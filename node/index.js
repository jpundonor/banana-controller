const { query } = require("express");
let express = require("express");
let app = express();
let spawn = require("child_process").spawn;

// Se comienza abriendo el programa
let net = spawn("../net/NetApp/bin/Debug/NetApp.exe");

net.stdout.on("data", function (data) {
  console.log("Recibi de .Net este mensaje: " + data.toString());
});

app.get("/", function (req, res) {
  console.log("recibi una solicitud " + req.query.acercarDer);
  net.stdin.write(
    req.query.movimientoIzq +
      "," +
      req.query.movimientoDer +
      "," +
      req.query.verticalIzq +
      "," +
      req.query.verticalDer +
      "," +
      req.query.acercarIzq +
      "," +
      req.query.acercarDer +
      "," +
      req.query.combinarPlat +
      "\r\n"
  );
  res.send("Hola");
});

app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Se levanto el servidor");
});
