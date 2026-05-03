import type { MDXContent } from "mdx/types";

export type ContentKind = "writing" | "project";

export type ContentMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: readonly string[];
  draft?: boolean;
  canonical?: string;
};

export type ContentEntry = ContentMetadata & {
  kind: ContentKind;
  slug: string;
};

export type ContentRecord = ContentEntry & {
  Component: MDXContent;
};
