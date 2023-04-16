let video;
let canvas;

let anchoCamara = 1280;
let altoCamara = 720;

let amarillo = { r: 255, g: 255, b: 0 };

let distanciaAceptable = 155;

function mostrarCamara() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");

  let opciones = {
    audio: false,
    video: {
      with: anchoCamara,
      height: altoCamara,
    },
  };
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(opciones)
      .then(function (stream) {
        video.srcObject = stream;
        procesarCamara();
      })
      .catch(function (err) {
        console.log("Hubo un error", err);
      });
  } else {
    console.log("La funcion getUserMedia no existe");
  }
}

function procesarCamara() {
  let ctx = canvas.getContext("2d");
  ctx.scale(-1, 1);

  ctx.drawImage(
    video,
    0,
    0,
    anchoCamara,
    altoCamara,
    0,
    0,
    canvas.width,
    canvas.height
  );

  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixeles = imgData.data;

  let platanos = [];

  // Crea los platanos en pantalla
  for (let pixel = 0; pixel < pixeles.length; pixel += 4) {
    let rojo = pixeles[pixel];
    let verde = pixeles[pixel + 1];
    let azul = pixeles[pixel + 2];
    let alpha = pixeles[pixel + 3];

    let distancia = Math.sqrt(
      Math.pow(amarillo.r - rojo, 2) +
        Math.pow(amarillo.g - verde, 2) +
        Math.pow(amarillo.b - azul, 2)
    );

    if (distancia < distanciaAceptable) {
      let y = Math.floor(pixel / 4 / canvas.width);
      let x = (pixel / 4) % canvas.width;

      // Agrupacion
      if (platanos.length == 0) {
        //
        let platano = new Platano(x, y);
        platanos.push(platano);
      } else {
        // Revisar si esta cerca. Si si, me uno a el, si no, creo uno nuevo
        let encontrado = false;
        for (let plat = 0; plat < platanos.length; plat++) {
          if (platanos[plat].estaCerca(x, y)) {
            platanos[plat].agregarPixel(x, y);
            encontrado = true;
            break;
          }
        }
        if (!encontrado && platanos.length <= 1) {
          let platano = new Platano(x, y);
          platanos.push(platano);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  platanos = unirPlatanos(platanos);

  let cantidadPlatanos = 0;

  let width = 0;
  let height = 0;
  let area = 0;
  let centroX = 0;

  let platanoDerecho = [];
  let platanoIzquierdo = [];

  let gradosIzq = 0;
  let gradosDer = 0;
  let alturaIzq = 0;
  let alturaDer = 0;
  let anchoIzq = 0;
  let anchoDer = 0;
  let altoIzq = 0;
  let altoDer = 0;

  let centroDerX = 0;
  let centroDerY = 0;

  for (let i = 0; i < 2; i++) {
    if (cantidadPlatanos <= 2) {
      width = platanos[i]?.xMaxima - platanos[i]?.xMinima;
      height = platanos[i]?.yMaxima - platanos[i]?.yMinima;
      centroX = platanos[i]?.xMinima + width / 2;
      area = width * height;

      if (area > 1000) {
        platanos[i].dibujar(ctx);

        if (centroX < 320) {
          platanoDerecho = platanos[i];
        }
        if (centroX > 320) {
          platanoIzquierdo = platanos[i];
        }
        gradosIzq = platanoIzquierdo?.grados;
        gradosDer = platanoDerecho?.grados;
        alturaIzq = platanoIzquierdo?.yMinima;
        alturaDer = platanoDerecho?.yMinima;
        anchoIzq = platanoIzquierdo?.xMaxima - platanoIzquierdo?.xMinima;
        anchoDer = platanoDerecho?.xMaxima - platanoDerecho?.xMinima;
        altoIzq = platanoIzquierdo?.yMaxima - platanoIzquierdo?.yMinima;
        altoDer = platanoDerecho?.yMaxima - platanoDerecho?.yMinima;

        centroDerX = platanoDerecho?.xMinima + anchoDer / 2;
        centroDerY = platanoDerecho?.yMinima + altoDer / 2;

        enviarMovimiento(
          gradosDer,
          gradosIzq,
          alturaIzq,
          alturaDer,
          anchoDer,
          anchoIzq,
          altoIzq,
          altoDer
        );
        cantidadPlatanos++;
      }
    }
  }

  setTimeout(procesarCamara, 20);
}

function unirPlatanos(platanos) {
  let salir = false;
  // Itero en todos los platanos
  for (let p1 = 0; p1 < platanos.length; p1++) {
    // Itero en todos los platanos nuevamente para ver si tienen interaccion con la primera iteracion
    for (let p2 = 0; p2 < platanos.length; p2++) {
      if (p1 == p2) continue; // Si es el mismo, no se considera y ya

      let platano1 = platanos[p1];
      let platano2 = platanos[p2];

      let intersectan =
        platano1.xMinima < platano2.xMaxima &&
        platano1.xMaxima > platano2.xMinima &&
        platano1.yMinima < platano2.yMaxima &&
        platano1.yMaxima > platano2.yMinima;

      // Si encuentro una interseccion, los uno
      if (intersectan) {
        // Pasar los pixeles del platano2 al platano1
        for (let p = 0; p < platano2.length; p++) {
          platano1.agregarPixel([platano2.pixeles[p].x, platano2.pixeles[p].y]);
        }
        // Borrar platano2
        platanos.splice(p2, 1);
        salir = true;
        break;
      }
    }
    if (salir) {
      break;
    }
  }
  // Vuelvo a llamar a esta funcion

  // Si se encuentra una interserccion, reprocesamos todo de nuevo con el arreglo modificado
  if (salir) {
    return unirPlatanos(platanos);
  } else {
    // Si no hubo intersecciones, salir
    return platanos;
  }

  // SI no encontre uniones, ahora si regreso el arreglo final
}

let ultimoUrl = null;

function enviarMovimiento(
  gradosDer,
  gradosIzq,
  alturaIzq,
  alturaDer,
  anchoDer,
  anchoIzq,
  altoIzq,
  altoDer
) {
  // MOVIMIENTOS (en grados)
  // DERECHA
  let movimientoDer = "0"; // 0 = no hay movimiento; -1 = movimiento a la izq; 1 = movimiento a la der;

  if (gradosDer >= 15) {
    movimientoDer = "-1";
  } else if (gradosDer <= -15) {
    movimientoDer = "1";
  }

  // IZQUIERDA
  let movimientoIzq = "0";

  if (gradosIzq >= 15) {
    movimientoIzq = "-1";
  } else if (gradosIzq <= -15) {
    movimientoIzq = "1";
  }

  // ALTURA (en Y)
  // DERECHA
  let verticalDer = "0";

  if (alturaDer <= 50) {
    verticalDer = "1";
  } else if (alturaDer >= 260) {
    verticalDer = "-1";
  }
  // IZQUIERDA
  let verticalIzq = "0";

  if (alturaIzq <= 50) {
    verticalIzq = "1";
  } else if (alturaIzq >= 260) {
    verticalIzq = "-1";
  }

  // ACERCAR (ancho del platano)
  // IZQUIERDA
  let acercarIzq = "0";

  if (anchoIzq >= 240 && anchoIzq < 300) {
    acercarIzq = "1";
  } else if (anchoIzq <= 100 && altoIzq <= 60) {
    acercarIzq = "-1";
  }
  // DERECHA
  let acercarDer = "0";

  if (anchoDer >= 240 && anchoDer < 300) {
    acercarDer = "1";
  } else if (anchoDer <= 100 && altoDer <= 60) {
    acercarDer = "-1";
  }

  let combinarPlat = "0";
  if (anchoDer > 300 || anchoDer > 300) {
    combinarPlat = "1";
  } 
  /*
    else if (anchoIzq > 300) {
    combinarPlat = "-1";
  }
  */

  // console.log("posicion minima de Y: " + yMinima);

  let url =
    "http://localhost:3000?movimientoIzq=" +
    movimientoIzq +
    "&movimientoDer=" +
    movimientoDer +
    "&verticalIzq=" +
    verticalIzq +
    "&verticalDer=" +
    verticalDer +
    "&acercarIzq=" +
    acercarIzq +
    "&acercarDer=" +
    acercarDer +
    "&combinarPlat=" +
    combinarPlat;

  if (ultimoUrl === null || url !== ultimoUrl) {
    ultimoUrl = url;
    $.get(url, function (response) {
      console.log(response);
    });
  }
}
