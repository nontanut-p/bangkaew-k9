# บางแก้ว K9

Agentic Cybersecurity Guard Platform — หมาเฝ้าระบบไซเบอร์อัจฉริยะสำหรับองค์กรยุค AI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) for English (default), or [http://localhost:3001/th](http://localhost:3001/th) for Thai.

Use the **TH / EN** toggle in the navbar to switch languages.

## Tech Stack

- **Next.js 15** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **TypeScript** — Type safety
- **Noto Sans Thai** — Thai typography support

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & design tokens
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Landing page assembly
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # All 11 landing page sections
│   └── ui/              # Reusable UI components
public/
└── k9-hero-mascot.png   # Hero section mascot image
```

## Sections

1. Hero — Brand introduction with cyber Bangkaew mascot
2. Problem — Security tool fatigue pain points
3. Solution — Central brain + UX layer concept
4. The Pack — Wazuh, AI, Shuffle, Kali roles
5. Workflow — 7-step detect-to-learn pipeline
6. Key Features — 9 product capabilities
7. Guardrails — AI safety controls
8. Tech Stack — Open-source foundation
9. Use Cases — Target audiences
10. Roadmap — MVP phases 1-5
11. Final CTA — Demo request
