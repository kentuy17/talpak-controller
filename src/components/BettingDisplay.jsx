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
      <div style={styles.frame}>
        <button style={styles.allButton} onClick={toggleAll}>
          {areAllOpen ? 'CLOSE ALL' : 'OPEN ALL'}
        </button>

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
        </div>
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
    padding: '26px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at 50% 0%, #1e2252 0%, #0a0d23 48%, #060714 100%)',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  frame: {
    width: '100%',
    maxWidth: '1120px',
  },
  allButton: {
    margin: '0 auto 14px',
    display: 'block',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.16)',
    color: 'white',
    borderRadius: '999px',
    padding: '10px 20px',
    fontWeight: 800,
    letterSpacing: '0.8px',
    cursor: 'pointer',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
  },
  panel: {
    minHeight: '490px',
    textAlign: 'center',
    padding: '18px 28px 38px',
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
    top: '14px',
    left: '18px',
    border: 'none',
    borderRadius: '999px',
    padding: '7px 12px',
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    zIndex: 2,
  },
  openState: {
    background: 'rgba(0, 170, 90, 0.95)',
  },
  closedState: {
    background: 'rgba(20, 20, 20, 0.78)',
  },
  lockIcon: {
    lineHeight: 1,
  },
  closedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '1px',
    textShadow: '0 2px 6px rgba(0,0,0,0.45)',
  },
  sideName: {
    margin: '58px 0 30px',
    fontSize: '5.1rem',
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
    fontSize: '5.8rem',
    fontWeight: 900,
    textShadow: '0 4px 10px rgba(0,0,0,0.28)',
  },
  payout: {
    margin: 0,
    fontSize: '5.6rem',
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
    minWidth: '152px',
    textAlign: 'center',
    padding: '18px 12px 14px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
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
};

export default BettingDisplay;
