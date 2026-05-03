import styles from "./prose.module.css";
import { ProsePre } from "./prose-pre";

export type CodeBlockProps = React.ComponentProps<"figure"> & {
  children: React.ReactNode;
  filename?: string;
  language?: string;
};

export function CodeBlock({
  children,
  className,
  filename,
  language,
  ...props
}: CodeBlockProps) {
  return (
    <figure className={joinClassName(styles.codeBlock, className)} {...props}>
      {filename || language ? (
        <figcaption className={styles.codeCaption}>
          {[filename, language].filter(Boolean).join(" · ")}
        </figcaption>
      ) : null}
      <ProsePre>
        <code data-language={language}>{children}</code>
      </ProsePre>
    </figure>
  );
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
