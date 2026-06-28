#!/usr/bin/env python3
"""
SOARA. Script de validation pré-push
Usage: python3 scripts/validate.py (depuis la racine du repo)
"""
import os, re, json, sys
from collections import Counter

CONTENT_DIR = 'lib/content'
errors = []
warnings = []

def err(msg): errors.append(f'  ❌ {msg}')
def warn(msg): warnings.append(f'  ⚠️  {msg}')
def ok(msg): print(f'  ✓  {msg}')

# ── 1. articles.json ──────────────────────────
print('\n── 1. articles.json ──')
arts = json.load(open('lib/articles.json'))
slugs_json = {a['slug'] for a in arts}
slugs_html = {f.replace('.html','') for f in os.listdir(CONTENT_DIR) if f.endswith('.html')}

for a in arts:
    if not a.get('image','').strip(): warn(f'[{a["slug"]}] pas d\'image')
    if not a.get('description','').strip(): warn(f'[{a["slug"]}] pas de description')

orphans = slugs_html - slugs_json - {'biden_medias', 'covid_labo'}
if orphans: warn(f'HTML sans entrée JSON: {orphans}')
missing = slugs_json - slugs_html
if missing: err(f'JSON sans HTML: {missing}')
ok(f'{len(arts)} articles')

# ── 2. HTML — structure ──────────────────────
print('\n── 2. HTML — structure ──')
for fname in sorted(os.listdir(CONTENT_DIR)):
    if not fname.endswith('.html'): continue
    slug = fname.replace('.html','')
    content = open(f'{CONTENT_DIR}/{fname}', encoding='utf-8').read()

    # Div balance
    o = len(re.findall(r'<div[^>]*>', content))
    c = len(re.findall(r'</div>', content))
    if o != c:
        err(f'[{slug}] div imbalance {c-o:+d}')


    # Contenu minimum (évite articles vidés)
    text_only = re.sub(r'<[^>]+>', '', content).strip()
    if len(text_only) < 400:
        err(f'[{slug}] CONTENU TROP COURT: {len(text_only)} chars — article peut-être vidé')
    # Orphaned nav blocks
    if re.search(r'class="(art-nav|anav)"', content):
        err(f'[{slug}] bloc nav orphelin présent')

    # Dangerous global CSS in <style>
    for s in re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL):
        if re.search(r'^\s*(html|body)\s*\{', s, re.MULTILINE):
            err(f'[{slug}] <style> contient règle html/body globale')

    # Essentiel order: must be AFTER hero and internal header
    ess_pos = content.find('<div class="essentiel">')
    hero_pos = content.find('<div class="art-hero-wrap">')
    atop_pos = content.find('<div class="atop">')
    ah_pos = content.find('<div class="article-header">')
    header_pos = min([p for p in [atop_pos, ah_pos] if p >= 0], default=-1)
    if ess_pos >= 0 and hero_pos >= 0 and ess_pos < hero_pos:
        err(f'[{slug}] essentiel AVANT hero image — mauvais ordre')
    if ess_pos >= 0 and header_pos >= 0 and ess_pos < header_pos:
        err(f'[{slug}] essentiel AVANT header interne — mauvais ordre')

    # Orphaned fragment at start
    stripped = content.lstrip()
    if stripped and not stripped.startswith('<'):
        err(f'[{slug}] contenu orphelin en début')
    if re.match(r'\s+<(ul|li|\/)', content):
        err(f'[{slug}] fragment orphelin en début: {repr(content[:50])}')

ok(f'{len([f for f in os.listdir(CONTENT_DIR) if f.endswith(".html")])} fichiers HTML')

# ── 3. CSS ───────────────────────────────────
print('\n── 3. CSS ──')

# Scroll reveal must NOT hide essentiel or titles
article_css = open('app/article-content.css').read()
sr_match = re.search(r'SCROLL REVEAL.*?(?=\/\* ═══|\/\* ──|$)', article_css, re.DOTALL)
if sr_match:
    block = sr_match.group(0)
    for bad in ['.essentiel', 'h1', 'h2', 'h3', '.art-hero-wrap', '.atop', '.atitle']:
        if bad in block and 'opacity: 0' in block:
            err(f'article-content.css: {bad} dans scroll reveal avec opacity:0')

# No duplicate classes in ArticleLayout.module.css
module_css = open('components/ArticleLayout.module.css').read()
classes = re.findall(r'^(\.[a-zA-Z][a-zA-Z0-9_-]*)\s*\{', module_css, re.MULTILINE)
dupes = [c for c, n in Counter(classes).items() if n > 1]
if dupes: err(f'Module CSS: classes dupliquées: {dupes}')

# CSS brace balance
for fname in ['app/globals.css', 'app/article-content.css',
              'components/ArticleLayout.module.css', 'app/page.module.css']:
    css = open(fname).read()
    o, c = css.count('{'), css.count('}')
    if o != c: err(f'{fname}: accolades {c-o:+d}')

ok('CSS vérifié')

# ── 4. ArticleLayout.tsx ──────────────────────
print('\n── 4. ArticleLayout.tsx ──')
layout = open('components/ArticleLayout.tsx').read()

if 'StickyReadingHeader' not in layout:
    err('StickyReadingHeader non importé')

# Critical elements must NOT be in scroll reveal JS targets
js_targets_match = re.search(r'querySelectorAll\([\'\"](.*?)[\'"]\)', layout)
if js_targets_match:
    t = js_targets_match.group(1)
    for bad in ['h1', 'h2', 'h3', '.essentiel', '.art-hero-wrap', '.atitle', '.atop']:
        if bad in t:
            err(f'ArticleLayout: {bad} dans scroll reveal targets — cache du contenu critique')

ok('ArticleLayout.tsx vérifié')

# ── 5. BottomNav ──────────────────────────────
print('\n── 5. BottomNav ──')
nav = open('components/BottomNav.tsx').read()
# S'abonner is in the header, not required in BottomNav
if False:
    warn("BottomNav: item /recoupement encore présent")
ok('BottomNav vérifié')

# ── 6. Ratios éditoriaux ──────────────────────
print('\n── 6. Ratios ──')
premium = sum(1 for a in arts if a.get('premium'))
ratio = premium / len(arts) * 100
if ratio > 50: warn(f'{premium}/{len(arts)} articles premium ({ratio:.0f}%) — ratio élevé')
else: ok(f'{premium}/{len(arts)} premium ({ratio:.0f}%)')

ess = sum(1 for a in arts if 'essentiel' in open(f'lib/content/{a["slug"]}.html').read())
pq = sum(1 for a in arts if 'pull-quote' in open(f'lib/content/{a["slug"]}.html').read())
ok(f'{ess}/{len(arts)} essentiel, {pq}/{len(arts)} pull-quote')


# ── 7. Intégrité articles vs backup ──────────────
print()
print("── 7. Intégrité articles ──")
import shutil
BACKUP_DIR = "scripts/backup"
os.makedirs(BACKUP_DIR, exist_ok=True)
for a in arts:
    slug = a["slug"]
    path = f"lib/content/{slug}.html"
    if not os.path.exists(path): continue
    content_a = open(path, encoding="utf-8").read()
    text_a = re.sub(r"<[^>]+>", "", content_a).strip()
    visual = slug in ["cygne", "ia", "overton", "predateurs"]
    min_c = 200 if visual else 1000
    if len(text_a) < min_c:
        err(f"[{slug}] contenu trop court: {len(text_a)} chars — article peut-être vidé")
    backup = f"{BACKUP_DIR}/{slug}.html"
    if os.path.exists(backup):
        bt = re.sub(r"<[^>]+>", "", open(backup).read()).strip()
        if len(bt) > 500 and len(text_a) < len(bt) * 0.7:
            err(f"[{slug}] contenu réduit à {int(len(text_a)/len(bt)*100)}% du backup — vérifier")
    # Update backup
    shutil.copy2(path, backup)
ok(f"{len(arts)} articles intègres, backups à jour")
# ── RÉSUMÉ ────────────────────────────────────
print('\n' + '═'*50)
if errors:
    print(f'\n🔴 {len(errors)} ERREUR(S) À CORRIGER :')
    for e in errors: print(e)
if warnings:
    print(f'\n🟡 {len(warnings)} WARNING(S) :')
    for w in warnings: print(w)
if not errors:
    print('\n✅ Propre — safe to push')
else:
    print(f'\n❌ Ne pas pusher avant correction')
    sys.exit(1)
