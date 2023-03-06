import styles from './main.module.css'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import ConfigButton from '@/components/ConfigButton'

function Home() {

  return (
    <>
      <main className={styles.main}>
        <ConnectWalletButton />
        <ConfigButton />
      </main>
    </>
  )
}

export default Home
