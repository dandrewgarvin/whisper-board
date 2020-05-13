import io from "socket.io-client";
import config from "../config/config.json";

class SocketController {
  constructor(store) {
    this.socket = io.connect(config.backend_url);
    this.store = store;

    this.socket.on("startup", (payload) => {
      store.fillEmptyGrid(payload);
    });

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
    console.log("payload", payload);

    // handle party button
    if (payload.meta.type === "Party") {
      const party = config.party;

      // don't support parties that have over 9 members
      if (party.length > 9) {
        alert("You cannot place a party that has more than 9 members");
        return null;
      }

      // The party will be placed in a grid in a semi-spiral fashion. the placements array handles the placement of each party member

      // WARNING: THIS WILL OVERWRITE ANY TOKENS THAT EXIST IN THE 3x3 GRID THAT SURROUNDS THE PARTY TOKEN THAT WAS DROPPED
      const placements = [
        { col: 0, row: 0 }, // middle
        { col: 0, row: -1 }, // top center
        { col: 1, row: 0 }, // right center
        { col: 0, row: 1 }, // bottom center
        { col: -1, row: 0 }, // left center
        { col: 1, row: -1 }, // top right
        { col: 1, row: 1 }, // bottom right
        { col: -1, row: 1 }, // bottom left
        { col: -1, row: -1 }, // top left
      ];

      party.forEach((mem, ind) => {
        const tempPayload = {
          from: null,
          to: {
            col: payload.to.col + placements[ind].col,
            row: payload.to.row + placements[ind].row,
          },
          meta: mem,
        };

        this.store.moveToken(tempPayload);
        this.socket.emit("move", tempPayload);
      });
    } else {
      this.socket.emit("move", payload);
    }
  }

  sendDelete(payload) {
    this.socket.emit("delete", payload);
  }

  sendResize(payload) {
    this.socket.emit("resize", payload);
  }
}

export default SocketController;
