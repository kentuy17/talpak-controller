import { useMemo, useState } from 'react';

const INITIAL_MERON_BET = 24091;
const INITIAL_WALA_BET = 19572;

const BettingDisplay = () => {
  const [meronBet] = useState(INITIAL_MERON_BET);
  const [walaBet] = useState(INITIAL_WALA_BET);
  const [isMeronOpen, setIsMeronOpen] = useState(true);
  const [isWalaOpen, setIsWalaOpen] = useState(true);

  const totalPool = meronBet + walaBet;
  const meronPayout = useMemo(() => calculatePayout(meronBet, totalPool), [meronBet, totalPool]);
  const walaPayout = useMemo(() => calculatePayout(walaBet, totalPool), [walaBet, totalPool]);

  const areAllOpen = isMeronOpen && isWalaOpen;

  const toggleAll = () => {
    const next = !areAllOpen;
    setIsMeronOpen(next);
    setIsWalaOpen(next);
  };

  return (
    <main style={styles.page}>
      <div style={styles.board}>
        <FighterPanel
          side="MERON"
          isOpen={isMeronOpen}
          onToggle={() => setIsMeronOpen((value) => !value)}
          bet={formatMoney(meronBet)}
          payout={meronPayout}
          panelStyle={styles.meron}
        />

        <FightInfo />

        <FighterPanel
          side="WALA"
          isOpen={isWalaOpen}
          onToggle={() => setIsWalaOpen((value) => !value)}
          bet={formatMoney(walaBet)}
          payout={walaPayout}
          panelStyle={styles.wala}
        />

        <button style={styles.allButton} onClick={toggleAll}>
          {areAllOpen ? 'CLOSE ALL' : 'OPEN ALL'}
        </button>
      </div>
    </main>
  );
};

const FighterPanel = ({ side, isOpen, onToggle, bet, payout, panelStyle }) => (
  <section style={{ ...styles.panel, ...panelStyle }}>
    <button
      style={{ ...styles.sideLockButton, ...(isOpen ? styles.openState : styles.closedState) }}
      onClick={onToggle}
      aria-label={`${isOpen ? 'Close' : 'Open'} ${side} betting`}
    >
      <span style={styles.lockIcon}>{isOpen ? '🔓' : '🔒'}</span>
      <span>{isOpen ? 'OPEN' : 'CLOSED'}</span>
    </button>

    {!isOpen && <div style={styles.closedOverlay}>BETTING CLOSED</div>}

    <h1 style={styles.sideName}>{side}</h1>
    <p style={styles.label}>BET:</p>
    <p style={styles.amount}>{bet}</p>
    <p style={styles.label}>PAYOUT:</p>
    <p style={styles.payout}>{payout}%</p>
  </section>
);

const FightInfo = () => (
  <div style={styles.fightInfo}>
    <div style={styles.fightLabel}>Fight No:</div>
    <div style={styles.fightNo}>6</div>
  </div>
);

const calculatePayout = (bet, total) => {
  const netPool = total * 0.9;
  return ((netPool / bet) * 100).toFixed(2);
};

const formatMoney = (amount) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#050714',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  board: {
    width: '100%',
    maxWidth: '1200px',
    minHeight: '640px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  panel: {
    textAlign: 'center',
    padding: '24px 24px 84px',
    color: 'white',
    position: 'relative',
  },
  meron: {
    background: 'linear-gradient(140deg, #ff3b3b 0%, #ea2428 50%, #d9151f 100%)',
  },
  wala: {
    background: 'linear-gradient(140deg, #1a6aff 0%, #0e58f2 50%, #0845d2 100%)',
  },
  sideLockButton: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    border: 'none',
    borderRadius: '999px',
    padding: '14px 24px',
    display: 'inline-flex',
    gap: '10px',
    alignItems: 'center',
    color: 'white',
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '0.6px',
    cursor: 'pointer',
    zIndex: 5,
  },
  openState: {
    background: 'rgba(0, 170, 90, 0.95)',
  },
  closedState: {
    background: 'rgba(20, 20, 20, 0.85)',
  },
  lockIcon: {
    lineHeight: 1,
    fontSize: '1.25rem',
  },
  closedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.24)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.35rem',
    fontWeight: 800,
    letterSpacing: '1px',
    textShadow: '0 2px 6px rgba(0,0,0,0.45)',
  },
  sideName: {
    margin: '96px 0 30px',
    fontSize: '5rem',
    fontWeight: 900,
    letterSpacing: '2px',
    textShadow: '0 3px 8px rgba(0,0,0,0.28)',
  },
  label: {
    margin: '0 0 12px',
    fontSize: '2rem',
    fontWeight: 700,
  },
  amount: {
    margin: '0 0 28px',
    fontSize: '5.5rem',
    fontWeight: 900,
    textShadow: '0 4px 10px rgba(0,0,0,0.28)',
  },
  payout: {
    margin: 0,
    fontSize: '5.3rem',
    fontWeight: 900,
    opacity: 0.8,
    textShadow: '0 4px 10px rgba(0,0,0,0.28)',
  },
  fightInfo: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    color: '#111427',
    borderRadius: '0 0 16px 16px',
    minWidth: '160px',
    textAlign: 'center',
    padding: '20px 12px 14px',
    zIndex: 6,
  },
  fightLabel: {
    marginBottom: '6px',
    fontSize: '2rem',
    fontWeight: 700,
  },
  fightNo: {
    fontSize: '5.8rem',
    lineHeight: 1,
    fontWeight: 900,
  },
  allButton: {
    position: 'absolute',
    left: '50%',
    bottom: '16px',
    transform: 'translateX(-50%)',
    border: '1px solid rgba(255,255,255,0.5)',
    background: 'rgba(7, 8, 22, 0.9)',
    color: 'white',
    borderRadius: '999px',
    padding: '14px 28px',
    fontSize: '1.05rem',
    fontWeight: 800,
    letterSpacing: '0.8px',
    cursor: 'pointer',
    zIndex: 7,
  },
};

export default BettingDisplay;
