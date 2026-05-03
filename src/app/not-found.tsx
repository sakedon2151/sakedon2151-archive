import Link from "next/link";
import styles from "@/app/content.module.css";

export default function NotFound() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.identity} href="/">
          sakedon2151
        </Link>
        <p className={styles.role}>404</p>
      </header>

      <section className={styles.notFound} aria-labelledby="not-found-title">
        <h1 className={styles.notFoundTitle} id="not-found-title">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className={styles.notFoundText}>
          공개된 글이나 프로젝트가 아니거나, 주소가 바뀌었을 수 있습니다.
        </p>
        <Link className={styles.notFoundLink} href="/">
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
