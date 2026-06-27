#!/usr/bin/env python3
"""Generate Dr Smile world assets: floor tile, dental chair, plant, tooth sign,
reception desk station, and PWA icons. Soft pastel clinic theme."""
import os, math
from PIL import Image, ImageDraw

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
    W, H = 60, 84
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); cx = W//2
    d.ellipse((cx-16, H-10, cx+16, H-2), fill=(0,0,0,40))
    # stand
    rr(d, (cx-3, H-30, cx+3, H-6), 2, fill=(150,120,90,255))
    # board
    rr(d, (cx-26, 6, cx+26, H-26), 8, fill=(255,255,255,255), outline=(120,200,190,255), width=3)
    # smiling tooth mascot
    tx, ty = cx, 30
    d.pieslice((tx-13, ty-14, tx+13, ty+10), 180, 360, fill=(250,250,255,255), outline=OUTL)
    d.polygon([(tx-13, ty-2),(tx-13, ty+12),(tx-5, ty+6)], fill=(250,250,255,255), outline=OUTL)
    d.polygon([(tx+13, ty-2),(tx+13, ty+12),(tx+5, ty+6)], fill=(250,250,255,255), outline=OUTL)
    d.ellipse((tx-6, ty-6, tx-2, ty-2), fill=(40,40,55,255))
    d.ellipse((tx+2, ty-6, tx+6, ty-2), fill=(40,40,55,255))
    d.arc((tx-5, ty-3, tx+5, ty+6), 10, 170, fill=(40,40,55,255), width=2)
    # sparkle
    d.line([(tx+9, ty-9),(tx+9, ty-3)], fill=(255,210,90,255), width=2)
    d.line([(tx+6, ty-6),(tx+12, ty-6)], fill=(255,210,90,255), width=2)
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

# ---------- PWA icons: smiling tooth on soft pink rounded bg ----------
def tooth_icon(size, path):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    s = size
    rr(d, (0, 0, s-1, s-1), int(s*0.22), fill=(255, 224, 233, 255))
    cx, cy = s//2, int(s*0.52)
    R = int(s*0.30)
    # tooth body
    d.pieslice((cx-R, cy-R-int(s*0.04), cx+R, cy+int(s*0.20)), 180, 360, fill=(255,255,255,255), outline=(120,200,190,255), width=max(2,s//90))
    d.polygon([(cx-R, cy-int(s*0.02)),(cx-R, cy+int(s*0.28)),(cx-int(R*0.35), cy+int(s*0.14))], fill=(255,255,255,255), outline=(120,200,190,255))
    d.polygon([(cx+R, cy-int(s*0.02)),(cx+R, cy+int(s*0.28)),(cx+int(R*0.35), cy+int(s*0.14))], fill=(255,255,255,255), outline=(120,200,190,255))
    # face
    er = int(s*0.035)
    for ex in (cx-int(R*0.45), cx+int(R*0.45)):
        d.ellipse((ex-er, cy-er-int(s*0.04), ex+er, cy+er-int(s*0.04)), fill=(60,55,70,255))
    d.arc((cx-int(R*0.5), cy-int(s*0.04), cx+int(R*0.5), cy+int(s*0.16)), 10, 170, fill=(60,55,70,255), width=max(2,s//70))
    # cheeks
    for ex in (cx-int(R*0.7), cx+int(R*0.7)):
        d.ellipse((ex-er, cy+int(s*0.02), ex+er, cy+int(s*0.06)), fill=(255,170,180,230))
    # sparkle
    spx, spy = cx+int(R*0.7), cy-int(R*0.7)
    d.line([(spx, spy-int(s*0.05)),(spx, spy+int(s*0.05))], fill=(255,205,80,255), width=max(2,s//80))
    d.line([(spx-int(s*0.05), spy),(spx+int(s*0.05), spy)], fill=(255,205,80,255), width=max(2,s//80))
    im.save(path)

floor(); chair(); plant(); tooth_sign(); reception()
tooth_icon(512, OUT + "/favicon.png")
tooth_icon(180, OUT + "/apple-touch-icon.png")

print("Dr Smile world assets generated.")
