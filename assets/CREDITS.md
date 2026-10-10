# Asset credits

This game, **Dr Smile**, runs on the generic engine in this repo. **All of its art is
generated** from one parametric SVG art module, `tools/art/drsmile.cjs`, rendered to PNG
by `.claude/skills/_shared/render-svg.cjs` (headless Chromium). Everything is original to
this repo — nothing is reused from any other game's art — and dedicated to the public
domain (**CC0**).

| Asset | File | Notes |
| --- | --- | --- |
| Dr Smile / Dr Rose | `assets/sheet/drsmile.webp`, `drsmile_pink.webp` | 128-px LPC walkcycle (white coat, head-mirror) |
| Dentist thumbnails | `assets/ui/drsmile_thumb.webp`, `drsmile_pink_thumb.webp` | menu portraits |
| Child patients (×6) | `assets/sheet/kid_*.webp` + `kid_*_happy.webp` | worried on arrival, beaming once cured |
| Child thumbnails | `assets/ui/kid_*.webp` | customize/preview portraits |
| Clinic | `floor.webp`, `rug.webp`, `wall*.webp`, `doormat.webp` | honey-wood floor, care rug, walls, entrance |
| Furniture | `chair.webp`, `reception.webp`, `plant*.webp`, `toothsign.webp`, `bench.webp`, `toybox.webp` | cosy, nothing scary |
| Unlockable surprises | `balloons.webp`, `aquarium.webp`, `teddy.webp`, `rainbow_rug.webp`, `trophy.webp` | appear as stars are earned |
| Face close-ups (×6) | `assets/img/mouth_*.webp` + `mouth_*_done.webp` | open mouth → big clean smile |
| Germs (×3) | `assets/img/germ_*.webp` | cute, smiling microbes to scrub away |
| Toothbrush, bubble | `brush.webp`, `want.webp` | close-up cursor, "needs care" bubble |
| UI icons | `assets/ui/icons/*.webp` | shared icon kit in the pastel palette + tooth, brush, germ, kid |
| Home splash | `assets/img/splash.webp` | the clinic window, bunting and happy children |
| Logo & app icons | `assets/img/logo.webp`, `assets/favicon.png`, `assets/apple-touch-icon.png`, `icon-192.png`, `icon-maskable.png` | the shared `tooth()` mascot |

Regenerate: `node .claude/skills/_shared/render-svg.cjs tools/art/drsmile.cjs [--only key]`.

## Engine dependencies
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
- **Fredoka** font (latin subset) vendored at `vendor/fonts/fredoka-latin.woff2` —
  SIL Open Font License 1.1, © The Fredoka Project Authors (Milena Brandão).
- Sounds and music are synthesised at runtime (WebAudio) — no audio files.
