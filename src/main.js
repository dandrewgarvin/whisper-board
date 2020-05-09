import App from "./App.svelte";

window.addEventListener("beforeunload", (evnt) => {
  evnt.preventDefault();

  if (window.location.hostname !== "localhost") {
    evnt.returnValue = "Are you sure you want to leave the page?";
  }
});

const app = new App({
  target: document.body,
});

export default app;
