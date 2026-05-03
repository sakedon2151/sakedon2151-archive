import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/content/callout";
import { CodeBlock } from "@/components/content/code-block";
import { Footnote } from "@/components/content/footnote";
import { ProseImage } from "@/components/content/prose-image";
import { ProseLink } from "@/components/content/prose-link";
import { ProseCode, ProsePre } from "@/components/content/prose-pre";

const components: MDXComponents = {
  a: ProseLink,
  code: ProseCode,
  pre: ProsePre,
  Callout,
  CodeBlock,
  Footnote,
  ProseImage,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
