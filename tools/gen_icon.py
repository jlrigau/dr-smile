#!/usr/bin/env python3
"""Dr Smile app icons — the big happy-tooth mascot on a mint→pink gradient.
The tooth nearly fills the frame so it stays legible at home-screen size.
Drawn large and downscaled (anti-aliased) for crisp edges."""
import os, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tooth import tight_tooth

OUT = "/home/user/dr-smile/assets"


def vgrad(S, top, bot):
    g = Image.new("RGB", (1, S))
    for y in range(S):
        t = y / (S - 1)
        g.putpixel((0, y), tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3)))
    return g.resize((S, S))


def draw_icon(S):
    k = S / 512.0
    def s(v): return v * k
    im = vgrad(S, (190, 236, 226), (255, 206, 226)).convert("RGBA")
    d = ImageDraw.Draw(im, "RGBA")

    # scattered sparkles in the background
    for (x, y, r) in [(70, 120, 11), (446, 360, 13), (96, 410, 8), (430, 110, 7)]:
        d.ellipse((s(x - r), s(y - r), s(x + r), s(y + r)), fill=(255, 255, 255, 150))

    # the tooth, scaled to fill ~92% of the frame
    tooth = tight_tooth(px=S)
    margin = int(s(20))
    avail = S - 2 * margin
    tw, th = tooth.size
    scale = avail / max(tw, th)
    nw, nh = int(tw * scale), int(th * scale)
    tooth = tooth.resize((nw, nh), Image.LANCZOS)

    # faint drop shadow centred under the tooth
    cx = S // 2
    base = margin + nh
    d.ellipse((cx - nw * 0.30, base - s(20), cx + nw * 0.30, base + s(8)), fill=(120, 90, 110, 32))

    im.alpha_composite(tooth, (cx - nw // 2, margin))
    return im


SS = 2048
master = draw_icon(SS)

# favicon: full-bleed square with rounded corners (browser tab / maskable-any)
fav = master.resize((512, 512), Image.LANCZOS)
mask = Image.new("L", (512, 512), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 511, 511), radius=96, fill=255)
fav.putalpha(mask)
fav.save(OUT + "/favicon.png")

# apple-touch: full square, no transparency (iOS rounds the corners itself)
master.resize((180, 180), Image.LANCZOS).convert("RGB").save(OUT + "/apple-touch-icon.png")
print("icons generated")
