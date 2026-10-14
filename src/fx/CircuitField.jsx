import React, { useEffect, useRef } from 'react';

/**
 * The hero's circuit board: chunky pixel traces run in from the edges of the
 * page and bend into Chip's pins, with little lime pulses travelling along them
 * toward him. Traces near the cursor light up.
 *
 * Plain WebGL, one full-screen triangle and one fragment shader, no libraries.
 * Decorative only (aria-hidden). It renders a single still frame for
 * reduced-motion visitors, sleeps when off-screen or in a background tab, and
 * simply isn't there if WebGL isn't available: the paper and clouds remain.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;    // canvas size, in board cells
uniform vec2 uChip;   // Chip's centre, device px, y up
uniform vec2 uPtr;    // pointer, device px, y up (far away when unknown)
uniform float uTime;
uniform float uCell;  // canvas px per board cell (1: the canvas is the grid)
uniform float uHalf;  // half of Chip's width, in cells

float h(float n) { return fract(sin(n * 127.13) * 43758.5453); }

const int N = 26;

void main() {
  vec2 c = floor(gl_FragCoord.xy / uCell);
  vec2 grid = floor(uRes / uCell);
  vec2 chip = floor(uChip / uCell);

  float trace = 0.0;
  float pulse = 0.0;
  float pad = 0.0;

  for (int k = 0; k < N; k++) {
    float i = float(k);
    float side = mod(i, 2.0) < 1.0 ? -1.0 : 1.0;
    // Row where the trace enters, spread over the whole board height.
    float y0 = floor(h(i + 1.0) * grid.y);
    // Edge it starts from, and the column where it turns toward a pin.
    float x0 = side < 0.0 ? -1.0 : grid.x;
    float xt = chip.x + side * (uHalf + 2.0 + floor(h(i + 2.0) * 7.0));
    // Pin row on Chip's side.
    float yp = chip.y + floor((h(i + 3.0) - 0.5) * uHalf * 1.4);

    float hLen = abs(xt - x0);
    float vLen = abs(yp - y0);
    float s = -1.0;

    // Horizontal run from the edge to the turn.
    if (abs(c.y - y0) < 0.5 && (c.x - x0) * side <= 0.0 && (c.x - xt) * side >= 0.0) s = abs(c.x - x0);
    // Vertical run from the turn to the pin row.
    if (abs(c.x - xt) < 0.5 && (c.y - y0) * sign(yp - y0) >= 0.0 && (c.y - yp) * sign(yp - y0) <= 0.0) s = hLen + abs(c.y - y0);
    // Short stub from the turn into Chip's side.
    if (abs(c.y - yp) < 0.5 && (c.x - xt) * side <= 0.0 && (c.x - (chip.x + side * uHalf)) * side >= 0.0)
      s = hLen + vLen + abs(c.x - xt);

    if (s >= 0.0) {
      trace = 1.0;
      float total = hLen + vLen + abs(xt - chip.x) - uHalf;
      float speed = 9.0 + h(i + 4.0) * 10.0;
      float head = mod(uTime * speed + h(i + 5.0) * total, total + 30.0);
      float d = head - s;
      if (d >= 0.0 && d < 5.0) pulse = max(pulse, 1.0 - d / 5.0);
    }
    // A solder pad where the trace turns.
    if (abs(c.x - xt) < 1.5 && abs(c.y - y0) < 1.5) pad = 1.0;
  }

  // Faint dot grid, like a perfboard.
  float dots = (mod(c.x, 6.0) < 1.0 && mod(c.y, 6.0) < 1.0) ? 1.0 : 0.0;

  float near = 1.0 - smoothstep(0.0, 22.0 * uCell, distance(gl_FragCoord.xy, uPtr));

  vec3 ink = vec3(0.043, 0.051, 0.067);
  vec3 lime = vec3(0.78, 1.0, 0.345);
  vec3 blue = vec3(0.361, 0.537, 1.0);

  float a = dots * 0.06 + trace * (0.13 + near * 0.35) + pad * 0.22;
  vec3 col = mix(ink, blue, near * trace);
  // Pulses are drawn as a lime head with an ink outline feel.
  col = mix(col, lime, pulse);
  a = max(a, pulse * 0.95);

  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function CircuitField({ chipRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes');
    const uChip = u('uChip');
    const uPtr = u('uPtr');
    const uTime = u('uTime');
    const uCell = u('uCell');
    const uHalf = u('uHalf');

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = { w: 0, h: 0, dpr: 1, cell: 1, chip: [0, 0], half: 8, ptr: [-1e4, -1e4], onScreen: true };

    // One canvas pixel per board cell: every cell is a flat colour, so the
    // shader runs on a tiny grid and CSS scales it up with crisp edges.
    const measure = () => {
      const r = host.getBoundingClientRect();
      const cell = r.width > 900 ? 6 : 5; // CSS px per board cell
      state.dpr = 1 / cell;
      state.w = Math.max(1, Math.ceil(r.width / cell));
      state.h = Math.max(1, Math.ceil(r.height / cell));
      canvas.width = state.w;
      canvas.height = state.h;
      canvas.style.width = `${state.w * cell}px`;
      canvas.style.height = `${state.h * cell}px`;
      gl.viewport(0, 0, state.w, state.h);
      state.cell = 1;
      const chip = chipRef?.current?.getBoundingClientRect();
      if (chip && chip.width) {
        state.chip = [(chip.left - r.left + chip.width / 2) / cell, (state.h * cell - (chip.top - r.top + chip.height * 0.56)) / cell];
        state.half = Math.max(4, Math.floor((chip.width * 0.32) / cell));
      } else {
        state.chip = [state.w * 0.72, state.h * 0.55];
      }
    };

    const draw = (t) => {
      gl.uniform2f(uRes, state.w, state.h);
      gl.uniform2f(uChip, state.chip[0], state.chip[1]);
      gl.uniform2f(uPtr, state.ptr[0], state.ptr[1]);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uCell, state.cell);
      gl.uniform1f(uHalf, state.half);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    const start = performance.now();
    const loop = (now) => {
      raf = 0;
      draw((now - start) / 1000);
      if (!still && state.onScreen && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    measure();
    // Still frame: pulses frozen mid-route so the board still reads as "live".
    if (still) draw(3.7);
    else kick();
    canvas.classList.add('is-on');

    const ro = new ResizeObserver(() => {
      measure();
      if (still) draw(3.7);
    });
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => {
      state.onScreen = e.isIntersecting;
      if (state.onScreen && !still) kick();
    });
    io.observe(canvas);

    const onVis = () => !document.hidden && !still && kick();
    document.addEventListener('visibilitychange', onVis);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      state.ptr = [(e.clientX - r.left) * state.dpr, (r.bottom - e.clientY) * state.dpr];
    };
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine && !still) window.addEventListener('pointermove', onMove, { passive: true });

    // Chip boots in with a small animation; re-measure once he has settled.
    const settle = setTimeout(measure, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [chipRef]);

  return <canvas ref={canvasRef} className="circuit-field" aria-hidden="true" />;
}
