#!/usr/bin/env python3
"""Dr Smile app icons — a cute happy-tooth mascot on a mint→pink gradient.
Drawn at 4x and downscaled (anti-aliased) for crisp edges."""
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets"

def vgrad(S, top, bot):
    g = Image.new("RGB", (1, S))
    for y in range(S):
        t = y / (S - 1)
        g.putpixel((0, y), tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3)))
    return g.resize((S, S))

def rr(d, box, r, **kw): d.rounded_rectangle(box, radius=r, **kw)

def draw_icon(S):
    k = S / 512.0
    def s(v): return v * k
    im = vgrad(S, (190, 236, 226), (255, 206, 226)).convert("RGBA")
    d = ImageDraw.Draw(im, "RGBA")

    # scattered sparkles in the background
    for (x, y, r) in [(96, 130, 10), (410, 350, 12), (120, 400, 8), (380, 110, 7)]:
        d.ellipse((s(x-r), s(y-r), s(x+r), s(y+r)), fill=(255, 255, 255, 150))

    # faint drop shadow under the big tooth
    d.ellipse((s(176), s(452), s(336), s(486)), fill=(120, 90, 110, 30))

    # ---- BIG molar tooth: two rounded humps on top + body + two roots with a notch ----
    white = (255, 255, 255, 255)
    tl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    dt = ImageDraw.Draw(tl, "RGBA")
    dt.ellipse((s(108), s(86), s(286), s(280)), fill=white)     # left top hump
    dt.ellipse((s(226), s(86), s(404), s(280)), fill=white)     # right top hump
    rr(dt, (s(132), s(170), s(380), s(432)), s(40), fill=white) # body + roots
    dt.polygon([(s(212), s(440)), (s(256), s(312)), (s(300), s(440))], fill=(0, 0, 0, 0))  # notch → 2 roots
    tl.putalpha(tl.split()[3])
    im.alpha_composite(tl)
    # subtle base shadow inside the tooth, masked to the tooth so it can't spill out
    sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse((s(170), s(330), s(342), s(420)), fill=(225, 232, 238, 90))
    a = sh.split()[3]; a2 = Image.composite(a, Image.new("L", (S, S), 0), tl.split()[3]); sh.putalpha(a2)
    im.alpha_composite(sh)

    # ---- face (smaller, in the middle, so the tooth silhouette dominates) ----
    eye = (54, 48, 60, 255)
    for ex in (216, 296):
        d.ellipse((s(ex-30), s(214), s(ex+30), s(276)), fill=white, outline=(210, 216, 222, 255), width=int(s(3)))
        d.ellipse((s(ex-16), s(232), s(ex+16), s(272)), fill=eye)
        d.ellipse((s(ex-10), s(236), s(ex-1), s(248)), fill=white)
    d.ellipse((s(176), s(280), s(206), s(304)), fill=(255, 150, 165, 190))   # cheeks
    d.ellipse((s(306), s(280), s(336), s(304)), fill=(255, 150, 165, 190))
    d.chord((s(220), s(278), s(292), s(330)), 0, 180, fill=(150, 70, 86, 255))   # open smile
    d.ellipse((s(236), s(308), s(276), s(332)), fill=(255, 150, 165, 255))       # tongue

    # ---- sparkle (shiny clean tooth) ----
    sx, sy = s(360), s(150)
    d.polygon([(sx, sy - s(30)), (sx + s(9), sy - s(9)), (sx + s(30), sy),
               (sx + s(9), sy + s(9)), (sx, sy + s(30)), (sx - s(9), sy + s(9)),
               (sx - s(30), sy), (sx - s(9), sy - s(9))], fill=(255, 214, 92, 255))
    d.ellipse((sx - s(7), sy - s(7), sx + s(7), sy + s(7)), fill=(255, 255, 255, 255))
    return im

SS = 2048
master = draw_icon(SS)

# favicon: rounded-corner square
fav = master.resize((512, 512), Image.LANCZOS)
mask = Image.new("L", (512, 512), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 511, 511), radius=112, fill=255)
fav.putalpha(mask)
fav.save(OUT + "/favicon.png")

# apple-touch: full square (iOS masks the corners itself)
master.resize((180, 180), Image.LANCZOS).convert("RGB").save(OUT + "/apple-touch-icon.png")
print("icons generated")
