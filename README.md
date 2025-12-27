# ARC Raiders Loot Helper

An interactive web companion tool for ARC Raiders that helps you make instant loot decisions. Based on the V3 Recycling Cheat Sheet by u/pRoDeeD.

## Features

### 📦 Items Database
- **Instant Search**: Type any item name to quickly find it
- **ROI Calculator**: See at a glance whether to recycle or sell
- **Smart Categories**: Filter by Safe to Recycle, Quests, Expedition Project
- **Visual Indicators**: Color-coded recommendations (green = recycle, red = sell)

### 🔧 Component Tracker
- **Best Donors**: Find the most efficient items to recycle for specific components
- **Priority System**: Components organized by importance (Essential, Priority, High-Tier)
- **Yield Information**: See exactly how many components each item produces

### 🏗️ Workshop Upgrades
- **All 7 Benches**: Gear, Gunsmith, Medical Lab, Refiner, Utility, Explosives, Scrappy
- **Level Tracking**: See requirements for each upgrade level
- **ROI Data**: Know which upgrade items are worth recycling

## Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Bun
- **Build**: Turbopack

## Usage Guide

### Finding Items
1. Use the search bar to type any item name (e.g., "Ion Sputter", "Battery")
2. Check the ROI percentage:
   - **Green (+%)**: Recycling gives MORE value than selling ✅
   - **Gray (0%)**: Equal value either way ⚖️
   - **Orange (-10% to -30%)**: Small loss if recycled ⚠️
   - **Red (-40%+)**: Big loss if recycled - SELL! ❌

### Finding Components
1. Switch to the "Components" tab
2. Search for the component you need
3. See the best items to recycle to get that component
4. Compare yields to find the most efficient sources

### Workshop Planning
1. Switch to the "Workshops" tab
2. Browse all 7 workshop benches
3. See exactly what items you need for each upgrade level
4. Plan your looting priorities accordingly

## Key Insights

- **Selling beats scrapping** most of the time
- **High-priority components** carry penalties of -40% to -60%
- **Recycling during raids** only returns ~50% of components - wait for Speranza
- **Don't craft for profit** - you'll lose value

## Data Sources

**Recycling ROI Data:**
All recycling calculations from the [V3 Looting and Recycling Cheat Sheet](https://ko-fi.com/prodeed) by u/pRoDeeD.
Last synced: November 30, 2025

**Item Database:**
Item images and rarity data available from the [ARC Raiders Database API](https://ardb.app)
- 465+ items with images
- Rarity information (Common → Legendary)
- Regular community updates

**Integration:**
See [API_INTEGRATION.md](API_INTEGRATION.md) for instructions on adding live item data, images, and rarity badges to the site.

## Deployment

### Cloudflare Pages (Recommended)

```bash
# Build the site
bun run build

# Deploy to Cloudflare Pages
# Make sure to unset any local environment tokens first
unset CLOUDFLARE_API_TOKEN
npx wrangler pages deploy out
```

### Other Platforms
The built site in the `out` folder can be deployed to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Development

```bash
# Project structure
arc-scrap/
├── app/              # Next.js app directory
│   ├── page.tsx      # Main page with all features
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # Reusable React components
│   ├── SearchBar.tsx
│   ├── FilterTabs.tsx
│   ├── ItemCard.tsx
│   └── ComponentCard.tsx
├── data/            # JSON data files
│   ├── items.json
│   ├── components.json
│   └── workshops.json
└── lib/             # Utility functions
    └── types.ts     # TypeScript types
```

## Contributing

This is a community tool! If you find errors in the data or have suggestions:
1. Check the original cheat sheet at [ko-fi.com/prodeed](https://ko-fi.com/prodeed)
2. Open an issue with the correction
3. Submit a PR with updated data

## License

Data and original cheat sheet by u/pRoDeeD. Interactive tool built as a community resource.

## Credits

- **Original Cheat Sheet**: u/pRoDeeD
- **Game**: ARC Raiders by Embark Studios
- **Interactive Tool**: Built with Next.js and TypeScript
