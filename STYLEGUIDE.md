# Styleguide

This project keeps design decisions in CSS custom properties first. Use `src/app/globals.css` for shared tokens and page-level CSS modules for composition.

## Files

- `src/app/globals.css`: color, spacing, typography, radius, motion, focus tokens.
- `src/app/page.module.css`: homepage composition primitives.
- `DESIGN.md`: product/design rules for the blog system.

## Token Usage

Use semantic tokens in components:

```css
color: var(--color-text-muted);
background: var(--color-surface-hover);
margin-top: var(--space-section);
border-radius: var(--radius-md);
transition: background-color var(--duration-fast) var(--ease-quiet);
```

Avoid raw color values in component CSS unless introducing a new token. If a raw value appears more than once, promote it to `globals.css`.

## Layout Rules

- Use `var(--layout-content)` for index/list pages.
- Use `var(--layout-measure)` for prose blocks.
- Keep page gutters at `var(--space-page-x)`.
- Keep index sections separated with `var(--space-section)`.
- Prefer one unframed column before adding grids.

## Typography Rules

- Body, section labels, and list titles all start at `var(--font-size-body)`.
- Use `var(--font-weight-medium)` sparingly for identity, section labels, and inline emphasis.
- Do not use negative letter spacing.
- Do not scale font size with viewport width.

## Interaction Rules

- Links should look calm by default.
- Repeated list links can use a hover background on desktop.
- Mobile list links should rely on spacing, not hover-only affordances.
- Focus states must use `var(--shadow-focus)`.

## Component Pattern

```tsx
<section className={styles.section} aria-labelledby="writing-title">
  <h2 className={styles.sectionTitle} id="writing-title">
    글
  </h2>
  <div className={styles.itemList}>
    <Link className={styles.listItem} href="/writing/example">
      <span className={styles.itemTitle}>Title</span>
      <span className={styles.itemDescription}>Description</span>
    </Link>
  </div>
</section>
```
