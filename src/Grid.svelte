<script context="module">
  import { writable } from "svelte/store";
  let tempGrid = [];

  for (let i = 0; i < config.columns; i++) {
    let row = [];

    for (let j = 0; j < config.rows; j++) {
      let cell = {
        id: `c${i}:r${j}`,
        col: i,
        row: j,
        content: null
      };

      row.push(cell);
    }
    tempGrid.push(row);
  }

  let grid = writable(tempGrid);

  export function removeFromGrid(location) {
    const col = +location.split(":")[0].replace(/[A-z]/, "");
    const row = +location.split(":")[1].replace(/[A-z]/, "");

    grid.update(gd => {
      gd[col][row].content = null;
      return gd;
    });
  }
</script>

<script>
  import config from "./config/config.json";

  function handleDragDrop(evnt) {
    evnt.preventDefault();

    const target = evnt.target.id;
    const targetCol = +target.split(":")[0].replace(/[A-z]/, "");
    const targetRow = +target.split(":")[1].replace(/[A-z]/, "");

    const item_type = evnt.dataTransfer.getData("text");
    const fromLocation = evnt.dataTransfer.getData("fromLocation");

    // remove item from previous cell
    if (fromLocation) {
      const fromCol = +fromLocation.split(":")[0].replace(/[A-z]/, "");
      const fromRow = +fromLocation.split(":")[1].replace(/[A-z]/, "");

      grid.update(gd => {
        gd[fromCol][fromRow].content = null;
        return gd;
      });
    }

    grid.update(gd => {
      gd[targetCol][targetRow].content = {
        type: item_type
      };

      return gd;
    });
  }

  function handleDragStart(evnt) {
    evnt.dataTransfer.dropEffect = "move";
    evnt.dataTransfer.setData("text", evnt.target.id);

    // this is set so that the handleDragDrop function knows where the token is coming from so it can remove it
    evnt.dataTransfer.setData("fromLocation", evnt.target.dataset.location);
  }
</script>

<style lang="scss">
  section {
    flex: 8;
    overflow: scroll;
    display: grid;
    justify-content: center;
    align-content: center;

    .grid-column {
      height: 100%;
      display: grid;
      grid-gap: auto;

      .grid-cell {
        border: 1px solid darkgray;
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        .token {
          height: 90%;
          width: 90%;
          cursor: move;

          &.character {
            border-radius: 100%;
            background: darkred;
          }

          &.entity {
            border-radius: 16px;
            background: rgb(5, 77, 17);
          }
        }
      }
    }
  }
</style>

<section
  class="Grid"
  style="grid-template-columns: repeat({config.columns}, 50px);">
  {#each $grid as row, rowInd}
    <div
      class="grid-column"
      style="grid-template-rows: repeat({config.rows}, 50px);">
      {#each row as cell, cellInd}
        <div
          class="grid-cell"
          id={cell.id}
          on:drop={handleDragDrop}
          ondragover="return false">
          {#if cell.content}
            {#if cell.content.type === 'Character'}
              <div
                class="character token"
                id="Character"
                data-location="c{rowInd}:r{cellInd}"
                draggable="true"
                on:dragstart={handleDragStart}>
                c{rowInd}:r{cellInd}
              </div>
            {:else}
              <div
                class="entity token"
                id="Entity"
                data-location="c{rowInd}:r{cellInd}"
                draggable="true"
                on:dragstart={handleDragStart}>
                c{rowInd}:r{cellInd}
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</section>
