import styles from './main.module.css'
import ConnectWalletButton from '@/components/ConnectWalletButton'

export default function Home() {

  return (
    <>
      <main className={styles.main}>
        <ConnectWalletButton />
      </main>
    </>
  )
}
