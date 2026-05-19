<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let status = $state('initializing WebGPU…');

  const shaderCode = /* wgsl */ `
    @vertex
    fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
      var p = array<vec2f, 3>(
        vec2f( 0.0,  0.6),
        vec2f(-0.6, -0.6),
        vec2f( 0.6, -0.6),
      );
      return vec4f(p[i], 0.0, 1.0);
    }

    @fragment
    fn fs() -> @location(0) vec4f {
      return vec4f(1.0, 0.45, 0.1, 1.0);
    }
  `;

  async function initWebGPU() {
    if (!navigator.gpu) {
      status = 'WebGPU is not available in this environment.';
      return;
    }

    const adapter = await navigator.gpu.requestAdapter({ forceFallbackAdapter: true });
    if (!adapter) {
      status = 'No WebGPU adapter found.';
      return;
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu');
    if (!context) {
      status = 'Failed to acquire a WebGPU canvas context.';
      return;
    }

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'premultiplied' });

    const module = device.createShaderModule({ code: shaderCode });
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format }] },
      primitive: { topology: 'triangle-list' }
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const frame = () => {
      resize();
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.07, g: 0.07, b: 0.09, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
          }
        ]
      });
      pass.setPipeline(pipeline);
      pass.draw(3);
      pass.end();
      device.queue.submit([encoder.finish()]);
      requestAnimationFrame(frame);
    };

    status = `WebGPU running · ${adapter.info?.vendor || 'unknown vendor'}`;
    requestAnimationFrame(frame);
  }

  onMount(() => {
    initWebGPU().catch((err) => {
      status = `WebGPU init failed: ${err instanceof Error ? err.message : String(err)}`;
    });
  });
</script>

<main>
  <header>
    <h1>WebGPU Triangle</h1>
    <p>{status}</p>
  </header>
  <canvas bind:this={canvas}></canvas>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: system-ui, sans-serif;
  }
  header {
    padding: 1rem 1.5rem;
  }
  h1 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  p {
    margin: 0;
    opacity: 0.7;
    font-size: 0.85rem;
  }
  canvas {
    flex: 1;
    width: 100%;
    display: block;
  }
</style>
