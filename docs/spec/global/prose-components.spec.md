---
title: Prose Components
status: accepted
owner: codex
created: 2026-05-03
updated: 2026-05-03
---

# Prose Components

## Problem

`content-mdx.spec.md`는 MDX 콘텐츠 파이프라인을 정의했고, `routing-seo.spec.md`는 해당 콘텐츠를 공개 URL과 metadata에 연결하는 계약을 정의했다. 하지만 MDX 본문 안에서 어떤 HTML과 React 컴포넌트를 허용할지, 그리고 그 컴포넌트가 어떤 접근성/디자인/성능 기준을 만족해야 하는지는 아직 정해지지 않았다.

이 기준이 없으면 다음 문제가 생긴다.

- MDX 작성자가 임의의 app/layout 컴포넌트를 import해 페이지 구조를 깨뜨릴 수 있다.
- 본문 typography, image, code, callout, footnote가 글마다 다른 시각 언어를 가질 수 있다.
- code highlighting, footnote, table 같은 편의 기능 때문에 큰 의존성이 즉흥적으로 추가될 수 있다.
- 이미지 크기와 alt 규칙이 없어 layout shift와 접근성 문제가 생길 수 있다.
- Client Component가 MDX 안에 퍼져 블로그의 정적 렌더링과 최소 JavaScript 원칙이 약해질 수 있다.

이 스펙은 MDX 본문 컴포넌트의 허용 표면과 구현 기준을 정의한다.

## Goals

- MDX 본문에서 허용되는 기본 element mapping과 명시적 content component 목록을 정의한다.
- `src/mdx-components.tsx`의 global MDX component map이 `src/components/content`만 노출하도록 한다.
- 본문 typography와 spacing이 `DESIGN.md`의 절제된 one-column prose 패턴을 따르게 한다.
- 이미지, 링크, 코드, callout, footnote, metadata 표시의 접근성 기준을 명시한다.
- Prose 컴포넌트는 Server Component를 기본값으로 유지한다.
- 초기 구현은 새 런타임 의존성 없이 진행한다.

## Non-Goals

- MDX 설치와 content registry 구현은 `docs/spec/global/content-mdx.spec.md`의 범위다.
- 라우트, canonical, sitemap, robots, Open Graph metadata 구현은 `docs/spec/global/routing-seo.spec.md`의 범위다.
- syntax highlighting, copy code button, table of contents, heading anchor link, search, comments는 초기 범위에서 제외한다.
- GitHub Flavored Markdown syntax 지원을 위해 `remark-gfm`을 도입하지 않는다.
- footnote markdown syntax를 파싱하지 않는다. 초기 footnote는 명시적 MDX component로만 허용한다.
- MDX 안에서 app shell, navigation, page-level layout, arbitrary Client Component를 import하는 사용법은 허용하지 않는다.

## Users And Use Cases

- 사이트 소유자는 MDX로 글을 쓰면서 이미지, 코드, callout, footnote를 일관된 형태로 사용할 수 있다.
- 독자는 desktop/mobile에서 안정적인 line length와 hierarchy로 본문을 읽는다.
- 키보드/스크린리더 사용자는 링크, 이미지, callout, footnote의 의미를 잃지 않고 탐색한다.
- 개발자/에이전트는 새로운 prose 요소를 추가하기 전에 이 스펙의 허용 표면과 의존성 규칙을 확인한다.

## Scope

포함되는 파일/폴더:

- `src/mdx-components.tsx`
- `src/components/content/prose-root.tsx`
- `src/components/content/prose-link.tsx`
- `src/components/content/prose-image.tsx`
- `src/components/content/code-block.tsx`
- `src/components/content/callout.tsx`
- `src/components/content/footnote.tsx`
- `src/components/content/post-meta.tsx`
- `src/components/content/*.module.css`

포함되는 MDX element mapping:

- `a`
- `blockquote`
- `code`
- `hr`
- `ol`
- `p`
- `pre`
- `ul`
- `h2`, `h3`, `h4`

포함되는 명시적 MDX components:

- `ProseImage`
- `CodeBlock`
- `Callout`
- `Footnote`

Route-level content component:

- `PostMeta`

영향 받는 문서:

- `ARCHITECTURE.md`
- `STYLEGUIDE.md`
- `DESIGN.md`
- `WORKFLOW.md`
- `docs/spec/global/content-mdx.spec.md`
- `docs/spec/global/routing-seo.spec.md`

## Architecture

### Component Boundary

Prose 컴포넌트는 `src/components/content`에 둔다.

```txt
src/
  mdx-components.tsx
  components/
    content/
      prose-root.tsx
      prose-link.tsx
      prose-image.tsx
      code-block.tsx
      callout.tsx
      footnote.tsx
      post-meta.tsx
      prose.module.css
```

규칙:

- `src/mdx-components.tsx`는 `MDXComponents` 타입을 사용해 approved component map만 export한다.
- MDX component map은 `src/components/content`의 컴포넌트만 import한다.
- `src/components/ui`, `src/components/layout`, `src/app/*` 컴포넌트는 MDX에 직접 노출하지 않는다.
- 각 컴포넌트는 가능한 한 하나의 semantic element를 감싼다.
- custom prop type은 export한다.
- native element wrapper는 `React.ComponentProps<"...">`를 확장한다.
- Server Component가 기본값이다. `'use client'`는 copy button, interactive demo 같은 별도 스펙이 승인된 leaf에만 둔다.

### MDX Component Map

`src/mdx-components.tsx`는 Next.js App Router에서 필수이며, 이 프로젝트에서는 `src` root에 둔다.

```tsx
import type { MDXComponents } from "mdx/types";
import {
  Callout,
  CodeBlock,
  Footnote,
  ProseImage,
  ProseLink,
  ProsePre,
} from "@/components/content";

const components: MDXComponents = {
  a: ProseLink,
  pre: ProsePre,
  Callout,
  CodeBlock,
  Footnote,
  ProseImage,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

최종 import 구조는 barrel 없이 direct import를 우선한다. 위 예시는 관계를 설명하기 위한 축약형이다.

### Prose Root

MDX detail page는 본문 컴포넌트를 `ProseRoot`로 감싼다.

```tsx
<article>
  <header>{/* h1, description, PostMeta */}</header>
  <ProseRoot>
    <Content />
  </ProseRoot>
</article>
```

규칙:

- `ProseRoot`는 `div` 또는 `section`을 감싸되, 페이지의 `article` landmark를 대체하지 않는다.
- Article page의 `h1`은 route page가 담당한다.
- MDX 본문은 원칙적으로 `h2`부터 시작한다.
- `ProseRoot`는 `--layout-measure`를 기준으로 line length를 제한한다.
- CSS는 CSS Module로 작성하고, color/spacing/radius는 `globals.css` token을 사용한다.

### Dependency Decision

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| No new dependency | 최소 의존성 유지, Server Component 친화적, 디자인 통제 쉬움 | syntax highlighting, GFM tables/footnotes 같은 편의 기능을 직접 제한해야 함 | Accept. 초기 prose 범위에 충분하다. |
| `remark-gfm` | tables, strikethrough, task list, footnote syntax 지원 | GFM 전체 표면을 열어 디자인/접근성 검증 범위 증가 | Defer. table/footnote 요구가 명확해진 뒤 재검토한다. |
| `shiki` or `rehype-pretty-code` | 고품질 syntax highlighting | 의존성/빌드 비용 증가, theme 결정 필요 | Defer. code-heavy 콘텐츠가 생긴 뒤 별도 스펙으로 결정한다. |
| `clsx`, `class-variance-authority` | class 조합 편의 | 현재 variant 수가 작아 과함 | Reject for now. 작은 로컬 class 조합으로 충분하다. |

## Content Model

이 스펙은 콘텐츠 metadata 필드를 추가하지 않는다. 대신 MDX 본문에서 허용되는 작성 표면을 정의한다.

### Allowed Markdown

허용:

- paragraphs
- emphasis and strong
- inline links
- unordered and ordered lists
- blockquote
- inline code
- fenced code block
- horizontal rule
- `h2`, `h3`, `h4`

제한:

- MDX 본문에서 `h1`은 사용하지 않는다.
- raw HTML은 가능한 한 사용하지 않는다. 필요한 경우 content component로 승격한다.
- markdown image shorthand는 초기 범위에서 지원하지 않는다. 이미지에는 `ProseImage`를 사용한다.
- markdown table syntax와 footnote syntax는 `remark-gfm` 도입 전까지 지원 범위가 아니다.

### Approved Explicit Components

| Component | Purpose | Server/Client | Notes |
| --- | --- | --- | --- |
| `ProseImage` | 본문 이미지와 optional caption | Server | `next/image` 기반. `alt`, `width`, `height` 필수. |
| `CodeBlock` | 명시적 코드 블록 | Server | syntax highlighting 없음. language/filename은 text metadata로만 표시. |
| `Callout` | 본문 중간의 보조 설명 | Server | variant는 작게 유지. 색만으로 의미 전달 금지. |
| `Footnote` | 수동 footnote 항목 | Server | markdown footnote parser 없음. 명시적 component만 허용. |
| `PostMeta` | 글 날짜/태그 metadata 표시 | Server | route header에서 사용. MDX body import는 권장하지 않음. |

### Component Contracts

#### `ProseImage`

필수 props:

- `src`
- `alt`
- `width`
- `height`

선택 props:

- `caption`
- `sizes`

규칙:

- `next/image`를 사용한다.
- `alt`는 빈 문자열이 아니어야 한다. 장식 이미지가 필요하면 `decorative` prop을 별도 스펙으로 추가한다.
- `width`와 `height`를 통해 layout shift를 줄인다.
- `caption`이 있으면 `figure`와 `figcaption`을 사용한다.
- remote image는 `next.config.ts`의 `remotePatterns`가 필요하므로 별도 스펙 없이는 local/public image를 우선한다.
- `priority`는 prose image에서 기본 허용하지 않는다. LCP 이미지 요구가 있는 경우 route 스펙에서 결정한다.

#### `CodeBlock`

필수 props:

- `children`

선택 props:

- `language`
- `filename`

규칙:

- 기본 렌더링은 `<pre><code>`다.
- syntax highlighting은 하지 않는다.
- 긴 줄은 horizontal scroll을 허용하되 페이지 전체 overflow를 만들지 않는다.
- filename은 장식 텍스트가 아니라 코드 블록의 문맥으로 표시한다.
- copy button은 초기 범위에서 제외한다.

#### `Callout`

필수 props:

- `children`

선택 props:

- `title`
- `variant`: `"note" | "caution"`

규칙:

- `aside`를 기본 element로 사용한다.
- `variant`는 색상만으로 의미를 전달하지 않고 text label 또는 title과 함께 표시한다.
- `role="alert"`는 사용하지 않는다. 문서성 보조 정보이지 실시간 경고가 아니기 때문이다.
- 카드처럼 과한 배경/그림자를 쓰지 않는다.

#### `Footnote`

필수 props:

- `id`
- `children`

규칙:

- footnote syntax parser가 아니라 수동 component다.
- footnote reference와 backlink 구조는 구현 시 접근성 검증을 거친다.
- 본문 의미를 footnote에만 숨기지 않는다.
- footnote가 많아지면 별도 footnote system 스펙을 작성한다.

#### `PostMeta`

필수 props:

- `publishedAt`

선택 props:

- `updatedAt`
- `tags`

규칙:

- route page header에서 제목/설명 아래에 표시한다.
- `<time dateTime="YYYY-MM-DD">`를 사용한다.
- 태그는 링크가 되기 전까지 단순 text list로 표시한다.
- 태그 archive route가 생기기 전까지 태그를 navigation처럼 보이게 만들지 않는다.

## UX And Design

Prose는 `DESIGN.md`의 content-first, quiet hierarchy, one-column default 원칙을 따른다.

### Prose Layout

- 본문 최대 폭은 `--layout-measure`를 사용한다.
- page shell이나 article wrapper를 카드로 만들지 않는다.
- 본문 spacing은 section chrome보다 작고, 읽기 흐름을 끊지 않아야 한다.
- mobile에서도 prose font size는 `16px` 아래로 줄이지 않는다.
- Korean copy는 `word-break: keep-all`과 `overflow-wrap: break-word` 규칙을 유지한다.

### Typography

- 본문은 body-sized type을 기본으로 한다.
- 시각 hierarchy는 font size보다 weight, color, spacing으로 만든다.
- heading은 `h2`, `h3`, `h4`까지만 초기 스타일을 정의한다.
- inline link는 underline을 사용한다.
- inline code는 조용한 surface와 mono font를 사용한다.

### Code

- code block은 `--color-muted-surface` 또는 동등한 quiet surface를 사용한다.
- border와 radius는 subtle하게 유지한다.
- syntax 색상 palette는 초기 범위에서 만들지 않는다.
- horizontal scroll은 code block 내부에만 생겨야 한다.

### Image

- 이미지는 prose width 안에서 렌더링한다.
- 이미지 자체가 콘텐츠를 설명해야 하며, 흐린 장식 이미지는 피한다.
- caption은 muted text로 작게 표시하되 가독성을 해치지 않는다.

### Callout

- callout은 본문 리듬 안에 있는 조용한 보조 블록이다.
- 아이콘은 초기 범위에서 사용하지 않는다.
- 배경, border, label만으로 충분히 구분한다.
- warning/caution은 과한 색보다 명확한 text label을 우선한다.

## Accessibility

- MDX 본문은 페이지 `h1` 다음의 논리적 heading order를 유지한다.
- `ProseImage`는 의미 있는 `alt`를 요구한다.
- `figure`와 `figcaption`을 사용해 이미지 caption 관계를 표현한다.
- 링크 텍스트는 목적지를 설명해야 한다.
- 외부 링크는 새 창을 기본값으로 열지 않는다. 새 창이 필요한 경우 text나 accessible label로 알려야 한다.
- code block은 keyboard focus를 강제로 받지 않는다. copy button이 추가되면 별도 keyboard/focus 규칙을 정의한다.
- callout은 색상만으로 variant를 전달하지 않는다.
- footnote reference와 backlink는 keyboard로 이동 가능해야 한다.
- focus-visible 스타일은 project token을 사용한다.
- motion은 기본적으로 사용하지 않는다. 추가되면 `prefers-reduced-motion`을 따른다.

## SEO

Prose 컴포넌트는 검색엔진이 본문 구조를 이해하기 쉬운 semantic HTML을 출력해야 한다.

- Article page의 `h1`은 route page가 담당하고 MDX body는 `h2`부터 시작한다.
- 이미지 `alt`는 이미지 검색과 접근성 모두에 의미 있는 텍스트를 제공한다.
- 링크는 실제 `href`를 가진 anchor로 렌더링한다.
- 내부 링크는 가능한 경우 `next/link`를 사용하되, HTML output이 검색엔진에 명확한 anchor로 남아야 한다.
- callout은 본문 맥락을 보강하는 `aside`로 렌더링한다.
- `PostMeta`는 날짜를 `<time dateTime>`으로 노출한다.
- 코드나 footnote 안에 핵심 본문 내용을 숨기지 않는다.

## Test Plan

### Red

구현 전 다음 실패 상태를 먼저 정의한다.

- `src/mdx-components.tsx`가 approved content component 외의 app/layout component를 노출하면 검증이 실패해야 한다.
- `ProseImage`에 `alt`, `width`, `height` 중 하나가 없으면 타입 또는 fixture 검증이 실패해야 한다.
- MDX fixture가 markdown image shorthand를 사용하면 검증이 실패해야 한다.
- MDX fixture가 `h1`을 본문에 포함하면 heading hierarchy 검증이 실패해야 한다.
- code block fixture가 페이지 전체 horizontal overflow를 만들면 browser verification에서 실패해야 한다.
- callout variant가 색상만으로 구분되면 accessibility review에서 실패해야 한다.

### Green

구현 후 다음 자동 검증을 통과해야 한다.

- `npm run lint`
- `npm run build`
- prose component type checks
- MDX fixture build check
- heading hierarchy check

테스트 러너가 아직 없으면, 구현 시 TypeScript 타입 검증과 작은 fixture route/build 검증을 우선한다. DOM-level component test가 필요해지는 시점에 가장 작은 테스트 도구 도입을 별도 판단한다.

### Manual Verification

UI 구현 후 local server에서 desktop/mobile을 확인한다.

- prose line length가 `--layout-measure` 안에 머문다.
- Korean paragraph line break가 어색하게 깨지지 않는다.
- inline link와 focus state가 명확하다.
- code block은 내부 scroll만 만들고 viewport overflow를 만들지 않는다.
- image는 layout shift 없이 caption과 함께 렌더링된다.
- callout은 본문보다 과하게 튀지 않으며 dark mode에서도 읽힌다.
- footnote reference/backlink가 keyboard로 이동 가능하다.

## Acceptance Criteria

- MDX에서 허용되는 element mapping과 explicit component 목록이 문서화되어 있다.
- `src/mdx-components.tsx`는 `src/components/content`의 approved components만 노출한다.
- `ProseRoot`는 article을 대체하지 않고 본문 measure와 typography만 담당한다.
- MDX body는 `h2`부터 시작한다는 heading 계약이 정의되어 있다.
- `ProseImage`는 `next/image`, required `alt`, `width`, `height`, optional `caption` 기준을 가진다.
- `CodeBlock`은 초기 syntax highlighting과 copy button 없이 `<pre><code>` 기반으로 정의되어 있다.
- `Callout`은 `"note" | "caution"` variant와 색상 외 text label 기준을 가진다.
- `Footnote`는 parser가 아니라 명시적 component로 제한되어 있다.
- `PostMeta`는 route header에서 `<time>` 기반 metadata 표시를 담당한다.
- 초기 prose 구현은 새 runtime dependency를 추가하지 않는다.
- `remark-gfm`, syntax highlighter, copy button, table of contents는 deferred로 문서화되어 있다.
- 접근성, SEO, responsive verification 기준이 있다.

## Rollout And Migration

권장 구현 순서:

1. `content-mdx.spec.md` 구현으로 MDX import와 registry를 먼저 준비한다.
2. `routing-seo.spec.md` 구현으로 detail route와 article shell을 준비한다.
3. `src/components/content/prose-root.tsx`와 prose CSS Module을 추가한다.
4. 기본 element mapping용 `ProseLink`, `ProsePre`, inline code 스타일을 추가한다.
5. `ProseImage`, `CodeBlock`, `Callout`, `Footnote`, `PostMeta`를 순서대로 추가한다.
6. `src/mdx-components.tsx`에서 approved component map을 연결한다.
7. 최소 MDX fixture에 paragraph, link, code block, image, callout, footnote를 포함한다.
8. lint, build, desktop/mobile browser verification을 수행한다.

마이그레이션:

- 현재 MDX 콘텐츠가 없으므로 기존 prose 마이그레이션은 없다.
- 기존 홈페이지 UI는 이 스펙의 범위가 아니다.

되돌리기:

- prose component 구현을 되돌리면 MDX 기본 HTML 렌더링으로 돌아간다.
- content registry와 route/SEO 구현은 별도 스펙 범위이므로 유지될 수 있다.

## Open Questions

- code-heavy 글이 많아질 경우 syntax highlighter를 도입할지 결정해야 한다.
- markdown table과 footnote syntax를 위해 `remark-gfm`을 도입할지, 명시적 component만 유지할지 결정해야 한다.
- 이미지 파일을 `public/` 중심으로 둘지, static import 중심으로 둘지 콘텐츠 작성 경험을 보고 결정한다.
- heading anchor link와 table of contents가 필요한지 글 길이가 충분히 길어진 뒤 판단한다.
- external link에 아이콘 또는 `target="_blank"` 정책을 둘지 아직 결정하지 않는다.
