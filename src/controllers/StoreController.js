import config from "../config/config.json";

import { writable } from "svelte/store";

class StoreController {
  constructor() {
    let grid = this.generateInitialGrid();

    this.grid = writable(grid);
    this.tokens = writable([]);
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

  fillEmptyGrid(tokens) {
    this.grid.set(this.generateInitialGrid());

    this.grid.update((gd) => {
      tokens.forEach((token) => {
        const { position } = token;
        delete token.position;

        gd[position.col][position.row].content = token;
      });

      return gd;
    });
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

    this.tokens.update((tokens) => {
      tokens = tokens.filter((tkn) => {
        if (tkn.position.col === col && tkn.position.row === row) {
          return false;
        }

        return true;
      });

      return tokens;
    });
  }

  moveToken({ from, to, meta }) {
    // delete old token location
    if (from) {
      this.grid.update((gd) => {
        // grid cells should not be able to overtake other grid cells
        if (gd[to.col][to.row].content) {
          return gd;
        }

        gd[from.col][from.row].content = null;
        return gd;
      });
    }

    // handle party button
    if (meta.type === "Party") {
      this.grid.update((gd) => {
        const party = config.party;

        // don't support parties that have over 9 members
        if (party.length > 9) {
          alert("You cannot place a party that has more than 9 members");
          return gd;
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
          gd[to.col + placements[ind].col][
            to.row + placements[ind].row
          ].content = {
            type: mem.type,
            size: mem.size,
            name: mem.name,
            color: mem.color,
          };
        });

        return gd;
      });

      return true;
    }

    // add new token location
    this.grid.update((gd) => {
      // grid cells should not be able to overtake other grid cells
      if (gd[to.col][to.row].content) {
        return gd;
      }

      gd[to.col][to.row].content = {
        type: meta.type,
        size: meta.size,
        name: meta.name,
        color: meta.color,
      };

      return gd;
    });

    this.tokens.update((tokens) => {
      if (from) {
        // update existing token in list
        tokens = tokens.map((tkn) => {
          if (tkn.position.col === from.col && tkn.position.row === from.row) {
            return {
              ...meta,
              position: to,
            };
          } else {
            return tkn;
          }
        });
      } else {
        // add new token to list
        tokens.push({
          ...meta,
          position: to,
        });
      }

      return tokens;
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

    this.tokens.update((tokens) => {
      tokens = tokens.map((tkn) => {
        if (tkn.position.col === col && tkn.position.row === row) {
          tkn.size = size;
        }

        return tkn;
      });

      return tokens;
    });
  }
}

export default StoreController;
