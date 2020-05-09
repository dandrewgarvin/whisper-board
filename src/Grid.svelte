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
    const split = location.split(":");

    if (!split[0] || !split[1]) {
      return;
    }

    const col = +split[0].replace(/[A-z]/, "");
    const row = +split[1].replace(/[A-z]/, "");

    grid.update(gd => {
      gd[col][row].content = null;
      return gd;
    });
  }
</script>

<script>
  import config from "./config/config.json";

  export let sizes;

  function handleDragDrop(evnt) {
    evnt.preventDefault();

    const target = evnt.target.id;
    const split = target.split(":");

    if (!split[0] || !split[1]) {
      return;
    }

    const targetCol = +split[0].replace(/[A-z]/, "");
    const targetRow = +split[1].replace(/[A-z]/, "");

    const item_type = evnt.dataTransfer.getData("text");
    const fromLocation = evnt.dataTransfer.getData("fromLocation");

    const fromSplit = fromLocation.split(":");

    if (fromLocation && (!fromSplit[0] || !fromSplit[1])) {
      return;
    }

    // remove item from previous cell
    if (fromLocation) {
      const fromCol = +fromSplit[0].replace(/[A-z]/, "");
      const fromRow = +fromSplit[1].replace(/[A-z]/, "");

      grid.update(gd => {
        gd[fromCol][fromRow].content = null;
        return gd;
      });
    }

    grid.update(gd => {
      gd[targetCol][targetRow].content = {
        type: item_type,
        size: evnt.dataTransfer.getData("size")
      };

      return gd;
    });
  }

  function handleDragStart(evnt) {
    evnt.dataTransfer.dropEffect = "move";
    evnt.dataTransfer.setData("text", evnt.target.id);

    // this is set so that the handleDragDrop function knows where the token is coming from so it can remove it
    evnt.dataTransfer.setData("fromLocation", evnt.target.dataset.location);
    evnt.dataTransfer.setData("size", evnt.target.dataset.size);
  }

  function changeSize(evnt) {
    const currentSize = evnt.target.dataset.size;

    const location = evnt.target.dataset.location;
    const col = +location.split(":")[0].replace(/[A-z]/, "");
    const row = +location.split(":")[1].replace(/[A-z]/, "");

    grid.update(gd => {
      gd[col][row].content = {
        type: evnt.target.id,
        size:
          sizes.indexOf(currentSize) + 1 < sizes.length
            ? sizes[sizes.indexOf(currentSize) + 1]
            : sizes[0]
      };

      return gd;
    });
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
        position: relative;
        border: 1px solid darkgray;
        height: 50px;
        width: 50px;
        overflow: visible;

        .token {
          cursor: move;
          height: 90%;
          width: 90%;
          left: 5%;
          top: 5%;
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          position: absolute;

          &[data-size="medium"] {
            height: calc(90% * 1) !important;
            width: calc(90% * 1) !important;
            left: calc(5% * 1);
            top: calc(5% * 1);
            font-size: 8px;
          }

          &[data-size="large"] {
            height: calc(90% * 2) !important;
            width: calc(90% * 2) !important;
            left: calc(5% * 2);
            top: calc(5% * 2);
            font-size: 12px;
          }

          &[data-size="huge"] {
            height: calc(90% * 3) !important;
            width: calc(90% * 3) !important;
            left: calc(5% * 3);
            top: calc(5% * 3);
            font-size: 18px;
          }

          &[data-size="gargantuan"] {
            height: calc(90% * 4) !important;
            width: calc(90% * 4) !important;
            left: calc(5% * 4);
            top: calc(5% * 4);
            font-size: 22px;
          }

          &.character {
            border-radius: 100%; // make circle
            background: rgb(124, 9, 9);
          }

          &.entity {
            border-radius: 16px; // make rounded square
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
                data-size={cell.content.size}
                on:click={changeSize}
                draggable="true"
                on:dragstart={handleDragStart}>
                {cell.content.size}
              </div>
            {:else}
              <div
                class="entity token"
                id="Entity"
                data-location="c{rowInd}:r{cellInd}"
                data-size={cell.content.size}
                on:click={changeSize}
                draggable="true"
                on:dragstart={handleDragStart}>
                {cell.content.size}
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</section>
