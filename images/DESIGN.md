# Design System Document: The Grand Venue

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Concierge"
This design system moves away from the "booking engine" aesthetic and toward a "high-end editorial" experience. Our goal is to replicate the feeling of walking into a five-star lobby: expansive, quiet, and meticulously curated. We lean into **Soft Minimalism**—a philosophy that prioritizes breathing room over density and tonal depth over structural lines.

To break the "template" look, we utilize **Intentional Asymmetry**. Layouts should not always be centered or perfectly balanced; use large typography offsets and overlapping elements (e.g., an image overlapping a container edge) to create a sense of bespoke architectural design. The interface should feel like a premium physical brochure translated into a liquid digital space.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a "High-Contrast Luxury" approach, utilizing deep navies for authority and warm ivories for approachability.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning or containment. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` (#fef9f1) to `surface-container-low` (#f8f3eb).
2.  **Tonal Transitions:** Using subtle variations in the ivory scale to define "zones" without drawing lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine-paper layers. 
*   **Base:** `surface` (#fef9f1) for the main canvas.
*   **Elevated Content:** Use `surface-container-lowest` (#ffffff) for cards to create a subtle "pop" against the ivory background.
*   **Deep Interaction:** Use `primary-container` (#0f1f3d) for high-impact callouts to ground the user’s eye.

### Signature Textures & Glass
To achieve the "Stripe-inspired" polish, use **Glassmorphism** for floating navigation and overlays. 
*   **The Glass Effect:** Apply `surface` at 80% opacity with a `24px` backdrop blur. 
*   **The Gradient Soul:** For primary CTAs, use a subtle linear gradient from `primary` (#00071b) to `primary-container` (#0f1f3d) at a 135-degree angle. This prevents the "flatness" of standard buttons.

---

## 3. Typography: The Swiss Editorial Scale

We pair **Manrope** (Display) with **Inter** (Utility) to create an authoritative yet modern hierarchy.

*   **Display (Manrope):** Used for headlines and hero statements. The scale is aggressive (`display-lg` at 3.5rem) to ensure the "Swiss" influence is felt immediately. Use tight letter-spacing (-0.02em) for large headings.
*   **Body (Inter):** Used for all long-form content and UI labels. Inter’s tall x-height ensures readability even at `body-sm`.
*   **Intentional Whitespace:** Typography must never feel "crowded." For every line of text, ensure at least 1.5x the font size in line-height, and use the "Generous Gap" principle—doubling the standard padding between headers and body copy.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional drop shadows.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` section. The change in hex code provides enough contrast for the eye to perceive a vertical lift.
*   **Ambient Shadows:** For floating elements (like the "Book Now" widget), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(15, 31, 61, 0.06);`. The shadow color must be a tint of our Navy (`primary-container`), never pure black.
*   **The "Ghost Border" Fallback:** If a container lacks sufficient contrast against its background, use a "Ghost Border": `outline-variant` (#c5c6ce) at **15% opacity**. This creates a suggestion of a boundary without the "boxed-in" feeling.

---

## 5. Components

### Navigation (Sticky Transparent)
*   **Behavior:** Initially transparent with `on_background` text. Upon scroll, it transitions to a Glassmorphic `surface` background with a subtle `outline-variant` (10% opacity) bottom stroke.
*   **Layout:** Wide-spread links with `label-md` uppercase typography and 2px letter spacing.

### Buttons (The Signature CTA)
*   **Primary:** Gradient fill (`primary` to `primary-container`), `DEFAULT` (0.25rem) rounded corners, `on_primary` text.
*   **Secondary/Champagne:** Fill with `secondary_fixed_dim` (#e6c364) and `on_secondary_fixed` text.
*   **Interaction:** On hover, apply a subtle scale-up (1.02) and increase shadow diffusion.

### Input Fields (Luxury Forms)
*   **Styling:** Background of `surface_container_lowest`, rounded at `lg` (0.5rem). 
*   **Focus State:** Change background to `surface_container_highest` and add a `primary` (20% opacity) outer glow. Forbid the "standard" blue focus ring.

### Floating Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Spacing:** Use a consistent 32px or 48px vertical gap to separate items in a list.
*   **Cards:** Use `surface_container_lowest` with `xl` (0.75rem) corner radius. Use "Ambient Shadows" as defined in Section 4.

### Additional Component: The "Experience" Carousel
*   Instead of standard arrows, use large `display-sm` text links ("Next" / "Back") with a `secondary` (Gold) underline that grows on hover.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Padding:** Try 120px padding on the left and 80px on the right for hero sections to create a custom, editorial feel.
*   **Embrace "Empty" Space:** If a section feels "empty," it is likely finished. Do not fill space with decorative icons or unnecessary dividers.
*   **Use Subtle Animation:** All transitions (hover, page load) should be slow and ease-in-out (e.g., 400ms).

### Don't:
*   **Don't use pure black:** Use `primary` (#00071b) for the darkest elements.
*   **Don't use standard "Apple" Grays:** Use our `surface-container` tiers (ivory/sand tints) to maintain the "Warm Luxury" brand identity.
*   **Don't center everything:** While standard UI is centered, high-end design often utilizes left-aligned headers with right-aligned body copy to create a "Z-pattern" visual interest.