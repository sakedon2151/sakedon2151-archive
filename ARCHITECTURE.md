# Architecture

이 문서는 sakedon2151 blog app의 구조적 의사결정을 정의한다. 구현 세부는 스펙(`docs/spec/*`)에서 다루되, 스펙은 이 문서의 경계를 벗어나지 않는다.

## System Overview

이 프로젝트는 Next.js App Router 기반의 개인 블로그다. 핵심 콘텐츠는 로컬 MDX 파일로 관리하고, 서버 렌더링/정적 생성에 친화적인 구조를 유지한다.

Primary goals:

- 개인 글, 프로젝트, 노트를 빠르고 안정적으로 발행한다.
- 외부 검색엔진이 이해하기 쉬운 semantic HTML과 metadata를 제공한다.
- 런타임 JavaScript와 의존성을 최소화한다.
- 디자인 시스템을 토큰과 작은 컴포넌트로 유지한다.
- SDD + TDD 흐름으로 기능을 확장한다.

Non-goals:

- CMS, 데이터베이스, 인증, 댓글, 대시보드 기능을 기본 범위에 포함하지 않는다.
- 대형 UI kit, content framework, animation library를 기본 의존성으로 삼지 않는다.
- 클라이언트 사이드 렌더링 중심 블로그로 만들지 않는다.

## Stack

- Framework: Next.js 16 App Router
- Runtime UI: React 19
- Language: TypeScript strict mode
- Content: MDX, local-first
- Styling: CSS custom properties + CSS Modules
- Formatting/Linting: Biome
- Package manager: npm

MDX 지원은 아직 현재 코드에 설치되어 있지 않다. MDX 도입 스펙이 작성되면 Next.js 공식 경로인 `@next/mdx`를 우선 사용하고, App Router에서 요구하는 `mdx-components.tsx`를 함께 추가한다.

## Source Layout

현재 구조:

```txt
src/
  app/
    globals.css
    layout.tsx
    page.module.css
    page.tsx
  components/
    .gitkeep
docs/
  spec/
    index.md
```

목표 구조:

```txt
src/
  mdx-components.tsx
  app/
    layout.tsx
    globals.css
    page.tsx
    robots.ts
    sitemap.ts
    opengraph-image.tsx
    writing/
      page.tsx
      [slug]/
        page.tsx
    projects/
      page.tsx
      [slug]/
        page.tsx
  components/
    ui/
    content/
    layout/
  content/
    writing/
      *.mdx
    projects/
      *.mdx
  lib/
    content/
    seo/
    url/
```

The target layout is intentional, not mandatory all at once. Add folders only when a spec needs them.

## Routing

Use App Router only.

- `/`: index page and personal introduction
- `/writing`: writing index
- `/writing/[slug]`: writing detail page
- `/projects`: project index
- `/projects/[slug]`: project detail page

Route groups may be introduced for organization, for example `(content)`, only when they reduce route-level duplication. They must not change URL semantics.

## Rendering Model

Server Components are the default.

- Content indexes and article pages are Server Components.
- Local MDX content is loaded on the server.
- Client Components are reserved for small interactive leaves such as search input, theme toggle, or copy button.
- Props crossing Server to Client boundaries must be serializable.
- Async work should start early and resolve late. Independent reads use `Promise.all` or streaming with Suspense when useful.

## Content Model

Content is local-first and typed.

Each MDX document should expose or be associated with:

- `slug`
- `title`
- `description`
- `publishedAt`
- `updatedAt` when relevant
- `tags`
- `draft`
- optional `canonical`

Until a full content pipeline is specified, prefer a small typed registry over adding a large content framework. If frontmatter parsing becomes necessary, choose the smallest dependency that satisfies the spec or implement a narrow parser only after risk review.

MDX component usage is curated. MDX files may use approved content components from `src/components/content`, not arbitrary app internals.

## Metadata And SEO

SEO is part of architecture, not polish.

- Root layout defines default metadata and title template.
- Index pages use static metadata.
- Detail pages use `generateMetadata` based on content metadata.
- Duplicate content must define a canonical policy.
- `robots.ts` and `sitemap.ts` are generated from the same content registry used by pages.
- Open Graph images use App Router metadata file conventions. Dynamic OG uses `next/og`, not extra OG packages.
- Metadata generation must avoid duplicate content reads by sharing cached server utilities when necessary.

## Styling Architecture

Global CSS is limited to:

- reset
- CSS custom property tokens
- base typography
- focus defaults
- document-level behavior

Page and component styling uses CSS Modules. Component CSS should consume semantic tokens from `globals.css`, not raw repeated values.

## Component Architecture

Components are organized by role:

- `components/ui`: small reusable primitives and controls
- `components/content`: MDX/prose components
- `components/layout`: shells, headers, navigation, page scaffolding

Component defaults:

- semantic HTML first
- accessible by default
- one component wraps one primary element when practical
- native HTML attributes are forwarded
- prop types are exported
- server-safe by default unless interactivity requires `'use client'`

## Data And API Boundaries

Internal content reads do not go through Route Handlers.

Use Route Handlers only for:

- external clients
- webhooks
- machine-readable feeds or API surfaces
- special file generation not covered by App Router metadata conventions

Mutations are not currently in scope. If admin/editing features are introduced later, prefer Server Actions for UI-originated mutations.

## Performance Boundaries

- Keep dependencies small and explicit.
- Avoid barrel imports for heavy modules.
- Load heavy optional UI dynamically only after a spec proves the need.
- Do not pass large duplicated objects to Client Components.
- Keep article pages static or cache-friendly whenever possible.
- Use `next/font` for fonts and `next/image` for images.

## Testing Architecture

The test stack is intentionally not finalized until the first behavior spec requires it.

Baseline verification today:

- `npm run lint`
- `npm run build`
- browser screenshot/interaction verification for UI changes

When behavior grows, add the smallest appropriate test tool:

- content/schema tests for MDX metadata and registries
- component tests for reusable UI
- end-to-end checks for routing, metadata, and critical reading flows

New test dependencies require a spec-level justification.
