const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
var http = require("http").Server(app);
const PORT = 3000;
var http = require("http").Server(app);
var WebSocketServer = require("ws").Server;
var webSocketServer;
const Readline = require("@serialport/parser-readline");
const SerialPort = require("serialport");
var newport;
SerialPort.list().then(function (ports) {
  ports.forEach(function (ports) {
    if (
      ports.pnpId.includes("VID_10C4&PID_EA60") ||
      ports.pnpId.includes("VID_1A86&PID_7523")
    ) {
      comport = ports.path;
      console.log("PlayComputer Connected at :", comport);
      console.log("Visit 'localhost:3000' on your browser");
      newport = new SerialPort(comport, {
        baudRate: 115200,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        flowControl: false,
      });
      parser = newport.pipe(new Readline({ delimiter: "\r\n" }));
    }
  });
  if (!newport) {
    console.log("PlayComputer not connected \n Connect and reopen again");
  }
});
server = http.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

app.use(express.static(path.join(__dirname, "/")));

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/", router);

webSocketServer = new WebSocketServer({ server: server });

webSocketServer.on("connection", (ws) => {
  console.log("New Client Connected");

  parser.on("data", async function (data) {
    data = await data.toString("utf-8").trim();
    //console.log("movement from esp32:", data);
    if (data == "49") {
      ws.send("btndown");
      console.log("flap");
    }
  });
});
