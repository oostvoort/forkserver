import { useRef, useState } from 'react'
import styles from './mineblock.module.css'

function MineBlock({ onMineBlock }: { onMineBlock: () => void }) {
  const gifRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = () => {
    setPlaying(true)
    timerRef.current = setTimeout(() => {
      onMineBlock()
      handleMouseUp()
    }, 1500)
  }

  const handleMouseUp = () => {
    setPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return <div className={'flex items-center justify-center'}>
    {playing
      ? <img
        className={styles.playing}
        ref={gifRef}
        src={'mine_block.gif'}
        alt={'GIF'}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      : <img
        ref={gifRef}
        className={styles.notPlaying}
        src={'mine_block.png'}
        alt={'GIF'}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />}
  </div>

}

export default MineBlock
