import React from 'react'
import FundTokenCard from '@/components/FundTokenCard'
import FundEthCard from '@/components/FundEthCard'
import MineBlockCard from '@/components/MineBlockCard'
import StateManagementCard from '@/components/StateManagementCard'
import IncreaseTimeCard from '@/components/IncreaseTimeCard'

function Home() {
  return (
    <div className={'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'}>
      <div className={'grid gap-4 grid-cols-3'}>
        <FundTokenCard />
        <StateManagementCard />
        <MineBlockCard />
        <FundEthCard />
        <IncreaseTimeCard />
      </div>
    </div>
  )
}

export default Home
