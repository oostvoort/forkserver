import styles from './main.module.css'
import ConnectWalletButton from '@/components/ConnectWalletButton'

function Home() {

  return (
    <>
      <main className={styles.main}>
        <ConnectWalletButton />
      </main>
    </>
  )
}
export default Home
