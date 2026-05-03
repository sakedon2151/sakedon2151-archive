import Link from "next/link";
import {
  getPublishedProjectEntries,
  getPublishedWritingEntries,
} from "@/lib/content/registry";
import { getEntryPathname } from "@/lib/url/site";
import styles from "./page.module.css";

const notes = [
  "본문 폭은 좁게 유지하고, 섹션 간격은 크게 둔다.",
  "장식은 상태 변화와 초점 표시처럼 필요한 순간에만 등장한다.",
  "텍스트 계층은 크기보다 색과 굵기로 만든다.",
];

export default function Home() {
  const projects = getPublishedProjectEntries();
  const writings = getPublishedWritingEntries();

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
              href={getEntryPathname(project)}
              key={project.slug}
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
              href={getEntryPathname(writing)}
              key={writing.slug}
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
