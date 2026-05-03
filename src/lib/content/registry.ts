import BlogSystem, {
  metadata as blogSystemMetadata,
} from "@/content/projects/blog-system.mdx";
import DesignNotes, {
  metadata as designNotesMetadata,
} from "@/content/projects/design-notes.mdx";
import DraftProject, {
  metadata as draftProjectMetadata,
} from "@/content/projects/draft-private-system.mdx";
import InterfaceArchive, {
  metadata as interfaceArchiveMetadata,
} from "@/content/projects/interface-archive.mdx";
import DesignSystemAsTaste, {
  metadata as designSystemAsTasteMetadata,
} from "@/content/writing/design-system-as-taste.mdx";
import DraftProseLab, {
  metadata as draftProseLabMetadata,
} from "@/content/writing/draft-prose-lab.mdx";
import MinimalismNotEmpty, {
  metadata as minimalismNotEmptyMetadata,
} from "@/content/writing/minimalism-not-empty.mdx";
import QuietLinks, {
  metadata as quietLinksMetadata,
} from "@/content/writing/quiet-links.mdx";
import RestrainedUiDensity, {
  metadata as restrainedUiDensityMetadata,
} from "@/content/writing/restrained-ui-density.mdx";
import type { ContentRecord } from "@/lib/content/types";
import {
  defineContentRecord,
  validateContentRegistry,
} from "@/lib/content/validators";

const writingEntries = validateContentRegistry([
  defineContentRecord({
    kind: "writing",
    slug: "restrained-ui-density",
    metadata: restrainedUiDensityMetadata,
    Component: RestrainedUiDensity,
  }),
  defineContentRecord({
    kind: "writing",
    slug: "quiet-links",
    metadata: quietLinksMetadata,
    Component: QuietLinks,
  }),
  defineContentRecord({
    kind: "writing",
    slug: "design-system-as-taste",
    metadata: designSystemAsTasteMetadata,
    Component: DesignSystemAsTaste,
  }),
  defineContentRecord({
    kind: "writing",
    slug: "minimalism-not-empty",
    metadata: minimalismNotEmptyMetadata,
    Component: MinimalismNotEmpty,
  }),
  defineContentRecord({
    kind: "writing",
    slug: "draft-prose-lab",
    metadata: draftProseLabMetadata,
    Component: DraftProseLab,
  }),
]);

const projectEntries = validateContentRegistry([
  defineContentRecord({
    kind: "project",
    slug: "blog-system",
    metadata: blogSystemMetadata,
    Component: BlogSystem,
  }),
  defineContentRecord({
    kind: "project",
    slug: "design-notes",
    metadata: designNotesMetadata,
    Component: DesignNotes,
  }),
  defineContentRecord({
    kind: "project",
    slug: "interface-archive",
    metadata: interfaceArchiveMetadata,
    Component: InterfaceArchive,
  }),
  defineContentRecord({
    kind: "project",
    slug: "draft-private-system",
    metadata: draftProjectMetadata,
    Component: DraftProject,
  }),
]);

export function getPublishedWritingEntries(): ContentRecord[] {
  return sortEntries(writingEntries.filter(isPublished));
}

export function getPublishedProjectEntries(): ContentRecord[] {
  return sortEntries(projectEntries.filter(isPublished));
}

export function getPublishedWritingEntry(
  slug: string,
): ContentRecord | undefined {
  return getPublishedWritingEntries().find((entry) => entry.slug === slug);
}

export function getPublishedProjectEntry(
  slug: string,
): ContentRecord | undefined {
  return getPublishedProjectEntries().find((entry) => entry.slug === slug);
}

export function getAllPublishedEntries(): ContentRecord[] {
  return sortEntries([
    ...getPublishedWritingEntries(),
    ...getPublishedProjectEntries(),
  ]);
}

function isPublished(entry: ContentRecord): boolean {
  return entry.draft !== true;
}

function sortEntries(entries: readonly ContentRecord[]): ContentRecord[] {
  return [...entries].sort((a, b) => {
    const dateOrder = b.publishedAt.localeCompare(a.publishedAt);

    if (dateOrder !== 0) {
      return dateOrder;
    }

    return a.title.localeCompare(b.title, "ko");
  });
}
