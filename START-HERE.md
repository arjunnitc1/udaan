# Udaan — Complete Package

| Folder/File | What it is |
|---|---|
| `udaan-app/` | **The full production app** (Next.js 14 + Anthropic API, server-side key, TypeScript, verified-schemes layer, funnel analytics, rate limiting). Read `udaan-app/README.md` to run and deploy it. |
| `udaan-prototype.html` | The single-file prototype — open directly in Chrome, demo mode works offline. Drop into Claude.ai to run it as an AI-powered Artifact. |
| `docs/udaan-prd.md` | The one-page PRD — your hour-zero team document. |
| `docs/udaan-pitch.pptx` | The 10-slide pitch deck. |
| `docs/udaan-build-guide.md` | Hour-by-hour hackathon plan + post-hackathon roadmap. |

## Fastest path to running the real app
```bash
cd udaan-app
npm install
cp .env.example .env.local   # paste your key from console.anthropic.com
npm run dev                  # → http://localhost:3000
```
The build is verified ✓ (compiles cleanly on Next 14.2.35 / Node 20).
