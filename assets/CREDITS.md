# Asset credits

This game, **Dr Smile**, runs on the generic engine in this repo. **All of its textures
are generated procedurally** with Pillow and are original to this repo — nothing is
reused from any other game's art. They are dedicated to the public domain (**CC0**).

| Asset | File | Notes |
| --- | --- | --- |
| Dr Smile (2 colours) | `assets/sheet/drsmile.png`, `drsmile_pink.png` | 64×64 LPC walkcycle (white coat, head-mirror) |
| Dr Smile thumbnails | `assets/ui/drsmile_thumb.png`, `drsmile_pink_thumb.png` | menu portraits |
| Child patients (×6) | `assets/sheet/kid_*.png` | 64×64, 4-frame bob; boys & girls, varied skin/hair |
| Clinic floor | `assets/img/floor.png` | tileable pastel tiles |
| Dental chair | `assets/img/chair.png` | cosy pastel centrepiece (water cup, no scary tools) |
| Potted plant | `assets/img/plant.png` | scenery |
| Happy-tooth sign | `assets/img/toothsign.png` | scenery |
| Reception desk | `assets/img/reception.png` | "next patients" station (heart sign + bell) |
| Face backdrops (×6) | `assets/img/mouth_*.png` | close-up: each child's face (own skin tone) around the open mouth |
| Dirt spot | `assets/img/spot.png` | scrubbable stain in the close-up |
| Toothbrush cursor | `assets/img/brush.png` | follows the finger in the close-up |
| App icons | `assets/favicon.png`, `assets/apple-touch-icon.png` | smiling tooth |

Generation: Pillow scripts in `tools/` (`gen_chars.py`, `gen_world.py`, `gen_closeup.py`, `gen_kids.py`, `gen_faces.py`).

## Engine dependency
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
