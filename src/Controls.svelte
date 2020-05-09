<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let sizes;

  let input = "";
  let dropped_in = false;
  let dropped = [];

  function handleDragDrop(evnt) {
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
    evnt.dataTransfer.setData("text", evnt.target.id);
    evnt.dataTransfer.setData("size", sizes[0]);
    evnt.dataTransfer.setData("name", input || evnt.target.id);

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
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      box-shadow: -3px 0px 5px 0px rgb(141, 149, 158);

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
      }
    }
  }
</style>

<section class="Controls">
  <div class="content">
    <input class="input" placeholder="Token Name" bind:value={input} />
    <div
      class="btn"
      id="Enemy"
      draggable="true"
      on:dragstart={handleDragStart}>
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
      class="btn dropzone"
      on:drop={handleDragDrop}
      ondragover="return false">
      Drag Here To Delete
    </div>
  </div>
</section>
