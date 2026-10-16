export type Casino = {
  rank: number;
  name: string;
  logo: string;
  background: string;
  established: string;
  bonus: string;
  rating: number;
  payoutDays: string;
  gamesCount: string;
  paymentMethods: number;
  isNew?: boolean;
  affiliateUrl: string;
};

export type BonusEntry = {
  casinoName: string;
  promoTag: string;
  reward: string;
};

export const casinos: Casino[] = [
  { rank: 1, name: 'Oxibet', logo: '/assets/oxibet.svg', background: '#212e3c', established: 'New 2026', bonus: '500% up to €4,500 welcome bonus', rating: 9.5, payoutDays: '0–1 days', gamesCount: '2,140 games', paymentMethods: 22, isNew: true, affiliateUrl: '#directory' },
  { rank: 2, name: 'Rooli', logo: '/assets/rooli.svg', background: '#d80027', established: 'est. 2024', bonus: '400% up to €2,000 welcome bonus', rating: 9.3, payoutDays: '0–2 days', gamesCount: '1,890 games', paymentMethods: 19, affiliateUrl: '#directory' },
  { rank: 3, name: 'Bitguruz', logo: '/assets/bitguruz.svg', background: '#1a1d26', established: 'est. 2024', bonus: '100% up to €1,500 + 150 Free Spins', rating: 9.1, payoutDays: '1–3 days', gamesCount: '3,205 games', paymentMethods: 14, affiliateUrl: '#directory' },
  { rank: 4, name: 'Bluffbet', logo: '/assets/bluffbet.svg', background: '#2a2a2a', established: 'New 2026', bonus: '200% up to €3,000 package deal', rating: 8.9, payoutDays: '0–3 days', gamesCount: '1,764 games', paymentMethods: 17, isNew: true, affiliateUrl: '#directory' },
  { rank: 5, name: 'Lussurio', logo: '/assets/lussurio.svg', background: '#e070c7', established: 'est. 2024', bonus: '150% up to €800 crypto bonus', rating: 8.7, payoutDays: '1–2 days', gamesCount: '2,530 games', paymentMethods: 11, affiliateUrl: '#directory' },
  { rank: 6, name: 'Crusino', logo: '/assets/crusino.svg', background: '#141a2f', established: 'est. 2024', bonus: '500% up to €5,000 highroller offer', rating: 8.5, payoutDays: '2–5 days', gamesCount: '4,100 games', paymentMethods: 26, affiliateUrl: '#directory' },
  { rank: 7, name: 'Slot Mafia', logo: '/slot_mafia.svg', background: '#1c1c1c', established: 'est. 2024', bonus: '100% up to €500 + 200 FS', rating: 8.4, payoutDays: '1–4 days', gamesCount: '1,520 games', paymentMethods: 9, affiliateUrl: '#directory' },
  { rank: 8, name: 'Betplay', logo: '/betplay.svg', background: '#2b0a3b', established: 'est. 2024', bonus: '250% up to €2,500 bonus pack', rating: 8.3, payoutDays: '0–2 days', gamesCount: '2,870 games', paymentMethods: 15, affiliateUrl: '#directory' },
  { rank: 9, name: 'BK8', logo: '/bk8.svg', background: '#0054d1', established: 'est. 2024', bonus: '300% up to €1,200 welcome reward', rating: 8.2, payoutDays: '1–3 days', gamesCount: '1,976 games', paymentMethods: 13, affiliateUrl: '#directory' },
  { rank: 10, name: 'BETHARD', logo: '/bethard.svg', background: '#171717', established: 'est. 2024', bonus: '100% up to €1,000 + 10% cashback', rating: 8.1, payoutDays: '2–4 days', gamesCount: '1,340 games', paymentMethods: 8, affiliateUrl: '#directory' },
];

export const dailyBonusData: Record<number, BonusEntry[]> = {
  0: [
    { casinoName: 'Oxibet', promoTag: 'MONDAY BONUS', reward: '500% up to €4,500 welcome bonus' },
    { casinoName: 'Rooli', promoTag: 'MONDAY RELOAD', reward: '400% up to €2,000 welcome bonus' },
    { casinoName: 'Bitguruz', promoTag: 'MONDAY FREE SPINS', reward: '150 Free Spins on Book of Dead' },
    { casinoName: 'Bluffbet', promoTag: 'MONDAY POWER-UP', reward: '200% up to €3,000 package deal' },
  ],
  1: [
    { casinoName: 'Lussurio', promoTag: 'TUESDAY RELOAD', reward: '150% up to €800 crypto bonus' },
    { casinoName: 'Crusino', promoTag: 'TUESDAY FREE SPINS', reward: '500% up to €5,000 highroller offer' },
    { casinoName: 'Slot Mafia', promoTag: 'MIDWEEK POWER-UP', reward: '100% up to €500 + 200 FS' },
  ],
  2: [
    { casinoName: 'Betplay', promoTag: 'WEEKDAY FREE SPINS', reward: '250% up to €2,500 bonus pack' },
    { casinoName: 'BK8', promoTag: 'WEDNESDAY RELOAD', reward: '300% up to €1,200 welcome reward' },
    { casinoName: 'BETHARD', promoTag: 'WEDNESDAY CASHBACK', reward: '100% up to €1,000 + 10% cashback' },
    { casinoName: 'Oxibet', promoTag: 'WEDNESDAY POWER-UP', reward: '100 Free Spins on Starburst' },
  ],
  3: [
    { casinoName: 'Rooli', promoTag: 'THURSDAY BOOST', reward: '400% up to €2,000 welcome bonus' },
    { casinoName: 'Bitguruz', promoTag: 'THURSDAY FREE SPINS', reward: '100% up to €1,500 + 150 Free Spins' },
    { casinoName: 'Bluffbet', promoTag: 'THURSDAY RELOAD', reward: '200% up to €3,000 package deal' },
    { casinoName: 'Lussurio', promoTag: 'THURSDAY CASHBACK', reward: '150% up to €800 crypto bonus' },
    { casinoName: 'Crusino', promoTag: 'THURSDAY HIGHROLLER', reward: '500% up to €5,000 highroller offer' },
  ],
  4: [
    { casinoName: 'Slot Mafia', promoTag: 'FRIDAY POWER-UP', reward: '100% up to €500 + 200 FS' },
    { casinoName: 'Betplay', promoTag: 'FRIDAY FREE SPINS', reward: '250% up to €2,500 bonus pack' },
    { casinoName: 'BK8', promoTag: 'FRIDAY RELOAD', reward: '300% up to €1,200 welcome reward' },
    { casinoName: 'BETHARD', promoTag: 'FRIDAY CASHBACK', reward: '100% up to €1,000 + 10% cashback' },
  ],
  5: [
    { casinoName: 'Oxibet', promoTag: 'WEEKEND PROMOTION', reward: '500% up to €4,500 welcome bonus' },
    { casinoName: 'Crusino', promoTag: 'WEEKEND HIGHROLLER', reward: '500% up to €5,000 highroller offer' },
    { casinoName: 'Rooli', promoTag: 'WEEKEND RELOAD', reward: '400% up to €2,000 welcome bonus' },
  ],
  6: [
    { casinoName: 'Bitguruz', promoTag: 'SUNDAY CASHBACK', reward: '100% up to €1,500 + 150 Free Spins' },
    { casinoName: 'Bluffbet', promoTag: 'SUNDAY RELOAD', reward: '200% up to €3,000 package deal' },
    { casinoName: 'Lussurio', promoTag: 'SUNDAY FREE SPINS', reward: '150% up to €800 crypto bonus' },
    { casinoName: 'Slot Mafia', promoTag: 'SUNDAY POWER-UP', reward: '100% up to €500 + 200 FS' },
  ],
};
