declare module "*.mdx" {
  import type { ContentMetadata } from "@/lib/content/types";
  import type { MDXContent as MdxContentComponent } from "mdx/types";

  export const metadata: ContentMetadata;

  const Content: MdxContentComponent;
  export default Content;
}
