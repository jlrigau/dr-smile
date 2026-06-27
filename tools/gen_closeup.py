#!/usr/bin/env python3
"""Close-up mini-scene assets for Dr Smile: open-mouth backdrop, dirt spot, brush.
Teeth are kept INSIDE the lips, with gum lines, so it reads as a real mouth and the
scrubbable spots only ever land on teeth."""
import os, math, random
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets"
random.seed(7)

def rr(d, box, r, **kw): d.rounded_rectangle(box, radius=r, **kw)

# ---------------- Open mouth backdrop (1000x800, 5:4) ----------------
def mouth():
    W, H = 1000, 800
    im = Image.new("RGBA", (W, H), (255, 222, 230, 255))     # soft skin/lips pink
    d = ImageDraw.Draw(im)
    cx, cy = W // 2, 420
    RX, RY = 355, 258                                        # mouth interior radii

    # lips (two soft rings) then the rose interior
    d.ellipse((cx-422, cy-300, cx+422, cy+312), fill=(255, 150, 178, 255))
    d.ellipse((cx-388, cy-272, cx+388, cy+286), fill=(236, 120, 150, 255))
    d.ellipse((cx-RX, cy-RY, cx+RX, cy+RY), fill=(190, 94, 118, 255))

    gum = (228, 132, 150, 255)
    tooth = (255, 255, 255, 255); tline = (210, 218, 226, 255); tshade = (228, 236, 242, 255)

    def teeth_row(y0, y1, n, span, upper=True):
        # span is the half-width; kept < interior half-width at the narrow edge so the
        # row never pokes through the lips.
        x0, x1 = cx - span, cx + span
        w = (x1 - x0) / n
        if upper:
            rr(d, (x0-14, y0-30, x1+14, y0+34), 22, fill=gum)     # upper gum strip
        else:
            rr(d, (x0-14, y1-34, x1+14, y1+30), 22, fill=gum)     # lower gum strip
        for i in range(n):
            bx = x0 + i * w
            d.rounded_rectangle((bx+4, y0, bx+w-4, y1), radius=16,
                                fill=tooth, outline=tline, width=3)
            d.line((bx+w*0.5, y0+10, bx+w*0.5, y1-10), fill=(238, 244, 248, 255), width=2)
            if upper:
                d.ellipse((bx+10, y1-20, bx+w-10, y1-4), fill=tshade)
            else:
                d.ellipse((bx+10, y0+4, bx+w-10, y0+20), fill=tshade)

    # Anatomy: upper teeth (top), then the TONGUE in the middle of the mouth, then the
    # lower teeth drawn IN FRONT of the tongue's base (the tongue tucks behind them).
    teeth_row(cy-158, cy-38, 8, 250, upper=True)

    # tongue resting in the middle, between the two jaws
    d.ellipse((cx-152, cy-18, cx+152, cy+128), fill=(255, 148, 164, 255), outline=(226, 116, 138, 255), width=5)
    d.ellipse((cx-150, cy-16, cx+150, cy+40), fill=(255, 168, 182, 255))   # soft highlight on top
    d.line((cx, cy+6, cx, cy+104), fill=(226, 116, 138, 255), width=5)

    teeth_row(cy+86, cy+176, 7, 226, upper=False)

    im.save(OUT + "/img/mouth.png")

# ---------------- Dirt spot (a cute, removable little stain) ----------------
def spot():
    S = 96
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S // 2
    base = (214, 188, 96, 255); edge = (190, 158, 70, 255)
    pts = []
    n = 12
    for i in range(n):
        a = i / n * 2 * math.pi
        rad = 28 + random.randint(-4, 5)
        pts.append((c + math.cos(a) * rad, c + math.sin(a) * rad))
    d.polygon(pts, fill=base, outline=edge)
    eye = (90, 70, 40, 255)
    d.ellipse((c-12, c-8, c-5, c+0), fill=eye)
    d.ellipse((c+5, c-8, c+12, c+0), fill=eye)
    d.arc((c-8, c+6, c+8, c+17), 190, 350, fill=eye, width=3)   # small friendly frown
    for _ in range(5):
        sx, sy = c + random.randint(-18, 18), c + random.randint(-18, 18)
        d.ellipse((sx-2, sy-2, sx+2, sy+2), fill=edge)
    im.save(OUT + "/img/spot.png")

# ---------------- Toothbrush cursor (bristles at top-left contact) ----------------
def brush():
    S = 128
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    teal = (95, 200, 190, 255); tealD = (60, 160, 150, 255)
    d.line((36, 30, 110, 116), fill=tealD, width=16)
    d.line((36, 30, 110, 116), fill=teal, width=10)
    rr(d, (16, 12, 56, 40), 10, fill=teal, outline=tealD, width=3)
    for i in range(6):
        bx = 20 + i * 6
        d.line((bx, 12, bx, 0), fill=(235, 245, 248, 255), width=3)
    rr(d, (16, -2, 56, 12), 4, fill=(245, 250, 252, 255), outline=tealD, width=2)
    im.save(OUT + "/img/brush.png")

mouth(); spot(); brush()
print("Dr Smile close-up assets generated.")
