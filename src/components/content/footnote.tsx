import styles from "./prose.module.css";

export type FootnoteProps = React.ComponentProps<"aside"> & {
  children: React.ReactNode;
  id: string;
};

export function Footnote({ children, className, id, ...props }: FootnoteProps) {
  const noteId = `fn-${id}`;
  const referenceId = `fnref-${id}`;

  return (
    <aside
      className={joinClassName(styles.footnote, className)}
      id={noteId}
      {...props}
    >
      <span className={styles.footnoteMarker}>{id}</span>
      <div>{children}</div>
      <a
        aria-label={`${id}번 각주 참조로 돌아가기`}
        className={styles.footnoteBacklink}
        href={`#${referenceId}`}
      >
        ↩
      </a>
    </aside>
  );
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
