import type { MDXContent } from "mdx/types";
import type {
  ContentKind,
  ContentMetadata,
  ContentRecord,
} from "@/lib/content/types";

const metadataKeys = new Set([
  "title",
  "description",
  "publishedAt",
  "updatedAt",
  "tags",
  "draft",
  "canonical",
]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type DefineContentRecordInput = {
  kind: ContentKind;
  slug: string;
  metadata: unknown;
  Component: MDXContent;
};

export function defineContentRecord({
  kind,
  slug,
  metadata,
  Component,
}: DefineContentRecordInput): ContentRecord {
  validateSlug(slug, `${kind}/${slug}`);

  return {
    kind,
    slug,
    ...validateContentMetadata(metadata, `${kind}/${slug}`),
    Component,
  };
}

export function validateContentRegistry(
  records: readonly ContentRecord[],
): readonly ContentRecord[] {
  const seen = new Set<string>();

  for (const record of records) {
    const key = `${record.kind}:${record.slug}`;

    if (seen.has(key)) {
      throw new Error(`Duplicate content slug: ${record.kind}/${record.slug}`);
    }

    seen.add(key);
  }

  return records;
}

export function validateContentMetadata(
  metadata: unknown,
  label: string,
): ContentMetadata {
  if (!isRecord(metadata)) {
    throw new Error(`${label} metadata must be an object.`);
  }

  for (const key of Object.keys(metadata)) {
    if (!metadataKeys.has(key)) {
      throw new Error(`${label} metadata has unknown field "${key}".`);
    }
  }

  const title = requireString(metadata.title, `${label}.title`);
  const description = requireString(
    metadata.description,
    `${label}.description`,
  );
  const publishedAt = requireDate(metadata.publishedAt, `${label}.publishedAt`);
  const updatedAt =
    metadata.updatedAt === undefined
      ? undefined
      : requireDate(metadata.updatedAt, `${label}.updatedAt`);
  const tags = requireTags(metadata.tags, `${label}.tags`);
  const draft =
    metadata.draft === undefined
      ? undefined
      : requireBoolean(metadata.draft, `${label}.draft`);
  const canonical =
    metadata.canonical === undefined
      ? undefined
      : requireAbsoluteUrl(metadata.canonical, `${label}.canonical`);

  return {
    title,
    description,
    publishedAt,
    updatedAt,
    tags,
    draft,
    canonical,
  };
}

export function validateSlug(slug: string, label: string): void {
  if (!slugPattern.test(slug)) {
    throw new Error(`${label} slug must be lowercase kebab-case.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function requireDate(value: unknown, label: string): string {
  const date = requireString(value, label);

  if (!datePattern.test(date)) {
    throw new Error(`${label} must use YYYY-MM-DD format.`);
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`${label} must be a valid calendar date.`);
  }

  return date;
}

function requireTags(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value.map((tag, index) => requireString(tag, `${label}[${index}]`));
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }

  return value;
}

function requireAbsoluteUrl(value: unknown, label: string): string {
  const url = requireString(value, label);

  try {
    new URL(url);
  } catch {
    throw new Error(`${label} must be an absolute URL.`);
  }

  return url;
}
