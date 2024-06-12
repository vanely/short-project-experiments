import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

//Using your knowledge of React and Next.js, please set up three routes within a "dashboard" folder. 
//One route provides a list of Collections, allows public access and it hits an api REST call. 
//Two other private routes list a static short list of Users, which can be selected to view any specific user.


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>User Dashboard App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Collections <Link href="/dashboard/collections">list</Link>
        </h1>
        <ul>

        </ul>
        </main>
    </div>
  )
}

