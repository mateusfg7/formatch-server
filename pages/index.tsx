import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Formatch</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Formatch!</h1>

        <div className={styles.grid}>
          <a
            href='https://github.com/mateusfg7/formatch'
            className={styles.card}
          >
            <h2>App Source &rarr;</h2>
            <p>
              Git repository on Github containing the source-code of the app.
            </p>
          </a>

          <a
            href='https://github.com/mateusfg7/formatch-web'
            className={styles.card}
          >
            <h2>Api/Web Source &rarr;</h2>
            <p>
              Git repository on Github containing the source-code of the API and
              Web Client.
            </p>
          </a>

          <Link href='/articles' className={styles.card}>
            <h2>Articles &rarr;</h2>
            <p>All articles published on Formatch Database.</p>
          </Link>

          <Link
            href='/article/create'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.card}
          >
            <h2>Create article &rarr;</h2>
            <p>Create a new article</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by Mateus Felipe (mateusfg7)
      </footer>
    </div>
  )
}
