# Workflow

이 프로젝트의 작업 방식은 SDD(Spec-Driven Development)와 TDD(Test-Driven Development)를 결합한다. 빠르게 만들되, 무엇을 왜 만드는지 먼저 고정하고 검증 가능한 기준으로 끝낸다.

## Core Loop

1. Context
2. Spec
3. Test Plan
4. Red
5. Green
6. Refactor
7. Verify
8. Document

이 순서를 생략하려면 변경이 문서/오타/기계적 포맷 수준임을 명확히 설명해야 한다.

## 1. Context

작업 전 확인한다.

- `AGENTS.md`
- `ARCHITECTURE.md`
- `STYLEGUIDE.md`
- `DESIGN.md`
- 관련 `docs/spec/*`
- 관련 Next.js 공식 문서 in `node_modules/next/dist/docs/`
- 관련 skill 문서

확인해야 할 질문:

- 이 변경은 어떤 사용자 문제를 해결하는가?
- 공개 URL, metadata, sitemap, robots, OG에 영향이 있는가?
- Server Component로 충분한가, Client Component가 필요한가?
- 새 의존성이 필요한가, 아니면 현재 스택으로 가능한가?
- 디자인 시스템 토큰 또는 컴포넌트 규칙을 바꾸는가?

## 2. Spec

기능 구현 전에는 `docs/spec/` 아래에 스펙을 작성한다. 최상위 컨텍스트 문서가 충분히 고도화되기 전에는 스펙 작성을 보류한다.

Spec 문서에는 최소한 다음을 포함한다.

- Problem
- Goals
- Non-goals
- User stories
- Content model or data model
- Routes and URLs
- SEO requirements
- Accessibility requirements
- Design requirements
- Technical approach
- Test plan
- Acceptance criteria
- Rollout or migration notes

작은 변경이라도 behavior가 바뀌면 수용 기준은 반드시 적는다.

## 3. Test Plan

구현 전에 검증 방법을 정한다.

Current baseline:

- `npm run lint`
- `npm run build`

UI changes:

- desktop browser check
- mobile browser check
- screenshot review for layout, line breaks, contrast, and overflow

Content/SEO changes:

- metadata verification
- generated route list or sitemap check when available
- heading hierarchy and semantic HTML review

Future test layers:

- content registry/schema tests
- component tests
- route/render tests
- end-to-end tests for core reading flows

테스트 도구가 아직 없을 때는 먼저 어떤 테스트가 필요한지 스펙에 적고, 도구 도입은 최소 의존성 원칙에 따라 판단한다.

## 4. Red

가능한 경우 먼저 실패 상태를 만든다.

Examples:

- content schema test that fails for missing metadata
- component test that fails for an accessibility state
- route test that fails for missing generated page
- snapshot or screenshot expectation that fails for layout regression
- explicit build/type error that demonstrates the missing implementation

문서 작업만 하는 경우 Red 단계는 "현재 문서에 없는 결정/규칙"을 diff로 드러내는 것으로 대체할 수 있다.

## 5. Green

수용 기준을 통과하는 가장 작은 구현을 한다.

- 범위를 넓히지 않는다.
- 스펙에 없는 기능을 끼워 넣지 않는다.
- 새 추상화는 실제 중복이나 복잡도가 생긴 뒤 도입한다.
- Client Component는 필요한 가장 작은 leaf에 둔다.
- 데이터 waterfall을 만들지 않는다.

## 6. Refactor

동작이 통과한 뒤 구조를 다듬는다.

- 이름을 도메인에 맞게 정리한다.
- 중복을 제거하되 premature abstraction은 피한다.
- CSS raw value가 반복되면 token으로 승격한다.
- 컴포넌트 API가 커지면 composition으로 나눈다.
- 문서와 실제 구현이 어긋나는지 확인한다.

## 7. Verify

완료 전 검증은 필수다.

Baseline commands:

```bash
npm run lint
npm run build
```

UI 작업:

- local server 실행
- desktop viewport 확인
- mobile viewport 확인
- core interaction 확인
- screenshot으로 overflow, line break, visual hierarchy 확인

SEO 작업:

- metadata output 확인
- canonical policy 확인
- robots/sitemap 영향 확인
- semantic heading 순서 확인

검증하지 못한 항목은 최종 보고에 명시한다.

## 8. Document

변경이 규칙을 바꾸면 문서를 함께 갱신한다.

- 구조 변경: `ARCHITECTURE.md`
- 코드 컨벤션 변경: `STYLEGUIDE.md`
- 디자인 토큰/패턴 변경: `DESIGN.md`
- 작업 방식 변경: `WORKFLOW.md`
- 기능 요구사항 변경: 관련 `docs/spec/*`

문서는 구현보다 느리게 따라오는 기록이 아니라, 다음 작업자가 사용하는 인터페이스다.

## Definition Of Done

작업은 다음 조건을 만족해야 완료다.

- 스펙 또는 요청 범위를 충족한다.
- 관련 수용 기준이 검증되었다.
- `npm run lint`가 통과한다.
- `npm run build`가 통과한다.
- UI 변경은 브라우저에서 확인했다.
- SEO 영향이 있으면 metadata/route/semantic structure를 확인했다.
- 새 의존성이 있으면 이유와 대안을 기록했다.
- 필요한 문서가 갱신되었다.

## Dependency Decision Checklist

새 패키지를 추가하기 전에 답한다.

- 현재 표준 API나 작은 로컬 유틸로 해결할 수 없는가?
- 런타임 번들에 포함되는가?
- Server Component 전용으로 격리할 수 있는가?
- 유지보수 상태와 타입 품질은 충분한가?
- 제거 비용은 낮은가?
- 스펙의 수용 기준을 직접적으로 만족시키는가?

## Handoff Format

최종 보고에는 간결하게 포함한다.

- 변경한 문서/파일
- 핵심 결정
- 실행한 검증
- 남은 의도적 미결정 사항
