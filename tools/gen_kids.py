#!/usr/bin/env python3
"""Generate the child patients for Dr Smile: 6 distinct kids (boys & girls,
varied skin tones, hairstyles and clothes). Each is its own 256x64 sheet
(4-frame bob), so the engine animates them per-variant."""
import os, math
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets/sheet"
os.makedirs(OUT, exist_ok=True)

OUTL = (70, 58, 64, 255)
EYE = (45, 38, 44, 255)
BOB = [0, -2, -3, -2]

def draw_kid(frame, skin, hair, style, shirt):
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = 32
    base_y = 56 + BOB[frame]
    shirtD = tuple(max(0, int(v * 0.7)) if i < 3 else v for i, v in enumerate(shirt))
    skinD = tuple(max(0, int(v * 0.8)) if i < 3 else v for i, v in enumerate(skin))
    shoe = (84, 72, 96, 255)

    # legs + shoes (little step via frame)
    step = [(-1, 1), (0, 0), (1, -1), (0, 0)][frame]
    for i, side in enumerate((-1, 1)):
        lx = cx + side * 6
        ly = base_y + step[i]
        d.rounded_rectangle((lx - 4, ly - 12, lx + 4, ly - 2), 3, fill=skin, outline=OUTL)
        d.rounded_rectangle((lx - 5, ly - 4, lx + 5, ly + 1), 2, fill=shoe, outline=OUTL)  # shoe

    # shirt body
    d.rounded_rectangle((cx - 13, base_y - 30, cx + 13, base_y - 11), 8, fill=shirt, outline=OUTL, width=2)
    d.line((cx, base_y - 28, cx, base_y - 12), fill=shirtD, width=1)

    # arms (slight sway opposite the legs)
    sway = [(1, -1), (0, 0), (-1, 1), (0, 0)][frame]
    for i, side in enumerate((-1, 1)):
        ax = cx + side * 14
        ay = base_y - 26 + sway[i] * 2
        d.rounded_rectangle((ax - 3, ay, ax + 3, ay + 13), 3, fill=shirt, outline=OUTL)
        d.ellipse((ax - 3, ay + 11, ax + 3, ay + 17), fill=skin, outline=OUTL)   # hand

    # head
    hy = base_y - 40
    d.ellipse((cx - 12, hy - 13, cx + 12, hy + 11), fill=skin, outline=OUTL)
    d.ellipse((cx - 12, hy - 13, cx + 12, hy + 11), outline=OUTL)

    # ---- hair styles ----
    if style == "pigtails":
        d.ellipse((cx - 17, hy - 4, cx - 7, hy + 8), fill=hair, outline=OUTL)   # side puffs
        d.ellipse((cx + 7, hy - 4, cx + 17, hy + 8), fill=hair, outline=OUTL)
    if style == "ponytail":
        d.ellipse((cx + 9, hy - 8, cx + 20, hy + 6), fill=hair, outline=OUTL)   # tail
    if style == "bun":
        d.ellipse((cx - 6, hy - 22, cx + 6, hy - 10), fill=hair, outline=OUTL)  # top bun
    # hair cap (front fringe) for all
    if style == "curly":
        for bx, by in [(-8, -12), (-2, -15), (4, -15), (10, -12), (-10, -6), (10, -6)]:
            d.ellipse((cx + bx - 6, hy + by - 6, cx + bx + 6, hy + by + 6), fill=hair, outline=OUTL)
        d.chord((cx - 12, hy - 13, cx + 12, hy + 2), 180, 360, fill=hair)
    elif style == "cap":
        d.chord((cx - 13, hy - 15, cx + 13, hy + 3), 180, 360, fill=hair)
        d.rounded_rectangle((cx - 14, hy - 4, cx + 2, hy + 1), 2, fill=hair)    # cap brim
    else:
        d.chord((cx - 12, hy - 14, cx + 12, hy + 2), 180, 360, fill=hair)
        d.rectangle((cx - 12, hy - 7, cx + 12, hy - 3), fill=hair)
        # side bangs
        d.polygon([(cx - 12, hy - 5), (cx - 12, hy + 4), (cx - 7, hy - 2)], fill=hair)
        d.polygon([(cx + 12, hy - 5), (cx + 12, hy + 4), (cx + 7, hy - 2)], fill=hair)

    # face (always happy)
    d.ellipse((cx - 7, hy - 3, cx - 3, hy + 2), fill=EYE)
    d.ellipse((cx + 3, hy - 3, cx + 7, hy + 2), fill=EYE)
    d.ellipse((cx - 6, hy - 2, cx - 5, hy - 1), fill=(255, 255, 255, 255))
    d.ellipse((cx + 4, hy - 2, cx + 5, hy - 1), fill=(255, 255, 255, 255))
    d.arc((cx - 5, hy + 1, cx + 5, hy + 8), 15, 165, fill=EYE, width=2)         # smile
    d.ellipse((cx - 10, hy + 2, cx - 6, hy + 6), fill=(255, 150, 165, 150))     # cheeks
    d.ellipse((cx + 6, hy + 2, cx + 10, hy + 6), fill=(255, 150, 165, 150))
    return im

def build(name, **kw):
    sheet = Image.new("RGBA", (256, 64), (0, 0, 0, 0))
    for f in range(4):
        sheet.paste(draw_kid(f, **kw), (f * 64, 0), draw_kid(f, **kw))
    sheet.save(f"{OUT}/{name}.png")

KIDS = [
    ("kid_leo",   dict(skin=(255,216,178,255), hair=(120,82,48,255),  style="short",    shirt=(90,170,230,255))),   # boy, brown, blue
    ("kid_mila",  dict(skin=(255,224,196,255), hair=(140,90,54,255),  style="pigtails", shirt=(255,140,180,255))),  # girl, pigtails, pink
    ("kid_sacha", dict(skin=(232,184,138,255), hair=(232,198,106,255),style="cap",      shirt=(108,196,122,255))),  # boy, blond cap, green
    ("kid_lou",   dict(skin=(176,122,79,255),  hair=(58,42,34,255),   style="ponytail", shirt=(255,210,74,255))),   # girl, ponytail, yellow
    ("kid_tom",   dict(skin=(138,90,60,255),   hair=(42,32,24,255),   style="curly",    shirt=(239,106,106,255))),  # boy, curly, red
    ("kid_zoe",   dict(skin=(255,219,186,255), hair=(168,84,46,255),  style="bun",      shirt=(180,138,230,255))),  # girl, bun, purple
]
for nm, kw in KIDS:
    build(nm, **kw)

# contact sheet (front frame of each) for review
prev = Image.new("RGBA", (64*6, 80), (60,70,80,255))
for i,(nm,_) in enumerate(KIDS):
    s = Image.open(f"{OUT}/{nm}.png").crop((0,0,64,64))
    prev.paste(s,(i*64,8),s)
prev.resize((64*6*2, 80*2), Image.NEAREST).save("/tmp/claude-0/-home-user-dr-smile/977d9f20-6b13-5fa0-99fe-ab7cde4914ae/scratchpad/preview_kids.png")
print("kids generated:", ", ".join(n for n,_ in KIDS))
