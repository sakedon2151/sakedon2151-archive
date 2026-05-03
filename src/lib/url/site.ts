import type { ContentEntry } from "@/lib/content/types";

const localSiteUrl = "http://localhost:3000";

type SiteUrlOptions = {
  requireConfigured?: boolean;
};

export function getSiteUrl(options: SiteUrlOptions = {}): string {
  const configuredUrl = process.env.SITE_URL?.trim();

  if (!configuredUrl) {
    if (options.requireConfigured) {
      throw new Error("SITE_URL must be configured for deployed production.");
    }

    return localSiteUrl;
  }

  return normalizeSiteUrl(configuredUrl);
}

export function getCanonicalUrl(pathname: string): string {
  const siteUrl = getSiteUrl();
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/") {
    return siteUrl;
  }

  return `${siteUrl}${normalizedPathname}`;
}

export function getEntryPathname(
  entry: Pick<ContentEntry, "kind" | "slug">,
): `/writing/${string}` | `/projects/${string}` {
  if (entry.kind === "writing") {
    return `/writing/${entry.slug}`;
  }

  return `/projects/${entry.slug}`;
}

export function getEntryCanonicalUrl(entry: ContentEntry): string {
  return entry.canonical ?? getCanonicalUrl(getEntryPathname(entry));
}

function normalizeSiteUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be an absolute URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https.");
  }

  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function normalizePathname(pathname: string): string {
  const withoutHash = pathname.split("#")[0] ?? "/";
  const withoutSearch = withoutHash.split("?")[0] ?? "/";
  const withLeadingSlash = withoutSearch.startsWith("/")
    ? withoutSearch
    : `/${withoutSearch}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  const withoutTrailingSlash =
    collapsed.length > 1 ? collapsed.replace(/\/+$/, "") : collapsed;

  return withoutTrailingSlash || "/";
}
