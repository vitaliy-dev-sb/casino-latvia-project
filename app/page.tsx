'use client';

import { type CSSProperties, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  Gift,
  Home as HomeIcon,
  Menu,
  LoaderCircle,
  Newspaper,
  Trophy,
  X,
  Send,
} from 'lucide-react';
import BorderBeam from '@/components/ui/border-beam';
import { casinos, dailyBonusData, type Casino, type BonusEntry } from '@/lib/casino-data';


const stats = [
  { value: '124', label: 'Licensed casinos personally tested', icon: '/icon/icon_shield.svg' },
  { value: '987', label: 'Detailed slot reviews compiled', icon: '/icon/icon_slot_machine.svg' },
  { value: '499', label: 'Active bonus offers validated', icon: '/icon/icon_bonus.svg' },
  { value: '54', label: 'Secure payment methods vetted', icon: '/icon/icon_payment.svg' },
];

const seoParagraphs = [
  'Discover the ultimate catalog of regulated online gambling in Latvia. Our team evaluates local sites first-hand to deliver comprehensive casino ratings, clear rule breakdowns, and the highest payout options available.',
  'Every casino in our directory is checked for licensing, payment speed, game variety, and the quality of its welcome offers before it earns a place on the list.',
  'Whether you are looking for a trusted casino for classic table games or the latest slots, our practical guides make it easier to compare the details that matter most.',
  'We keep our reviews current as bonus terms, new operators, and payment methods change, so Latvian players can make confident and informed choices.',
  'Play responsibly and always read the full terms before claiming an offer. Gambling should be entertaining, never a way to solve financial problems.',
];


const sectionActionButtonClass = 'flex h-auto shrink-0 items-center gap-0.5 rounded-[10px] bg-[#e2dfdf] px-3.5 py-[11px] text-sm font-medium text-[#1a1516] transition-colors hover:bg-[#d5d2d2]';

const navItems = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Casinos', icon: Trophy },
  { label: 'Bonuses', icon: Gift },
  { label: 'Games', icon: Gamepad2 },
  { label: 'News', icon: Newspaper },
];

function RankBadge({ visualRank }: { visualRank: number }) {
  const medal = visualRank === 1 ? 'linear-gradient(135deg, #ffe17b, #c89924)' : visualRank === 2 ? 'linear-gradient(135deg, #f3f3f5, #a6a9ad)' : visualRank === 3 ? 'linear-gradient(135deg, #ead1bb, #c8a281)' : '#f9f8f8';

  return (
    <div
      className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-[14px_0_14px_0] text-xs font-extrabold text-[#1a1516]"
      style={{ background: medal }}
      aria-label={`Rank ${visualRank}`}
    >
      {visualRank}
    </div>
  );
}

const slotImages = [
  '/assets/slot-1.png',
  '/assets/slot-2.png',
  '/assets/slot-3.png',
  '/assets/slot-4.png',
  '/assets/slot-5.png',
];
const reelSlots = Array.from({ length: 6 }, () => slotImages).flat().map((_, index) => index);
const reelStep = 156;

function SpookySpinsBanner() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [targetIndex, setTargetIndex] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const centerOffset = 70;
  const targetDistance = targetIndex * reelStep + centerOffset;
  const restOffset = currentIndex * reelStep + centerOffset;

  const handleSpin = () => {
    if (isSpinning) {
      return;
    }

    const nextTarget = 20 + Math.floor(Math.random() * 10);
    setTargetIndex(nextTarget);
    setHasWon(false);
    setIsSpinning(true);
  };

  const handleSpinEnd = () => {
    setCurrentIndex(targetIndex);
    setIsSpinning(false);
    setHasWon(true);
  };

  return (
    <section className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-[#1B052E] via-[#295E24] to-[#0D0D0D] pb-5 pt-0 text-white shadow-[0_6px_18px_rgba(13,13,13,0.16)]">
      <div className="flex flex-col items-center px-4 text-center">
        <img src="/assets/bgaming-logo.png" alt="BGaming" width={128} height={38} className="h-[38px] w-[128px] object-contain" />
        <h2 className="mt-[14px] text-[21px] font-extrabold leading-[24px]">Spooky Spins Await!<br />20 FS in BGaming slots!</h2>
        <p className="mt-[16px] mb-[12px] text-sm text-white/85">100% Free. No deposit required.</p>
      </div>

      {/* Slot track viewport — 190px tall, overflow-visible so frame/arrow/Play can extend beyond */}
      <div className="relative mt-[20px] h-[190px] overflow-visible" aria-live="polite">
        {/* z-0: Dynamic reels track — the moving lane */}
        <div className="absolute left-1/2 top-0 z-0">
          <div
            className={`flex w-max gap-4 ${isSpinning ? 'reel-spin' : ''}`}
            style={{
              '--spin-distance': `${targetDistance}px`,
              transform: `translateX(-${restOffset}px)`,
            } as CSSProperties}
            onAnimationEnd={handleSpinEnd}
          >
            {reelSlots.map((slotIndex) => (
              <div
                key={slotIndex}
                className={`h-[190px] w-[140px] shrink-0 overflow-hidden rounded-2xl bg-[#162b1b] ${hasWon && slotIndex === targetIndex ? 'winner-flash' : ''}`}
              >
                <img
                  src={slotImages[slotIndex % slotImages.length]}
                  alt="Haunted Reels slot"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* z-10: Lateral vignette shadows — locked to 190px, flush to outer edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[24%] bg-gradient-to-r from-[#1B052E] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[24%] bg-gradient-to-l from-[#0D0D0D] to-transparent" />

        {/* z-30: Static center frame — frame, arrow, Play button all anchored here */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-full w-[140px] -translate-x-1/2">
          {/* Target frame — flush to slot card edges, flat solid #20C137 */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#20C137]" />
          {/* Top indicator arrow — 50% smaller, hangs above the frame border */}
          <svg
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            width="45"
            height="21"
            viewBox="0 0 45 21"
            fill="#20C137"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 3 L36 3 Q40.5 3 40.5 7.5 L25.5 18 Q22.5 21 19.5 18 L4.5 7.5 Q4.5 3 9 3 Z" />
          </svg>
          {/* Play button — anchored to bottom of frame, extends below the 190px viewport */}
          <a
            href="#directory"
            aria-label="Play BGaming slots"
            aria-disabled={isSpinning}
            className={`pointer-events-auto absolute bottom-[-24px] left-1/2 flex h-[38px] w-[110px] -translate-x-1/2 items-center justify-center rounded-xl bg-gradient-to-b from-[#39FF14] to-[#1D9B07] text-xs font-bold transition-opacity duration-300 ${isSpinning ? 'pointer-events-none opacity-0' : 'opacity-100'}`} style={{ color: '#141414' }}
          >
            Play
          </a>
        </div>
      </div>

      {/* Spin button — compact margin below the Play button */}
      <div className="mt-[42px] px-4">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="relative mx-auto flex h-12 w-full max-w-[322px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-b from-[#39FF14] to-[#1D9B07] px-6 text-base font-bold transition-all duration-300 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ color: '#141414', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 15px rgba(32, 193, 55, 0.3)' }}
        >
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <img src="/assets/ghost-icon.svg" alt="" aria-hidden="true" className="h-5 w-5" />
            Spin the Wheel
          </span>
        </button>
      </div>
    </section>
  );
}

const gameCategories = ['Top', 'Slots', 'Live Casino', 'Cards', 'Roulette'];

type GameEntry = {
  id: string;
  title: string;
  tags: string[];
  image: string;
  addedOrder: number;
  exclusive?: boolean;
  miniImage?: string;
};

const gameDatabase: GameEntry[] = [
  { id: 'ultras', title: 'Ultras', tags: ['top', 'exclusive'], image: '/ultras_cover.webp', addedOrder: 1, miniImage: '/ultras_mini.webp', exclusive: true },
  { id: 'johnny-vs-chicken', title: 'Johnny vs Chicken', tags: ['top', 'slots'], image: '/johny_vs_chiken.webp', addedOrder: 2 },
  { id: 'miss-cherry', title: 'Miss Cherry Wild Frames', tags: ['top', 'slots'], image: '/miss_cherry.webp', addedOrder: 3 },
  { id: 'dusty-duel', title: 'Dusty Duel', tags: ['top', 'slots'], image: '/dusty_duel.webp', addedOrder: 4 },
  { id: 'franzy-clusters', title: 'Franzy Clusters', tags: ['top', 'slots'], image: '/franzy_clusters.webp', addedOrder: 5 },
  { id: 'red-hot-chilli', title: 'Red & Hot Chilli', tags: ['top', 'slots'], image: '/red_hot_chilli.webp', addedOrder: 6 },
  { id: 'reel-of-ra', title: 'Reel of Ra', tags: ['top', 'slots'], image: '/reel_of_ra.webp', addedOrder: 7 },
  { id: 'temple-of-power', title: 'Temple of Power', tags: ['top', 'slots'], image: '/temple_of_power.webp', addedOrder: 8 },
  { id: 'american-roulette-live', title: 'American Roulette Live', tags: ['live casino', 'roulette'], image: '/american_roulette_live.webp', addedOrder: 9 },
  { id: 'double-ball-roulette-live', title: 'Double Ball Roulette Live', tags: ['live casino', 'roulette'], image: '/double_ball_roulette_live.webp', addedOrder: 10 },
  { id: 'immersive-roulette-live', title: 'Immersive Roulette Live', tags: ['live casino', 'roulette'], image: '/immersive_roulette_live.webp', addedOrder: 11 },
  { id: 'lightning-roulette', title: 'Lightning Roulette', tags: ['top', 'live casino', 'roulette'], image: '/lighting_roulette.webp', addedOrder: 12 },
  { id: 'speed-roulette-live', title: 'Speed Roulette Live', tags: ['live casino', 'roulette'], image: '/speed_roulette_live.webp', addedOrder: 13 },
  { id: 'classic-baccarat', title: 'Classic Baccarat', tags: ['cards'], image: '/classic_baccarat.webp', addedOrder: 14 },
  { id: 'classic-multihand-blackjack', title: 'Classic Multihand Blackjack', tags: ['cards'], image: '/classic_multihand_blackjack.webp', addedOrder: 15 },
  { id: 'multihand-blackjack-pro-2', title: 'Blackjack Multihand Pro 2', tags: ['cards'], image: '/multihand_blackjack_pro_2.webp', addedOrder: 16 },
  { id: 'multihand-blackjack', title: 'Multihand Blackjack', tags: ['cards'], image: '/multihand_blackjack.webp', addedOrder: 17 },
  { id: 'speed-blackjack-pro', title: 'Speed Blackjack Pro', tags: ['cards'], image: '/speed_blackjack_pro.webp', addedOrder: 18 },
  { id: 'clash-of-gods-power-duel', title: 'Clash of Gods Power Duel', tags: ['slots'], image: '/clash_of-gods_power_duel.webp', addedOrder: 19 },
  { id: 'lucky-turkey', title: 'Lucky Turkey', tags: ['slots'], image: '/lucky_turkey.webp', addedOrder: 20 },
  { id: 'the-godfather-3-pillars-of-power', title: 'The Godfather: 3 Pillars of Power', tags: ['top', 'slots'], image: '/the_godfather_3_pillars_of_power.webp', addedOrder: 21 },
  { id: 'wild-cash-gold', title: 'Wild Cash Gold', tags: ['top', 'slots'], image: '/wild_cash_gold.webp', addedOrder: 22 },
  { id: 'wild-west-trueways', title: 'Wild West Trueways', tags: ['slots'], image: '/wild_west_trueways.webp', addedOrder: 23 },
  { id: 'easy-blackjack-live', title: 'Easy Blackjack Live', tags: ['new', 'live casino', 'cards'], image: '/easy_blackjack_live.webp', addedOrder: 24 },
  { id: 'free-bet-blackjack-live', title: 'Free Bet Blackjack Live', tags: ['new', 'live casino', 'cards'], image: '/free_bet_blackjack_live.webp', addedOrder: 25 },
  { id: 'lightning-baccarat-xxxtreme', title: 'Lightning Baccarat XXXTreme', tags: ['new', 'live casino'], image: '/lighrning_baccarat_xxxtreme.webp', addedOrder: 26 },
  { id: 'lightning-sic-bo-live', title: 'Lightning Sic Bo Live', tags: ['top', 'live casino'], image: '/lightning_sicbo_live.webp', addedOrder: 27 },
  { id: 'super-speed-baccarat-live', title: 'Super Speed Baccarat Live', tags: ['new', 'live casino'], image: '/super_speed_baccarat_live.webp', addedOrder: 28 },
  { id: 'arcade-roulette', title: 'Arcade Roulette', tags: ['new', 'roulette'], image: '/arcade_roulette.webp', addedOrder: 29 },
  { id: 'gold-vault-roulette-live', title: 'Gold Vault Roulette Live', tags: ['new', 'live casino', 'roulette'], image: '/gold_vault_roulette_live.webp', addedOrder: 30 },
  { id: 'mega-roulette-3000', title: 'Mega Roulette 3000', tags: ['new', 'live casino', 'roulette'], image: '/mega_roulette_3000.webp', addedOrder: 31 },
  { id: 'monopoly-roulette-live', title: 'Monopoly Roulette Live', tags: ['new', 'live casino', 'roulette'], image: '/monopoly_roulette_live.webp', addedOrder: 32 },
  { id: 'quantum-roulette-live', title: 'Quantum Roulette Live', tags: ['new', 'live casino', 'roulette'], image: '/quantum_roulette_live.webp', addedOrder: 33 },
  { id: 'azure-roulette', title: 'Azure Roulette', tags: ['top', 'live casino', 'roulette'], image: '/azure_roulette.webp', addedOrder: 34 },
  { id: 'casino-hold-em-elena', title: "Casino Hold 'em Elena", tags: ['top', 'live casino', 'cards'], image: '/casino_hold_em_elena.webp', addedOrder: 35 },
  { id: 'casino-hold-em-kate', title: "Casino Hold 'em Kate", tags: ['new', 'live casino', 'cards'], image: '/casino_hold_em_kate.webp', addedOrder: 36 },
  { id: 'svensk-roulette-live', title: 'Svensk Roulette Live', tags: ['new', 'live casino', 'roulette'], image: '/svensk_roulette_live.webp', addedOrder: 37 },
  { id: 'exclusive-baccarat', title: 'Exclusive Baccarat', tags: ['new', 'live casino', 'cards'], image: '/exclusive_baccarat.webp', addedOrder: 38 },
  { id: 'baccarat-no-commission-live', title: 'Baccarat No Commission Live', tags: ['new', 'live casino', 'cards'], image: '/baccarat_no_comission_live.webp', addedOrder: 39 },
  { id: 'baccarat-b', title: 'Baccarat B', tags: ['new', 'live casino', 'cards'], image: '/baccarat_b.webp', addedOrder: 40 },
].map((game) => game.tags.includes('top') ? game : { ...game, tags: [...game.tags, 'new'] });

function GameCard({ game }: { game: GameEntry }) {
  const isExclusive = game.exclusive || game.tags.includes('exclusive');
  const gameType = game.tags.includes('roulette') ? 'live roulette game' : game.tags.includes('cards') ? 'casino card game' : 'slot game';
  const alt = isExclusive
    ? 'Ultras exclusive slot game by BGaming at SEO Casino Latvia'
    : `${game.title} ${gameType} at SEO Casino Latvia`;

  return (
    <article className={`relative h-[154px] overflow-hidden rounded-2xl ${isExclusive ? 'col-span-2' : ''}`}>
      <img
        src={game.image}
        alt={alt}
        title={alt}
        loading={isExclusive ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {isExclusive ? (
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-2.5 rounded-2xl bg-black/40 p-1.5 backdrop-blur-md">
          <img
            src={game.miniImage}
            alt="Ultras slot game icon by BGaming at SEO Casino Latvia"
            title="Ultras slot game icon by BGaming at SEO Casino Latvia"
            loading="lazy"
            decoding="async"
            className="h-10 w-10 shrink-0 rounded-[7px] border border-white object-cover"
          />
          <div className="min-w-0 text-white">
            <p className="text-sm font-semibold leading-normal">{game.title}</p>
            <p className="text-[9px] font-medium leading-normal text-white/80">Exclusively for SEO Casino Latvia by BGAMING</p>
          </div>
        </div>
      ) : game.tags.includes('new') ? (
        <span className="absolute left-[9px] top-[9px] flex h-3.5 min-w-6 items-center justify-center rounded-full bg-[#E22044] px-1 text-[7px] font-bold leading-none text-white">NEW</span>
      ) : game.tags.includes('top') ? (
        <span className="absolute left-[9px] top-[9px] flex h-3.5 min-w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#242426] via-[#1a1a1c] to-[#400818] px-1 text-[7px] font-bold leading-none text-white">TOP</span>
      ) : null}
    </article>
  );
}

function getGamePriority(game: GameEntry): number {
  if (game.tags.includes('new')) return 1;
  if (game.tags.includes('top')) return 2;
  return 3;
}

function CasinoGamesSection() {
  const [selectedCategory, setSelectedCategory] = useState('Top');
  const filteredGames = gameDatabase
    .filter((game) => game.tags.includes(selectedCategory.toLowerCase()))
    .sort((firstGame, secondGame) => getGamePriority(firstGame) - getGamePriority(secondGame) || secondGame.addedOrder - firstGame.addedOrder);
  const visibleGames = (selectedCategory === 'Top'
    ? [
        gameDatabase.find((game) => game.id === 'ultras')!,
        ...filteredGames.filter((game) => game.id !== 'ultras'),
      ]
    : filteredGames).slice(0, selectedCategory === 'Top' ? 11 : 12);

  return (
    <section id="casino-games" className="flex w-full scroll-mt-[76px] flex-col gap-3.5 bg-white px-4 pb-8 pt-[30px] text-[#1a1516]">
      <header className="flex w-full items-center gap-[30px]">
        <h2 className="flex-1 text-[21px] font-bold leading-6">Casino games</h2>
        <button type="button" className={sectionActionButtonClass}>
          All games
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex w-full flex-col gap-[18px]">
        <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {gameCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-[14px] py-[10px] text-[14px] font-medium transition-colors ${selectedCategory === category ? 'bg-[#141414] text-white' : 'border border-[#e2dfdf] bg-white text-[#1a1516] hover:border-[#9e1b34] hover:bg-[#fff0f2]'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid w-[736px] grid-cols-6 grid-rows-2 gap-2">
            {visibleGames.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

const dayLabels = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const nextWeekBonusOrder: Record<number, number[]> = {
  0: [2, 0, 3, 1],
  1: [2, 0, 1],
  2: [3, 1, 0, 2],
  3: [4, 1, 3, 0, 2],
  4: [2, 0, 3, 1],
};

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - ((d.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekOffset(date: Date, today: Date): number {
  const currentWeekStart = getMondayOfWeek(today);
  const targetWeekStart = getMondayOfWeek(date);
  return Math.round((targetWeekStart.getTime() - currentWeekStart.getTime()) / 86400000 / 7);
}

function isSelectableBonusDate(date: Date, today: Date): boolean {
  const weekOffset = getWeekOffset(date, today);
  if (weekOffset < 0 || weekOffset > 1) return false;
  if (weekOffset === 0) return date >= today;
  return date.getDay() >= 1 && date.getDay() <= 5;
}

function getBonusesForDate(date: Date, today: Date): BonusEntry[] {
  const dayIndex = (date.getDay() + 6) % 7;
  const bonuses = dailyBonusData[dayIndex] ?? [];
  if (getWeekOffset(date, today) !== 1 || dayIndex > 4) return bonuses;
  return nextWeekBonusOrder[dayIndex].map((index) => bonuses[index]);
}

function DailyBonusCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleWeekStart, setVisibleWeekStart] = useState(() => getMondayOfWeek(today));

  const weekNumber = getISOWeekNumber(visibleWeekStart);
  const monthYear = visibleWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekOffset = getWeekOffset(visibleWeekStart, today);
  const canGoBack = weekOffset > 0;
  const canGoForward = weekOffset < 1;
  const selectedDateIsEnabled = isSelectableBonusDate(selectedDate, today);
  const bonuses = selectedDateIsEnabled ? getBonusesForDate(selectedDate, today) : [];
  const secretCasino = casinos.find((casino) => casino.name === 'Oxibet')!;

  const handleDayClick = (index: number) => {
    const newDate = new Date(visibleWeekStart);
    newDate.setDate(visibleWeekStart.getDate() + index);
    if (!isSelectableBonusDate(newDate, today)) return;
    setSelectedDate(newDate);
  };

  const handleWeekChange = (direction: number) => {
    if ((direction < 0 && !canGoBack) || (direction > 0 && !canGoForward)) return;
    const newWeekStart = new Date(visibleWeekStart);
    newWeekStart.setDate(visibleWeekStart.getDate() + direction * 7);
    setVisibleWeekStart(newWeekStart);
  };

  return (
    <section id="daily-casino-bonuses" className="flex w-full scroll-mt-[76px] flex-col gap-3.5 bg-[#f9f8f8] px-4 pb-8 pt-[30px] text-[#1a1516]">
      <header className="flex w-full items-center justify-between">
        <h2 className="text-[21px] font-bold leading-6">Daily Casino Bonuses</h2>
        <button type="button" className={sectionActionButtonClass}>
          All bonuses
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200/80 bg-white px-[14px] pb-[14px] pt-[14px]">
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => handleWeekChange(-1)} disabled={!canGoBack} aria-label="Previous week" className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f2f2] text-[#1a1516] transition-colors hover:bg-[#e2dfdf] ${!canGoBack ? 'pointer-events-none cursor-not-allowed opacity-40' : ''}`}>
            <ChevronDown className="h-4 w-4 rotate-90" aria-hidden="true" />
          </button>
          <span className="text-sm font-bold text-[#1a1516]">Week {weekNumber} · {monthYear}</span>
          <button type="button" onClick={() => handleWeekChange(1)} disabled={!canGoForward} aria-label="Next week" className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f2f2] text-[#1a1516] transition-colors hover:bg-[#e2dfdf] ${!canGoForward ? 'pointer-events-none cursor-not-allowed opacity-40' : ''}`}>
            <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
          </button>
        </div>

        <div className="flex w-full justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-full min-w-0 justify-between gap-1">
            {dayLabels.map((label, index) => {
              const dayDate = new Date(visibleWeekStart);
              dayDate.setDate(visibleWeekStart.getDate() + index);
              const isEnabled = isSelectableBonusDate(dayDate, today);
              const isToday = isSameDay(dayDate, today);
              const isActive = isSameDay(dayDate, selectedDate) && isEnabled;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleDayClick(index)}
                  disabled={!isEnabled}
                  aria-pressed={isActive}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[10px] px-0 py-2.5 text-center transition-colors ${isActive ? 'bg-[#141414]' : isEnabled ? 'bg-[#f7f7f7] hover:bg-[#e2dfdf]' : 'cursor-not-allowed bg-[#fafafa]'}`}
                >
                  <span className={`w-full text-center text-[10px] font-bold uppercase leading-none ${isToday ? 'text-[#E22044]' : isActive ? 'text-white' : isEnabled ? 'text-[#1a1516]' : 'text-[#c6c2c3]'}`}>{label}</span>
                  <span className={`w-full text-center text-sm font-bold leading-none ${isToday ? 'text-[#E22044]' : isActive ? 'text-white' : isEnabled ? 'text-[#1a1516]' : 'text-[#c6c2c3]'}`}>{dayDate.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col">
          {bonuses.map((bonus, index) => {
            const casino = casinos.find((c) => c.name === bonus.casinoName);
            if (!casino) return null;

            return (
              <div key={`${bonus.casinoName}-${index}`} className="flex flex-row items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl p-2" style={{ backgroundColor: casino.background }}>
                  <img src={casino.logo} alt={`${casino.name} logo`} className="h-full w-full object-contain" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#9e1b34]">{bonus.promoTag}</span>
                  <span className="text-base font-bold leading-5 text-black">{bonus.reward}</span>
                  <span className="text-[10px] text-[#777073]">min deposit €20 · wagering 30x · T&amp;Cs apply</span>
                </div>
                <a href="#directory" aria-label={`View ${casino.name} offer`} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f3f2f2] text-[#1a1516] transition-opacity transition-transform hover:opacity-70 active:scale-95">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-1 rounded-[14px] bg-[#212121] p-5 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9f7aea]">EXCLUSIVE FOR DISCORD</span>
          <div className="relative mt-4 flex min-h-[104px] items-center justify-center overflow-hidden rounded-xl bg-[#1a1a1c] p-4">
            <div className="absolute inset-0 flex items-center gap-3 opacity-60 blur-md">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl p-2" style={{ backgroundColor: secretCasino.background }}>
                <img src={secretCasino.logo} alt="" className="h-full w-full object-contain" />
              </div>
              <span className="text-sm">min deposit €20 · wagering 30x · T&amp;Cs apply</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1 text-center">
              <span className="text-base font-bold text-white">200 Free Spins Secret Bonus</span>
              <span className="text-[10px] font-medium text-gray-400">min deposit €20 · wagering 30x · T&amp;Cs apply</span>
            </div>
          </div>
          <BorderBeam duration={3.3} strength={2} beamWidth={2} backgroundColor="#6d3bd1" active className="mt-4 w-full">
            <button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#6d3bd1] px-4 text-sm font-bold text-white transition-colors hover:bg-[#7d4be0]">
              <img src="/social_discord.svg" alt="" aria-hidden="true" className="h-5 w-5 brightness-0 invert" />
              Join the Club
            </button>
          </BorderBeam>
        </div>
      </div>
    </section>
  );
}

const newsArticle = {
  title: 'What Is Really Wrong With This Casino? Who Do You Think You Are, Mister?',
  description: 'An absolute disaster at the table this October. Who do you think you are, mister, to manipulate the game like this and break every single rule in front of everyone?',
  meta: 'By Mark Vance · 8 Oct 2026',
};

function NewsSection() {
  return (
    <section id="news" className="flex w-full scroll-mt-[76px] flex-col gap-3.5 bg-[#f9f8f8] px-4 pb-8 pt-[30px] text-[#1a1516]">
      <header className="flex w-full items-center gap-[30px]">
        <h2 className="flex-1 text-[21px] font-bold leading-6">News</h2>
        <button type="button" className={sectionActionButtonClass}>
          All articles
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex w-full flex-col gap-3.5">
        <article className="overflow-hidden rounded-2xl border border-[#e2dfdf] bg-white">
          <img src="/news_01_drama.jpg" alt="Drama at a casino table" className="w-full aspect-[3/2] rounded-t-2xl object-cover" />
          <div className="flex flex-col gap-1.5 p-4">
            <p className="text-[11px] font-extrabold tracking-[1px] text-[#9e1b34]">SCANDAL</p>
            <h3 className="text-lg font-bold leading-[22px] text-[#1a1516]">{newsArticle.title}</h3>
            <p className="line-clamp-2 text-[13px] leading-5 text-[#4f484a]">{newsArticle.description}</p>
            <p className="pt-0.5 text-xs text-[#777073]">{newsArticle.meta}</p>
          </div>
        </article>

        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#e2dfdf] bg-white px-3">
          {Array.from({ length: 4 }, (_, index) => (
            <article key={`news-article-${index + 1}`} className="flex flex-row items-start gap-4 border-b border-gray-100 py-3 last:border-0">
              <img src="/news_01_drama.jpg" alt="Drama at a casino table" className="aspect-[3/2] w-[110px] shrink-0 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-sm font-bold leading-[17px] text-[#1a1516]">{newsArticle.title}</h3>
                <p className="text-xs text-[#777073]">{newsArticle.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type FaqItem = {
  question: string;
  answer: string[];
};

const faqItems: FaqItem[] = [
  {
    question: 'What is SEO Casino Latvia and how does it work?',
    answer: [
      'SEO Casino Latvia is an independent affiliate website that helps Latvian players compare online casinos, games, payment options, and bonus terms in one place. We publish honest reviews and practical guides so you can make a more informed choice before signing up.',
      'When you use one of our links to visit a casino, we may receive a commission from the operator. This does not change the amount you pay, and our rankings are based on our review criteria rather than the commission we may earn.',
    ],
  },
  {
    question: 'Are online casinos featured on this site legal in Latvia?',
    answer: ['The casinos we feature should be checked for the appropriate Latvian licensing and operating permissions before you play. Always confirm the operator\'s current licence status and read the terms that apply to Latvian players.'],
  },
  {
    question: 'How do you evaluate and rank Latvian online casinos?',
    answer: ['We compare licensing, player safety, game selection, bonus terms, payment methods, withdrawal speed, customer support, and overall user experience. Reviews are updated when important operator details change.'],
  },
  {
    question: 'What are the most popular casino games available for Latvian players?',
    answer: ['Slots, live casino tables, blackjack, roulette, baccarat, poker, and jackpot games are among the most popular choices. Availability varies by casino, so check the game lobby before registering.'],
  },
  {
    question: 'Can I claim exclusive casino bonuses through SEO Casino Latvia?',
    answer: ['Some listed operators offer special promotions through our links. Check the full bonus terms, minimum deposit, wagering requirements, expiry date, and eligible games before claiming any offer.'],
  },
  {
    question: 'How long does it take to withdraw winnings from these casinos?',
    answer: ['Processing times depend on the casino, payment method, verification checks, and banking provider. E-wallets and some instant payment options can be faster, while bank transfers may take several business days.'],
  },
  {
    question: 'Is it possible to play online casino games on mobile devices?',
    answer: ['Most modern casino sites are designed to work in a mobile browser, and some also offer dedicated apps. Use a current browser and a secure connection for the best experience.'],
  },
  {
    question: 'What payment methods are supported by Latvian casino sites?',
    answer: ['Common options include cards, bank transfers, e-wallets, and selected instant payment services. The exact methods, fees, limits, and processing times differ between operators.'],
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="flex w-full scroll-mt-[76px] flex-col gap-5 bg-[#f9f8f8] px-4 pb-10 pt-8 text-[#1a1516]">
      <h2 className="text-[21px] font-bold leading-6">Frequently asked questions</h2>
      <div className="overflow-hidden rounded-2xl border border-[#e2dfdf] bg-white px-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.question} className="border-b border-gray-100 last:border-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-bold leading-5 text-[#1a1516]">{item.question}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#6e6466] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="min-h-0 overflow-hidden">
                  {item.answer.map((paragraph) => <p key={paragraph} className="mb-3 text-[13px] leading-5 text-[#4f484a] last:mb-0">{paragraph}</p>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const footerLinkGroups = [
  {
    title: 'Casinos',
    links: [
      ['Top Online Casinos', '#top-online-casinos'],
      ['New Casino Sites', '#new-casino-sites'],
      ['Live Dealer Casinos', '#live-dealer-casinos'],
      ['Mobile Casino Apps', '#mobile-casino-apps'],
      ['Fast Payout Casinos', '#fast-payout-casinos'],
      ['Crypto Gambling Latvia', '#crypto-gambling-latvia'],
    ],
  },
  {
    title: 'Bonuses',
    links: [
      ['Welcome Bonuses', '#welcome-bonuses'],
      ['No Deposit Offers', '#no-deposit-offers'],
      ['Free Spins No Wagering', '#free-spins-no-wagering'],
      ['Cashback Deals', '#cashback-deals'],
      ['Reload Bonuses', '#reload-bonuses'],
      ['Exclusive Promo Codes', '#exclusive-promo-codes'],
    ],
  },
  {
    title: 'Useful Guides',
    links: [
      ['How to Choose a Casino', '#how-to-choose-a-casino'],
      ['Casino Payment Methods', '#casino-payment-methods'],
      ['Understanding Wagering', '#understanding-wagering'],
      ['Responsible Gambling Tips', '#responsible-gambling-tips'],
      ['Slot Machine RTP Guide', '#slot-machine-rtp-guide'],
      ['Blackjack Strategies', '#blackjack-strategies'],
      ['Online Lottery Laws', '#online-lottery-laws'],
    ],
  },
  {
    title: 'Legal Info',
    links: [
      ['About Our Project', '#about-our-project'],
      ['Terms & Conditions', '#terms-and-conditions'],
      ['Privacy & Cookie Policy', '#privacy-cookie-policy'],
      ['Contact Support', '#contact-support'],
      ['Editorial Principles', '#editorial-principles'],
      ['Gambling Licensing (IAUI)', '#gambling-licensing-iaui'],
    ],
  },
];

function FooterSection() {
  return (
    <footer className="bg-white px-6 pb-[100px] pt-10 text-[#1a1516]">
      <div>
        <img src="/logo_seo_casino_latvia_dark.svg" alt="SEO Casino Latvia" className="h-[36px] object-contain" />
        <p className="mt-4 text-sm leading-[18px] text-[#777073]">Discover the ultimate catalog of regulated online gambling in Latvia.</p>
      </div>

      <div className="mt-4 flex items-center gap-3" aria-label="Social links">
        {[
          { name: 'Discord', image: '/social_discord.svg' },
          { name: 'X', image: '/social_x.svg' },
          { name: 'Telegram', image: '/social_telegram.svg' },
        ].map((social) => (
          <a key={social.name} href="#" aria-label={social.name} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F2F2] transition-colors hover:bg-[#e8e8e8]">
            <img src={social.image} alt="" aria-hidden="true" className="h-5 w-5" />
          </a>
        ))}
      </div>

      <nav aria-label="Footer links" className="mt-8 mb-10 grid grid-cols-2 gap-x-4 gap-y-8">
        {footerLinkGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-base font-bold text-[#1a1516]">{group.title}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {group.links.map(([label, href]) => <a key={label} href={href} className="text-sm leading-5 text-[#777073] transition-colors hover:text-[#1a1516]">{label}</a>)}
            </div>
          </div>
        ))}
      </nav>

      <div className="w-full border-t border-gray-100 my-4" />
      <p className="text-center text-xs leading-5 text-[#777073]">18+ | Gambling can be addictive. Please play responsibly.</p>
      <p className="mt-3 text-center text-xs font-medium text-[#777073]">© 2026 SEO Casino Latvia</p>
    </footer>
  );
}

function CasinoCard({ casino, visualRank }: { casino: Casino; visualRank: number }) {
  const medalStyle =
    visualRank === 1
      ? { borderColor: '#c89924', boxShadow: '0 2px 8px rgba(200,153,36,0.18)' }
      : visualRank === 2
      ? { borderColor: '#a6a9ad', boxShadow: '0 2px 8px rgba(166,169,173,0.15)' }
      : visualRank === 3
      ? { borderColor: '#c8a281', boxShadow: '0 2px 8px rgba(200,162,129,0.15)' }
      : undefined;

  return (
    <article
      className="overflow-hidden rounded-[14px] border bg-white shadow-[0_3px_12px_rgba(26,21,22,0.04)]"
      style={medalStyle}
    >
      <div className="flex flex-col gap-3 p-4">
        <header className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-[70px] w-[70px] shrink-0">
              <div className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-[14px] p-3" style={{ backgroundColor: casino.background }}>
                <img className="h-full w-full object-contain" src={casino.logo} alt={`${casino.name} logo`} />
              </div>
              <RankBadge visualRank={visualRank} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
              <h2 className="truncate text-base font-bold text-[#1a1516]">{casino.name}</h2>
              <div>
                <span className="block text-[10px] font-semibold text-[#6e6466]">RATING</span>
                <span className="text-sm font-bold text-[#2e7d32]">{casino.rating.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-between gap-4 py-1">
            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${casino.isNew ? 'bg-[#fff0f2] text-[#9e1b34]' : 'bg-[#f3f2f2] text-[#6e6466]'}`}>
              {casino.established}
            </span>
            <button type="button" className="text-[11px] font-bold text-[#6e6466] underline underline-offset-2">Read review</button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f3f2f2] px-2.5 py-1.5 text-[10px] font-semibold text-[#2b2526]">{casino.payoutDays}</span>
          <span className="rounded-full bg-[#f3f2f2] px-2.5 py-1.5 text-[10px] font-semibold text-[#2b2526]">{casino.gamesCount}</span>
          <span className="rounded-full bg-[#f3f2f2] px-2.5 py-1.5 text-[10px] font-semibold text-[#2b2526]">{casino.paymentMethods} payments methods</span>
        </div>

        <section className="rounded-[10px] bg-[#fff0f2] p-3.5">
          <h3 className="text-[10px] font-extrabold tracking-[1px] text-[#9e1b34]">WELCOME BONUS</h3>
          <p className="mt-1.5 text-base font-bold leading-5 text-[#1a1516]">{casino.bonus}</p>
          <p className="mt-1.5 text-[10px] text-[#6e6466]">min deposit €20 · wagering 30x · <a href="#terms" className="underline">T&amp;Cs apply</a></p>
        </section>

        <button type="button" className="flex h-11 w-full items-center justify-center rounded-[10px] bg-gradient-to-b from-[#cc2947] to-[#9e1b34] text-sm font-bold text-white shadow-[0_3px_6px_rgba(158,27,52,0.24)] transition-transform active:scale-[0.99]">
          Visit casino
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [activeFilter, setActiveFilter] = useState('All casinos');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFading, setIsLoadingFading] = useState(false);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { label: 'Top online casinos', href: '#directory' },
    { label: 'Casino games', href: '#casino-games' },
    { label: 'Daily Casino Bonuses', href: '#daily-casino-bonuses' },
    { label: 'News', href: '#news' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const casinoByName = casinos.reduce<Record<string, Casino>>((byName, casino) => {
    byName[casino.name] = casino;
    return byName;
  }, {});
  const filterOrders: Record<string, string[]> = {
    'All casinos': ['Oxibet', 'Rooli', 'Bitguruz', 'Bluffbet', 'Lussurio', 'Crusino', 'Slot Mafia', 'Betplay', 'BK8', 'BETHARD'],
    'New Casinos': ['Bluffbet', 'Oxibet', 'Crusino', 'Rooli', 'Slot Mafia', 'Lussurio', 'Betplay', 'Bitguruz', 'BETHARD', 'BK8'],
    'Risk-Free Spins': ['Rooli', 'Bitguruz', 'Betplay', 'Oxibet', 'Bluffbet', 'BK8', 'Crusino', 'Slot Mafia', 'Lussurio', 'BETHARD'],
    'No KYC': ['Lussurio', 'Bluffbet', 'Bitguruz', 'BETHARD', 'Oxibet', 'Crusino', 'Slot Mafia', 'Betplay', 'BK8', 'Rooli'],
  };
  const orderedCasinos = filterOrders[activeFilter].map((name) => casinoByName[name]);

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) {
      return;
    }

    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
    }
    if (loadingFadeTimer.current) {
      clearTimeout(loadingFadeTimer.current);
    }

    setActiveFilter(filter);
    setIsLoading(true);
    setIsLoadingFading(false);
    loadingTimer.current = setTimeout(() => {
      setIsLoadingFading(true);
      loadingTimer.current = null;
      loadingFadeTimer.current = setTimeout(() => {
        setIsLoading(false);
        setIsLoadingFading(false);
        loadingFadeTimer.current = null;
      }, 300);
    }, 1000);
  };

  return (
    <>
      <header className="fixed left-1/2 top-0 z-50 w-full max-w-[450px] -translate-x-1/2 border-b border-white/10 bg-[#231d1e]">
        <div className="flex h-[58px] items-center justify-between px-4">
          <img src="/assets/logo.svg" alt="SEO Casino Latvia" width={135} height={36} className="h-9 w-[135px]" />
          <button type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="border-t border-white/10 bg-[#1a1516] px-4 py-3 shadow-xl">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-[#e22044]" />
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="min-h-screen bg-[#231d1e] pb-0 pt-[58px]">
        <section id="about" className="px-4 pb-6 pt-5 text-white">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold text-[#eeeced]">
                <span className="h-2 w-2 rounded-full bg-[#e22044] shadow-[0_0_0_4px_rgba(226,32,68,0.2)]" />
                Updated Today · 247 sites fully analyzed
              </span>
              <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.7px]">Latvian Casinos:<br />Guides, Games,<br />Bonuses &amp; Reviews</h1>
              <div>
                <div className={`overflow-hidden text-[14px] leading-[21px] text-[#eeeced] transition-[max-height] duration-500 ${isDescriptionExpanded ? 'max-h-[620px]' : 'max-h-[68px]'}`}>
                  {seoParagraphs.map((paragraph) => <p key={paragraph} className="mb-3 last:mb-0">{paragraph}</p>)}
                </div>
                <button type="button" onClick={() => setIsDescriptionExpanded((expanded) => !expanded)} className="ml-auto flex items-center gap-1 py-1 text-[10px] font-extrabold tracking-[0.8px] text-[#d8d8d8]">
                  {isDescriptionExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {stats.map(({ value, label, icon }) => (
                <div key={label} className="flex min-h-[72px] min-w-0 items-center gap-2.5 rounded-[10px] border border-[#615D5D] bg-[#393434] p-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#575252] p-2"><img src={icon} alt="" aria-hidden="true" className="h-5 w-5" /></span>
                  <span className="min-w-0"><strong className="block text-xl font-bold leading-5">{value}</strong><span className="mt-1 block text-[10px] leading-[13px] text-white/80">{label}</span></span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center gap-2.5">
                <img src="/assets/Author.png" alt="Artūrs Bērziņš" width={40} height={40} className="h-10 w-10 rounded-md border border-white/10 object-cover" />
                <div><span className="block text-[10px] font-bold tracking-[0.5px] text-[#d8d8d8]">Author</span><p className="mt-0.5 text-xs"><span className="text-[#a3a39f]">By </span><strong className="text-[#ececec]">Artūrs Bērziņš</strong></p></div>
              </div>
            </div>
          </div>
        </section>

        <aside className="bg-gradient-to-b from-[#291519] to-[#1A1617] px-4 pb-4 pt-3.5">
          <div className="flex items-center gap-2 text-[#e22044]"><Send className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-semibold tracking-[0.5px]">EXCLUSIVE OFFERS</span></div>
          <p className="mt-2 text-xs leading-4"><strong className="text-white">Join our Telegram community to unlock secret casino bonuses and expert tips. </strong><button type="button" className="font-semibold text-[#e22044] underline">Subscribe</button></p>
        </aside>

        <section id="directory" className="scroll-mt-[76px] bg-[#f9f8f8] px-4 py-7 text-[#1a1516]">
          <div className="flex flex-col gap-2">
            <h2 className="text-[21px] font-bold leading-6">Top online casinos — October 2026</h2>
            <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {['All casinos', 'New Casinos', 'Risk-Free Spins', 'No KYC'].map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    aria-pressed={isActive}
                    className={`shrink-0 rounded-full px-[14px] py-[10px] text-[14px] font-medium transition-colors ${isActive ? 'bg-[#141414] text-white' : 'border border-[#e2dfdf] bg-white text-[#1a1516] hover:border-[#9e1b34] hover:bg-[#fff0f2]'}`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
            {isLoading ? (
              <div className={`flex min-h-[220px] items-center justify-center gap-2 py-12 text-sm font-medium text-[#4f484a] transition-opacity duration-300 ease-out will-change-[opacity] ${isLoadingFading ? 'opacity-0' : 'opacity-100'}`} role="status" aria-live="polite">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#9e1b34]" aria-hidden="true" />
                Loading {activeFilter}...
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 pt-2">
                {orderedCasinos.map((casino, index) => {
                  const visualRank = index + 1;

                  return (
                    <div key={casino.name} className="contents">
                      <CasinoCard casino={casino} visualRank={visualRank} />
                      {index === 4 && <SpookySpinsBanner />}
                    </div>
                  );
                })}
              </div>
            )}
            <button type="button" className={`mx-auto mt-1 ${sectionActionButtonClass}`}>All 124 casinos <ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </section>

        <CasinoGamesSection />
        <DailyBonusCalendar />
        <NewsSection />
        <FAQSection />
        <FooterSection />
      </main>



      <nav aria-label="Casino navigation" className="fixed bottom-0 left-1/2 z-50 w-full max-w-[450px] -translate-x-1/2 border-t border-[#1a15161a] bg-white px-1.5 shadow-[0_-3px_14px_rgba(26,21,22,0.08)]" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', paddingTop: '6px' }}>
        <div className="flex w-full">
          {navItems.map(({ label, icon: Icon }) => { const isActive = activeNav === label; return <button key={label} type="button" onClick={() => setActiveNav(label)} aria-current={isActive ? 'page' : undefined} className={`flex min-h-[54px] flex-1 flex-col items-center justify-center gap-1 rounded-[10px] text-[9px] font-semibold transition-colors ${isActive ? 'bg-[#fff0f2] text-[#9e1b34]' : 'text-[#1a1516] hover:bg-[#fff0f2]'}`}><Icon className="h-[17px] w-[17px]" />{label}</button>; })}
        </div>
      </nav>
    </>
  );
}
