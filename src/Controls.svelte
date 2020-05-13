<script>
  import config from "./config/config.json";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let sizes;

  let input = "";
  let dropped_in = false;
  let dropped = [];
  let draggedOver = false;

  function handleDragDrop(evnt) {
    draggedOver = false;

    evnt.preventDefault();
    dropped_in = true;
    dropped.push(evnt.target.id);

    const item_type = evnt.dataTransfer.getData("text");
    const fromLocation = evnt.dataTransfer.getData("fromLocation");

    if (fromLocation) {
      dispatch("message", {
        type: "DELETE_TOKEN",
        payload: fromLocation
      });
    }
  }

  function handleDragStart(evnt) {
    evnt.dataTransfer.dropEffect = "move";
    evnt.dataTransfer.setData("text", evnt.target.id); // type of token
    evnt.dataTransfer.setData("size", sizes[1]); // default size is medium
    evnt.dataTransfer.setData("name", input || evnt.target.id);

    // set random background color for non-party character tokens
    if (evnt.target.id === "Character") {
      const colorIndex = Math.floor(Math.random() * config.randomColors.length);
      evnt.dataTransfer.setData("color", config.randomColors[colorIndex]);
    }

    input = "";
  }
</script>

<style lang="scss">
  section {
    height: 100%;
    background: rgb(202, 211, 221);
    flex: 2;
    display: flex;

    .content {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      box-shadow: -3px 0px 5px 0px rgb(141, 149, 158);

      .logo-container {
        height: 35px;
        position: absolute;
        top: 0px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;

        img {
          height: 100%;
        }
      }

      .input {
        margin: 5px;
        outline: none;
        border-radius: 4px;
      }

      .btn {
        cursor: move;
        height: 30px;
        background: white;
        border-radius: 8px;
        margin: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        width: 120px;
      }

      .dropzone {
        width: calc(100% - 20px);
        height: 80px;
        background: rgb(124, 138, 150);
        color: white;
        cursor: unset;

        &.draggedOver {
          background: rgb(79, 91, 100);
        }
      }
    }
  }
</style>

<section class="Controls">
  <div class="content">
    <div class="logo-container">
      <img src="images/logo.png" alt="logo" />
    </div>
    <div class="btn" id="Party" draggable="true" on:dragstart={handleDragStart}>
      + Party
    </div>

    <input class="input" placeholder="Token Name" bind:value={input} />
    <div class="btn" id="Enemy" draggable="true" on:dragstart={handleDragStart}>
      + Enemy
    </div>

    <div
      class="btn"
      id="Character"
      draggable="true"
      on:dragstart={handleDragStart}>
      + Character
    </div>

    <div
      class="btn"
      id="Entity"
      draggable="true"
      on:dragstart={handleDragStart}>
      + Entity
    </div>

    <div
      class="btn dropzone {draggedOver ? 'draggedOver' : ''}"
      on:drop={handleDragDrop}
      on:dragenter={() => (draggedOver = true)}
      on:dragleave={() => (draggedOver = false)}
      ondragover="return false">
      Drag Here To Delete
    </div>
  </div>
</section>
