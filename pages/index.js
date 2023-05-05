import Head from "next/head"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottory</title>
        <meta name="description" content="Our Smart Contract Lottory"></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      {/* <ManualHeader /> */}
      <Header/>
      <LotteryEntrance/>
    </div>
  )
}

