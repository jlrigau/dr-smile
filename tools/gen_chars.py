#!/usr/bin/env python3
"""Generate Dr Smile character sprites: player walkcycle (the patients live in gen_kids.py).
Pixel-art, drawn at native resolution (engine scales with nearest-neighbour)."""
import math, os
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets"
os.makedirs(OUT + "/sheet", exist_ok=True)
os.makedirs(OUT + "/ui", exist_ok=True)
os.makedirs(OUT + "/img", exist_ok=True)

def rr(d, box, r, fill):
    d.rounded_rectangle(box, radius=r, fill=fill)

# ---------------- Player: Dr Smile (LPC 9x4 walkcycle, 64x64 frames) ----------
# Rows order expected by engine DIRS: up=0, left=1, down=2, right=3
DIRS = ["up", "left", "down", "right"]

def draw_drsmile(direction, phase, coat, trim, hair, skin):
    """Return a 64x64 RGBA frame. phase in 0..1 (walk), or None for idle."""
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = 32
    # walk swing
    if phase is None:
        legA = 0.0; armA = 0.0; bob = 0
    else:
        legA = math.sin(phase * 2 * math.pi)
        armA = -legA
        bob = -1 if abs(math.sin(phase * 2 * math.pi)) > 0.6 else 0
    base_y = 60 + bob
    outline = (60, 52, 70, 255)
    shoe = (90, 78, 120, 255)

    # legs (trousers) — two legs swinging along the walk axis
    leg_w = 6
    sw = int(round(legA * 5))
    for side, off in ((-1, sw), (1, -sw)):
        lx = cx + side * 4 + (off if direction in ("up", "down") else 0)
        # for side views, swing forward/back along x relative to facing
        if direction == "left":
            lx = cx + side * 2 + (off if side < 0 else -off) - 2
        if direction == "right":
            lx = cx + side * 2 + (off if side < 0 else -off) + 2
        rr(d, (lx - leg_w//2, base_y - 14, lx + leg_w//2, base_y - 2), 2, trim_dark(trim))
        # shoe
        rr(d, (lx - leg_w//2 - 1, base_y - 4, lx + leg_w//2 + 1, base_y), 2, shoe)

    # coat (white body), slightly trapezoid
    by0, by1 = base_y - 32, base_y - 12
    d.polygon([(cx-12, by1), (cx+12, by1), (cx+10, by0), (cx-10, by0)], fill=coat)
    rr(d, (cx-11, by0, cx+11, by1), 5, coat)
    # coat shading edge
    d.line([(cx, by0+2), (cx, by1)], fill=(225, 232, 240, 255), width=1)
    # collar / trim (variant colour)
    d.polygon([(cx-7, by0+2), (cx, by0+9), (cx+7, by0+2), (cx, by0+5)], fill=trim)

    # arms (white sleeves) swinging
    arm_sw = int(round(armA * 4))
    for side in (-1, 1):
        ax = cx + side * 12
        ay = by0 + 4
        a2 = ay + 16 + (arm_sw if side > 0 else -arm_sw)
        rr(d, (ax-3, ay, ax+3, a2), 3, coat)
        # hand
        d.ellipse((ax-3, a2-3, ax+3, a2+3), fill=skin)

    # head
    hy = by0 - 1
    d.ellipse((cx-10, hy-19, cx+10, hy+1), fill=skin, outline=outline)
    # hair cap
    if direction == "up":
        d.chord((cx-10, hy-19, cx+10, hy+3), 0, 360, fill=hair)
        d.rectangle((cx-10, hy-12, cx+10, hy+1), fill=hair)
    else:
        d.chord((cx-10, hy-19, cx+10, hy-1), 180, 360, fill=hair)
        d.rectangle((cx-10, hy-12, cx+10, hy-8), fill=hair)
    # dentist head-mirror band (cute) for front/side
    if direction != "up":
        d.line([(cx-9, hy-12), (cx+9, hy-12)], fill=trim, width=2)
        mx = cx + (0 if direction == "down" else (-5 if direction == "left" else 5))
        d.ellipse((mx-3, hy-15, mx+3, hy-9), fill=(238, 245, 250, 255), outline=outline)

    # face
    eye = (50, 45, 60, 255)
    if direction == "down":
        d.ellipse((cx-6, hy-9, cx-3, hy-5), fill=eye)
        d.ellipse((cx+3, hy-9, cx+6, hy-5), fill=eye)
        d.arc((cx-5, hy-7, cx+5, hy-1), 20, 160, fill=eye, width=1)
        # cheeks
        d.ellipse((cx-8, hy-5, cx-6, hy-3), fill=(255, 170, 175, 200))
        d.ellipse((cx+6, hy-5, cx+8, hy-3), fill=(255, 170, 175, 200))
    elif direction == "left":
        d.ellipse((cx-6, hy-9, cx-3, hy-5), fill=eye)
        d.arc((cx-7, hy-7, cx+1, hy-2), 30, 150, fill=eye, width=1)
        d.ellipse((cx-8, hy-5, cx-6, hy-3), fill=(255, 170, 175, 200))
    elif direction == "right":
        d.ellipse((cx+3, hy-9, cx+6, hy-5), fill=eye)
        d.arc((cx-1, hy-7, cx+7, hy-2), 30, 150, fill=eye, width=1)
        d.ellipse((cx+6, hy-5, cx+8, hy-3), fill=(255, 170, 175, 200))
    return im

def trim_dark(c):
    return tuple(max(0, int(v*0.55)) if i < 3 else v for i, v in enumerate(c))

def build_player(path, coat, trim, hair, skin):
    sheet = Image.new("RGBA", (576, 256), (0, 0, 0, 0))
    for row, direction in enumerate(DIRS):
        for col in range(9):
            if col == 0:
                frame = draw_drsmile(direction, None, coat, trim, hair, skin)  # idle
            else:
                phase = (col - 1) / 8.0
                frame = draw_drsmile(direction, phase, coat, trim, hair, skin)
            sheet.paste(frame, (col*64, row*64), frame)
    sheet.save(path)

WHITE = (245, 248, 252, 255)
build_player(OUT + "/sheet/drsmile.png", WHITE, (90, 200, 190, 255), (96, 64, 40, 255), (255, 213, 178, 255))   # mint trim, brown hair
build_player(OUT + "/sheet/drsmile_pink.png", WHITE, (255, 150, 180, 255), (40, 30, 30, 255), (255, 224, 196, 255))  # pink trim, dark hair

# thumbnails (36x52): crop the front idle (row down=2, col0) head+torso, scale
def make_thumb(sheetpath, outpath):
    s = Image.open(sheetpath)
    fr = s.crop((0, 2*64, 64, 3*64))  # down idle
    fr = fr.crop((14, 8, 50, 60)).resize((36, 52), Image.NEAREST)
    fr.save(outpath)
make_thumb(OUT + "/sheet/drsmile.png", OUT + "/ui/drsmile_thumb.png")
make_thumb(OUT + "/sheet/drsmile_pink.png", OUT + "/ui/drsmile_pink_thumb.png")

print("Dr Smile player sprites generated.")
