# Spec Index

이 디렉터리는 sakedon2151 blog app의 기능별 스펙을 관리한다. 스펙은 구현 전에 작성하는 계약서이며, 구현 이후에는 실제 동작과 문서가 계속 일치하도록 관리한다.

## Role

`docs/spec/`는 최상위 컨텍스트 문서를 기능 단위로 해석한다.

- `AGENTS.md`: 프로젝트 전체 지시사항과 우선순위
- `ARCHITECTURE.md`: 구조적 경계와 목표 아키텍처
- `STYLEGUIDE.md`: 코드 작성 규칙
- `DESIGN.md`: 디자인 시스템
- `WORKFLOW.md`: SDD + TDD 작업 흐름
- `docs/spec/*`: 개별 기능의 문제, 범위, 수용 기준, 검증 계획

스펙은 최상위 문서를 덮어쓰지 않는다. 최상위 문서와 충돌하면 먼저 최상위 문서를 수정할지, 스펙 범위를 조정할지 결정한다.

## Directory Structure

```txt
docs/spec/
  index.md
  global/
    *.md
  domains/
    *.md
```

- `global/`: 여러 기능에 걸친 기반 스펙. 예: MDX 콘텐츠 파이프라인, SEO, 라우팅, 디자인 토큰.
- `domains/`: 특정 사용자-facing 기능 스펙. 예: writing index, writing detail, projects.

필요해지기 전까지 하위 폴더를 더 만들지 않는다.

## Status

각 스펙은 문서 상단에 상태를 명시한다.

| Status | Meaning |
| --- | --- |
| `draft` | 문제와 방향을 정리 중이며 구현 기준으로 쓰지 않는다. |
| `accepted` | 구현 가능한 계약으로 승인된 상태다. |
| `implemented` | 구현과 검증이 완료되었고 실제 코드와 일치한다. |
| `superseded` | 다른 스펙으로 대체되었다. 대체 문서를 링크한다. |

Status 변경 기준:

- `draft` -> `accepted`: 목표, non-goals, 수용 기준, 테스트 계획이 충분히 구체적이다.
- `accepted` -> `implemented`: 구현, 검증, 관련 문서 업데이트가 완료되었다.
- `implemented` -> `draft`: 실제 요구사항이 바뀌어 재설계가 필요하다.

## Naming

파일명은 lowercase kebab-case를 사용한다.

Examples:

- `global/content-mdx.md`
- `global/routing-seo.md`
- `global/prose-components.md`
- `domains/writing-index.md`
- `domains/writing-detail.md`
- `domains/project-index.md`

한 스펙은 하나의 주요 결정 또는 기능 흐름만 다룬다. 파일이 너무 커지면 shared 기반 스펙과 domain 스펙으로 나눈다.

## Required Frontmatter

각 스펙은 Markdown 본문 최상단에 YAML frontmatter를 둔다.

```yaml
---
title: Content MDX
status: draft
owner: codex
created: 2026-05-03
updated: 2026-05-03
---
```

Fields:

- `title`: 사람이 읽는 스펙 이름
- `status`: `draft`, `accepted`, `implemented`, `superseded`
- `owner`: 현재 책임자. 혼자 작업할 때는 `codex` 또는 사용자 이름을 사용한다.
- `created`: 최초 작성일
- `updated`: 마지막 의미 있는 수정일
- `supersedes`: 선택. 대체하는 스펙 경로
- `supersededBy`: 선택. 대체된 경우 새 스펙 경로

## Spec Template

새 스펙은 아래 구조를 기본으로 한다.

```md
---
title: Spec Title
status: draft
owner: codex
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Spec Title

## Problem

어떤 사용자 문제 또는 프로젝트 리스크를 해결하는가?

## Goals

- 달성해야 하는 결과
- 사용자 또는 개발자에게 생기는 가치

## Non-Goals

- 이번 스펙에서 일부러 하지 않는 일
- 이후 스펙으로 넘기는 일

## Users And Use Cases

- 주요 사용자
- 핵심 사용 시나리오

## Scope

- 포함되는 라우트, 컴포넌트, 콘텐츠, 유틸
- 영향을 받는 문서

## Architecture

- 관련 파일/폴더 구조
- Server Component와 Client Component 경계
- 데이터 또는 콘텐츠 흐름
- 새 의존성 여부와 판단 근거

## Content Model

- 필요한 필드
- 타입 또는 schema
- 정렬, 필터링, draft 처리 규칙

## UX And Design

- 적용할 `DESIGN.md` 패턴
- 페이지/컴포넌트 구조
- responsive 고려사항
- 빈 상태, 오류 상태, loading 상태

## Accessibility

- semantic HTML
- heading order
- keyboard interaction
- focus behavior
- contrast or motion requirements

## SEO

- title/description 규칙
- canonical URL
- Open Graph/Twitter card
- sitemap/robots 영향
- structured data 여부

## Test Plan

- Red 단계에서 먼저 실패해야 하는 것
- 자동 검증
- 수동 브라우저 검증
- metadata/SEO 검증

## Acceptance Criteria

- 구현 완료를 판단할 수 있는 체크리스트

## Rollout And Migration

- 기존 코드/콘텐츠 마이그레이션
- 배포 전후 확인사항
- 되돌릴 때의 영향

## Open Questions

- 결정되지 않은 질문
- 결정을 미루는 이유
```

스펙 작성 시 해당하지 않는 섹션은 삭제하지 말고 `해당 없음`과 이유를 적는다. 그래야 나중에 의도적으로 제외했는지, 실수로 빠뜨렸는지 구분할 수 있다.

## Acceptance Criteria Rules

수용 기준은 검증 가능한 문장으로 작성한다.

Good:

- `/writing/[slug]`는 published MDX 글만 정적 경로로 생성한다.
- draft 글은 production sitemap에 포함되지 않는다.
- 글 상세 페이지의 `generateMetadata`는 title, description, canonical을 콘텐츠 metadata에서 생성한다.

Avoid:

- SEO가 좋아야 한다.
- UI가 예뻐야 한다.
- 성능이 빨라야 한다.

## Test Planning Rules

각 스펙은 TDD 관점의 검증 계획을 포함한다.

현재 기본 검증:

- `npm run lint`
- `npm run build`
- UI 변경 시 desktop/mobile browser screenshot

테스트 도구가 아직 없을 때도 Red 단계를 정의한다.

Examples:

- content registry가 없는 상태에서 schema 테스트가 실패해야 한다.
- metadata 생성 유틸이 없는 상태에서 title/canonical 검증이 실패해야 한다.
- 라우트가 없는 상태에서 build 또는 route 검증이 실패해야 한다.

새 테스트 도구를 도입하려면 스펙에 다음을 적는다.

- 왜 현재 검증으로 부족한가?
- 대안은 무엇인가?
- 런타임 의존성인가 dev dependency인가?
- 제거 비용은 낮은가?

## Dependency Rules

스펙에서 새 의존성을 제안할 때는 반드시 비교표를 포함한다.

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| No dependency |  |  |  |
| Package A |  |  |  |
| Package B |  |  |  |

기본값은 no dependency다. 추가 의존성은 사용자 가치, 유지보수성, 번들 영향, 타입 품질이 분명할 때만 선택한다.

## Initial Spec Roadmap

작성 순서는 다음을 권장한다.

1. `global/content-mdx.md`
   - MDX 설치 방식
   - content directory 구조
   - metadata schema
   - draft/published 처리

2. `global/routing-seo.md`
   - `/writing`, `/writing/[slug]`, `/projects`, `/projects/[slug]`
   - metadata, canonical, sitemap, robots, OG image 정책
   - 검색 색인 품질 기준

3. `global/prose-components.md`
   - MDX에서 허용할 컴포넌트
   - prose, code, image, callout, metadata 컴포넌트
   - accessibility와 responsive 기준

4. `domains/writing-index.md`
   - 글 목록 UX
   - 정렬, 태그, excerpt, empty state

5. `domains/writing-detail.md`
   - 글 상세 페이지
   - prose layout, metadata, related navigation

6. `domains/projects.md`
   - 프로젝트 목록과 상세 페이지
   - 글과 프로젝트의 콘텐츠 모델 차이

## Review Checklist

스펙을 `accepted`로 바꾸기 전에 확인한다.

- 최상위 문서와 충돌하지 않는다.
- 목표와 non-goals가 분리되어 있다.
- URL과 파일 구조가 명확하다.
- SEO 영향이 명시되어 있다.
- 접근성 요구사항이 있다.
- 디자인 시스템 참조가 있다.
- 테스트 계획이 Red/Green/Verify 흐름을 설명한다.
- 수용 기준이 측정 가능하다.
- 새 의존성 여부가 판단되어 있다.
- 미결정 질문이 숨겨져 있지 않다.

## Implementation Linkage

구현 PR 또는 작업 완료 보고에는 관련 스펙 경로를 명시한다.

구현 중 스펙과 다른 선택이 필요해지면:

1. 구현을 멈춘다.
2. 스펙을 먼저 수정한다.
3. 변경 이유를 기록한다.
4. 다시 구현한다.

스펙은 계획서이면서 변경 이력이다. 코드가 스펙을 몰래 앞서가면 안 된다.
