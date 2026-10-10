# Asset credits

This game, **Dr Smile**, runs on the generic engine in this repo. **All of its art is
generated** from one parametric SVG art module, `tools/art/drsmile.cjs`, rendered to PNG
by `.claude/skills/_shared/render-svg.cjs` (headless Chromium). Everything is original to
this repo — nothing is reused from any other game's art — and dedicated to the public
domain (**CC0**).

| Asset | File | Notes |
| --- | --- | --- |
| Dr Smile / Dr Rose | `assets/sheet/drsmile.png`, `drsmile_pink.png` | 128-px LPC walkcycle (white coat, head-mirror) |
| Dentist thumbnails | `assets/ui/drsmile_thumb.png`, `drsmile_pink_thumb.png` | menu portraits |
| Child patients (×6) | `assets/sheet/kid_*.png` + `kid_*_happy.png` | worried on arrival, beaming once cured |
| Child thumbnails | `assets/ui/kid_*.png` | customize/preview portraits |
| Clinic | `floor.png`, `rug.png`, `wall*.png`, `doormat.png` | honey-wood floor, care rug, walls, entrance |
| Furniture | `chair.png`, `reception.png`, `plant*.png`, `toothsign.png`, `bench.png`, `toybox.png` | cosy, nothing scary |
| Unlockable surprises | `balloons.png`, `aquarium.png`, `teddy.png`, `rainbow_rug.png`, `trophy.png` | appear as stars are earned |
| Face close-ups (×6) | `assets/img/mouth_*.png` + `mouth_*_done.png` | open mouth → big clean smile |
| Germs (×3) | `assets/img/germ_*.png` | cute, smiling microbes to scrub away |
| Toothbrush, bubble | `brush.png`, `want.png` | close-up cursor, "needs care" bubble |
| UI icons | `assets/ui/icons/*.png` | shared icon kit in the pastel palette + tooth, brush, germ, kid |
| Home splash | `assets/img/splash.png` | the clinic window, bunting and happy children |
| Logo & app icons | `assets/img/logo.png`, `assets/favicon.png`, `assets/apple-touch-icon.png` | the shared `tooth()` mascot |

Regenerate: `node .claude/skills/_shared/render-svg.cjs tools/art/drsmile.cjs [--only key]`.

## Engine dependencies
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
- **Fredoka** font (latin subset) vendored at `vendor/fonts/fredoka-latin.woff2` —
  SIL Open Font License 1.1, © The Fredoka Project Authors (Milena Brandão).
- Sounds and music are synthesised at runtime (WebAudio) — no audio files.
