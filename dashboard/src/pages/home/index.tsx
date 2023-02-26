import React from 'react'
import { FundTokenForm } from '@/components/FundTokenForm'
import { FundEthForm } from '@/components/FundEthForm'
import { MineBlockForm } from '@/components/MineBlockForm'

function Home() {
  return (
    <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'}>
      <div className={'grid gap-4 grid-cols-3 grid-rows-3'}>
        <FundTokenForm />
        <FundEthForm />
        <MineBlockForm/>
      </div>
    </div>
  )
}

export default Home
