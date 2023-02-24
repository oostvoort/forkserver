import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'


export { RouteGuard }

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { active } = useWeb3React()


  useEffect(() => {
    if (router.pathname != '/' && !active) {
      router.push('/')
    }
  }, [active, router])

  return (
    <>
      {children}
    </>
  )
}
