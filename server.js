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
const port = new SerialPort("COM5", {
  baudRate: 115200,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});
parser = port.pipe(new Readline({ delimiter: "\r\n" }));
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
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  parser.on("data", async function (data) {
    data = await data.toString("utf-8").trim();
    //console.log("movement from esp32:", data);
    if (data == "48") {
      // setTimeout(function () {
      //   ws.send("btndown");
      // }, 1);
      ws.send("btndown");
      console.log("flap");
    }
    // else if (data == "50" || "49") {
    //   ws.send("restart");
    // }
  });
});
