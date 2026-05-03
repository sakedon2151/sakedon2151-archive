import styles from "./prose.module.css";

export type CalloutVariant = "caution" | "note";

export type CalloutProps = React.ComponentProps<"aside"> & {
  children: React.ReactNode;
  title?: string;
  variant?: CalloutVariant;
};

const variantLabels: Record<CalloutVariant, string> = {
  caution: "주의",
  note: "노트",
};

export function Callout({
  children,
  className,
  title,
  variant = "note",
  ...props
}: CalloutProps) {
  return (
    <aside
      className={joinClassName(styles.callout, className)}
      data-variant={variant}
      {...props}
    >
      <div className={styles.calloutLabel}>
        {title ?? variantLabels[variant]}
      </div>
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  );
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
