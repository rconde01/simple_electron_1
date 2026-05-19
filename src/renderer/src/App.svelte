<script lang="ts">
  let count = $state(0);
  const increment = () => count++;

  const platform = window.api;
</script>

<main>
  <h1>Hello from Svelte + Electron</h1>
  <button onclick={increment}>Clicked {count} times</button>
  <p>Platform: {platform.platform}</p>
  <p>
    Electron: {platform.versions.electron} · Chromium: {platform.versions.chrome} · Node: {platform
      .versions.node}
  </p>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    text-align: center;
  }
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
