import styles from "./prose.module.css";

export type ProseRootProps = React.ComponentProps<"div">;

export function ProseRoot({ className, ...props }: ProseRootProps) {
  return <div className={joinClassName(styles.root, className)} {...props} />;
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
