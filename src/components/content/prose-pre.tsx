import styles from "./prose.module.css";

export type ProsePreProps = React.ComponentProps<"pre">;

export function ProsePre({ className, ...props }: ProsePreProps) {
  return <pre className={joinClassName(styles.pre, className)} {...props} />;
}

export type ProseCodeProps = React.ComponentProps<"code">;

export function ProseCode({ className, ...props }: ProseCodeProps) {
  return (
    <code className={joinClassName(styles.inlineCode, className)} {...props} />
  );
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
