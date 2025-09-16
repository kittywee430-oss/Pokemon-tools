# Pokemon TCG Toolbox

A comprehensive toolbox for Pokemon Trading Card Game players featuring matchup tracking, tournament management, and competitive analysis tools.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Local Storage** - Data persistence

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles with mobile optimizations
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main application
├── components/         # React components
│   ├── ToolHub.tsx    # Main tool selection
│   ├── MatchupForm.tsx # PTCGLive matchup form
│   ├── Statistics.tsx  # Win rate analysis
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useMatchups.ts # Matchup data management
│   ├── useTournaments.ts # Tournament management
│   └── usePokemonMap.ts # Pokemon sprite mapping
└── types/             # TypeScript type definitions
    ├── tournament.ts  # Tournament types
    └── limitless.ts   # Limitless TCG API types
```
