import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/content.module.css";
import { getPublishedWritingEntries } from "@/lib/content/registry";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getEntryPathname } from "@/lib/url/site";

export const metadata: Metadata = createPageMetadata({
  title: "글",
  description: "절제된 UI, 디자인 시스템, 개발 감각에 대한 글을 모읍니다.",
  pathname: "/writing",
});

export default function WritingPage() {
  const entries = getPublishedWritingEntries();

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.identity} href="/">
          sakedon2151
        </Link>
        <p className={styles.role}>Writing</p>
      </header>

      <section aria-labelledby="writing-title">
        <h1 className={styles.sectionTitle} id="writing-title">
          글
        </h1>
        <p className={styles.intro}>
          작고 조용한 인터페이스를 만들기 위해 남겨두는 디자인과 개발의 기록.
        </p>
      </section>

      <section aria-label="글 목록" className={styles.itemList}>
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
