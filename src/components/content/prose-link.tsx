import Link from "next/link";
import styles from "./prose.module.css";

export type ProseLinkProps = React.ComponentProps<"a">;

export function ProseLink({ className, href, ...props }: ProseLinkProps) {
  const linkClassName = joinClassName(styles.link, className);

  if (href?.startsWith("/")) {
    return <Link className={linkClassName} href={href} {...props} />;
  }

  return <a className={linkClassName} href={href} {...props} />;
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
