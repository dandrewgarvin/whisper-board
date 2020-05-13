<script>
  import config from "./config/config.json";
  import StoreController from "./controllers/StoreController.js";
  import SocketController from "./controllers/SocketController.js";

  const store = new StoreController();
  const socket = new SocketController(store);

  import "./styles/reset.css";

  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  function handleMessage(evnt) {
    const { type, payload } = evnt.detail;

    switch (type) {
      case "MOVE_TOKEN": {
        store.moveToken(payload); // handle movement locally
        socket.sendMovement(payload); // send movement to all other players
        break;
      }
      case "DELETE_TOKEN": {
        store.removeFromGrid(payload); // handle delete locally
        socket.sendDelete(payload); // send delete to all other players
        break;
      }
      case "RESIZE_TOKEN": {
        store.resizeToken(payload); // handle resize locally
        socket.sendResize(payload); // send resize to all other players
        break;
      }
      default: {
        console.log("No message case found");
      }
    }
  }

  const sizes = config.sizes;
</script>

<style lang="scss">
  main {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    display: flex;
  }
</style>

<main class="App">
  <Grid {sizes} grid={store.grid} on:message={handleMessage} />
  <Controls on:message={handleMessage} {sizes} tokens={store.tokens} />
</main>
