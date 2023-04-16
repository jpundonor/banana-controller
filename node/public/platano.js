class Platano {
  pixeles = [];

  // Posicion
  xMinima = 0;
  xMaxima = 0;
  yMinima = 0;
  yMaxima = 0;
  grados = 0;

  constructor(x, y) {
    this.agregarPixel(x, y);
    this.xMinima = x;
    this.xMaxima = x;
    this.yMinima = y;
    this.yMaxima = y;
  }

  agregarPixel(x, y) {
    this.pixeles.push({ x: x, y: y });
    if (x < this.xMinima) {
      this.xMinima = x;
    }
    if (x > this.xMaxima) {
      this.xMaxima = x;
    }
    // Lo mismo de arriba, pero de otro modo
    this.yMinima = y < this.yMinima ? y : this.yMinima;
    this.yMaxima = y > this.yMaxima ? y : this.yMaxima;
  }

  estaCerca(x, y) {
    // Revisar si esta dentro del rectangulo
    if (
      x >= this.xMinima &&
      x <= this.xMaxima &&
      y >= this.yMinima &&
      y <= this.yMaxima
    ) {
      return true;
    }

    let distanciaX = 0;
    let distanciaY = 0;

    if (x < this.xMinima) {
      distanciaX = this.xMinima - x;
    }
    if (x > this.xMaxima) {
      distanciaX = x - this.xMaxima;
    }
    if (y < this.yMinima) {
      distanciaY = this.yMinima - y;
    }
    if (y > this.yMaxima) {
      distanciaY = y - this.yMaxima;
    }

    let distanciaAbsoluta = distanciaX + distanciaY;

    // Distancia minima entre objetos
    return distanciaAbsoluta < 50;
  }

  dibujar(ctx) {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 4;
    ctx.beginPath();

    let x = this.xMinima;
    let y = this.yMinima;
    let width = this.xMaxima - this.xMinima;
    let height = this.yMaxima - this.yMinima;

    ctx.rect(x, y, width, height);
    ctx.stroke();

    // Dibujar circulo en el centro
    let centroX = x + width / 2;
    let centroY = y + height / 2;

    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(centroX, centroY, 5, 0, 2 * Math.PI);
    ctx.fill();

    let sumaYIzq = 0;
    let cuentaYIzq = 0;
    let sumaYDer = 0;
    let cuentaYDer = 0;

    // Iterar en todos los pixeles que se tienen
    for (let p = 0; p < this.pixeles.length; p++) {
      if (this.pixeles[p].x <= x + width * 0.1) {
        sumaYIzq += this.pixeles[p].y;
        cuentaYIzq++;
      } else if (this.pixeles[p].x >= x + width * 0.9) {
        sumaYDer += this.pixeles[p].y;
        cuentaYDer++;
      }
    }

    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(this.xMinima, sumaYIzq / cuentaYIzq, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(this.xMaxima, sumaYDer / cuentaYDer, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#0f0";
    ctx.moveTo(this.xMinima, sumaYIzq / cuentaYIzq);
    ctx.lineTo(this.xMaxima, sumaYDer / cuentaYDer);
    ctx.stroke();

    let diffY = sumaYDer / cuentaYDer - sumaYIzq / cuentaYIzq;
    let diffX = this.xMaxima - this.xMinima;

    let radianes = Math.atan(diffY / diffX);
    let grados = radianes * (180 / Math.PI);

    grados = Math.round(grados);

    // document.getElementById("infoGrados").innerHTML = grados;
    this.grados = grados;
  }
}
