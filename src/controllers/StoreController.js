import config from "../config/config.json";

import { writable } from "svelte/store";

class StoreController {
  constructor() {
    let grid = this.generateInitialGrid();

    this.grid = writable(grid);
  }

  generateInitialGrid() {
    let grid = [];

    for (let i = 0; i < config.columns; i++) {
      let row = [];

      for (let j = 0; j < config.rows; j++) {
        let cell = {
          id: `c${i}:r${j}`,
          col: i,
          row: j,
          content: null,
        };

        row.push(cell);
      }
      grid.push(row);
    }

    return grid;
  }

  removeFromGrid(location) {
    const split = location.split(":");

    if (!split[0] || !split[1]) {
      return;
    }

    const col = +split[0].replace(/[A-z]/, "");
    const row = +split[1].replace(/[A-z]/, "");

    this.grid.update((gd) => {
      gd[col][row].content = null;
      return gd;
    });
  }

  moveToken({ from, to, meta }) {
    // delete old token location
    if (from) {
      this.grid.update((gd) => {
        gd[from.col][from.row].content = null;
        return gd;
      });
    }

    // add new token location
    this.grid.update((gd) => {
      gd[to.col][to.row].content = {
        type: meta.type,
        size: meta.size,
        name: meta.name,
      };

      return gd;
    });
  }

  resizeToken({ col, row, size }) {
    this.grid.update((gd) => {
      const cell = gd[col][row];

      gd[col][row].content = {
        type: cell.content.type,
        name: cell.content.name,
        size,
      };

      return gd;
    });
  }
}

export default StoreController;
