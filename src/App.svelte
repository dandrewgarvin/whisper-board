<script>
  import config from "./config/config.json";
  import StoreController from "./controllers/StoreController.js";

  let store = new StoreController();

  import "./styles/reset.css";

  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  function handleMessage(evnt) {
    const { type, payload } = evnt.detail;

    switch (type) {
      case "MOVE_TOKEN": {
        store.moveToken(payload);
        break;
      }
      case "DELETE_TOKEN": {
        store.removeFromGrid(payload);
        break;
      }
      case 'RESIZE_TOKEN': {
        store.resizeToken(payload);
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
  <Controls on:message={handleMessage} {sizes} />
</main>
