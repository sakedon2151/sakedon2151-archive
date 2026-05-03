import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/app/content.module.css";
import { PostMeta } from "@/components/content/post-meta";
import { ProseRoot } from "@/components/content/prose-root";
import {
  getPublishedWritingEntries,
  getPublishedWritingEntry,
} from "@/lib/content/registry";
import { createEntryMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedWritingEntries().map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = getPublishedWritingEntry(slug);

  if (!entry) {
    notFound();
  }

  return createEntryMetadata(entry);
}

export default async function WritingDetailPage(
  props: PageProps<"/writing/[slug]">,
) {
  const { slug } = await props.params;
  const entry = getPublishedWritingEntry(slug);

  if (!entry) {
    notFound();
  }

  const Content = entry.Component;

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.backLink} href="/writing">
          글
        </Link>
        <p className={styles.role}>Writing</p>
      </header>

      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{entry.title}</h1>
          <p className={styles.articleDescription}>{entry.description}</p>
          <PostMeta
            publishedAt={entry.publishedAt}
            tags={entry.tags}
            updatedAt={entry.updatedAt}
          />
        </header>
        <ProseRoot>
          <Content />
        </ProseRoot>
      </article>
    </main>
  );
}
