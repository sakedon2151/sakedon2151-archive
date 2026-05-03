import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/content.module.css";
import { getPublishedProjectEntries } from "@/lib/content/registry";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getEntryPathname } from "@/lib/url/site";

export const metadata: Metadata = createPageMetadata({
  title: "프로젝트",
  description: "개인 블로그와 인터페이스 실험을 프로젝트 단위로 정리합니다.",
  pathname: "/projects",
});

export default function ProjectsPage() {
  const entries = getPublishedProjectEntries();

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.identity} href="/">
          sakedon2151
        </Link>
        <p className={styles.role}>Projects</p>
      </header>

      <section aria-labelledby="projects-title">
        <h1 className={styles.sectionTitle} id="projects-title">
          프로젝트
        </h1>
        <p className={styles.intro}>
          오래 쓸 수 있는 개인 도구와 작게 반복해 본 인터페이스 작업.
        </p>
      </section>

      <section aria-label="프로젝트 목록" className={styles.itemList}>
        {entries.map((entry) => (
          <Link
            className={styles.listItem}
            href={getEntryPathname(entry)}
            key={entry.slug}
          >
            <span className={styles.itemTitle}>{entry.title}</span>
            <span className={styles.itemDescription}>{entry.description}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
