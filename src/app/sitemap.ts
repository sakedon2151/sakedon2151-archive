import type { MetadataRoute } from "next";
import { getAllPublishedEntries } from "@/lib/content/registry";
import { getCanonicalUrl, getEntryPathname } from "@/lib/url/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getAllPublishedEntries().map((entry) => ({
    url: getCanonicalUrl(getEntryPathname(entry)),
    lastModified: toLocalDate(entry.updatedAt ?? entry.publishedAt),
  }));

  return [
    {
      url: getCanonicalUrl("/"),
    },
    {
      url: getCanonicalUrl("/writing"),
    },
    {
      url: getCanonicalUrl("/projects"),
    },
    ...entries,
  ];
}

function toLocalDate(date: string): string {
  return `${date}T00:00:00+09:00`;
}
