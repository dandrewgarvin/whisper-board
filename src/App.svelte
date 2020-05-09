<script>
  import config from "./config/config.json";
  import StoreController from "./controllers/StoreController.js";

  let store = new StoreController();

  import "./styles/reset.css";

  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  function handleDeleteToken(evnt) {
    store.removeFromGrid(evnt.detail.location);
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
  <Grid {sizes} grid={store.grid} />
  <Controls on:message={handleDeleteToken} {sizes} />
</main>
