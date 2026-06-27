#!/usr/bin/env python3
"""Close-up interaction assets for Dr Smile: the scrubbable dirt spot + the brush
cursor. (The face backdrops live in gen_faces.py.)"""
import os, math, random
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets"
random.seed(7)

def rr(d, box, r, **kw): d.rounded_rectangle(box, radius=r, **kw)

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

spot(); brush()
print("Dr Smile close-up assets generated.")
