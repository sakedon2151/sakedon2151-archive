import styles from "./prose.module.css";

export type PostMetaProps = React.ComponentProps<"div"> & {
  publishedAt: string;
  tags?: readonly string[];
  updatedAt?: string;
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PostMeta({
  className,
  publishedAt,
  tags = [],
  updatedAt,
  ...props
}: PostMetaProps) {
  return (
    <div className={joinClassName(styles.postMeta, className)} {...props}>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      {updatedAt ? (
        <span>
          업데이트 <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </span>
      ) : null}
      {tags.length > 0 ? (
        <ul aria-label="태그" className={styles.tagList}>
          {tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00+09:00`));
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
