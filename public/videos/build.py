import subprocess, os, math
from PIL import Image, ImageDraw, ImageFont

uploads = "/mnt/user-data/uploads"
work    = "/home/claude/scenes_v3"
frm     = "/home/claude/frames_v3"
out_dir = "/mnt/user-data/outputs"
for d in [work, frm, out_dir]: os.makedirs(d, exist_ok=True)

W, H   = 1280, 720
MARGIN = 90  # px each side
MAX_TW = W - MARGIN * 2  # max text width
FPS    = 24
DUR    = 9   # seconds per scene → 7×11 + 9 packshots - overlaps ≈ 1:20

OR     = (196, 162, 101)
BLANC  = (255, 255, 255)
NOIR   = (0, 0, 0)

FONT_BOLD  = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_REG   = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
FONT_SANS  = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_SANSR = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def easeOut(t):
    return 1 - (1-min(1.0,max(0.0,t)))**3

def run(cmd, label=""):
    print(f"▶ {label}")
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0: print("  ERR:", r.stderr[-300:])
    else: print("  OK")
    return r.returncode

# ── Scenes data ─────────────────────────────────────────────────────────────
# Format: line1 and line2 are lists of (word, is_gold) tuples
# "gold" words = numbers and key terms highlighted in #C4A265

SCENES = [
    {
        "source": "v1",
        "line1": [("En 2023, l'Inde", False), ("a dépassé la Chine.", False)],
        "line2": [("1,44 milliard", True), ("d'êtres humains.", False)],
        "sub":   "Le plus grand pays du monde par la population."
    },
    {
        "source": "p1",
        "line1": [("Une croissance de", False), ("7%", True), ("par an.", False)],
        "line2": [("3e économie mondiale", True), ("d'ici 2030.", False)],
        "sub":   "Devant le Japon et l'Allemagne réunis."
    },
    {
        "source": "p2",
        "line1": [("Ni pro-Occident.", False), ("Ni pro-Russie.", False)],
        "line2": [("Elle achète le pétrole russe,", True), ("négocie avec Washington.", False)],
        "sub":   "Une doctrine : l'intérêt national avant tout."
    },
    {
        "source": "v2",
        "line1": [("600 millions", True), ("d'Indiens", False)],
        "line2": [("sous le seuil", False), ("de pauvreté.", False)],
        "sub":   "Le défi intérieur est aussi grand que l'ambition mondiale."
    },
    {
        "source": "v1",
        "line1": [("L'Inde a posé", False), ("un rover sur la Lune.", True)],
        "line2": [("10 fois moins cher", True), ("que la NASA.", False)],
        "sub":   "L'efficacité comme doctrine technologique."
    },
    {
        "source": "v2",
        "line1": [("D'ici 2050,", False), ("1 milliard d'actifs.", True)],
        "line2": [("La plus grande force de travail", False), ("de l'histoire.", True)],
        "sub":   "Pendant que la Chine et l'Europe vieillissent."
    },
    {
        "source": "v3",
        "line1": [("Le siècle qui vient", False)],
        "line2": [("aura peut-être", False), ("un accent hindi.", True)],
        "sub":   None
    },
]

VIDEO_FILES = {
    "v1": f"{uploads}/Gen-4_5_Aerial_slow_drone_shot_over_a_massive_crowd_in_Mumbai_streets_at_golden_hour__thousands_of_people_moving__warm_light__cinematic__slow_motion__dark_color_grading_488801612.mp4",
    "v2": f"{uploads}/Gen-4_5_Split_street_scene_in_India__left_side_luxury_glass_tower_modern_city__right_side_dusty_village_road_poor_neighborhood__people_walking__cinematic_slow_pan__dramatic_lighting_3561480998.mp4",
    "v3": f"{uploads}/Gen-4_5_Young_Indian_woman_silhouette_standing_alone_facing_a_vast_horizon_at_sunrise__slow_camera_push_forward__epic_golden_light__cinematic__emotional__wide_shot_1577830577.mp4",
    "p1": f"{uploads}/66749.png",
    "p2": f"{uploads}/66750.png",
}

# ── Text rendering ────────────────────────────────────────────────────────────

def render_text_frame(t, sc, total_dur):
    img  = Image.new("RGBA", (W, H), (0,0,0,0))
    draw = ImageDraw.Draw(img)

    f_title = ImageFont.truetype(FONT_BOLD, 40)
    f_sub   = ImageFont.truetype(FONT_SANSR, 20)
    f_prsm  = ImageFont.truetype(FONT_BOLD, 28)
    f_cat   = ImageFont.truetype(FONT_SANS, 11)

    # Gold top bar animates in
    bar_p = min(1.0, t / 0.5)
    draw.rectangle([0, 0, int(W * easeOut(bar_p)), 3], fill=OR)

    # PRISME badge top-left
    if t > 0.2:
        a = int(easeOut(min(1.0,(t-0.2)/0.6)) * 255)
        draw.text((28, 16), "PRISME", font=f_prsm, fill=(*BLANC, a))
        bb = draw.textbbox((28,16), "PRISME", font=f_prsm)
        draw.rectangle([28, bb[3]+3, bb[2], bb[3]+4], fill=(*OR, a))
        draw.text((28, bb[3]+10), "GÉOPOLITIQUE", font=f_cat, fill=(*OR, int(a*0.85)))

    # Text starts at t=2.0
    TEXT_START = 0.5
    if t < TEXT_START:
        return img

    t_txt = t - TEXT_START
    WORD_DUR = 0.20  # seconds per word

    # Flatten all words across line1 + line2
    all_lines = [sc["line1"], sc["line2"]]
    line_y_positions = []

    # Measure line heights to center block vertically (lower third area)
    n_lines = 2 if sc["line2"] else 1
    block_h = n_lines * 72 + (30 if sc.get("sub") else 0)
    # Position: center of lower third
    block_top = int(H * 0.58)

    # Gold accent line above text
    gold_line_y = block_top - 16
    gold_p = min(1.0, max(0, (t_txt - 0.1) / 0.4))
    gold_w = int(easeOut(gold_p) * 100)
    gold_a = int(easeOut(gold_p) * 255)
    gold_x = (W - 100) // 2
    draw.rectangle([gold_x, gold_line_y, gold_x + gold_w, gold_line_y + 2], fill=(*OR, gold_a))

    # Compute global word index offset for timing
    global_word_idx = 0

    for line_idx, words in enumerate(all_lines):
        if not words:
            continue
        y = block_top + line_idx * 72

        # Measure full line
        full_text = " ".join(w for w, _ in words)
        bb_full = draw.textbbox((0,0), full_text, font=f_title)
        line_w  = bb_full[2] - bb_full[0]
        # Clamp to margins
        if line_w > MAX_TW:
            cursor_x = MARGIN
        else:
            cursor_x = (W - line_w) // 2

        for w_idx, (word, is_gold) in enumerate(words):
            gidx = global_word_idx + w_idx
            w_start = gidx * WORD_DUR
            wp = min(1.0, max(0.0, (t_txt - w_start) / WORD_DUR))

            if wp <= 0:
                bb_w = draw.textbbox((0,0), word + " ", font=f_title)
                cursor_x += bb_w[2] - bb_w[0]
                continue

            alpha = int(easeOut(wp) * 255)
            slide = int((1 - easeOut(wp)) * 22)
            color = OR if is_gold else BLANC

            # Drop shadow
            draw.text((cursor_x+2, y - slide + 2), word, font=f_title, fill=(0,0,0, min(alpha,200)))
            # Word
            draw.text((cursor_x, y - slide), word, font=f_title, fill=(*color, alpha))

            bb_w = draw.textbbox((0,0), word + " ", font=f_title)
            cursor_x += bb_w[2] - bb_w[0]

        global_word_idx += len(words)

    # Subtitle line
    if sc.get("sub"):
        total_words = sum(len(l) for l in all_lines)
        sub_start = total_words * WORD_DUR + 0.3
        if t_txt > sub_start:
            sub_p = min(1.0, (t_txt - sub_start) / 0.5)
            sub_a = int(easeOut(sub_p) * 170)
            sub_y = block_top + n_lines * 72 + 8
            bb_s = draw.textbbox((0,0), sc["sub"], font=f_sub)
            sx = (W - (bb_s[2]-bb_s[0])) // 2
            draw.text((sx, sub_y), sc["sub"], font=f_sub, fill=(*BLANC, sub_a))

    # Credit / source — bottom right, small italic
    if sc.get("credit"):
        f_credit = ImageFont.truetype(FONT_SANS_REG if hasattr(ImageFont, "_") else FONT_SANSR, 15)
        try:
            f_credit = ImageFont.truetype(FONT_SANSR, 15)
        except:
            f_credit = ImageFont.truetype(FONT_SANS, 15)
        credit_text = sc["credit"]
        total_words = sum(len(l) for l in all_lines)
        cr_start = total_words * WORD_DUR + 0.5
        if t_txt > cr_start:
            cr_p = min(1.0, (t_txt - cr_start) / 0.6)
            cr_a = int(easeOut(cr_p) * 140)
            bb_cr = draw.textbbox((0,0), credit_text, font=f_credit)
            cr_w = bb_cr[2] - bb_cr[0]
            cr_x = W - cr_w - 28
            cr_y = H - 28
            # subtle dark bg for readability
            draw.rectangle([cr_x - 6, cr_y - 4, cr_x + cr_w + 6, cr_y + 18], fill=(0,0,0,int(cr_a*0.5)))
            draw.text((cr_x, cr_y), credit_text, font=f_credit, fill=(220, 220, 220, cr_a))

    return img


def render_packshot_intro(t, total=4.0):
    img  = Image.new("RGBA", (W, H), (0,0,0,255))
    draw = ImageDraw.Draw(img)
    f_big  = ImageFont.truetype(FONT_BOLD, 86)
    f_med  = ImageFont.truetype(FONT_BOLD, 30)
    f_sm   = ImageFont.truetype(FONT_SANS, 13)
    cx = W // 2

    bar_p = min(1.0, t/0.5)
    draw.rectangle([0, 0, int(W*easeOut(bar_p)), 4], fill=OR)

    if t > 0.3:
        p = min(1.0,(t-0.3)/0.9); a = int(easeOut(p)*255)
        bb = draw.textbbox((0,0),"PRISME",font=f_big)
        x  = cx-(bb[2]-bb[0])//2
        draw.text((x+2,H//2-100),"PRISME",font=f_big,fill=(0,0,0,a))
        draw.text((x,H//2-102),"PRISME",font=f_big,fill=(*BLANC,a))

    if t > 0.9:
        p = min(1.0,(t-0.9)/0.5); a = int(easeOut(p)*255)
        lw = int(easeOut(p)*160)
        draw.rectangle([cx-lw//2, H//2+4, cx+lw//2, H//2+6], fill=(*OR,a))

    if t > 1.3:
        p = min(1.0,(t-1.3)/0.7); a = int(easeOut(p)*255)
        sl= int((1-easeOut(p))*14)
        title = "L'INDE, LE SIÈCLE QUI VIENT"
        bb = draw.textbbox((0,0),title,font=f_med)
        x  = cx-(bb[2]-bb[0])//2
        draw.text((x,H//2+22-sl),title,font=f_med,fill=(*BLANC,a))

    if t > 2.0:
        p = min(1.0,(t-2.0)/0.5); a = int(easeOut(p)*180)
        tag = "GÉOPOLITIQUE  ·  2025"
        bb  = draw.textbbox((0,0),tag,font=f_sm)
        x   = cx-(bb[2]-bb[0])//2
        draw.text((x,H//2+68),tag,font=f_sm,fill=(*OR,a))

    if t > total - 0.8:
        fade = min(1.0,(t-(total-0.8))/0.8)
        ov = Image.new("RGBA",(W,H),(0,0,0,int(fade*255)))
        img = Image.alpha_composite(img, ov)
    return img


def render_packshot_outro(t, total=5.0):
    img  = Image.new("RGBA",(W,H),(0,0,0,255))
    draw = ImageDraw.Draw(img)
    f_big  = ImageFont.truetype(FONT_BOLD, 74)
    f_tag  = ImageFont.truetype(FONT_REG, 22)
    f_url  = ImageFont.truetype(FONT_SANSR, 15)
    cx = W//2

    # Fade in from black
    if t < 0.6:
        ov = Image.new("RGBA",(W,H),(0,0,0,int((1-t/0.6)*255)))
        img = Image.alpha_composite(img, ov)
        draw = ImageDraw.Draw(img)

    # Gold bar
    p0 = min(1.0,max(0,(t-0.1)/0.5))
    draw.rectangle([0,0,int(W*easeOut(p0)),4],fill=OR)

    # PRISME — letters appear one by one, 0.18s apart starting at t=0.5
    letters = list("PRISME")
    letter_delay = 0.18
    letter_anim  = 0.25
    # Measure full word to center it
    bb_full = draw.textbbox((0,0),"PRISME",font=f_big)
    word_w  = bb_full[2] - bb_full[0]
    x_start = cx - word_w // 2
    cursor  = x_start
    for li, ch in enumerate(letters):
        ch_start = 0.5 + li * letter_delay
        lp = min(1.0, max(0.0, (t - ch_start) / letter_anim))
        if lp <= 0:
            bb_c = draw.textbbox((0,0), ch, font=f_big)
            cursor += bb_c[2] - bb_c[0]
            continue
        la    = int(easeOut(lp) * 255)
        slide = int((1 - easeOut(lp)) * 28)
        # Shadow
        draw.text((cursor+2, H//2-90-slide+2), ch, font=f_big, fill=(0,0,0,min(la,180)))
        # Letter
        draw.text((cursor,   H//2-90-slide),   ch, font=f_big, fill=(*BLANC, la))
        bb_c = draw.textbbox((0,0), ch, font=f_big)
        cursor += bb_c[2] - bb_c[0]

    # Gold separator line — appears after last letter
    last_letter_t = 0.5 + 5 * letter_delay + letter_anim
    if t > last_letter_t:
        p = min(1.0,(t-last_letter_t)/0.4); a = int(easeOut(p)*255)
        lw = int(easeOut(p)*160)
        draw.rectangle([cx-lw//2,H//2+0,cx+lw//2,H//2+2],fill=(*OR,a))

    # Tagline
    tag_t = last_letter_t + 0.5
    if t > tag_t:
        p = min(1.0,(t-tag_t)/0.6); a = int(easeOut(p)*200)
        sl = int((1-easeOut(p))*10)
        tag = "Comprendre le monde tel qu'il est."
        bb  = draw.textbbox((0,0),tag,font=f_tag)
        x   = cx-(bb[2]-bb[0])//2
        draw.text((x,H//2+18-sl),tag,font=f_tag,fill=(*BLANC,a))

    # URL
    url_t = tag_t + 0.7
    if t > url_t:
        p = min(1.0,(t-url_t)/0.4); a = int(easeOut(p)*180)
        url = "prisme-peach.vercel.app"
        bb  = draw.textbbox((0,0),url,font=f_url)
        x   = cx-(bb[2]-bb[0])//2
        draw.text((x,H//2+58),url,font=f_url,fill=(*OR,a))

    return img


# ── Render helpers ─────────────────────────────────────────────────────────────

def render_seq(name, render_fn, n_frames, **kwargs):
    folder = f"{frm}/{name}"
    os.makedirs(folder, exist_ok=True)
    total_dur = n_frames / FPS
    for i in range(n_frames):
        frame = render_fn(i/FPS, **kwargs)
        frame.save(f"{folder}/{i:05d}.png")
    return folder

def seq_to_video(folder, out, n_frames):
    run(f'ffmpeg -y -f image2 -framerate {FPS} -i "{folder}/%05d.png" '
        f'-vf format=yuv420p -t {n_frames/FPS:.3f} -r {FPS} '
        f'-c:v libx264 -preset fast -crf 19 -an "{out}"',
        f"seq→video {os.path.basename(out)}")

def composite(bg_path, ov_folder, out, n_frames, is_photo=False):
    src = bg_path
    if is_photo:
        tmp = out.replace(".mp4","_raw.mp4")
        run(f'ffmpeg -y -loop 1 -i "{bg_path}" '
            f'-vf "scale={W*2}:{H*2}:force_original_aspect_ratio=increase,'
            f'zoompan=z=zoom+0.0005:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):d={n_frames}:fps={FPS}:s={W}x{H}" '
            f'-t {n_frames/FPS:.3f} -r {FPS} -c:v libx264 -pix_fmt yuv420p -preset fast -crf 19 -an "{tmp}"',
            f"  zoompan {os.path.basename(bg_path)}")
        src = tmp

    run(f'ffmpeg -y -i "{src}" -i "{ov_folder}/%05d.png" '
        f'-filter_complex "[0]scale={W}:{H}:force_original_aspect_ratio=decrease,'
        f'pad={W}:{H}:(ow-iw)/2:(oh-ih)/2[bg];[bg][1]overlay=0:0:format=auto[v]" '
        f'-map "[v]" -t {n_frames/FPS:.3f} -r {FPS} '
        f'-c:v libx264 -pix_fmt yuv420p -preset fast -crf 19 -an "{out}"',
        f"  composite {os.path.basename(out)}")


# ── Build ──────────────────────────────────────────────────────────────────────
N = DUR * FPS

print("\n=== INTRO ===")
intro_n = int(4.0 * FPS)
intro_folder = render_seq("intro", render_packshot_intro, intro_n, total=4.0)
seq_to_video(intro_folder, f"{work}/s00_intro.mp4", intro_n)

print("\n=== SCENES ===")
for i, sc in enumerate(SCENES):
    print(f"\n  — Scene {i+1}")
    ov_folder = f"{frm}/s{i+1}"
    os.makedirs(ov_folder, exist_ok=True)
    for j in range(N):
        frame = render_text_frame(j/FPS, sc, DUR)
        frame.save(f"{ov_folder}/{j:05d}.png")

    src_key = sc["source"]
    src_path = VIDEO_FILES[src_key]
    is_photo = src_key.startswith("p")
    composite(src_path, ov_folder, f"{work}/s{i+1:02d}.mp4", N, is_photo=is_photo)

print("\n=== OUTRO ===")
outro_n = int(5.0 * FPS)
outro_folder = render_seq("outro", render_packshot_outro, outro_n, total=5.0)
seq_to_video(outro_folder, f"{work}/s99_outro.mp4", outro_n)

print("\n=== FINAL CONCAT ===")
clips = (
    [f"{work}/s00_intro.mp4"] +
    [f"{work}/s{i+1:02d}.mp4" for i in range(len(SCENES))] +
    [f"{work}/s99_outro.mp4"]
)
durs = [4.0] + [DUR]*len(SCENES) + [5.0]
xd   = 0.8
n    = len(clips)

cum = 0
offsets = []
for i in range(n-1):
    cum += durs[i]
    offsets.append(round(cum - xd*(i+1), 3))

fc_parts = []
for i in range(n-1):
    a   = f"[xout{i}]" if i > 0 else f"[0:v]"
    out = f"[xout{i+1}]" if i < n-2 else "[vfinal]"
    fc_parts.append(f"{a}[{i+1}:v]xfade=transition=fade:duration={xd}:offset={offsets[i]}{out}")

inputs = " ".join([f'-i "{c}"' for c in clips])
fc     = ";".join(fc_parts)

run(f'ffmpeg -y {inputs} -filter_complex "{fc}" '
    f'-map "[vfinal]" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 17 '
    f'-movflags +faststart "{out_dir}/prisme_inde_v4.mp4"',
    "xfade concat")

r = subprocess.run(
    f'ffprobe -v quiet -show_entries format=duration,size -of default "{out_dir}/prisme_inde_v4.mp4"',
    shell=True, capture_output=True, text=True)
print("\n✓", r.stdout.strip())
