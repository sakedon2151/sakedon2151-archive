import type { Metadata } from "next";
import type { ContentEntry } from "@/lib/content/types";
import { getCanonicalUrl, getEntryCanonicalUrl } from "@/lib/url/site";

export const siteName = "sakedon2151";
export const siteDescription =
  "절제된 UI와 미니멀리즘을 바탕으로 만든 개인 블로그.";

type PageMetadataInput = {
  description: string;
  pathname: string;
  title?: string;
};

export function createPageMetadata({
  description,
  pathname,
  title,
}: PageMetadataInput): Metadata {
  const canonical = getCanonicalUrl(pathname);
  const resolvedTitle = title ?? siteName;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      siteName,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}

export function createEntryMetadata(entry: ContentEntry): Metadata {
  const canonical = getEntryCanonicalUrl(entry);

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: canonical,
      siteName,
      locale: "ko_KR",
      type: "article",
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt,
      tags: [...entry.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
    },
  };
}
