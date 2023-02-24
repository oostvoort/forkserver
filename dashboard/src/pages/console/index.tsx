import React, { useEffect } from 'react'
import { Terminal } from 'primereact/terminal'
import { TerminalService } from 'primereact/terminalservice'
import styles from './style.module.css'

export default function Console() {
  const commandHandler = (text: string) => {
    let response
    let args = text.substring(text.indexOf(' ') + 1).split(' ')
    let command = text.indexOf(' ') !== -1 ? text.substring(0, text.indexOf(' ')) : text

    switch (command) {
      case 'date':
        response = 'Today is ' + new Date().toDateString()
        break

      case 'greet':
        if (!args[0] || !args[1] || args.length > 2) {
          response = 'Invalid arguments'
        } else response = 'Hola ' + args[0] + args[1] + '!'
        break

      case 'random':
        response = Math.floor(Math.random() * 100)
        break

      case 'clear':
        response = null
        break

      default:
        response = 'Unknown command: ' + command
        break
    }

    if (response)
      TerminalService.emit('response', response)
    else
      TerminalService.emit('clear')
  }

  useEffect(() => {
    TerminalService.on('command', commandHandler)

    return () => {
      TerminalService.off('command', commandHandler)
    }
  }, [])

  return (
    <div>
      <Terminal className={styles.terminal} prompt='/' />
    </div>
  )
}
