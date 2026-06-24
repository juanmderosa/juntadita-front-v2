---
name: Vibrant Pulse
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  sidebar-width: 260px
  gutter: 24px
---

## Brand & Style

The design system is built to evoke a sense of organized joy and seamless collaboration. Targeting social organizers and event attendees, the aesthetic balances professional utility with a warm, approachable personality. 

The style is **Modern Corporate with a Soft Edge**, leaning heavily into high-quality whitespace and intentional "breathing room" to reduce cognitive load during complex planning tasks. It utilizes a refined mix of **Minimalism** for structure and **Soft Glassmorphism** for interactive overlays, ensuring the UI feels premium yet accessible. The emotional goal is to move the user from the stress of logistics to the excitement of the event itself.

## Colors

This design system utilizes a "Vibrant Soft" palette. The **Indigo Primary** (#4F46E5) serves as the main driver for action and brand recognition. The **Teal Secondary** (#0D9488) is reserved for success states, confirmed attendance, and "voted" indicators, providing a calming counterpoint to the primary blue. 

The **Amber Tertiary** (#F59E0B) is used sparingly for pending actions, alerts, or "not yet decided" statuses. The foundation of the UI sits on a crisp white (#FFFFFF) or very soft gray (#F9FAFB) background to maintain a high-end, clean look. Text follows a strict hierarchy of deep charcoal for readability and medium grays for meta-information.

## Typography

The typography system relies exclusively on **Inter** for its exceptional legibility and neutral, modern tone. 

- **Headlines:** Use tighter letter-spacing and bold weights to create a strong visual anchor for event titles and section headers.
- **Body:** Standardized at 16px for optimal readability across all devices.
- **Labels:** Used for navigation items, tags, and "voted" counts, often employing slightly heavier weights (600) at smaller sizes to ensure they don't get lost in the layout.

## Layout & Spacing

This design system follows an **8px grid system** for consistent vertical and horizontal rhythm. 

- **Desktop:** Features a fixed-width **Minimalist Sidebar** (260px) on the left. The main content area uses a fluid grid with a maximum container width of 1280px. Content is centered with generous 40px margins on ultra-wide screens.
- **Mobile:** Transition to a 4-column fluid layout with 16px side margins. Navigation shifts to a **Bottom Bar** for reachability, featuring a floating center action button for "Create."
- **Rhythm:** Use `lg` (24px) spacing between cards and `md` (16px) for internal card padding to maintain the "airy" feel.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Ambient Shadows**. 

The background is typically `#F9FAFB`. Interactive cards sit on a pure white background with a very soft, diffused shadow (`0px 4px 20px rgba(0, 0, 0, 0.05)`). This makes them appear to float slightly above the surface without feeling heavy. 

Hover states on cards or buttons should increase this shadow slightly to provide tactile feedback. Modals and popovers use a backdrop blur (Glassmorphism) of 12px to keep the user oriented within the event context while focusing on the specific task at hand.

## Shapes

The shape language is defined by **pronounced, friendly roundedness**. 

All standard containers and cards use a **16px (rounded-xl)** corner radius. Smaller elements like buttons and input fields use an **8px (rounded-md)** radius. Avatars should always be perfectly circular to contrast with the rectangular card shapes. This high level of roundedness reinforces the "Amigable" (friendly) aspect of the brand personality.

## Components

- **Buttons:** Primary buttons are Indigo with white text. Secondary buttons use a light Indigo tint background (#EEF2FF) with Indigo text. All have 8px rounded corners.
- **Cards (Events):** White background, 16px radius, subtle border (#F3F4F6). Headlines at the top, followed by a metadata row (date/location) using `label-sm`.
- **Voting Elements:** 
    - **Progress Bars:** Use a thick 8px height with a rounded track. The filled portion uses Teal (#0D9488).
    - **Selected State:** A 2px Indigo border surrounding the entire voting card or option.
- **Expense Lists:** Clean rows with 12px padding. Avatars (32px) on the left, name and description stacked, and amount in `label-md` on the far right.
- **Receipt Upload:** A dashed border container (#D1D5DB) with a centered icon and "Upload Receipt" label in `text-muted`.
- **Sidebar (Desktop):** Icons use a 24px bounding box. Active states feature a vertical 4px "pill" indicator on the left edge and an Indigo tint for the icon.
- **Bottom Bar (Mobile):** 64px height, pure white background with a top stroke border. Icons are spaced evenly, with the "Create" button optionally styled as a primary action circle in the center.


## CAPTURAS PARA LA APP

![alt text](dashboard_mis_eventos.png) ![alt text](dashboard_mis_eventos_mobile.png) ![alt text](detalle_del_evento_votacion_mobile.png) ![alt text](detalle_evento_votación.png) ![alt text](gestion_gastos.png) ![alt text](gestion_gastos_mobile.png) ![alt text](grupos_y_contactos.png) ![alt text](grupos_y_contactos_mobile.png)