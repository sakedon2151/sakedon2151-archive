# Design System

Source reference: https://emilkowal.ski

이 디자인 시스템은 참고 사이트의 표면을 복제하지 않는다. 대신 절제된 UI, 미니멀리즘, 좁은 읽기 폭, 낮은 대비, 큰 호흡의 섹션 리듬을 이 블로그에 맞는 규칙으로 정리한다.

## Design Principles

- Content first: 화면은 글과 링크를 돕는다. 장식은 콘텐츠보다 앞서지 않는다.
- Quiet hierarchy: 크기보다 굵기, 색, 간격으로 계층을 만든다.
- One-column default: 블로그의 기본 경험은 한 줄기의 읽기 흐름이다.
- Minimal chrome: 버튼, 카드, 그림자, 배지는 필요한 기능이 있을 때만 쓴다.
- Warm neutrality: 완전한 흰색/검정 대비보다 따뜻한 회색의 낮은 대비를 쓴다.
- Durable pages: 유행하는 장식보다 오래 봐도 피로하지 않은 조형을 우선한다.

## Token Model

Design tokens live in `src/app/globals.css`. Component CSS must consume semantic tokens rather than duplicating raw values.

### Layout

| Token | Value | Purpose |
| --- | ---: | --- |
| `--layout-content` | `692px` | index/list page max width |
| `--layout-measure` | `590px` | prose max width |
| `--space-page-x` | `24px` | horizontal page gutter |
| `--space-page-y` | `64px` | desktop vertical page padding |
| `--space-section` | `128px` | desktop section gap |
| mobile section gap | `64px` | compact section rhythm |

Rules:

- Do not widen prose to fill desktop screens.
- Use the content width as a ceiling, not a fixed desktop column.
- Prefer vertical rhythm over bordered section containers.

### Typography

| Role | Size | Line height | Weight |
| --- | ---: | ---: | ---: |
| body | `16px` | `24px` | `400` |
| section label | `16px` | `24px` | `500` |
| list title | `16px` | `24px` | `400` or `500` by context |
| metadata | `16px` | `24px` | `400` |

Rules:

- Index headings stay body-sized unless a spec explicitly calls for editorial scale.
- Do not use negative letter spacing.
- Do not scale font size with viewport width.
- Korean copy uses `word-break: keep-all` and `overflow-wrap: break-word`.
- Prose should feel readable before it feels styled.

### Color

Light palette:

| Token | Value |
| --- | --- |
| background | `#fdfdfc` |
| surface | `#ffffff` |
| muted surface | `#f9f9f8` |
| hover surface | `#f5f4f4` |
| primary text | `#21201c` |
| muted text | `#63635e` |
| subtle text | `#8d8d86` |
| border | `#e9e9e7` |

Dark palette:

| Token | Value |
| --- | --- |
| background | `#0b0b09` |
| surface | `#111110` |
| muted surface | `#191918` |
| hover surface | `#151514` |
| primary text | `#eeeeec` |
| muted text | `#b5b3ad` |
| subtle text | `#6f6d66` |
| border | `#2a2a28` |

Rules:

- Primary text should be quiet but readable.
- Muted text is for descriptions, dates, excerpts, and supporting prose.
- Avoid saturated accents unless a spec defines a semantic state.
- Link underline color may be quieter than text, but hover/focus must be clear.

### Radius, Shadow, Motion

- `--radius-sm`: `4px`
- `--radius-md`: `6px`
- `--radius-full`: `999px`
- list hover duration: `140ms`
- easing: `cubic-bezier(0.2, 0, 0, 1)`
- focus ring: tokenized two-ring shadow

Rules:

- Rounded corners are subtle. Default repeated list items use `6px`.
- Shadows are rare. Prefer spacing and background change.
- Motion is functional and short.
- Respect `prefers-reduced-motion`.

## Page Patterns

### Page Shell

The shell is centered and unframed. It should not look like a card.

Use for:

- home
- writing index
- project index
- article detail pages with prose width constraints

Avoid:

- full-width marketing hero sections
- nested cards
- centered paragraphs

### Identity Header

The default header is a compact text signature.

- First line: identity, medium weight, primary text.
- Second line: role/descriptor, medium weight, muted text, tight line-height.
- The gap after the header is intentionally large.

### Section Label

Section labels are body-sized text with medium weight. They are not decorative eyebrows or pills.

Use labels such as:

- `오늘`
- `글`
- `프로젝트`
- `노트`

### Text List Item

The default repeated pattern is a text link with title and description.

Desktop:

- negative horizontal margin is allowed for hover affordance
- hover uses quiet surface fill
- no border by default

Mobile:

- no hover-only visual dependency
- larger vertical gap
- no card background

### Prose

Article prose should be sparse and durable.

- Use `article` as the main wrapper.
- One visible `h1` per article.
- Paragraphs use muted text only when the whole prose style calls for quiet reading; use primary text for dense long-form reading if contrast needs improve.
- Code, blockquote, image, and callout treatments must be specified before implementation.

## Component Patterns

### Link

- Inline prose links use underline.
- List links may omit underline if layout clearly communicates clickability.
- External links should not require icon decoration by default.

### Button

Buttons are for actions, not navigation lists.

- Primary button: dark fill, light text, full radius only when it is a true compact command.
- Secondary button: border or quiet surface.
- Icon-only buttons require accessible names and stable square dimensions.

### Card

Cards are not the default blog primitive.

Use cards only for:

- repeated visual media items
- modal/dialog surfaces
- framed tools or previews

Do not wrap page sections in cards.

### MDX Components

Approved MDX components should look like part of prose, not app chrome.

Initial candidates:

- `ProseImage`
- `CodeBlock`
- `Callout`
- `Footnote`
- `PostMeta`

Each MDX component requires a spec before implementation.

## Responsive Rules

- Mobile starts at the same content-first hierarchy.
- Do not shrink text below `16px` for prose.
- Avoid layout shifts on hover, focus, or dynamic content.
- Keep readable line length with width constraints, not viewport font scaling.
- Verify mobile screenshots for Korean line breaks.

## Anti-Patterns

- Oversized hero sections on the blog index
- Decorative gradient blobs, bokeh, or ornamental backgrounds
- Card grids for simple writing lists
- Badge/pill labels used as section titles
- Large shadows on content surfaces
- Low-contrast text below readable thresholds
- Image or icon decoration that does not communicate content
- Widening content because desktop has empty space
