import Head from "next/head";
import Link from "next/link";
import styles from "../Styles/info.module.css";

export async function getStaticProps() {
  const buildDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  return {
    props: {
      infoMessage: `This page was built statically on ${buildDate}.`,
      version: "1.0",
    },
  };
}

export default function Info({
  infoMessage,
  version,
}: {
  infoMessage: string;
  version: string;
}) {
  return (
    <>
      <Head>
        <title>App Info - My Art Gallery</title>
        <meta name="description" content="Information about the application." />
      </Head>

      <main className={styles.mainSection}>
        <h1>App Information</h1>
        <p>{infoMessage}</p>
        <p>App Version: {version}</p>
        <Link href="/" className={styles.linkSection}>
          Go back Home
        </Link>
      </main>
    </>
  );
}
