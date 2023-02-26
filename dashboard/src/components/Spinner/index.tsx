import styles from './spinner.module.css'

export default function Spinner() {
  return (
    <div className='flex justify-center items-center h-full'>
      <div className={styles.spinner}></div>
    </div>
  )
}
