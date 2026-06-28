#!/usr/bin/env python3
"""Generate Dr Smile world assets: floor tile, dental chair, plant, tooth sign,
reception desk station, and PWA icons. Soft pastel clinic theme."""
import os, math, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tooth import tight_tooth

OUT = "/home/user/dr-smile/assets"

def rr(d, box, r, **kw): d.rounded_rectangle(box, radius=r, **kw)

OUTL = (90, 95, 110, 255)

# ---------- floor tile (64x64 tileable) : soft mint/white tiles ----------
def floor():
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    a = (224, 244, 238, 255); b = (240, 250, 247, 255); grout = (205, 228, 221, 255)
    for ty in range(2):
        for tx in range(2):
            col = a if (tx + ty) % 2 == 0 else b
            d.rectangle((tx*32, ty*32, tx*32+31, ty*32+31), fill=col)
    for k in range(0, 65, 32):
        d.line([(k, 0), (k, 64)], fill=grout, width=1)
        d.line([(0, k), (64, k)], fill=grout, width=1)
    im.save(OUT + "/img/floor.png")

# ---------- dental chair (cute, pastel — centerpiece) ----------
def chair():
    W, H = 88, 124
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = W//2
    teal = (95, 200, 190, 255); tealD = (60, 160, 150, 255)
    cushion = (120, 210, 200, 255)
    # shadow
    d.ellipse((cx-34, H-14, cx+34, H-2), fill=(0, 0, 0, 45))
    # base post
    rr(d, (cx-8, H-30, cx+8, H-8), 5, fill=tealD)
    d.ellipse((cx-22, H-16, cx+22, H-6), fill=tealD)
    # seat
    rr(d, (cx-30, H-56, cx+30, H-26), 10, fill=teal, outline=OUTL, width=2)
    # backrest (slightly reclined)
    rr(d, (cx-26, H-104, cx+26, H-54), 14, fill=cushion, outline=OUTL, width=2)
    # cushion seams
    d.line([(cx, H-100), (cx, H-58)], fill=tealD, width=2)
    # headrest
    rr(d, (cx-14, H-118, cx+14, H-98), 8, fill=cushion, outline=OUTL, width=2)
    # armrests
    for s in (-1, 1):
        rr(d, (cx + s*30 - 6, H-72, cx + s*30 + 6, H-44), 5, fill=tealD, outline=OUTL, width=1)
    # little side tray with a friendly water cup (no scary tools)
    rr(d, (cx+28, H-66, cx+44, H-60), 3, fill=(225, 232, 240, 255), outline=OUTL, width=1)
    rr(d, (cx+32, H-72, cx+40, H-64), 2, fill=(150, 205, 245, 255), outline=OUTL, width=1)  # cup
    im.save(OUT + "/img/chair.png")

# ---------- potted plant ----------
def plant():
    W, H = 60, 84
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); cx = W//2
    d.ellipse((cx-18, H-12, cx+18, H-2), fill=(0,0,0,40))
    # pot
    d.polygon([(cx-14, H-30), (cx+14, H-30), (cx+10, H-6), (cx-10, H-6)], fill=(240,150,170,255), outline=OUTL)
    rr(d, (cx-16, H-34, cx+16, H-26), 3, fill=(255,175,190,255), outline=OUTL, width=1)
    # leaves
    g1=(110,195,120,255); g2=(80,170,95,255)
    for ang, col, ln in [(-40,g2,30),(-12,g1,38),(15,g2,32),(40,g1,28)]:
        a=math.radians(ang-90)
        ex=cx+math.cos(a)*ln; ey=(H-30)+math.sin(a)*ln
        d.line([(cx, H-30),(ex,ey)], fill=col, width=4)
        d.ellipse((ex-7,ey-9,ex+7,ey+5), fill=col, outline=OUTL)
    im.save(OUT + "/img/plant.png")

# ---------- happy tooth sign (decor) ----------
def tooth_sign():
    # a little sign showing the Dr Smile mascot — the SAME happy tooth as the app icon.
    # Drawn at 2x then kept hi-res so it stays crisp when the engine scales it down.
    W, H = 120, 168
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); cx = W//2
    d.ellipse((cx-32, H-20, cx+32, H-4), fill=(0,0,0,40))
    # stand
    rr(d, (cx-6, H-60, cx+6, H-12), 4, fill=(150,120,90,255))
    # board (soft mint panel)
    rr(d, (cx-52, 12, cx+52, H-52), 16, fill=(233,248,243,255), outline=(120,200,190,255), width=6)
    # the mascot tooth, fitted INSIDE the board with margin and centred both ways
    # (rounded base reads better than the molar notch at this size)
    t = tight_tooth(px=320, shadow=False, notch=False)
    ix0, iy0, ix1, iy1 = cx-42, 26, cx+42, 104   # interior box, inside the outline
    bw, bh = ix1-ix0, iy1-iy0
    sc = min(bw/t.size[0], bh/t.size[1])
    t = t.resize((max(1, int(t.size[0]*sc)), max(1, int(t.size[1]*sc))), Image.LANCZOS)
    im.alpha_composite(t, (ix0 + (bw - t.size[0])//2, iy0 + (bh - t.size[1])//2))
    im.save(OUT + "/img/toothsign.png")

# ---------- reception desk (station building ~118x150) ----------
def reception():
    W, H = 118, 150
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); cx = W//2
    d.ellipse((cx-50, H-16, cx+50, H-2), fill=(0,0,0,45))
    pink=(255,178,196,255); pinkD=(232,140,162,255); wood=(240,225,210,255)
    # back wall sign board
    rr(d, (cx-44, 6, cx+44, 44), 10, fill=(255,255,255,255), outline=pink, width=3)
    # heart on sign
    hx, hy = cx, 25
    d.pieslice((hx-14, hy-10, hx-2, hy+2), 0, 360, fill=pink)
    d.pieslice((hx+2, hy-10, hx+14, hy+2), 0, 360, fill=pink)
    d.polygon([(hx-13, hy-2),(hx+13, hy-2),(hx, hy+14)], fill=pink)
    # desk body
    rr(d, (cx-50, 70, cx+50, H-10), 10, fill=pink, outline=pinkD, width=3)
    # desk top counter
    rr(d, (cx-56, 62, cx+56, 78), 6, fill=wood, outline=pinkD, width=2)
    # panel lines
    d.line([(cx, 80),(cx, H-12)], fill=pinkD, width=2)
    # service bell on the counter
    bx, by = cx, 60
    d.ellipse((bx-12, by-2, bx+12, by+8), fill=(255,210,90,255), outline=OUTL)  # base
    d.pieslice((bx-11, by-16, bx+11, by+6), 180, 360, fill=(255,225,120,255), outline=OUTL)
    d.ellipse((bx-2, by-20, bx+3, by-15), fill=(255,225,120,255), outline=OUTL)
    im.save(OUT + "/img/reception.png")


# ---------- "needs care" bubble (floats above a child who still has dirty teeth) ----------
def want_bubble():
    # drawn at 3x then downscaled for clean edges
    S = 3
    W, H = 96 * S, 92 * S
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    teal = (70, 175, 165, 255)
    # rounded speech bubble + little tail pointing down
    body = (8 * S, 6 * S, 88 * S, 70 * S)
    tip = (44 * S, 86 * S)
    # tail first (white fill + teal outline on the two slanted sides), then the body covers its top
    d.line([(38 * S, 60 * S), tip], fill=teal, width=4 * S)
    d.line([(58 * S, 60 * S), tip], fill=teal, width=4 * S)
    d.polygon([(38 * S, 60 * S), (58 * S, 60 * S), tip], fill=(255, 255, 255, 255))
    rr(d, body, 26 * S, fill=(255, 255, 255, 255), outline=teal, width=4 * S)
    # a small dirty tooth inside the bubble
    cx, cy = 48 * S, 36 * S
    tooth = (cx - 19 * S, cy - 22 * S, cx + 19 * S, cy + 16 * S)
    d.ellipse((tooth[0], tooth[1], cx + 1 * S, cy - 2 * S), fill=(255, 255, 255, 255), outline=(205, 212, 220, 255), width=2 * S)
    d.ellipse((cx - 1 * S, tooth[1], tooth[2], cy - 2 * S), fill=(255, 255, 255, 255), outline=(205, 212, 220, 255), width=2 * S)
    rr(d, (cx - 19 * S, cy - 14 * S, cx + 19 * S, cy + 16 * S), 12 * S, fill=(255, 255, 255, 255), outline=(205, 212, 220, 255), width=2 * S)
    d.polygon([(cx - 8 * S, cy + 16 * S), (cx, cy + 2 * S), (cx + 8 * S, cy + 16 * S)], fill=(0, 0, 0, 0))
    # brown stains on the tooth
    for (sx, sy, sr) in [(-7, -2, 5), (6, 4, 4), (1, -9, 3)]:
        d.ellipse((cx + (sx - sr) * S, cy + (sy - sr) * S, cx + (sx + sr) * S, cy + (sy + sr) * S),
                  fill=(150, 110, 70, 235))
    im = im.resize((96, 92), Image.LANCZOS)
    im.save(OUT + "/img/want.png")

tooth_sign()   # refresh the clinic signs with the new mascot tooth
want_bubble()


print("Dr Smile world assets generated.")
