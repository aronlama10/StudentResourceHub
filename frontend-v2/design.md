# Student Resource Hub - Design Tokens

This file documents the core design tokens used across the UI. Keep these values consistent when adding new styles.

## Fonts

- Heading: "Space Grotesk", sans-serif
- Body: "Inter", sans-serif

## Colors

### Backgrounds

- Primary background: #0a0e1a
- Secondary background: #111827
- Card background: rgba(17, 24, 39, 0.6)
- Card hover background: rgba(30, 41, 59, 0.7)
- Glass background: rgba(255, 255, 255, 0.04)
- Glass border: rgba(255, 255, 255, 0.08)

### Text

- Primary text: #f1f5f9
- Secondary text: #94a3b8
- Muted text: #64748b

### Accents

- Accent primary: #6366f1
- Accent secondary: #06b6d4
- Accent tertiary: #8b5cf6
- Success accent: #22c55e
- Heart accent: #f43f5e

### Borders

- Subtle border: rgba(255, 255, 255, 0.06)
- Card border: rgba(255, 255, 255, 0.08)
- Accent border: rgba(99, 102, 241, 0.3)

### Shadows

- Shadow sm: 0 1px 3px rgba(0, 0, 0, 0.3)
- Shadow md: 0 4px 16px rgba(0, 0, 0, 0.4)
- Shadow lg: 0 8px 32px rgba(0, 0, 0, 0.5)
- Shadow glow: 0 0 40px rgba(99, 102, 241, 0.15)
- Shadow glow hover: 0 0 60px rgba(99, 102, 241, 0.25)

## Gradients

- Accent: linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #8b5cf6 100%)
- Accent hover: linear-gradient(135deg, #818cf8 0%, #22d3ee 50%, #a78bfa 100%)
- Hero: linear-gradient(160deg, #0a0e1a 0%, #1e1b4b 40%, #0f172a 70%, #0a0e1a 100%)
- Section alt: linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)
- CTA: linear-gradient(135deg, #4f46e5, #7c3aed, #06b6d4)

## Notes

- Source of truth for tokens lives in src/index.css under :root.
- When adding new sections, reuse the tokens above instead of introducing new values.
