import Link from "next/link";
import styles from "./page.module.css";

const projects = [
  {
    title: "Blog System",
    description: "글, 노트, 레퍼런스를 한 줄기 흐름으로 정리하는 개인 블로그.",
    href: "/projects/blog-system",
  },
  {
    title: "Design Notes",
    description: "작은 UI 결정과 구현 감각을 기록하는 디자인 엔지니어링 노트.",
    href: "/projects/design-notes",
  },
  {
    title: "Interface Archive",
    description: "절제된 인터페이스 패턴을 관찰하고 다시 사용할 수 있게 저장.",
    href: "/projects/interface-archive",
  },
];

const writings = [
  {
    title: "절제된 UI를 위한 밀도",
    description: "공백, 대비, 타이포그래피가 화면의 온도를 결정하는 방식.",
    href: "/writing/restrained-ui-density",
  },
  {
    title: "작게 보이는 링크의 힘",
    description: "카드 없이도 충분히 탐색 가능한 리스트 인터랙션 만들기.",
    href: "/writing/quiet-links",
  },
  {
    title: "디자인 시스템은 감각의 문서화다",
    description: "색상표보다 먼저 합의해야 하는 태도와 규칙.",
    href: "/writing/design-system-as-taste",
  },
  {
    title: "미니멀리즘과 비어 있음의 차이",
    description: "덜어낸 화면이 허전하지 않게 느껴지는 조건.",
    href: "/writing/minimalism-not-empty",
  },
];

const notes = [
  "본문 폭은 좁게 유지하고, 섹션 간격은 크게 둔다.",
  "장식은 상태 변화와 초점 표시처럼 필요한 순간에만 등장한다.",
  "텍스트 계층은 크기보다 색과 굵기로 만든다.",
];

export default function Home() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.identity} href="/">
          sakedon2151
        </Link>
        <p className={styles.role}>Design / Engineering</p>
      </header>

      <section className={styles.section} aria-labelledby="today-title">
        <h1 className={styles.sectionTitle} id="today-title">
          오늘
        </h1>
        <div className={styles.prose}>
          <p>
            절제된 UI와 미니멀리즘을 바탕으로, 글이 가장 먼저 읽히는 블로그
            시스템을 만듭니다. 인터페이스는 조용하게 물러나고, 링크와 문장은
            필요한 만큼만 존재합니다.
          </p>
          <p>
            디자인, 개발, 일상의 관찰을 오래 남길 수 있는 짧은 기록으로
            정리합니다.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="projects-title">
        <h2 className={styles.sectionTitle} id="projects-title">
          프로젝트
        </h2>
        <div className={styles.itemList}>
          {projects.map((project) => (
            <Link
              className={styles.listItem}
              href={project.href}
              key={project.title}
            >
              <span className={styles.itemTitle}>{project.title}</span>
              <span className={styles.itemDescription}>
                {project.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="writing-title">
        <h2 className={styles.sectionTitle} id="writing-title">
          글
        </h2>
        <div className={styles.itemList}>
          {writings.map((writing) => (
            <Link
              className={styles.listItem}
              href={writing.href}
              key={writing.title}
            >
              <span className={styles.itemTitle}>{writing.title}</span>
              <span className={styles.itemDescription}>
                {writing.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="notes-title">
        <h2 className={styles.sectionTitle} id="notes-title">
          노트
        </h2>
        <ul className={styles.noteList}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="more-title">
        <h2 className={styles.sectionTitle} id="more-title">
          더 보기
        </h2>
        <p className={styles.moreText}>
          더 많은 작업과 코드 기록은{" "}
          <a
            href="https://github.com/sakedon2151"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          에서 이어갑니다.
        </p>
      </section>
    </main>
  );
}
