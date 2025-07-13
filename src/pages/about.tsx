import Head from "next/head";
import Link from "next/link";
import styles from "./Styles/about.module.css";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - My Art Gallery</title>
        <meta
          name="description"
          content="Learn more about our amazing art gallery."
        />
      </Head>

      <main className={styles.mainSection}>
        <h1>About Our Art Gallery</h1>
        <p>
          We are passionate about art and bringing beautiful creations to the
          world.
        </p>
        <Link href="/" className={styles.linkSection}>
          Go back Home
        </Link>
      </main>
    </>
  );
}
