# Design System

Source reference: https://emilkowal.ski

이 프로젝트의 디자인 시스템은 참고 사이트의 화면을 그대로 복제하기보다, 그 안에서 반복되는 태도를 추출해 블로그에 맞게 정리한다. 핵심은 절제된 UI, 좁은 본문 폭, 낮은 대비, 큰 섹션 간격, 그리고 카드보다 텍스트 리스트를 우선하는 구조다.

## Principles

- Content first: 장식보다 글의 리듬과 탐색성이 먼저다.
- Quiet hierarchy: 크기 차이보다 굵기, 색, 간격으로 계층을 만든다.
- One-column reading: 기본 화면은 단일 컬럼이며, 본문 폭은 넓히지 않는다.
- Minimal chrome: 버튼, 배너, 카드, 그림자는 필요한 상태와 행동에만 쓴다.
- Warm neutrals: 완전한 흰색/검정만으로 끝내지 않고, 약간 따뜻한 회색을 쓴다.

## Tokens

### Layout

- Content width: `692px`
- Comfortable measure: `590px`
- Page x padding: `24px`
- Desktop y padding: `64px`
- Mobile y padding: `48px`
- Desktop section gap: `128px`
- Mobile section gap: `64px`

### Typography

- Base size: `16px`
- Base line height: `24px`
- Regular weight: `400`
- Emphasis weight: `500`
- Letter spacing: `0`
- Headings on index pages should stay body-sized unless a page truly needs editorial scale.

### Color

Light:

- Background: `#fdfdfc`
- Surface: `#ffffff`
- Hover surface: `#f5f4f4`
- Primary text: `#21201c`
- Muted text: `#63635e`
- Subtle text: `#8d8d86`
- Border: `#e9e9e7`

Dark:

- Background: `#0b0b09`
- Surface: `#111110`
- Hover surface: `#151514`
- Primary text: `#eeeeec`
- Muted text: `#b5b3ad`
- Subtle text: `#6f6d66`
- Border: `#2a2a28`

### Radius And Motion

- Small radius: `4px`
- List hover radius: `6px`
- Pills or inputs: `999px`
- Hover/focus duration: `140ms`
- Easing: `cubic-bezier(0.2, 0, 0, 1)`

## Components

### Page Shell

The page shell is centered, narrow, and mostly unframed. It should not sit inside a card. Use one column first, then add wider layouts only for pages that genuinely need comparison or media.

### Identity Header

The header is a small two-line signature:

- Name: medium weight, primary text.
- Role or descriptor: medium weight, muted text, tight line-height.
- Bottom margin is intentionally large to make the first content section feel deliberate.

### Section Label

Section labels are body-sized, medium-weight text. They are not large display headings. The surrounding whitespace gives them authority.

### Text List Item

The default repeated element is a text link with title and description. On desktop it may have a subtle hover fill with negative horizontal margin. On mobile it becomes plain text spacing with no visible card treatment.

### Prose

Paragraphs use muted text by default, with `16px/24px` rhythm. Avoid centered body copy and avoid long line lengths.

## Do Not

- Do not add marketing-style hero sections to the blog index.
- Do not use decorative gradient blobs, oversized cards, or loud shadows.
- Do not use rounded pills for plain labels.
- Do not make section headings large just to create hierarchy.
- Do not widen the reading column to fill desktop screens.
