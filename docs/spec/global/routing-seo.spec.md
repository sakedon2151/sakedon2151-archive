---
title: Routing SEO
status: accepted
owner: codex
created: 2026-05-03
updated: 2026-05-03
---

# Routing SEO

## Problem

`content-mdx.spec.md`는 로컬 MDX 콘텐츠의 source of truth를 정의했지만, 그 콘텐츠를 어떤 공개 URL로 노출하고 검색엔진용 metadata에 어떻게 연결할지는 아직 정해지지 않았다.

라우팅과 SEO 정책이 분리되어 있지 않으면 다음 문제가 생긴다.

- 목록 페이지, 상세 페이지, sitemap이 서로 다른 콘텐츠 기준을 사용할 수 있다.
- draft 콘텐츠가 정적 경로나 sitemap에 포함될 수 있다.
- canonical URL이 페이지마다 다르게 조립되어 중복 색인 위험이 생긴다.
- `params` async 처리, `generateStaticParams`, `notFound()` 사용 방식이 Next.js 16 규칙과 어긋날 수 있다.
- Open Graph 이미지, robots, sitemap이 뒤늦게 붙는 장식 작업처럼 취급될 수 있다.

이 스펙은 공개 라우트와 SEO 산출물을 App Router 파일 컨벤션 안에서 구현하기 위한 계약을 정의한다.

## Goals

- `/`, `/writing`, `/writing/[slug]`, `/projects`, `/projects/[slug]`의 공개 URL 정책을 정의한다.
- 모든 공개 페이지가 고유한 title, description, canonical URL을 갖게 한다.
- content registry의 published 콘텐츠만 목록, 상세 정적 경로, sitemap에 포함한다.
- 상세 페이지는 `generateStaticParams`와 `dynamicParams = false`를 사용해 공개 slug만 정적 경로로 생성한다.
- 존재하지 않거나 draft인 slug는 `notFound()`로 처리한다.
- `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`를 Next.js App Router metadata file convention으로 구현한다.
- URL 조립과 metadata 생성은 작은 로컬 유틸로 통일하고 새 의존성을 추가하지 않는다.

## Non-Goals

- MDX 패키지 설치, content registry 구현, metadata schema 검증은 `docs/spec/global/content-mdx.spec.md`의 범위다.
- 본문 typography, code block, image, callout 같은 MDX prose UI는 `docs/spec/global/prose-components.spec.md`에서 다룬다.
- tag archive, full-text search, RSS/Atom feed, newsletter, analytics는 포함하지 않는다.
- 다국어 URL, hreflang sitemap, locale negotiation은 포함하지 않는다.
- per-post dynamic Open Graph 이미지는 초기 범위에서 제외한다. 우선 site-level OG 이미지를 사용한다.
- URL migration redirect 정책은 실제 이전 URL이 생기기 전까지 다루지 않는다.

## Users And Use Cases

- 독자는 안정적인 URL로 글과 프로젝트를 읽고 공유한다.
- 검색엔진은 sitemap, canonical, metadata를 통해 공개 콘텐츠만 색인한다.
- 소셜/메신저 서비스는 Open Graph metadata와 기본 이미지를 사용해 링크 미리보기를 만든다.
- 사이트 소유자는 draft 콘텐츠를 로컬에 둘 수 있지만 production 공개 경로에는 노출하지 않는다.
- 개발자/에이전트는 라우트와 SEO 구현 시 같은 registry와 URL 유틸을 사용한다.

## Scope

포함되는 라우트:

| Route | Type | Source |
| --- | --- | --- |
| `/` | static page | `src/app/page.tsx` |
| `/writing` | static index | published writing entries |
| `/writing/[slug]` | static detail | one published writing entry |
| `/projects` | static index | published project entries |
| `/projects/[slug]` | static detail | one published project entry |
| `/robots.txt` | metadata route | `src/app/robots.ts` |
| `/sitemap.xml` | metadata route | `src/app/sitemap.ts` |
| `/opengraph-image` | metadata route | `src/app/opengraph-image.tsx` |

포함되는 파일/유틸:

- `src/app/layout.tsx`
- `src/app/not-found.tsx`
- `src/app/writing/page.tsx`
- `src/app/writing/[slug]/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/opengraph-image.tsx`
- `src/lib/seo/metadata.ts`
- `src/lib/url/site.ts`

영향 받는 문서:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `STYLEGUIDE.md`
- `WORKFLOW.md`
- `DESIGN.md`
- `docs/spec/global/content-mdx.spec.md`

## Architecture

### URL Contract

URL은 lowercase kebab-case slug를 그대로 사용한다.

| Content Kind | Index URL | Detail URL |
| --- | --- | --- |
| writing | `/writing` | `/writing/{slug}` |
| project | `/projects` | `/projects/{slug}` |

Trailing slash는 사용하지 않는다. root URL만 `/`로 유지한다.

Canonical URL은 `SITE_URL` 환경 변수와 pathname을 조합한다.

```ts
getCanonicalUrl("/") // https://example.com
getCanonicalUrl("/writing") // https://example.com/writing
getCanonicalUrl("/writing/my-post") // https://example.com/writing/my-post
```

규칙:

- deployed production에서는 `SITE_URL`이 반드시 설정되어야 한다.
- local development/test/local build에서는 `http://localhost:3000` fallback을 허용한다.
- `SITE_URL`은 trailing slash 없이 정규화한다.
- canonical에는 query string과 hash를 포함하지 않는다.
- 콘텐츠 metadata의 `canonical`이 절대 URL이면 해당 값을 우선한다.
- 내부 canonical은 항상 이 프로젝트의 URL 유틸을 통해 생성한다.

### Route Generation

상세 페이지는 published 콘텐츠만 정적 경로로 생성한다.

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedWritingEntries().map((entry) => ({
    slug: entry.slug,
  }));
}
```

Next.js 16 규칙에 따라 `params`는 Promise로 다룬다.

```tsx
export default async function Page(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const entry = getPublishedWritingEntry(slug);

  if (!entry) {
    notFound();
  }

  return <article>{/* ... */}</article>;
}
```

규칙:

- `PageProps<"/writing/[slug]">`와 `PageProps<"/projects/[slug]">`를 사용한다.
- `params`는 동기 객체처럼 접근하지 않는다.
- 존재하지 않는 slug, draft slug, invalid slug는 `notFound()`로 처리한다.
- `notFound()`는 가능한 한 페이지 상단에서 콘텐츠 존재 여부를 확인한 직후 호출한다.
- `notFound()`를 `try/catch`로 삼키지 않는다.
- 상세 라우트는 Client Component가 아니어야 한다.

### Metadata Generation

Root layout은 site-level 기본 metadata와 title template을 정의한다.

```ts
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "sakedon2151",
    template: "%s | sakedon2151",
  },
  description: "절제된 UI와 미니멀리즘을 바탕으로 만든 개인 블로그.",
};
```

Index pages는 static `metadata` object를 사용한다. Detail pages는 content metadata를 읽어 `generateMetadata`를 사용한다.

규칙:

- `metadata`와 `generateMetadata`를 같은 route segment에서 동시에 export하지 않는다.
- `generateMetadata`는 Server Component에서만 사용한다.
- 상세 페이지의 `generateMetadata`와 page render는 같은 content registry 유틸을 사용한다.
- 같은 데이터를 metadata와 page에서 모두 읽을 때는 필요하면 React `cache()` 또는 server-only utility로 중복 작업을 줄인다.
- file-based metadata는 Metadata API보다 우선순위가 높다는 점을 전제로 `opengraph-image.tsx` 위치를 결정한다.

### Robots And Sitemap

`src/app/robots.ts`는 Next.js `MetadataRoute.Robots`를 반환한다.

초기 정책:

- 모든 공개 경로를 허용한다.
- draft는 URL을 만들지 않으므로 별도 disallow 규칙을 두지 않는다.
- sitemap URL은 `getCanonicalUrl("/sitemap.xml")`에서 생성한다.

`src/app/sitemap.ts`는 Next.js `MetadataRoute.Sitemap`을 반환한다.

포함:

- `/`
- `/writing`
- `/projects`
- all published writing detail URLs
- all published project detail URLs

제외:

- draft 콘텐츠
- 존재하지 않는 slug
- query-string variations
- future preview/private routes

Content detail sitemap entry는 `updatedAt ?? publishedAt`을 `lastModified`로 사용한다. Static index pages는 별도 site-level updated date가 생기기 전까지 `lastModified`를 생략한다.

### Open Graph Image

초기 OG 정책은 site-level generated image 하나를 사용한다.

파일:

- `src/app/opengraph-image.tsx`

규칙:

- `next/og`의 `ImageResponse`를 사용한다.
- `@vercel/og`를 추가하지 않는다.
- 기본 크기는 `1200x630`이다.
- `alt`, `size`, `contentType`을 export한다.
- 시각 스타일은 `DESIGN.md`의 절제된 typography, warm neutral palette, 낮은 장식 밀도를 따른다.
- per-post dynamic OG image는 콘텐츠 수와 공유 요구가 분명해진 뒤 별도 스펙으로 도입한다.

### Dependency Decision

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| No new dependency | Next Metadata API와 작은 유틸만으로 구현 가능, 번들 영향 없음 | 테스트 편의 유틸을 직접 작성해야 함 | Accept. 초기 라우팅/SEO 범위에 충분하다. |
| SEO helper package | 일부 metadata 조립을 줄일 수 있음 | 프로젝트 규모 대비 의존성 증가, Next Metadata API와 중복 | Reject. |
| Sitemap/robots package | XML/robots 작성 편의 | Next metadata route convention과 중복 | Reject. |

## Content Model

이 스펙은 새 콘텐츠 필드를 추가하지 않는다. `content-mdx.spec.md`의 `ContentEntry`를 사용한다.

SEO에서 사용하는 필드:

| Field | Usage |
| --- | --- |
| `kind` | URL prefix와 Open Graph type 결정 |
| `slug` | detail pathname 생성 |
| `title` | page title, OG title |
| `description` | meta description, OG description |
| `publishedAt` | article published time, sitemap fallback lastModified |
| `updatedAt` | article modified time, sitemap lastModified |
| `tags` | article tags |
| `draft` | public route/sitemap exclusion |
| `canonical` | external canonical override |

Derived route model:

```ts
export type PublicRoute = {
  pathname: "/" | "/writing" | "/projects" | `/writing/${string}` | `/projects/${string}`;
  title: string;
  description: string;
  canonicalUrl: string;
};
```

`PublicRoute`는 구현 시 타입 이름이 바뀔 수 있지만, 라우트/SEO 유틸이 동일한 데이터를 공유해야 한다는 계약은 유지한다.

## UX And Design

이 스펙은 페이지 세부 UI를 완성하지 않는다. 다만 라우트별 기본 구조를 정의한다.

- `/writing`과 `/projects`는 `DESIGN.md`의 one-column page shell과 text list item 패턴을 따른다.
- Detail page는 `main > article` 구조를 사용하고 prose width를 넓히지 않는다.
- Root `not-found.tsx`는 최소한의 heading, 설명, home link를 제공한다.
- 404 UI는 카드나 큰 hero가 아니라 기존 블로그 톤의 작은 안내 페이지로 만든다.
- Loading UI는 초기 정적 콘텐츠 범위에서는 만들지 않는다. 실제 async UX 요구가 생기면 별도 스펙에서 다룬다.

## Accessibility

- 각 공개 페이지는 하나의 `main` landmark를 가진다.
- 각 route page에는 하나의 명확한 `h1`이 있다.
- Detail page는 `article`과 `header`를 사용해 제목, 설명, 날짜를 구조화한다.
- 목록 페이지는 링크 텍스트만으로 목적지를 이해할 수 있어야 한다.
- 404 페이지의 home link는 keyboard focus가 명확해야 한다.
- Open Graph 이미지는 `alt` metadata를 제공한다.
- SEO를 위해 heading level을 건너뛰거나 숨은 heading을 남발하지 않는다.

## SEO

### Page Metadata

| Route | Title | Description | Metadata Source |
| --- | --- | --- | --- |
| `/` | `sakedon2151` | root description | root layout/page |
| `/writing` | `글` | writing index description | static metadata |
| `/writing/[slug]` | content title | content description | `generateMetadata` |
| `/projects` | `프로젝트` | project index description | static metadata |
| `/projects/[slug]` | content title | content description | `generateMetadata` |

Detail metadata:

- `alternates.canonical`: content canonical override 또는 internal canonical
- `openGraph.title`: content title
- `openGraph.description`: content description
- `openGraph.url`: canonical URL
- `openGraph.siteName`: `sakedon2151`
- `openGraph.locale`: `ko_KR`
- `openGraph.type`: writing은 `article`, projects는 초기에는 `article`
- `twitter.card`: `summary_large_image`

Writing detail article metadata:

- `publishedTime`: `publishedAt`
- `modifiedTime`: `updatedAt` when present
- `tags`: `tags`

Index page metadata:

- canonical은 `/writing`, `/projects` 내부 URL을 사용한다.
- Open Graph type은 `website`를 사용한다.

### Search Indexing Rules

- Draft 콘텐츠는 public route, `generateStaticParams`, sitemap, metadata에 포함되지 않는다.
- `notFound()` 처리된 페이지는 Next.js가 noindex metadata를 주입한다.
- sitemap에는 canonical URL만 포함한다.
- query string이 있는 목록 필터가 나중에 생겨도 canonical은 index pathname을 유지한다.
- 중복 원문이 외부에 있으면 content metadata의 `canonical` absolute URL을 사용한다.

### Structured Data

초기 범위에서는 JSON-LD structured data를 구현하지 않는다.

이유:

- 현재 콘텐츠 모델과 페이지 구조를 먼저 안정화해야 한다.
- `BlogPosting`, `Article`, `CreativeWork` 중 어떤 schema를 쓸지 프로젝트 성격에 맞춰 별도 결정이 필요하다.
- 잘못된 structured data는 검색 품질에 오히려 나쁜 신호가 될 수 있다.

필요해지면 별도 SEO enhancement 스펙에서 다룬다.

## Test Plan

### Red

구현 전 다음 실패 상태를 먼저 정의한다.

- deployed production 검증 모드에서 `SITE_URL` 없이 URL 유틸을 호출하면 실패해야 한다.
- local build는 `SITE_URL` 없이도 fallback으로 통과해야 한다.
- draft content fixture가 `generateStaticParams` 결과에 포함되면 실패해야 한다.
- draft content fixture가 sitemap 결과에 포함되면 실패해야 한다.
- 존재하지 않는 slug를 조회하면 page와 `generateMetadata`가 `notFound()` 경로를 타야 한다.
- detail page metadata builder가 title, description, canonical을 누락하면 실패해야 한다.
- sitemap builder가 `/`, `/writing`, `/projects` 중 하나를 빠뜨리면 실패해야 한다.

### Green

구현 후 다음 자동 검증을 통과해야 한다.

- `npm run lint`
- `npm run build`
- URL utility tests
- metadata builder tests
- sitemap builder tests
- route static params filtering tests

테스트 러너가 아직 없다면, 이 스펙 구현 시 가장 작은 검증 방식을 선택한다. 우선순위는 TypeScript 타입 검증, 작은 Node 기반 assertion script, 테스트 러너 도입 순서다. 테스트 러너를 도입하려면 별도 dependency decision을 남긴다.

### Manual Verification

라우팅 구현 후 local server에서 확인한다.

- `/writing`이 published writing 목록을 표시한다.
- `/projects`가 published project 목록을 표시한다.
- published detail URL이 렌더링된다.
- 존재하지 않는 detail URL은 404 UI를 표시한다.
- `/robots.txt`가 sitemap URL을 포함한다.
- `/sitemap.xml`에 draft URL이 없다.
- page source 또는 metadata inspection으로 canonical/title/description이 route별로 다름을 확인한다.
- desktop/mobile에서 heading, list, prose width가 `DESIGN.md`와 어긋나지 않는다.

## Acceptance Criteria

- `/writing`, `/writing/[slug]`, `/projects`, `/projects/[slug]`의 URL 계약이 문서화되어 있다.
- detail routes는 published 콘텐츠만 `generateStaticParams`에 포함한다.
- detail routes는 `dynamicParams = false`를 사용한다.
- detail pages와 `generateMetadata`는 `params`를 Promise로 처리한다.
- draft 또는 missing slug는 `notFound()`로 처리한다.
- root layout은 `metadataBase`, default title, title template, default description을 정의한다.
- 모든 public pages는 canonical URL을 가진다.
- canonical URL 생성은 `SITE_URL` 기반 로컬 유틸로 통일된다.
- `robots.ts`는 `MetadataRoute.Robots`를 사용하고 sitemap URL을 포함한다.
- `sitemap.ts`는 `MetadataRoute.Sitemap`을 사용하고 published URL만 포함한다.
- site-level `opengraph-image.tsx`는 `next/og`를 사용한다.
- SEO 구현을 위해 새 runtime dependency를 추가하지 않는다.
- structured data와 per-post OG image는 초기 범위에서 제외되어 있다.

## Rollout And Migration

권장 구현 순서:

1. `content-mdx.spec.md` 구현으로 content registry와 published read API를 먼저 준비한다.
2. `src/lib/url/site.ts`에 `SITE_URL` 정규화와 canonical URL 유틸을 추가한다.
3. `src/lib/seo/metadata.ts`에 route metadata builder를 추가한다.
4. `src/app/layout.tsx`의 root metadata를 title template과 metadataBase 기준으로 정리한다.
5. `/writing`, `/projects` index routes를 추가한다.
6. `/writing/[slug]`, `/projects/[slug]` detail routes를 `generateStaticParams`, `dynamicParams = false`, `generateMetadata`와 함께 추가한다.
7. `src/app/not-found.tsx`를 추가한다.
8. `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`를 추가한다.
9. lint, build, metadata, sitemap, browser verification을 수행한다.

마이그레이션:

- 현재 공개 글/프로젝트 라우트가 없으므로 URL migration은 없다.
- 기존 `/` metadata는 root layout metadata로 흡수하되, 홈페이지 시각 구조는 변경하지 않는다.

되돌리기:

- 라우트 구현을 되돌리면 `/writing`, `/projects`, detail pages, robots, sitemap, OG image가 사라진다.
- 콘텐츠 registry 자체는 `content-mdx` 범위이므로 이 스펙을 되돌려도 유지될 수 있다.

## Open Questions

- production canonical base로 사용할 최종 도메인을 확정해야 한다.
- projects detail의 Open Graph type을 계속 `article`로 둘지, 프로젝트 성격에 맞는 별도 metadata를 둘지 추후 확인한다.
- per-post dynamic OG image가 필요한지 콘텐츠 수와 공유 빈도를 보고 판단한다.
- JSON-LD structured data는 라우팅 구현 후 별도 enhancement로 다룬다.
- tag pages, RSS/Atom feed, search는 별도 스펙에서 다룬다.
