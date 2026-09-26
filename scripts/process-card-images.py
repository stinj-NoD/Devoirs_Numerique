# -*- coding: utf-8 -*-
"""
Traitement des illustrations de cartes du Grimoire.

Transforme un PNG source (DesignApp, 1254x1254, damier de fausse transparence
incrusté) en WebP transparent 512px prêt pour data/cards/.

Usage :
  python scripts/process-card-images.py "DesignApp/DesignApp/IMG_0816.PNG" mon-slug
  python scripts/process-card-images.py --loose "..." mon-slug   # damier teinté
  python scripts/process-card-images.py --scan                    # détecte les résidus
  python scripts/process-card-images.py --verify mon-slug         # aperçu fond coloré

Pipeline :
  1. Flood-fill depuis les bords sur les pixels "damier" (clairs, neutres)
  2. Passe 2 : îlots de damier enfermés (zones fermées par le dessin),
     reconnus par leur alternance blanc/gris ~50/50
  3. Détection plein-cadre : si les bords ne sont pas en damier, l'image est
     gardée telle quelle (illustrations pleine page comme Z Ultime)
  4. Adoucissement du bord alpha, recadrage sur le contenu + marge, 512px,
     WebP qualité 85

Seuils :
  - standard : luminosité > 232 (damier blanc/gris classique)
  - --loose  : luminosité > 214 (damier TEINTÉ bleu-gris, peint par l'IA
    autour des créatures très ornées — ex: Delphitox, Capiroi). NE PAS
    utiliser --loose par défaut : sur les créatures au pelage blanc/pâle,
    il risque de manger de la fourrure légitime.

Après traitement, TOUJOURS vérifier visuellement avec --verify (le damier
teinté ne se voit que sur fond coloré).
"""
from PIL import Image, ImageFilter, ImageDraw
import sys, os
from collections import deque

ROOT = os.path.join(os.path.dirname(__file__), '..')
CARDS_DIR = os.path.join(ROOT, 'data', 'cards')
PREVIEW_DIR = os.path.join(ROOT, 'scratchpad')


def remove_checker(path, thresh=232, sat=10):
    img = Image.open(path).convert('RGB')
    w, h = img.size
    px = img.load()

    def is_checkerish(x, y):
        r, g, b = px[x, y]
        return r > thresh and g > thresh and b > thresh and max(r, g, b) - min(r, g, b) < sat

    mask = bytearray(w * h)
    dq = deque()

    def seed(x, y):
        if is_checkerish(x, y) and not mask[y * w + x]:
            mask[y * w + x] = 1
            dq.append((x, y))

    for x in range(w):
        seed(x, 0); seed(x, h - 1)
    for y in range(h):
        seed(0, y); seed(w - 1, y)

    full_bleed = len(dq) < (2 * w + 2 * h) * 0.05
    if not full_bleed:
        while dq:
            x, y = dq.popleft()
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and not mask[ny * w + nx] and is_checkerish(nx, ny):
                    mask[ny * w + nx] = 1
                    dq.append((nx, ny))
        # Passe 2 : îlots enfermés (alternance blanc/gris = signature damier)
        visited = bytearray(w * h)
        for y0 in range(h):
            for x0 in range(w):
                i0 = y0 * w + x0
                if visited[i0] or mask[i0] or not is_checkerish(x0, y0):
                    continue
                comp = []
                dq2 = deque([(x0, y0)])
                visited[i0] = 1
                while dq2:
                    x, y = dq2.popleft()
                    comp.append((x, y))
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        ni = ny * w + nx
                        if 0 <= nx < w and 0 <= ny < h and not visited[ni] and not mask[ni] and is_checkerish(nx, ny):
                            visited[ni] = 1
                            dq2.append((nx, ny))
                if len(comp) < 300:
                    continue
                grays = sum(1 for x, y in comp if max(px[x, y]) < (247 if thresh > 220 else 244))
                if 0.2 < grays / len(comp) < 0.8:
                    for x, y in comp:
                        mask[y * w + x] = 1

    out = img.convert('RGBA')
    if not full_bleed:
        opx = out.load()
        for y in range(h):
            base = y * w
            for x in range(w):
                if mask[base + x]:
                    opx[x, y] = (0, 0, 0, 0)
        alpha = out.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
        out.putalpha(alpha)
        bbox = out.getbbox()
        if bbox:
            m = 12
            bbox = (max(0, bbox[0] - m), max(0, bbox[1] - m), min(w, bbox[2] + m), min(h, bbox[3] + m))
            out = out.crop(bbox)
    out.thumbnail((512, 512), Image.LANCZOS)
    return out, full_bleed


def residue_score(path):
    """Score de damier résiduel : alternance clair/gris à période ~6px dans
    les pixels opaques. Les créatures blanches (fourrure) donnent des faux
    positifs — toujours confirmer visuellement avant de retraiter."""
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    px = img.load()
    hits = 0
    for y in range(0, h, 3):
        for x in range(0, w - 8, 3):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            br = (r + g + b) / 3
            if br < 205 or max(r, g, b) - min(r, g, b) > 18:
                continue
            r2, g2, b2, a2 = px[x + 6, y]
            if a2 < 200:
                continue
            br2 = (r2 + g2 + b2) / 3
            if 6 < abs(br - br2) < 32 and max(r2, g2, b2) - min(r2, g2, b2) <= 18:
                hits += 1
    return hits


def save_verify_preview(slug):
    """Aperçu sur fond coloré (le seul moyen de voir un damier résiduel)."""
    os.makedirs(PREVIEW_DIR, exist_ok=True)
    img = Image.open(os.path.join(CARDS_DIR, f'{slug}.webp')).convert('RGBA')
    bg = Image.new('RGB', img.size, (60, 90, 140))
    bg.paste(img, (0, 0), img)
    dest = os.path.join(PREVIEW_DIR, f'{slug}_verify.jpg')
    bg.save(dest, 'JPEG', quality=82)
    return dest


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    args = [a for a in sys.argv[1:]]

    if '--scan' in args:
        results = []
        for f in sorted(os.listdir(CARDS_DIR)):
            if f.endswith('.webp'):
                results.append((residue_score(os.path.join(CARDS_DIR, f)), f))
        results.sort(reverse=True)
        print('Scores de résidu de damier (élevé = suspect, à confirmer visuellement) :')
        for score, f in results[:12]:
            print(f'{score:>6}  {f}')
        print("\nNB : les créatures au pelage blanc/pâle scorent haut sans avoir de damier.")
        return

    if '--verify' in args:
        slug = args[args.index('--verify') + 1]
        dest = save_verify_preview(slug)
        print(f'Aperçu : {dest} — à examiner sur le fond bleu (damier = motif quadrillé).')
        return

    loose = '--loose' in args
    if loose:
        args.remove('--loose')
    if len(args) < 2:
        print(__doc__)
        return

    src, slug = args[0], args[1]
    thresh, sat = (214, 18) if loose else (232, 10)
    out, full_bleed = remove_checker(src, thresh=thresh, sat=sat)
    os.makedirs(CARDS_DIR, exist_ok=True)
    dest = os.path.join(CARDS_DIR, f'{slug}.webp')
    out.save(dest, 'WEBP', quality=85, method=6)
    size = os.path.getsize(dest) // 1024
    mode = 'PLEIN-CADRE (aucun détourage)' if full_bleed else ('seuil élargi' if loose else 'seuil standard')
    print(f'{slug}.webp : {out.size}, {size} Ko [{mode}]')
    preview = save_verify_preview(slug)
    print(f'Aperçu à vérifier : {preview}')


if __name__ == '__main__':
    main()
