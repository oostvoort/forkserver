import { useEffect, useRef } from 'react'
// @ts-ignore
import createLogo from '@metamask/logo'
import meshJson from './fade-fox.json'

const Fox = ({
               pxNotRatio = true,
               width = 500,
               height = 400,
               followMouse = false,
               slowDrift = false
             }: Props) => {

  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current as any
    const viewer = createLogo({
      pxNotRatio,
      width,
      height,
      followMouse,
      slowDrift,
      meshJson
    })

    viewer.lookAt({
      x: 100,
      y: 100
    })

    container.appendChild(viewer.container)

    return () => {
      viewer.stopAnimation()
      container.removeChild(viewer.container)
    }
  }, [containerRef, followMouse, height, pxNotRatio, slowDrift, width])

  return <div ref={containerRef} />
}

interface Props {
  pxNotRatio?: boolean
  width?: number | string
  height?: number | string
  followMouse?: boolean
  slowDrift?: boolean
}

export default Fox
