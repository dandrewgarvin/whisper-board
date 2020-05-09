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
}

export default StoreController;
