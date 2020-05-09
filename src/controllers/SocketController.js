import io from "socket.io-client";
import config from "../config/config.json";

class SocketController {
  constructor(store) {
    this.socket = io.connect(config.backend_url);

    this.socket.on("moved", (payload) => {
      store.moveToken(payload);
    });

    this.socket.on("deleted", (payload) => {
      store.removeFromGrid(payload);
    });

    this.socket.on("resized", (payload) => {
      store.resizeToken(payload);
    });
  }

  sendMovement(payload) {
    this.socket.emit("move", payload);
  }

  sendDelete(payload) {
    this.socket.emit("delete", payload);
  }

  sendResize(payload) {
    this.socket.emit("resize", payload);
  }
}

export default SocketController;
