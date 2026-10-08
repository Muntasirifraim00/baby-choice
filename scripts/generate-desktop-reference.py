"""Freeze reference units for desktop; run after editing mobile reference styles."""
from pathlib import Path
import re
source = Path('src/styles.css').read_text()
source = re.sub(r'/\*.*?\*/', '', source, flags=re.S)
allowed = ('.lv', '.sr', '.co-', '.ac', '.of-', '.offers-', '.search-', '.suggestion-', '.clothing-', '.shop-', '.brand-', '.filter-', '.bc-', '.pd-', '.live-', '.rating', '.stars', '.discount', '.wishlist-')
rules = []
for match in re.finditer(r'([^{}]+)\{([^{}]*)\}', source):
    selectors, body = match.groups()
    selectors = selectors.strip()
    if '@' in selectors or not selectors.startswith(allowed):
        continue
    parts = [s.strip() for s in selectors.split(',') if s.strip().startswith(allowed)]
    if not parts:
        continue
    body = re.sub(r'(-?\d*\.?\d+)cqw', lambda m: f'{float(m[1])*5:g}px', body)
    body = re.sub(r'--(?:su|u|lv)\s*:[^;]+;?', '', body)
    rules.append(','.join('.desktop-page '+s for s in parts)+'{'+body+'}')
Path('src/styles/desktop-reference.css').write_text('/* Generated fixed desktop reference units; mobile source remains unchanged. */\n@media (min-width:1024px){\n'+'\n'.join(rules)+'\n}\n')
