from PIL import Image, ImageDraw, ImageFont

W, SH, N = 1170, 2532, 3          # iPhone width, one screen height, number of screens
H = SH * N
M = 64                             # side margin
TOP, BOT = 140, 100                # status bar / home indicator safe areas
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f_s, f_m, f_b = ImageFont.truetype(F, 26), ImageFont.truetype(F, 32), ImageFont.truetype(FB, 40)

BLUE = (46, 107, 255)
RED = (255, 79, 46)
GRID = (46, 107, 255, 28)
GUIDE = (46, 107, 255, 90)

def dashed(d, y, color, w=3, dash=24, gap=16):
    x = 0
    while x < W:
        d.line([(x, y), (min(x + dash, W), y)], fill=color, width=w)
        x += dash + gap

def make(bg):
    img = Image.new("RGBA", (W, H), bg)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)

    # 4-column grid inside margins
    cw = (W - 2 * M) / 4
    for i in range(5):
        x = M + i * cw
        d.line([(x, 0), (x, H)], fill=GRID, width=2)
    # 80px baseline-ish horizontal grid
    for y in range(0, H, 80):
        d.line([(M, y), (W - M, y)], fill=(46, 107, 255, 14), width=1)
    # margins
    d.line([(M, 0), (M, H)], fill=GUIDE, width=3)
    d.line([(W - M, 0), (W - M, H)], fill=GUIDE, width=3)

    labels = [
        ("1. EKRAN — ilk açılışta görünen alan",
         "logo / isim · tek cümle sen kimsin · ana görsel · menü"),
        ("2. EKRAN — kaydırınca",
         "işler / galeri · öne çıkan projeler"),
        ("3. EKRAN — kaydırınca",
         "uygulamalar · AR · iletişim · instagram"),
    ]
    for s in range(N):
        y0 = s * SH
        # status bar safe area (only first screen really matters, mark all lightly)
        if s == 0:
            d.rectangle([0, 0, W, TOP], fill=(255, 79, 46, 26))
            d.text((M, 50), "saat / şarj çubuğu — buraya önemli şey koyma", font=f_s, fill=RED)
        # screen divider
        if s > 0:
            dashed(d, y0, (255, 79, 46, 200), w=4)
        title, hint = labels[s]
        d.text((M, y0 + (TOP if s == 0 else 0) + 24), title, font=f_b, fill=BLUE)
        d.text((M, y0 + (TOP if s == 0 else 0) + 76), hint, font=f_m, fill=(46, 107, 255, 150))
        # thumb zone on screen 1: lower third is easiest to tap
        if s == 0:
            tz = SH - 820
            d.rounded_rectangle([M, tz, W - M, SH - BOT - 20], radius=40,
                                outline=(20, 163, 90, 150), width=3)
            d.text((M + 24, tz + 20), "başparmak bölgesi — ana butonlar burada rahat basılır",
                   font=f_s, fill=(20, 163, 90))
    # bottom home indicator
    d.rectangle([0, H - BOT, W, H], fill=(255, 79, 46, 26))
    d.text((M, H - BOT + 30), "sayfa sonu — devam etmek istersen aşağı uzatabilirim", font=f_s, fill=RED)
    # top-right legend
    legend = ["1170 × 2532 px = 1 iPhone ekranı", f"kenar boşluğu {M}px · 4 sütun ızgara"]
    for i, t in enumerate(legend):
        tw = d.textlength(t, font=f_s)
        d.text((W - M - tw, 56 + i * 34 + (0 if True else 0)), t, font=f_s, fill=BLUE) if False else None
    img = Image.alpha_composite(img, ov)
    return img

make((255, 247, 232, 255)).convert("RGB").save("/home/claude/site/sablon_ana_sayfa.png")
make((0, 0, 0, 0)).save("/home/claude/site/sablon_ana_sayfa_seffaf.png")
print("ok")
