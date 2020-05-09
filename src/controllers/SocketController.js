import io from "socket.io-client";
import config from "../config/config.json";

class SocketController {
  constructor(store) {
    this.socket = io.connect(config.backend_url);
    console.log("this.socket", this.socket);
    console.log("config.backend_url", config.backend_url);

    console.log("store", store);

    this.socket.on("moved", (payload) => {
      console.log("moved payload", payload);
      store.moveToken(payload);
    });

    this.socket.on("deleted", (payload) => {
      console.log("deleted payload", payload);
      store.removeFromGrid(payload);
    });

    this.socket.on("resized", (payload) => {
      console.log("resized payload", payload);
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
