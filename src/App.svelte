<script>
  import config from "./config/config.json";

  import "./styles/reset.css";

  import Grid, { removeFromGrid } from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  function handleDeleteToken(evnt) {
    removeFromGrid(evnt.detail.location);
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
  <Grid {sizes} />
  <Controls on:message={handleDeleteToken} {sizes} />
</main>
