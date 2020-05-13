<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  import config from "./config/config.json";

  const dispatch = createEventDispatcher();

  export let sizes;
  export let tokens;
  export let hoveringToken;

  let input = "";
  let dropped_in = false;
  let dropped = [];
  let draggedOver = false;
  let clickedToken = undefined;

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

      dispatch("message", {
        type: "CHANGE_HOVERING_TOKEN",
        payload: null
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

  function handleTokenEnter(evnt) {
    let token;

    try {
      token = JSON.parse(evnt.target.id);
    } catch {
      // console.log("unable to parse token");
    }

    if (!token || !token.position) {
      return null;
    }

    if (!clickedToken) {
      dispatch("message", {
        type: "CHANGE_HOVERING_TOKEN",
        payload: token
      });
    }
  }

  function handleTokenLeave(evnt) {
    if (!clickedToken) {
      dispatch("message", {
        type: "CHANGE_HOVERING_TOKEN",
        payload: null
      });
    }
  }

  function handleTokenClick(evnt) {
    let token;

    try {
      token = JSON.parse(evnt.target.id);
    } catch {
      // console.log("unable to parse token");
    }

    if (!token) {
      return null;
    }

    if (
      clickedToken &&
      clickedToken.position.col === token.position.col &&
      clickedToken.position.row === token.position.row
    ) {
      clickedToken = undefined;
      input = "";
      return;
    }

    dispatch("message", {
      type: "CHANGE_HOVERING_TOKEN",
      payload: token
    });

    clickedToken = token;
    input = token.name;

    // document.getElementById("token-name-input").focus();
  }

  function handleInput(evnt) {
    if (clickedToken && evnt.key === "Enter") {
      dispatch("message", {
        type: "RENAME_TOKEN",
        payload: {
          position: clickedToken.position,
          name: input
        }
      });

      clickedToken = undefined;
      input = "";

      dispatch("message", {
        type: "CHANGE_HOVERING_TOKEN",
        payload: null
      });
    }
  }

  function handleKeyboardShortcuts(evnt) {
    const inputField = document.getElementById("token-name-input");

    if (document.activeElement === inputField) {
      return null;
    }

    if (clickedToken && ["Backspace", "Delete"].includes(evnt.key)) {
      dispatch("message", {
        type: "DELETE_TOKEN",
        payload: `c${clickedToken.position.col}:r${clickedToken.position.row}`
      });

      dispatch("message", {
        type: "CHANGE_HOVERING_TOKEN",
        payload: null
      });

      input = "";
      clickedToken = undefined;
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeyboardShortcuts);
  });
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
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;

        img {
          height: 100%;
        }
      }

      .list {
        width: 100%;
        flex: 1;
        overflow: scroll;
        margin-bottom: 50px;

        .token {
          margin: 0px 5px;
          padding: 0px 5px;
          max-width: 100%;
          height: 35px;
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover,
          &.hovered {
            background: rgb(163, 174, 187);
          }

          .color {
            height: 20px;
            width: 20px;
            border-radius: 100%;
            margin-right: 10px;

            &.character {
              background: rgb(11, 9, 124);
            }

            &.enemy {
              background: rgb(124, 9, 9);
            }

            &.entity {
              background: rgb(5, 77, 17);
            }
          }

          .name {
            font-size: 14px;
          }
        }

        .token + .token {
          border-top: 1px solid rgb(107, 107, 126);
        }
      }

      .actions {
        width: 100%;

        .input {
          margin: 0px 5px;
          outline: none;
          border-radius: 4px;
          width: calc(100% - 10px);
        }

        .row {
          display: flex;
        }

        .colorized.party {
          background: rgb(255, 175, 28);
        }
        .colorized.enemy {
          background: rgb(124, 9, 9);
          color: white;
        }
        .colorized.character {
          background: rgb(11, 9, 124);
          color: white;
        }
        .colorized.entity {
          background: rgb(5, 77, 17);
          color: white;
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
          flex: 1;

          .img {
            height: 20px;
            width: 20px;
            margin-right: 5px;
          }
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
  }
</style>

<section class="Controls">
  <div class="content">
    <div class="logo-container">
      <img src="images/logo.png" alt="logo" />
    </div>

    <div class="list">
      {#each $tokens.sort((a, b) => {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        return 0;
      }) as token}
        <div
          class="token {clickedToken && clickedToken.position.col === token.position.col && clickedToken.position.row === token.position.row ? 'hovered' : ''}"
          id={JSON.stringify(token)}
          on:mouseenter={handleTokenEnter}
          on:mouseleave={handleTokenLeave}
          on:click={handleTokenClick}>
          {#if token.type === 'Character'}
            <div class="color character" style="background: {token.color}" />
          {:else if token.type === 'Enemy'}
            <div class="color enemy" />
          {:else}
            <div class="color entity" />
          {/if}

          <p class="name">{token.name}</p>
        </div>
      {/each}
    </div>

    <div class="actions">
      <input
        class="input"
        id="token-name-input"
        placeholder="Token Name"
        bind:value={input}
        on:keydown={handleInput} />

      <div class="row">
        <div
          class="btn colorized party"
          id="Party"
          draggable="true"
          on:dragstart={handleDragStart}>
          <img
            draggable="false"
            src="images/party.png"
            alt="party"
            class="img" />
          Party
        </div>

        <div
          class="btn colorized enemy"
          id="Enemy"
          draggable="true"
          on:dragstart={handleDragStart}>
          <img
            draggable="false"
            src="images/goblin.png"
            alt="enemy"
            class="img" />
          Enemy
        </div>
      </div>

      <div class="row">
        <div
          class="btn colorized character"
          id="Character"
          draggable="true"
          on:dragstart={handleDragStart}>
          <img
            draggable="false"
            src="images/character.png"
            alt="character"
            class="img" />
          Character
        </div>

        <div
          class="btn colorized entity"
          id="Entity"
          draggable="true"
          on:dragstart={handleDragStart}>
          <img
            draggable="false"
            src="images/tree.png"
            alt="entity"
            class="img" />
          Entity
        </div>
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
  </div>
</section>
