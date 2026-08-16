#!/usr/bin/env python3
# 상황별 심플 이미지(카카오 simpleImage용) 생성 스크립트
# 640x640 PNG, 색상 배경 + 이모지 + 한글 라벨. 실행: python3 scripts/generate_images.py

import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'images')
os.makedirs(OUT_DIR, exist_ok=True)

EMOJI_FONT = '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
TEXT_FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'

SIZE = 640

# (파일명, 이모지, 배경색 위, 배경색 아래, 라벨)
ICONS = [
    ('start', '🪂', (3, 169, 244), (2, 100, 150), '게임 시작'),
    ('supply', '🎁', (255, 202, 40), (255, 143, 0), '초대박 보급!'),
    ('gold', '🥇', (255, 179, 0), (230, 130, 0), '금괴 획득'),
    ('key', '🔑', (57, 73, 171), (26, 35, 126), '비밀열쇠 획득'),
    ('cash', '💰', (67, 160, 71), (27, 94, 32), '현금 획득'),
    ('kill', '⚔️', (198, 40, 40), (100, 20, 20), '교전 승리'),
    ('attack', '🗡️', (216, 67, 21), (140, 40, 10), '공격 성공'),
    ('damage', '💥', (109, 27, 27), (60, 10, 10), '피해 발생'),
    ('heal', '🩹', (0, 137, 123), (0, 77, 64), '회복'),
    ('enhance_success', '✅', (249, 168, 37), (191, 120, 0), '연마 성공'),
    ('enhance_maintain', '🔨', (84, 110, 122), (38, 50, 56), '연마 유지'),
    ('enhance_destroy', '💔', (74, 20, 140), (30, 10, 60), '연마 실패'),
    ('win', '🍗', (255, 160, 0), (200, 110, 0), '치킨 획득! 승리'),
    ('dead', '💀', (66, 66, 66), (20, 20, 20), '사망'),
]


def vertical_gradient(size, top, bottom):
    img = Image.new('RGB', (1, size), color=0)
    for y in range(size):
        t = y / (size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        img.putpixel((0, y), (r, g, b))
    return img.resize((size, size))


def make_icon(name, emoji, top, bottom, label):
    img = vertical_gradient(SIZE, top, bottom).convert('RGBA')
    draw = ImageDraw.Draw(img)

    # NotoColorEmoji는 비트맵(고정 크기) 폰트라 네이티브 크기(109px)로 그린 뒤
    # 원하는 크기로 확대한다.
    NATIVE = 109
    emoji_font = ImageFont.truetype(EMOJI_FONT, NATIVE)
    tmp = Image.new('RGBA', (NATIVE * 2, NATIVE * 2), (0, 0, 0, 0))
    tmp_draw = ImageDraw.Draw(tmp)
    tmp_draw.text((0, 0), emoji, font=emoji_font, embedded_color=True)
    bbox = tmp.getbbox()
    if bbox:
        tmp = tmp.crop(bbox)
    target = 320
    scale = target / max(tmp.size)
    tmp = tmp.resize((max(1, int(tmp.size[0] * scale)), max(1, int(tmp.size[1] * scale))), Image.LANCZOS)
    ex = (SIZE - tmp.size[0]) // 2
    ey = (SIZE - tmp.size[1]) // 2 - 40
    img.alpha_composite(tmp, (ex, ey))

    # 하단 라벨 바
    bar_h = 120
    draw.rectangle([0, SIZE - bar_h, SIZE, SIZE], fill=(0, 0, 0, 140))
    text_font = ImageFont.truetype(TEXT_FONT, 54)
    tbbox = draw.textbbox((0, 0), label, font=text_font)
    tw, th = tbbox[2] - tbbox[0], tbbox[3] - tbbox[1]
    tx = (SIZE - tw) / 2 - tbbox[0]
    ty = SIZE - bar_h / 2 - th / 2 - tbbox[1]
    draw.text((tx, ty), label, font=text_font, fill=(255, 255, 255, 255))

    out_path = os.path.join(OUT_DIR, f'{name}.png')
    img.convert('RGB').save(out_path, 'PNG')
    print('generated', out_path)


if __name__ == '__main__':
    for name, emoji, top, bottom, label in ICONS:
        make_icon(name, emoji, top, bottom, label)
