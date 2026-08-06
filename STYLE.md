# STYLE.md — Nimisham Visual Design System

> **This file is the authoritative visual design specification for Nimisham.**
>
> All components, pages, and future phases must follow the design tokens and principles documented here. Do not scatter ad-hoc colors, fonts, or spacing values throughout the codebase.

---

## 1. Design Philosophy

Nimisham's visual identity balances seven qualities:

| Quality         | Expression                                                       |
| --------------- | ---------------------------------------------------------------- |
| **Creative**    | Photography-inspired layouts, image-first compositions           |
| **Professional**| Clean hierarchy, restrained palette, typographic precision        |
| **Editorial**   | Magazine-quality typography, generous whitespace, grid discipline |
| **Modern**      | Contemporary UI patterns, dark-first interface, subtle depth     |
| **Interactive** | Purposeful micro-animations, responsive feedback on every action |
| **Human**       | Warm accent tones, organic imagery, approachable language         |
| **Technical**   | Metadata-style labels, monospaced details, precision indicators  |

### Visual Language Inspirations

The interface draws subtle inspiration from the world of photography and visual creation:

- **Metadata labels** — EXIF-style uppercase micro-labels for categories and metadata
- **Editorial typography** — Serif headlines paired with clean sans-serif body text
- **Image-first layouts** — Content designed around visual media, not text walls
- **Subtle framing** — Thin borders and aspect-ratio containers evoking film frames
- **Darkroom aesthetic** — Dark mode as the primary experience, letting images speak
- **Aperture warmth** — Warm amber accent color inspired by golden-hour photography

These inspirations should remain **subtle and sophisticated**, never gimmicky or literal.

---

## 2. Color System

### Design Tokens — Dark Theme (Default)

| Token              | Value          | Usage                                  |
| ------------------ | -------------- | -------------------------------------- |
| `--bg-primary`     | `#0A0A0B`      | Page background                        |
| `--bg-secondary`   | `#111113`      | Cards, panels                          |
| `--bg-elevated`    | `#1A1A1E`      | Elevated surfaces, modals, dropdowns   |
| `--bg-hover`       | `#222228`      | Hover state backgrounds                |
| `--text-primary`   | `#F5F5F4`      | Headings, primary content              |
| `--text-secondary` | `#A8A8A0`      | Body text, descriptions                |
| `--text-muted`     | `#6B6B63`      | Captions, metadata, placeholders       |
| `--border`         | `#2A2A2E`      | Borders, dividers                      |
| `--border-focus`   | `#D4A853`      | Focus rings, active borders            |
| `--accent`         | `#D4A853`      | Primary accent — warm amber/gold       |
| `--accent-hover`   | `#E0B964`      | Accent hover state                     |
| `--accent-muted`   | `rgba(212,168,83,0.12)` | Accent backgrounds            |
| `--success`        | `#4ADE80`      | Success states                         |
| `--warning`        | `#FBBF24`      | Warning states                         |
| `--error`          | `#F87171`      | Error states                           |
| `--info`           | `#60A5FA`      | Info states                            |

### Design Tokens — Light Theme

| Token              | Value          | Usage                                  |
| ------------------ | -------------- | -------------------------------------- |
| `--bg-primary`     | `#FAFAF8`      | Page background                        |
| `--bg-secondary`   | `#FFFFFF`      | Cards, panels                          |
| `--bg-elevated`    | `#F5F5F0`      | Elevated surfaces                      |
| `--bg-hover`       | `#EDEDEA`      | Hover state backgrounds                |
| `--text-primary`   | `#1A1A1E`      | Headings, primary content              |
| `--text-secondary` | `#4A4A45`      | Body text, descriptions                |
| `--text-muted`     | `#8A8A83`      | Captions, metadata, placeholders       |
| `--border`         | `#E0E0DB`      | Borders, dividers                      |
| `--border-focus`   | `#B8922E`      | Focus rings                            |
| `--accent`         | `#B8922E`      | Primary accent — deeper gold           |
| `--accent-hover`   | `#A07D20`      | Accent hover                           |
| `--accent-muted`   | `rgba(184,146,46,0.08)` | Accent backgrounds             |

### Color Rationale

- **Dark background** (`#0A0A0B`) — Near-black that makes photography pop without being pure `#000`
- **Warm accent** (`#D4A853`) — Golden amber inspired by golden-hour light; avoids generic blue/purple
- **Warm grays** — All neutrals carry a slight warm undertone (olive-gray rather than blue-gray)
- **Muted status colors** — Success/warning/error are pastel-toned to not compete with artwork

---

## 3. Typography System

### Font Stack

| Role           | Font                  | Weight         | Fallback                    |
| -------------- | --------------------- | -------------- | --------------------------- |
| **Display**    | Playfair Display      | 600, 700       | Georgia, serif              |
| **Primary**    | Inter                 | 400, 500, 600  | system-ui, sans-serif       |
| **Monospace**  | JetBrains Mono        | 400            | Consolas, monospace         |

### Type Scale

| Token     | Size    | Line Height | Weight | Font             | Usage                       |
| --------- | ------- | ----------- | ------ | ---------------- | --------------------------- |
| `h1`      | 2.5rem  | 1.2         | 700    | Playfair Display | Page titles                 |
| `h2`      | 1.875rem| 1.25        | 600    | Playfair Display | Section headings            |
| `h3`      | 1.375rem| 1.3         | 600    | Inter            | Card titles, subsections    |
| `h4`      | 1.125rem| 1.35        | 600    | Inter            | Small headings              |
| `body`    | 0.9375rem| 1.6        | 400    | Inter            | Body text                   |
| `small`   | 0.8125rem| 1.5        | 400    | Inter            | Secondary text              |
| `caption` | 0.75rem | 1.4         | 500    | Inter            | Captions, timestamps        |
| `label`   | 0.6875rem| 1.3        | 600    | Inter            | EXIF-style metadata labels  |
| `mono`    | 0.8125rem| 1.5        | 400    | JetBrains Mono   | Technical data, codes       |

### Typography Rules

- **Headings** use Playfair Display (serif) for editorial character
- **Body and UI** use Inter (sans-serif) for clarity and legibility
- **Metadata labels** are uppercase, letter-spaced, small — inspired by EXIF data overlays
- **No font size below 0.6875rem** for accessibility
- **Line height** is generous for readability

---

## 4. Spacing System

Based on a 4px base unit:

| Token  | Value  | Usage                                    |
| ------ | ------ | ---------------------------------------- |
| `xs`   | 4px    | Tight gaps (icon-to-text)                |
| `sm`   | 8px    | Inner padding, small gaps                |
| `md`   | 12px   | Input padding, compact spacing           |
| `base` | 16px   | Standard gaps, paragraph spacing         |
| `lg`   | 24px   | Section padding, card padding            |
| `xl`   | 32px   | Large section gaps                       |
| `2xl`  | 48px   | Page section separators                  |
| `3xl`  | 64px   | Major layout spacing                     |
| `4xl`  | 96px   | Hero sections, page margins              |

### Spacing Rules

- Use the spacing scale consistently — avoid arbitrary pixel values
- Card internal padding: `lg` (24px)
- Form field gaps: `base` (16px)
- Section separators: `2xl` (48px)
- Page edge padding: responsive — `base` on mobile → `xl` on desktop

---

## 5. Border Radius

| Token      | Value  | Usage                          |
| ---------- | ------ | ------------------------------ |
| `none`     | 0      | Sharp edges (rare)             |
| `sm`       | 4px    | Badges, tags                   |
| `md`       | 8px    | Buttons, inputs                |
| `lg`       | 12px   | Cards, panels                  |
| `xl`       | 16px   | Modals, large containers       |
| `full`     | 9999px | Avatars, pills                 |

### Radius Rules

- Buttons and inputs: `md` (8px)
- Cards: `lg` (12px)
- Avatars: `full` (circle)
- Don't over-round — images should typically have `sm` to `md` radius, not `xl`

---

## 6. Shadows & Depth

| Token     | Value                                              | Usage                        |
| --------- | -------------------------------------------------- | ---------------------------- |
| `sm`      | `0 1px 2px rgba(0,0,0,0.3)`                       | Subtle lift (buttons)        |
| `md`      | `0 4px 12px rgba(0,0,0,0.25)`                     | Cards, dropdowns             |
| `lg`      | `0 8px 24px rgba(0,0,0,0.3)`                      | Modals, elevated panels      |
| `xl`      | `0 16px 48px rgba(0,0,0,0.35)`                    | Overlays, major dialogs      |
| `glow`    | `0 0 20px rgba(212,168,83,0.15)`                   | Accent glow (sparingly)      |

### Depth Rules

- In dark theme, shadows are subtle — rely on background color changes for elevation
- In light theme, shadows are the primary depth indicator
- **Never** use shadow + glow + border simultaneously — pick one
- Max 3 elevation levels on any single screen

---

## 7. Motion System

### Animation Principles

1. **Duration**: Keep animations under 300ms for UI responses; 400–500ms for page transitions
2. **Easing**: Use `[0.25, 0.1, 0.25, 1]` (ease-out) for entrances, `[0.4, 0, 0.2, 1]` for exits
3. **Reduce motion**: Respect `prefers-reduced-motion` — disable decorative animations
4. **Purpose**: Every animation must serve hierarchy, feedback, state, or continuity

### Animation Tokens

| Category          | Duration | Easing          | Usage                            |
| ----------------- | -------- | --------------- | -------------------------------- |
| **Micro**         | 150ms    | ease-out        | Button press, checkbox, toggle   |
| **Feedback**      | 200ms    | ease-out        | Hover effects, focus rings       |
| **Enter**         | 250ms    | ease-out        | Dropdown open, tooltip appear    |
| **Exit**          | 200ms    | ease-in         | Dropdown close, tooltip dismiss  |
| **Page**          | 400ms    | ease-in-out     | Page transitions                 |
| **Modal**         | 300ms    | spring(0.5)     | Modal enter/exit                 |
| **Loading**       | 1000ms+  | linear          | Skeleton shimmer, spinners       |
| **Success/Error** | 300ms    | spring(0.6)     | Toast entrance, status change    |

### Framer Motion Defaults

```jsx
// Standard entrance
{ opacity: 0, y: 12 } → { opacity: 1, y: 0 }
transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }

// Modal entrance
{ opacity: 0, scale: 0.96 } → { opacity: 1, scale: 1 }
transition: { type: "spring", damping: 25, stiffness: 300 }

// Page transition
{ opacity: 0, y: 8 } → { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
```

---

## 8. Interaction States

Every interactive element must express these states:

| State        | Visual Treatment                                              |
| ------------ | ------------------------------------------------------------- |
| **Default**  | Standard appearance                                           |
| **Hover**    | Subtle background shift or accent underline; cursor: pointer  |
| **Focus**    | `2px` accent ring offset by `2px`; never remove outline       |
| **Active**   | Slight scale-down (0.98) or darker background                 |
| **Disabled** | 40% opacity, cursor: not-allowed, no hover effects            |
| **Loading**  | Spinner replaces label or overlay with reduced opacity         |
| **Error**    | Red border + error message below; shake animation (once)       |
| **Success**  | Green border or checkmark; brief pulse                         |

### Focus Visibility

- Use `:focus-visible` (not `:focus`) to avoid showing focus rings on mouse click
- Focus ring: `0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent)`

---

## 9. Component Patterns

### Buttons

| Variant     | Background         | Text             | Border              |
| ----------- | ------------------ | ---------------- | -------------------- |
| `primary`   | `--accent`         | `#0A0A0B`        | none                 |
| `secondary` | `--bg-elevated`    | `--text-primary`  | `--border`           |
| `ghost`     | transparent        | `--text-secondary`| none                 |
| `danger`    | `--error` at 12%   | `--error`         | none                 |
| `outline`   | transparent        | `--accent`        | `--accent`           |

Sizes: `sm` (32px height), `md` (40px), `lg` (48px)

### Inputs

- Height: 44px (touch-friendly)
- Background: `--bg-elevated`
- Border: `1px solid var(--border)`
- Focus: border changes to `--accent`, glow ring
- Error: border changes to `--error`
- Label: above input, `label` type style, uppercase

### Cards

- Background: `--bg-secondary`
- Border: `1px solid var(--border)`
- Padding: `lg` (24px)
- Radius: `lg` (12px)
- Hover: subtle border color lightening or shadow lift

---

## 10. Responsive Breakpoints

| Name    | Min Width | Typical Device      |
| ------- | --------- | ------------------- |
| `sm`    | 640px     | Large phone          |
| `md`    | 768px     | Tablet               |
| `lg`    | 1024px    | Laptop               |
| `xl`    | 1280px    | Desktop              |
| `2xl`   | 1536px    | Large desktop        |

### Responsive Rules

- **Mobile-first**: Base styles target mobile, then scale up
- **Navigation**: Full horizontal nav on `lg+`; hamburger + slide-out below `lg`
- **Grid**: 1 column on mobile → 2 on `md` → 3–4 on `lg+`
- **Typography**: H1 scales down 20% on mobile
- **Touch targets**: Minimum 44px on mobile

---

## 11. Accessibility

| Requirement            | Standard                                          |
| ---------------------- | ------------------------------------------------- |
| Color contrast         | WCAG AA minimum (4.5:1 text, 3:1 large/UI)       |
| Focus indicators       | Visible on all interactive elements               |
| Keyboard navigation    | Full tab order, Enter/Space activation             |
| Screen reader          | Semantic HTML, ARIA labels where needed            |
| Reduced motion         | `prefers-reduced-motion` disables decorative anim |
| Form errors            | Associated with inputs via `aria-describedby`      |
| Images                 | Alt text on all meaningful images                  |
