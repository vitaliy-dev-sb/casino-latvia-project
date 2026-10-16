export const COPY = {
  placeholder: "Ask anything…",
  labels: ["Thinking", "Searching", "Analyzing", "Composing"],
  done: "Done",
  answerTitle: "Answer",
  answerBody: "The answer goes here",
  reset: "New question",
  send: "Send",
};

export const CANVAS = 220;
export const PILL_H = 60;
export const BALL_SMALL = 60;
export const ORB_D = 132;
export const ORB_R = 66;
export const CARD_H = 108;
export const FLY_D = 138;
export const TAU = Math.PI * 2;

export const pillW = () => Math.min(560, window.innerWidth - 32);
export const cardW = () => Math.min(320, window.innerWidth - 32);
export const homeDy = () => window.innerHeight * 0.54 - 96;

export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return sy(t);
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(t);
  };
}

export const E = {
  out: cubicBezier(0.22, 1, 0.36, 1),
  io: cubicBezier(0.65, 0, 0.35, 1),
  in: cubicBezier(0.4, 0, 1, 1),
  fly: cubicBezier(0.5, 0, 0.1, 1),
  grow: cubicBezier(0.3, 0, 0.2, 1),
  vortex: cubicBezier(0.6, 0, 0.2, 1),
  spring: cubicBezier(0.34, 1.4, 0.64, 1),
  card: cubicBezier(0.65, 0, 0.2, 1),
  lin: (t: number) => t,
};

export const bez = (t: number, p0: number, c: number, p2: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p2;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const RINGS = 16;
const DOT_LIST: { x: number; y: number; z: number; u: number; seed: number }[] = [];
const rand = mulberry32(7);
for (let k = 0; k < RINGS; k++) {
  const y = 1 - ((k + 0.5) / RINGS) * 2;
  const r = Math.sqrt(1 - y * y);
  const m = Math.max(4, Math.round(30 * r));
  for (let j = 0; j < m; j++) {
    const a = (j / m) * TAU + k * 0.35;
    DOT_LIST.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, u: (1 - y) / 2, seed: rand() * 6.283 });
  }
}

export const N = DOT_LIST.length;
export const DX = Float32Array.from(DOT_LIST, (d) => d.x);
export const DY = Float32Array.from(DOT_LIST, (d) => d.y);
export const DZ = Float32Array.from(DOT_LIST, (d) => d.z);
export const DU = Float32Array.from(DOT_LIST, (d) => d.u);
export const DS = Float32Array.from(DOT_LIST, (d) => d.seed);

export const COLORS: string[] = (() => {
  const out: string[] = [];
  for (let gi = 0; gi <= 24; gi++) {
    const g = gi / 24;
    const r = Math.round(lerp(226, 32, g));
    const gg = Math.round(lerp(32, 32, g));
    const b = Math.round(lerp(68, 32, g));
    for (let ai = 0; ai <= 48; ai++) {
      out.push(`rgba(${r},${gg},${b},${(ai / 48).toFixed(3)})`);
    }
  }
  return out;
})();

export interface OrbParams {
  k: number;
  alpha: number;
  spin: number;
  rot: number;
  sweep: number;
  pop: number;
  vortex: number;
  gain: number;
  floor: number;
  rad: number;
  prog: number;
}

export function createOrb(
  canvas: HTMLCanvasElement,
  getSpeed: () => number,
  isReduced: () => boolean
) {
  const P: OrbParams = {
    k: 0, alpha: 0, spin: 0, rot: 0, sweep: 0, pop: 1,
    vortex: 0, gain: 1, floor: 0, rad: 0, prog: 0,
  };
  const ctx = canvas.getContext("2d");
  const lit = new Float32Array(N);
  const SX = new Float32Array(N);
  const SY = new Float32Array(N);
  const SR = new Float32Array(N);
  const SD = new Float32Array(N);
  const SC = new Int16Array(N);
  const pw = new Float32Array(4);
  let time = 0, raf = 0, last = 0, dead = false;

  const reset = () => {
    P.k = 0; P.alpha = 0; P.spin = 0; P.rot = 0; P.sweep = 0;
    P.pop = 1; P.vortex = 0; P.gain = 1; P.floor = 0; P.rad = 0; P.prog = 0;
    lit.fill(0);
    pw[0] = 1; pw[1] = 0; pw[2] = 0; pw[3] = 0;
    time = isReduced() ? 1.2 : 0;
  };
  reset();

  if (!ctx) {
    return {
      P,
      ensure() {},
      reset,
      destroy() {},
    };
  }

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(CANVAS * dpr);
  canvas.height = Math.round(CANVAS * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const S = 0.6;
  const CP = Math.cos(0.35);
  const SP = Math.sin(0.35);
  const C0 = CANVAS / 2;

  const draw = (dt: number) => {
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    time += dt;
    P.rot += P.spin * dt;
    const yaw = P.rot + P.vortex;
    const cyw = Math.cos(yaw);
    const syw = Math.sin(yaw);
    const stepW = dt / 0.35;
    for (let q = 0; q < 4; q++) {
      const d = (q === P.prog ? 1 : 0) - pw[q];
      pw[q] += Math.abs(d) <= stepW ? d : d > 0 ? stepW : -stepW;
    }
    const decay = Math.exp(-dt / 0.5);
    const h0 = (time * 300) % N;

    for (let n = 0; n < N; n++) {
      const dx = DX[n], dy = DY[n], dz = DZ[n], u = DU[n];
      let pulse = 0;
      if (pw[0] > 0.001) {
        let dd = Math.abs(n - h0);
        if (dd > N - dd) dd = N - dd;
        const v = Math.max(0, 1 - dd / 16);
        pulse = Math.max(pulse, v * v * pw[0]);
      }
      const l = Math.max(lit[n] * decay, pulse * P.gain);
      lit[n] = l;

      const ki = Math.max(0, Math.min(1, P.k * (1 + S) - S * u));
      if (ki <= 0.001) {
        SC[n] = -1;
        continue;
      }
      const eo = E.out(ki);
      const kk = eo * P.pop;

      const x1 = dx * cyw + dz * syw;
      const z1 = -dx * syw + dz * cyw;
      const y2 = dy * CP - z1 * SP;
      const z2 = dy * SP + z1 * CP;
      const f = 2.8 / (2.8 - z2);
      const depth = (z2 + 1) / 2;
      const ox = x1 * ORB_R * kk * f;
      const oy = -y2 * ORB_R * kk * f;

      const g = Math.max(0, Math.min(1, (P.sweep * 1.4 - u) / 0.4));
      let a =
        0.1 +
        0.035 * Math.sin(DS[n] + time * 1.6) * (1 - g) +
        0.32 * depth * depth +
        0.75 * l * (1 - g) +
        g * (0.55 + 0.4 * depth);
      a = Math.max(a, P.floor * (0.7 + 0.3 * depth));
      if (a > 1) a = 1;
      a *= eo * P.alpha;

      SX[n] = C0 + ox;
      SY[n] = C0 + oy;
      SD[n] = depth;
      SR[n] =
        (1.15 * (0.45 + 0.75 * depth) * f + 0.9 * l + g * 0.25) *
        (1 + P.rad) *
        (0.4 + 0.6 * eo);
      const ai = Math.round(a * 48);
      const gi = Math.round(g * 24);
      SC[n] = ai <= 0 ? -1 : gi * 49 + ai;
    }

    for (let pass = 0; pass < 2; pass++) {
      for (let n = 0; n < N; n++) {
        const c = SC[n];
        if (c < 0) continue;
        if ((SD[n] >= 0.5) !== (pass === 1)) continue;
        ctx.fillStyle = COLORS[c];
        ctx.beginPath();
        ctx.arc(SX[n], SY[n], SR[n], 0, TAU);
        ctx.fill();
      }
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (dead) return;
    const dt = isReduced()
      ? 0
      : Math.max(0, Math.min(0.05, (now - last) / 1000)) * getSpeed();
    last = now;
    draw(dt);
    if (P.alpha > 0.002) {
      raf = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, CANVAS, CANVAS);
    }
  };

  return {
    P,
    ensure: () => {
      if (!raf && !dead && P.alpha > 0.002) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    },
    reset,
    destroy: () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
