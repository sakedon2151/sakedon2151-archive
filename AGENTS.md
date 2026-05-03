<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Agent Context

이 프로젝트는 최소 의존성을 가진 Next.js + MDX 기반 개인 블로그다. 글, 프로젝트, 노트 같은 개인 지식 자산을 로컬 MDX 콘텐츠로 관리하고, Next.js App Router의 정적 렌더링과 Metadata API를 활용해 검색 색인 품질이 높은 블로그를 만드는 것을 목표로 한다.

## Mandatory References

작업을 시작하기 전에 아래 문서를 먼저 읽고, 변경 범위에 맞는 문서의 규칙을 따른다.

- `ARCHITECTURE.md`: 프로젝트 구조, 라우팅, 콘텐츠/MDX/SEO 아키텍처
- `STYLEGUIDE.md`: TypeScript, React, Next.js, CSS, MDX 코드 컨벤션
- `DESIGN.md`: 페이지와 컴포넌트의 디자인 시스템
- `WORKFLOW.md`: SDD + TDD 기반 작업 흐름
- `docs/spec/`: 기능별 스펙. 최상위 문서가 충분히 안정된 뒤 작성한다.

문서 간 충돌이 있으면 우선순위는 다음과 같다.

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `WORKFLOW.md`
4. `STYLEGUIDE.md`
5. `DESIGN.md`
6. `docs/spec/*`

## Required Skills

이 프로젝트의 코드 작성, 리뷰, 리팩터링에는 다음 스킬의 원칙을 따른다.

- `next-best-practices`: Next.js App Router, RSC 경계, async params/searchParams, Metadata API, 이미지/폰트 최적화, 번들링 규칙
- `build-web-apps:react-best-practices`: waterfall 제거, bundle size 최소화, Server Component 우선, client boundary 축소, 재렌더링 최적화
- `building-components`: 접근성 기본값, 합성 가능한 컴포넌트 API, semantic HTML, design token 기반 스타일링

## Development Philosophy

이 프로젝트는 SDD(Spec-Driven Development)와 TDD(Test-Driven Development)를 함께 따른다.

- SDD: 구현 전에 목적, 사용자 가치, 범위, 아키텍처 영향, SEO 영향, 수용 기준을 문서화한다.
- TDD: 동작 변경에는 먼저 실패하는 테스트 또는 검증 가능한 수용 기준을 만들고, 최소 구현으로 통과시킨 뒤 리팩터링한다.
- UI 변경은 코드 테스트만으로 끝내지 않고 브라우저 캡처/상호작용 확인까지 수행한다.
- 문서 변경은 구현 변경과 같은 품질 기준을 가진다. 문서가 실제 코드와 어긋나면 문서 또는 코드를 함께 수정한다.

## Dependency Policy

최소 의존성이 기본값이다.

- 새 런타임 의존성은 명확한 스펙, 대안 비교, 번들/유지보수 비용 검토 없이 추가하지 않는다.
- MDX 지원은 Next.js 공식 `@next/mdx` 경로를 우선한다.
- 콘텐츠 인덱싱, frontmatter 파싱, RSS, 검색 등은 필요가 확정되기 전까지 직접 구현 또는 작은 표준 API를 우선 검토한다.
- UI 컴포넌트 라이브러리는 기본 선택지가 아니다. 필요한 경우 컴포넌트 단위로 명시적인 스펙을 작성한다.

## Next.js Rules

- Next.js 문법, 파일 컨벤션, async API는 설치된 버전의 공식 문서(`node_modules/next/dist/docs/`)를 기준으로 한다.
- App Router를 사용한다. Pages Router를 새로 추가하지 않는다.
- 페이지와 레이아웃은 기본적으로 Server Component다. `'use client'`는 상호작용이 필요한 가장 작은 leaf 컴포넌트에만 둔다.
- `params`, `searchParams`, `cookies()`, `headers()`는 Next.js 15+ 규칙에 맞춰 async API로 다룬다.
- 내부 콘텐츠 읽기는 API route를 만들지 말고 Server Component 또는 서버 전용 유틸에서 직접 처리한다.
- 외부 공개 API, webhook, 비 UI 클라이언트용 endpoint가 필요할 때만 Route Handler를 쓴다.

## SEO And Indexing

외부 검색엔진의 색인 품질을 중요한 제품 요구사항으로 취급한다.

- 모든 공개 페이지는 고유한 title, description, canonical URL 정책을 가진다.
- 글 상세 페이지는 `generateMetadata`로 콘텐츠 기반 metadata를 생성한다.
- `robots.ts`, `sitemap.ts`, Open Graph 이미지는 스펙이 준비되면 App Router 파일 컨벤션으로 구현한다.
- 페이지 구조는 semantic HTML을 우선하고, heading 계층을 건너뛰지 않는다.
- 콘텐츠 페이지는 서버 렌더링/정적 생성 친화적으로 작성한다.

## Component Rules

- 컴포넌트는 semantic HTML을 먼저 사용하고, ARIA는 semantic HTML로 충분하지 않을 때 보강한다.
- 합성이 가능한 작은 컴포넌트를 선호한다. 복잡한 variant prop보다 명확한 하위 컴포넌트와 조합을 우선한다.
- 컴포넌트 props는 native HTML attributes를 확장하고, 커스텀 prop 타입을 export한다.
- CSS는 design token과 CSS Modules를 우선한다. 전역 CSS는 reset, token, base typography에 한정한다.
- 디자인 변경은 반드시 `DESIGN.md`의 원칙과 토큰을 먼저 확인한다.
