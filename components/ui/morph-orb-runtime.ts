import {
  E,
  bez,
  PILL_H,
  BALL_SMALL,
  ORB_D,
  CANVAS,
  CARD_H,
  FLY_D,
  createOrb,
  homeDy,
  pillW,
  cardW,
} from "./morph-orb-math";
import { casinos, dailyBonusData } from "@/lib/casino-data";

type Track = { ch: string; t0: number; t1: number; from: number; to: number; ease?: (t: number) => number };

interface EnvUI {
  setPhase: (p: string) => void;
  setAnswer: (s: string) => void;
  live: (s: string) => void;
  clearInput: () => void;
  lock: () => void;
  idleReady: () => void;
  focusAnswer: () => void;
}

interface Env {
  actor: HTMLDivElement | null;
  mover: HTMLDivElement | null;
  root: HTMLDivElement | null;
  canvas: HTMLCanvasElement;
  status: Record<string, unknown>;
  pulse: Record<string, unknown>;
  ghosts: unknown[];
  form: HTMLFormElement | null;
  getBody: () => string | null;
  getSpeed: () => number;
  isReduced: () => boolean;
  CH_MAP?: Record<string, (v: number) => void>;
  ui: EnvUI;
}

export function getActiveCasinos(): { name: string; logo: string; background: string; promoTag: string; reward: string; affiliateUrl: string }[] {
  const dayIndex = (new Date().getDay() + 6) % 7;
  const bonuses = dailyBonusData[dayIndex] ?? [];
  return bonuses.slice(0, 2).map((bonus) => {
    const casino = casinos.find((c) => c.name === bonus.casinoName);
    return {
      name: casino?.name ?? bonus.casinoName,
      logo: casino?.logo ?? "",
      background: casino?.background ?? "#333",
      promoTag: bonus.promoTag,
      reward: bonus.reward,
      affiliateUrl: casino?.affiliateUrl ?? "#directory",
    };
  });
}

function detectLanguage(message: string): "lv" | "ru" | "en" {
  if (/[āčēģīķļņšūž]/i.test(message)) return "lv";
  if (/[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/i.test(message)) return "ru";
  return "en";
}

export function buildFallbackAnswer(message: string): string {
  const active = getActiveCasinos();
  const name1 = active[0]?.name ?? "Oxibet";
  const name2 = active[1]?.name ?? "Crusino";
  const lang = detectLanguage(message);

  if (lang === "ru") {
    return `К сожалению, сейчас мы работаем в тестовой среде Bolt.new, и из-за внутренних настроек безопасности сервер временно не принимает прямые запросы к ИИ-модели. Но я всё равно могу порекомендовать вам и без связи с нашей главной базой лучшие бонусы на сегодня — ${name1} и ${name2}! Оба предложения предлагают отличные условия и быстрые выплаты. Хотите узнать больше о любом из них?`;
  }

  if (lang === "lv") {
    return `Diemžēl šobrīd darbojamies Bolt.new testēšanas vidē, un drošības iestatījumu dēļ serveris uz laiku nevar sazināties ar AI modeli. Tomēr es joprojām varu ieteikt jums šodienas labākos bonusus arī bez savienojuma ar galveno bāzi — ${name1} un ${name2}! Abi piedāvājumi piedāvā izdevīgus nosacījumus un ātras izmaksas. Vai vēlaties uzzināt vairāk par kādu no tiem?`;
  }

  return `Unfortunately, we are currently running in a Bolt.new testing environment, and due to internal security settings the server temporarily cannot reach the AI model directly. But I can still recommend today's best bonuses even without a connection to our main database — ${name1} and ${name2}! Both offers provide great terms and fast payouts. Would you like to learn more about either of them?`;
}

export function createRuntime(env: Env) {
  const { root, status, pulse, ghosts, form } = env;
  const life = new AbortController();
  const geo = { pw: pillW(), cw: cardW(), H: homeDy(), dir: -1 };
  const orb = createOrb(env.canvas, env.getSpeed, env.isReduced);
  const vals: Record<string, number> = {};
  let current: AbortController | null = null;
  let busy = false,
    idling = false,
    epoch = 0,
    curX = 0,
    curY = 0,
    curD = BALL_SMALL,
    trailVis = 0;
  const hist: unknown[] = [];

  const setNow = (ch: string, v: number) => {
    vals[ch] = v;
    env.CH_MAP?.[ch]?.(v);
  };

  const play = (tracks: Track[], sig: AbortSignal) =>
    new Promise<void>((res) => {
      if (sig.aborted) return res();
      const end = tracks.reduce((m, k) => Math.max(m, k.t1), 0);
      let raf = 0,
        t = 0,
        last = performance.now();
      const step = (now: number) => {
        t += Math.max(0, now - last) * env.getSpeed();
        last = now;
        for (const k of tracks) {
          if (t < k.t0) continue;
          const p = Math.min(1, (t - k.t0) / Math.max(1, k.t1 - k.t0));
          vals[k.ch] = k.from + (k.to - k.from) * (k.ease ?? E.io)(p);
          env.CH_MAP?.[k.ch]?.(vals[k.ch]);
        }
        if (t >= end) res();
        else raf = requestAnimationFrame(step);
      };
      sig.addEventListener(
        "abort",
        () => {
          cancelAnimationFrame(raf);
          res();
        },
        { once: true }
      );
      raf = requestAnimationFrame(step);
    });

  return {
    start: async (text: string, _cfg: unknown) => {
      if (busy) return false;
      busy = true;
      env.ui.setPhase("think");
      env.ui.live("Thinking...");

      const friendlyAnswer = buildFallbackAnswer(text);

      await new Promise<void>((res) => setTimeout(res, 1500));

      env.ui.setAnswer(friendlyAnswer);
      env.ui.setPhase("answered");
      busy = false;
      return true;
    },
    escape: () => {
      busy = false;
      env.ui.setPhase("idle");
      orb.reset();
    },
    reset: () => {
      busy = false;
      env.ui.setPhase("idle");
      env.ui.setAnswer("");
      orb.reset();
    },
    busy: () => busy,
    destroy: () => {
      life.abort();
      orb.destroy();
    },
  };
}
