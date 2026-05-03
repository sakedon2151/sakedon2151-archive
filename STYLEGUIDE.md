# Styleguide

이 문서는 코드베이스의 일관성을 유지하기 위한 작성 규칙이다. 아키텍처 결정은 `ARCHITECTURE.md`, 시각 언어는 `DESIGN.md`, 작업 순서는 `WORKFLOW.md`를 따른다.

## Language And Formatting

- TypeScript를 기본 언어로 사용한다.
- `strict` 타입 환경을 전제로 작성한다.
- 포맷과 린트는 Biome 설정을 따른다.
- 들여쓰기는 2 spaces다.
- import 정렬은 Biome assist에 맡긴다.
- 파일과 코드 주석은 필요한 경우에만 작성한다. 코드가 이미 명확하면 주석을 추가하지 않는다.

## Naming

- React components: `PascalCase`
- Hooks: `useThing`
- Utilities: `camelCase`
- Types and interfaces: `PascalCase`
- CSS module classes: `camelCase`
- Content slugs: lowercase kebab-case
- Route segments: lowercase kebab-case, dynamic route는 `[slug]`

Avoid vague names like `data`, `item`, `helper` when the domain has a clear noun.

## Imports

- Use the `@/*` alias for imports from `src`.
- Prefer direct imports over barrel imports, especially for components and utilities.
- Do not import from `node_modules/next/dist/*` in app code. Those docs are reference material only.
- Keep server-only utilities out of Client Components.

## Next.js And React

- Pages and layouts are Server Components by default.
- Add `'use client'` only to the smallest interactive leaf.
- Client Components must not be async.
- Props passed from Server Components to Client Components must be serializable.
- For dynamic routes, type `params` and `searchParams` as promises according to Next.js 15+ rules.

```tsx
export default async function Page(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  return <article>{slug}</article>;
}
```

- Use `generateMetadata` in Server Components for content-specific SEO.
- Avoid internal API routes for data used by pages. Fetch or read directly on the server.
- Use `Promise.all` for independent async work.
- Use Suspense only when streaming or user-perceived loading states improve the page.

## Components

Component design follows `building-components` principles.

- Start with semantic HTML.
- Every interactive element must be keyboard accessible.
- Use ARIA only when native HTML does not express the behavior.
- Prefer composition over large variant props.
- Export custom prop types.
- Extend native HTML attributes when wrapping a native element.

```tsx
export type SectionHeaderProps = React.ComponentProps<"header"> & {
  heading: string;
};

export function SectionHeader({ heading, children, ...props }: SectionHeaderProps) {
  return (
    <header {...props}>
      <h2>{heading}</h2>
      {children}
    </header>
  );
}
```

When forwarding props, ensure user-provided props can override defaults intentionally. If class merging is needed later, define a small local utility in a spec rather than adding a dependency by default.

## Styling

Use CSS custom properties from `src/app/globals.css` as the shared token layer.

```css
color: var(--color-text-muted);
background: var(--color-surface-hover);
margin-top: var(--space-section);
border-radius: var(--radius-md);
transition: background-color var(--duration-fast) var(--ease-quiet);
```

Rules:

- Component and page styles live in CSS Modules.
- Global CSS is for reset, tokens, base typography, and document behavior.
- Avoid raw repeated color, spacing, shadow, radius, or typography values.
- Do not use viewport-based font scaling.
- Do not use negative letter spacing.
- Keep layout dimensions stable with `max-width`, `min()`, `aspect-ratio`, or explicit grid/flex rules.

## MDX

MDX is content, not an escape hatch for arbitrary UI.

- MDX pages should use approved components from `src/components/content`.
- MDX metadata must be typed or validated by the content layer.
- Avoid inline complex JSX in MDX. Move reusable UI into content components.
- Do not import Client Components into MDX unless the spec requires interactivity.
- Heading hierarchy starts at one `h1` per article page.
- Links must have clear text. Avoid "click here".

## SEO

- Every public page has intentional metadata.
- Article pages derive title, description, published date, and canonical URL from content metadata.
- Use semantic landmarks: `main`, `article`, `header`, `nav`, `footer`, `section`.
- Do not skip heading levels for visual reasons.
- Use `next/image` for images and provide meaningful `alt` text.
- Use `next/font` for fonts. Do not add manual Google Font links.

## Accessibility

- Focus states must be visible and use project tokens.
- Normal text contrast should meet WCAG AA.
- Links must be distinguishable by more than color when embedded in prose.
- Icon-only controls require accessible names.
- Motion must respect `prefers-reduced-motion`.
- Interactive custom widgets require keyboard behavior documented in the component or spec.

## Tests And Verification

For code changes, run the smallest relevant checks and record them in the final handoff.

Baseline:

- `npm run lint`
- `npm run build`

UI changes additionally require browser verification at desktop and mobile widths. Behavior changes require tests once a test runner is introduced by spec.

## Do Not

- Do not add dependencies for convenience without a spec-level reason.
- Do not move logic into Client Components just to avoid server typing.
- Do not introduce broad abstractions before two or more real use cases exist.
- Do not create card-heavy UI for simple blog lists.
- Do not allow documentation and implementation to drift.
