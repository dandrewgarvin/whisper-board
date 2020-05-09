<script>
  import config from "./config/config.json";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let grid;

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

    let move = {
      from: null,
      to: {
        col: targetCol,
        row: targetRow
      },
      meta: {
        type: item_type,
        size: evnt.dataTransfer.getData("size"),
        name: evnt.dataTransfer.getData("name")
      }
    };

    // add a "from" location if needed
    if (fromLocation) {
      const fromCol = +fromSplit[0].replace(/[A-z]/, "");
      const fromRow = +fromSplit[1].replace(/[A-z]/, "");

      move.from = {
        col: fromCol,
        row: fromRow
      };
    }

    // call store function to actually move token
    dispatch("message", {
      type: "MOVE_TOKEN",
      payload: move
    });
  }

  function handleDragStart(evnt) {
    evnt.dataTransfer.dropEffect = "move";
    evnt.dataTransfer.setData("text", evnt.target.id);

    // this is set so that the handleDragDrop function knows where the token is coming from so it can remove it
    evnt.dataTransfer.setData("fromLocation", evnt.target.dataset.location);
    evnt.dataTransfer.setData("size", evnt.target.dataset.size);
    evnt.dataTransfer.setData("name", evnt.target.innerText);
  }

  function changeSize(evnt) {
    const currentSize = evnt.currentTarget.dataset.size;

    const location = evnt.currentTarget.dataset.location;
    const col = +location.split(":")[0].replace(/[A-z]/, "");
    const row = +location.split(":")[1].replace(/[A-z]/, "");

    dispatch("message", {
      type: "RESIZE_TOKEN",
      payload: {
        col,
        row,
        size:
          sizes.indexOf(currentSize) + 1 < sizes.length
            ? sizes[sizes.indexOf(currentSize) + 1]
            : sizes[0]
      }
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
          text-align: center;
          position: absolute;

          .name {
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: white;
          }

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
            font-size: 14px;
          }

          &[data-size="gargantuan"] {
            height: calc(90% * 4) !important;
            width: calc(90% * 4) !important;
            left: calc(5% * 4);
            top: calc(5% * 4);
            font-size: 14px;
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
                <p class="name">{cell.content.name}</p>
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
                <p class="name">{cell.content.name}</p>
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</section>
