import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { FundTokenForm } from '@/components/FundTokenForm'

function Home() {
  const { active } = useWeb3React()

  return (
    <div className={"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"}>
      <div className={'grid gap-4 grid-cols-3 grid-rows-3'}>
        <FundTokenForm />
      </div>
    </div>
  )
}

export default Home
