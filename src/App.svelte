<script>
  import "./styles/reset.css";
  import Grid, { removeFromGrid } from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  function handleDeleteToken(evnt) {
    removeFromGrid(evnt.detail.location);
  }
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
  <Grid />
  <Controls on:message={handleDeleteToken} />
</main>
