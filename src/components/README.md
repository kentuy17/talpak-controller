
# Betting Display Component - Refactored

## Overview
This directory contains the refactored betting display components using React Context for state management.

## File Structure

### Context
- `BettingContext.jsx` - Main context provider that manages all betting-related state and operations
  - Manages fight data (meron/wala bets, fight number, status)
  - Handles socket connections for real-time updates
  - Provides API functions (fetchActiveEvent, fetchCurrentFight, updateStatus)
  - Exports custom hook `useBetting()` for accessing context

### Components
- `BettingDisplayRefactored.jsx` - Main display component using the context
  - Renders loading/error states
  - Displays header with event name and logout button
  - Shows fight information and status controls
  - Displays two fighter panels (MERON and WALA)
  - Shows splash screen when a fight winner is announced

- `FighterPanel.jsx` - Individual fighter betting panel component
  - Displays fighter name (MERON or WALA)
  - Shows current bet amount and payout percentage
  - Toggle button to open/close betting for that side
  - Visual indication when betting is closed

- `FightInfo.jsx` - Fight information display component
  - Shows current fight number
  - Status control buttons (WAITING, OPEN, CLOSED)
  - Updates fight status via context

- `LoadingState.jsx` - Loading indicator component
  - Simple loading message display

- `ErrorState.jsx` - Error display component
  - Shows error messages when operations fail

## Usage

### Wrap your app with BettingProvider
```jsx
import { BettingProvider } from './context/BettingContext';

function App() {
  return (
    <BettingProvider token={yourAuthToken}>
      <BettingDisplay onLogout={handleLogout} />
    </BettingProvider>
  );
}
```

### Access context in components
```jsx
import { useBetting } from '../context/BettingContext';

function MyComponent() {
  const { meronBet, walaBet, updateStatus } = useBetting();
  // Use the state and functions from context
}
```

## Key Features

1. **State Management**: All betting state is centralized in BettingContext
2. **Real-time Updates**: Socket.io integration for live bet updates
3. **Component Separation**: Each UI element is in its own component
4. **Type Safety**: Custom hook ensures context is used within provider
5. **Error Handling**: Centralized error state and display

## State Available in Context

- `meronBet` - Current bet amount for MERON
- `walaBet` - Current bet amount for WALA
- `isMeronOpen` - Whether MERON betting is open
- `isWalaOpen` - Whether WALA betting is open
- `fightNumber` - Current fight number
- `fightStatus` - Current fight status (WAITING, OPEN, CLOSED)
- `loading` - Loading state indicator
- `error` - Error message if any
- `eventName` - Name of the current event
- `currentFightId` - ID of the current fight
- `prevFightWinner` - Winner of the previous fight
- `totalPool` - Total betting pool (meron + wala)
- `meronPayout` - Calculated payout percentage for MERON
- `walaPayout` - Calculated payout percentage for WALA

## Actions Available in Context

- `setIsMeronOpen` - Toggle MERON betting open/closed
- `setIsWalaOpen` - Toggle WALA betting open/closed
- `updateStatus` - Update fight status (WAITING, OPEN, CLOSED)

## Utility Functions

- `formatMoney(amount)` - Format numbers as currency with 2 decimal places
- `calculatePayout(bet, total)` - Calculate payout percentage based on bet and total pool
