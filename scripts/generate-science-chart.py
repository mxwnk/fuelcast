"""
Generate SVG diagram: Glucose/Fructose absorption via dual transport model.

Shows:
- Glucose-only oxidation rate (saturating at ~60 g/h)
- Glucose + Fructose combined oxidation (reaching ~90 g/h)
- The dual transport advantage zone

Output: public/science-absorption.svg
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

# -- Data: intake rate vs. exogenous oxidation rate --
# Based on Jeukendrup (2010), Smith et al. (2013), Jentjens et al. (2004)

intake = np.array([0, 20, 40, 60, 80, 100, 120])

# Glucose only: saturates at ~60 g/h due to SGLT1 limit
glucose_only = np.array([0, 18, 38, 55, 58, 60, 60])

# Glucose + Fructose (2:1): recruits GLUT5, reaches ~90+ g/h
dual_transport = np.array([0, 18, 40, 62, 80, 90, 96])

# -- Styling --
BG_COLOR = '#0f1117'
SURFACE_COLOR = '#1a1d27'
TEXT_COLOR = '#c8cad0'
MUTED_COLOR = '#6b7085'
GLUCOSE_COLOR = '#38bdf8'   # sky blue
FRUCTOSE_COLOR = '#a78bfa'  # purple
ACCENT_COLOR = '#f59e0b'    # amber
GRID_COLOR = '#2a2d3a'

fig, ax = plt.subplots(1, 1, figsize=(8, 5))
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor(SURFACE_COLOR)

# Fill the dual transport advantage zone
ax.fill_between(intake, glucose_only, dual_transport,
                alpha=0.15, color=FRUCTOSE_COLOR,
                label='Fructose contribution (GLUT5)')

# Plot lines
ax.plot(intake, glucose_only, color=GLUCOSE_COLOR, linewidth=2.5,
        marker='o', markersize=5, label='Glucose only (SGLT1)')
ax.plot(intake, dual_transport, color=FRUCTOSE_COLOR, linewidth=2.5,
        marker='s', markersize=5, label='Glucose + Fructose (SGLT1 + GLUT5)')

# SGLT1 saturation line
ax.axhline(y=60, color=ACCENT_COLOR, linestyle='--', linewidth=1.5, alpha=0.7)
ax.text(122, 60, 'SGLT1 limit\n(~60 g/h)', fontsize=8.5, color=ACCENT_COLOR,
        va='center', ha='left', fontweight='bold')

# Annotations
ax.annotate('+75%\noxidation', xy=(100, 90), xytext=(105, 78),
            fontsize=9, fontweight='bold', color=FRUCTOSE_COLOR,
            ha='center', va='top',
            arrowprops=dict(arrowstyle='->', color=FRUCTOSE_COLOR, lw=1.5))

# Axes styling
ax.set_xlabel('Carbohydrate intake (g/h)', fontsize=11, color=TEXT_COLOR,
              labelpad=10)
ax.set_ylabel('Exogenous oxidation rate (g/h)', fontsize=11, color=TEXT_COLOR,
              labelpad=10)
ax.set_xlim(0, 130)
ax.set_ylim(0, 110)
ax.set_xticks([0, 20, 40, 60, 80, 100, 120])
ax.set_yticks([0, 20, 40, 60, 80, 100])

# Grid
ax.grid(True, alpha=0.3, color=GRID_COLOR, linewidth=0.5)
ax.tick_params(colors=MUTED_COLOR, labelsize=9)

# Spine styling
for spine in ax.spines.values():
    spine.set_color(GRID_COLOR)
    spine.set_linewidth(0.5)

# Legend
legend = ax.legend(loc='upper left', fontsize=9, framealpha=0.8,
                   facecolor=SURFACE_COLOR, edgecolor=GRID_COLOR)
for text in legend.get_texts():
    text.set_color(TEXT_COLOR)

plt.tight_layout(pad=1.5)

# Save as SVG
output_path = Path(__file__).parent.parent / 'public' / 'science-absorption.svg'
fig.savefig(output_path, format='svg', facecolor=BG_COLOR,
            bbox_inches='tight', dpi=96)
plt.close()

print(f'Generated: {output_path}')
