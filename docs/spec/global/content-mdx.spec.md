---
title: Content MDX
status: accepted
owner: codex
created: 2026-05-03
updated: 2026-05-03
---

# Content MDX

## Problem

현재 프로젝트는 개인 블로그를 목표로 하지만, 글과 프로젝트 콘텐츠를 안정적으로 작성하고 라우트/SEO로 연결하는 MDX 콘텐츠 파이프라인이 아직 없다.

콘텐츠 파이프라인이 명시되지 않으면 다음 문제가 생긴다.

- 글 목록, 상세 페이지, sitemap, metadata가 서로 다른 기준으로 콘텐츠를 읽을 수 있다.
- draft 콘텐츠가 production 검색 색인에 노출될 수 있다.
- frontmatter/parser/content framework 도입 여부가 기능 구현 중 즉흥적으로 결정될 수 있다.
- MDX에서 사용할 수 있는 컴포넌트 경계가 흐려져 블로그의 절제된 디자인 시스템이 깨질 수 있다.

이 스펙은 로컬 MDX 콘텐츠를 Next.js App Router 안에서 최소 의존성으로 다루기 위한 기반 계약을 정의한다.

## Goals

- 로컬 MDX 파일을 `writing`과 `projects` 콘텐츠의 원본으로 사용한다.
- Next.js 공식 `@next/mdx` 경로를 사용해 App Router와 Server Components 기본값을 유지한다.
- 콘텐츠 metadata schema를 명시하고, 목록/상세/SEO/sitemap이 같은 metadata를 사용하게 한다.
- draft와 published 콘텐츠의 노출 규칙을 production 기준으로 명확히 한다.
- MDX에서 사용할 수 있는 컴포넌트 표면을 작게 유지하고, 디자인 시스템과 접근성을 보존한다.
- 의존성 추가는 MDX 렌더링에 필요한 최소 패키지로 제한한다.

## Non-Goals

- `/writing`, `/writing/[slug]`, `/projects`, `/projects/[slug]` 라우트 구현은 이 스펙에서 하지 않는다. 라우팅과 SEO 상세 정책은 `docs/spec/global/routing-seo.spec.md`에서 다룬다.
- prose 컴포넌트의 최종 디자인과 전체 컴포넌트 목록은 이 스펙에서 확정하지 않는다. MDX 컴포넌트 시스템은 `docs/spec/global/prose-components.spec.md`에서 다룬다.
- CMS, 데이터베이스, 원격 MDX, MDX live editor, 댓글, 검색, RSS는 포함하지 않는다.
- 기존 홈페이지 디자인을 변경하지 않는다.
- 이 문서 작성 단계에서는 패키지 설치나 코드 구현을 수행하지 않는다.

## Users And Use Cases

- 사이트 소유자는 로컬 `.mdx` 파일을 추가해 글과 프로젝트를 발행한다.
- 독자는 발행된 글과 프로젝트만 목록과 상세 페이지에서 읽는다.
- 검색엔진은 콘텐츠 metadata, canonical URL, sitemap을 통해 공개 콘텐츠를 색인한다.
- 개발자/에이전트는 스펙화된 schema와 registry를 기준으로 콘텐츠 기능을 안전하게 확장한다.

## Scope

포함 범위:

- MDX 패키지 도입 방식
- `next.config.ts`의 MDX 설정 방향
- `src/mdx-components.tsx` 파일 convention
- `src/content/writing/*.mdx`, `src/content/projects/*.mdx` 콘텐츠 위치
- metadata schema와 draft/published 처리 규칙
- 콘텐츠 registry와 public read API의 책임
- 향후 라우팅/SEO 스펙이 사용할 content contract

영향 받는 문서:

- `ARCHITECTURE.md`
- `WORKFLOW.md`
- `STYLEGUIDE.md`
- `DESIGN.md`
- `docs/spec/index.md`

## Architecture

목표 구조:

```txt
src/
  mdx-components.tsx
  app/
    writing/
      page.tsx
      [slug]/
        page.tsx
    projects/
      page.tsx
      [slug]/
        page.tsx
  content/
    writing/
      *.mdx
    projects/
      *.mdx
  components/
    content/
  lib/
    content/
      registry.ts
      types.ts
      validators.ts
```

### MDX Setup

Next.js 공식 문서 기준으로 App Router에서 `@next/mdx`를 사용하려면 `mdx-components.tsx`가 필수다. 이 프로젝트는 `src/app` 구조를 사용하므로 파일 위치는 `src/mdx-components.tsx`로 둔다.

초기 구현 시 `next.config.ts`는 기존 TypeScript 설정 파일을 유지하고, `@next/mdx`의 `createMDX`로 Next config를 감싼다.

```ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
```

초기 범위에서는 `.mdx`만 허용한다. `.md`까지 허용하려면 `extension: /\.(md|mdx)$/` 설정과 별도 수용 기준을 추가한다.

### Server And Client Boundary

- MDX 콘텐츠 로딩, registry, 정렬, 필터링은 Server Component 또는 server-only 유틸에서 수행한다.
- MDX 파일은 기본적으로 서버에서 렌더링된다.
- MDX 내부에 Client Component가 필요한 경우 `components/content`에 작게 격리하고, 해당 컴포넌트만 `'use client'`를 선언한다.
- registry에서 Client Component로 넘기는 props는 serializable 데이터만 포함한다.

### Content Flow

1. 작성자는 `src/content/{kind}/{slug}.mdx` 파일을 추가한다.
2. MDX 파일은 `metadata` named export와 default component를 제공한다.
3. `src/lib/content/registry.ts`가 MDX 모듈을 명시적으로 import해 typed entry 목록을 만든다.
4. public read API가 published 콘텐츠만 필터링해 라우트와 SEO 유틸에 제공한다.
5. 라우트, sitemap, metadata는 registry에서 같은 source of truth를 사용한다.

초기 블로그 규모에서는 명시적 registry import를 허용한다. 콘텐츠 수가 커져 수동 registry 관리가 반복 비용이 되면 별도 스펙에서 파일 시스템 기반 수집 또는 content framework 도입을 재검토한다.

### Dependency Decision

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| No dependency | 의존성 증가 없음, 번들 영향 없음 | MDX 컴파일과 App Router 연동을 직접 해결해야 함 | Reject. MDX 렌더링 요구사항을 충족하지 못한다. |
| `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` + `@types/mdx` | Next 공식 경로, App Router Server Components 지원, 유지보수 리스크 낮음 | MDX 관련 패키지가 추가됨 | Accept. MDX를 위한 최소 공식 의존성으로 본다. |
| `gray-matter` | YAML frontmatter 작성 경험이 익숙함 | metadata parser 의존성 추가, MDX named export와 중복 가능 | Defer. 초기에는 사용하지 않는다. |
| Contentlayer 또는 대형 content framework | schema와 generated types가 강함 | 프로젝트 규모 대비 의존성/설정 비용이 큼, 유지보수 표면 증가 | Reject for now. 개인 블로그 초기 범위에 과하다. |

패키지 분류:

- runtime/build dependency: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`
- dev dependency: `@types/mdx`

## Content Model

초기 콘텐츠는 MDX named export로 metadata를 제공한다. YAML frontmatter parser는 도입하지 않는다.

권장 MDX 형태:

```mdx
export const metadata = {
  title: "글 제목",
  description: "검색 결과와 목록에 표시할 짧은 설명",
  publishedAt: "2026-05-03",
  tags: ["nextjs", "design-system"],
  draft: false,
};

# 글 제목

본문...
```

공통 타입:

```ts
export type ContentKind = "writing" | "project";

export type ContentMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: readonly string[];
  draft?: boolean;
  canonical?: string;
};

export type ContentEntry = ContentMetadata & {
  kind: ContentKind;
  slug: string;
};
```

필드 규칙:

| Field | Required | Rule |
| --- | --- | --- |
| `slug` | Yes | 파일명 또는 registry에서 결정한다. lowercase kebab-case만 사용한다. |
| `title` | Yes | 사람이 읽는 제목. detail page의 `h1`과 metadata title에 사용한다. |
| `description` | Yes | 목록 요약과 SEO description에 사용한다. 빈 문자열은 허용하지 않는다. |
| `publishedAt` | Yes | `YYYY-MM-DD` 형식의 공개일. 정렬 기준이다. |
| `updatedAt` | No | `YYYY-MM-DD` 형식. 본문 의미가 바뀐 경우에만 둔다. |
| `tags` | Yes | 0개 이상. 태그 필터 UI는 별도 스펙에서 다룬다. |
| `draft` | No | 생략 시 `false`로 간주한다. |
| `canonical` | No | 외부 원문 또는 중복 URL이 있을 때 사용한다. |

정렬 규칙:

- 목록은 `publishedAt` 내림차순을 기본으로 한다.
- 같은 날짜의 항목은 `title` 오름차순으로 안정 정렬한다.
- `updatedAt`은 기본 정렬에 영향을 주지 않는다.

노출 규칙:

- production에서는 `draft: true` 콘텐츠가 목록, 상세 정적 경로, sitemap, RSS, 검색 색인 metadata에 포함되지 않는다.
- development에서도 기본 목록은 published 콘텐츠만 보여준다.
- draft preview가 필요하면 별도 스펙으로 다룬다.

검증 규칙:

- `metadata`가 없거나 필수 필드가 빈 값이면 build 또는 test 단계에서 실패해야 한다.
- 날짜 형식이 `YYYY-MM-DD`가 아니면 실패해야 한다.
- 같은 `kind` 안에서 slug가 중복되면 실패해야 한다.
- unknown metadata field는 우선 허용하지 않는다. 새 필드는 스펙 업데이트 후 추가한다.

## UX And Design

이 스펙은 UI를 직접 구현하지 않는다. 다만 MDX 콘텐츠가 디자인 시스템을 해치지 않도록 다음 계약을 둔다.

- MDX 본문은 `DESIGN.md`의 절제된 UI, 좁은 measure, 낮은 장식 밀도를 따른다.
- 본문 컴포넌트는 `components/content`를 통해 노출한다.
- MDX에서 임의의 layout shell, navigation, page-level component를 import하지 않는다.
- code block, image, callout, footnote 같은 prose 요소의 세부 디자인은 `prose-components` 스펙에서 확정한다.

## Accessibility

- MDX 본문은 의미 있는 heading order를 유지한다. 각 글의 페이지 `h1`은 라우트가 담당하고, MDX 본문은 원칙적으로 `h2`부터 시작한다.
- 링크 텍스트는 목적지를 설명해야 하며 `여기`, `클릭` 같은 단독 텍스트를 피한다.
- 이미지에는 의미 있는 `alt`를 제공한다. 장식 이미지는 prose component 스펙에서 별도 규칙을 둔다.
- interactive MDX 컴포넌트는 keyboard interaction과 focus state를 제공해야 한다.
- syntax highlighting이나 callout 색상은 `DESIGN.md`의 contrast 기준을 만족해야 한다.

## SEO

이 스펙은 SEO 데이터의 source of truth만 정의한다. URL 생성, metadata 함수, sitemap 구현은 `routing-seo` 스펙에서 다룬다.

콘텐츠 metadata는 다음 SEO 자료로 사용된다.

- detail page title
- detail page description
- canonical URL
- Open Graph title/description
- sitemap entry
- article published/modified time

SEO 규칙:

- `description`은 검색 결과에 노출될 수 있으므로 본문 첫 문장 자동 추출에 의존하지 않는다.
- `draft: true` 콘텐츠는 production SEO 산출물에 포함되지 않는다.
- `canonical`이 없으면 사이트 내부 canonical을 생성한다.
- 외부 원문이 있는 글은 `canonical`에 절대 URL을 둔다.

## Test Plan

### Red

초기 구현 전에 다음 실패를 먼저 확인한다.

- MDX 의존성과 `src/mdx-components.tsx`가 없으면 `.mdx` import를 사용하는 테스트 또는 build가 실패한다.
- metadata 필수 필드가 누락된 fixture를 registry에 추가하면 validation 테스트가 실패한다.
- 잘못된 날짜 형식 또는 중복 slug fixture가 validation 테스트에서 실패한다.
- `draft: true` fixture가 published read API 결과에 포함되면 테스트가 실패한다.

### Green

구현 후 다음 자동 검증을 통과해야 한다.

- `npm run lint`
- `npm run build`
- content metadata validation 테스트
- registry filtering/sorting 테스트

테스트 도구가 아직 없을 경우, 이 스펙의 구현 PR에서 가장 작은 테스트 러너 도입 여부를 다시 판단한다. 도입 전까지는 TypeScript 타입 검증, build, 명시적 fixture 검증 스크립트 중 가장 작은 방법을 선택한다.

### Manual Verification

라우팅 구현 이후 다음을 브라우저에서 확인한다.

- published 글은 목록에 보인다.
- draft 글은 production 모드 목록과 상세 접근에서 보이지 않는다.
- MDX 본문 typography가 `DESIGN.md`의 measure와 spacing을 따른다.

이 스펙 단독 구현이 UI를 만들지 않는 경우 manual browser verification은 해당 없음이다.

## Acceptance Criteria

- `src/content/writing`과 `src/content/projects`가 canonical 콘텐츠 위치로 정의되어 있다.
- App Router MDX 필수 파일 위치가 `src/mdx-components.tsx`로 정의되어 있다.
- 초기 MDX 설정은 `.mdx`만 지원한다.
- metadata schema가 `title`, `description`, `publishedAt`, `tags`, `draft`, `canonical`을 명시한다.
- `draft: true` 콘텐츠는 production public content API에서 제외된다.
- content registry는 라우트, metadata, sitemap이 공유할 source of truth로 정의된다.
- YAML frontmatter parser와 content framework는 초기 범위에서 제외되어 있다.
- 구현 시 필요한 MDX 의존성과 도입 근거가 비교표로 문서화되어 있다.
- 검증 계획은 실패해야 하는 fixture와 통과해야 하는 명령을 포함한다.

## Rollout And Migration

권장 구현 순서:

1. MDX 패키지를 설치한다.
2. `next.config.ts`에 `@next/mdx` 설정과 `.mdx` page extension을 추가한다.
3. `src/mdx-components.tsx`를 추가하고 우선 빈 component map을 export한다.
4. `src/lib/content/types.ts`, `src/lib/content/validators.ts`, `src/lib/content/registry.ts`를 추가한다.
5. 최소 writing fixture와 project fixture를 추가한다.
6. validation과 build가 통과하는지 확인한다.
7. `routing-seo` 스펙으로 라우트와 SEO 산출물을 연결한다.

마이그레이션:

- 현재 로컬 콘텐츠가 없으므로 기존 콘텐츠 마이그레이션은 없다.
- 홈페이지 정적 카피를 MDX로 옮기는 작업은 이 스펙의 범위가 아니다.

되돌리기:

- MDX 구현을 되돌리면 콘텐츠 라우트는 동작하지 않는다.
- 이 스펙 단계에서는 문서만 추가하므로 런타임 영향은 없다.

## Open Questions

- 글 본문에서 `h1` 사용을 lint 수준으로 막을지, 작성 규칙으로만 둘지 결정해야 한다.
- `tags`를 단순 문자열 배열로 유지할지, later domain spec에서 tag registry를 둘지 결정해야 한다.
- RSS 또는 Atom feed가 필요해질 경우 content registry에 어떤 public API를 추가할지 별도 스펙에서 정한다.
- code block syntax highlighting을 의존성 없이 처리할지, 빌드 타임 highlighter를 도입할지 `prose-components` 스펙에서 결정한다.
