# Asset credits

This game, **Dr Smile**, runs on the generic engine in this repo. **All of its textures
are generated procedurally** with Pillow and are original to this repo — nothing is
reused from any other game's art. They are dedicated to the public domain (**CC0**).

| Asset | File | Notes |
| --- | --- | --- |
| Dr Smile (2 colours) | `assets/sheet/drsmile.png`, `drsmile_pink.png` | 64×64 LPC walkcycle (white coat, head-mirror) |
| Dr Smile thumbnails | `assets/ui/drsmile_thumb.png`, `drsmile_pink_thumb.png` | menu portraits |
| Patient | `assets/sheet/patient.png` | 64×64, 4-frame bob; recoloured by tint per variant |
| Clinic floor | `assets/img/floor.png` | tileable pastel tiles |
| Dental chair | `assets/img/chair.png` | cosy pastel centrepiece (water cup, no scary tools) |
| Potted plant | `assets/img/plant.png` | scenery |
| Happy-tooth sign | `assets/img/toothsign.png` | scenery |
| Reception desk | `assets/img/reception.png` | "next patients" station (heart sign + bell) |
| App icons | `assets/favicon.png`, `assets/apple-touch-icon.png` | smiling tooth |

Generation: Pillow scripts (`gen_chars.py`, `gen_world.py`), kept with the session.

## Engine dependency
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
