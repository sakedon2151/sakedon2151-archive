import Image, { type ImageProps } from "next/image";
import styles from "./prose.module.css";

export type ProseImageProps = Omit<
  ImageProps,
  "alt" | "height" | "priority" | "width"
> & {
  alt: string;
  caption?: React.ReactNode;
  height: number;
  width: number;
};

export function ProseImage({
  alt,
  caption,
  className,
  sizes = "(max-width: 640px) calc(100vw - 48px), 590px",
  ...props
}: ProseImageProps) {
  if (alt.trim() === "") {
    throw new Error("ProseImage requires meaningful alt text.");
  }

  return (
    <figure className={styles.imageFigure}>
      <Image
        alt={alt}
        className={joinClassName(styles.image, className)}
        sizes={sizes}
        {...props}
      />
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function joinClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}
