import io from "socket.io-client";
import config from "../config/config.json";

class SocketController {
  constructor() {
    this.socket = io.connect(config.backend_url);

    const socket = this.socket;

    socket.on("movement", ({ from, to }) => {});
  }
}

export default SocketController;
