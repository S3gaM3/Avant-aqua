# UI Audit and Redesign Matrix

## Current Structure

- App shell: `src/app/layout.tsx` composes providers plus persistent `Header` and `Footer`.
- Existing primitives: `src/components/ui/Button.tsx`, `src/components/ui/Container.tsx`.
- Global style layer: `src/app/globals.css` with base brand tokens and shadows.

## High-Impact Refactor Targets

- Layout: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`.
- Marketing pages: `src/app/page.tsx`, `src/app/services/page.tsx`, `src/app/gallery/page.tsx`, `src/app/contacts/page.tsx`.
- Content pages: `src/app/news/page.tsx`, `src/app/news/[slug]/page.tsx`, `src/app/offer/page.tsx`, `src/app/privacy/page.tsx`.
- Commerce pages: `src/app/catalog/page.tsx`, `src/app/catalog/category/[slug]/page.tsx`, `src/app/catalog/product/[slug]/page.tsx`, `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/app/account/page.tsx`, `src/app/wishlist/page.tsx`, `src/app/compare/page.tsx`.

## Repeated Patterns To Systematize

- Breadcrumb headers on most inner pages.
- Bordered cards with similar spacing and shadows.
- Repeated CTA blocks and form fields.
- Placeholder media blocks with `.allpools-placeholder`.
- Inconsistent hardcoded colors in page-level classes.

## Design System Replacement Plan

1. Expand tokens in `globals.css` with semantic roles (surface layers, text hierarchy, spacing, radii, motion, focus ring).
2. Replace ad-hoc utility strings with reusable primitives:
   - `Button`, `Container`, `Input`, `Card`, `Section`, `PageHero`, `StatGrid`, `FeatureGrid`, `CtaPanel`.
3. Rebuild header/footer with minimalist structure.
4. Refactor all page routes onto shared section components.
5. Document primitives and usage in Storybook and markdown docs.
