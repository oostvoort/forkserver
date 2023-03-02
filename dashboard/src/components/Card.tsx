import React from 'react'

function Card({
                title,
                children
              }: { title: string, children: React.ReactNode }) {
  return (
    <div className='border border-green-400 rounded-md overflow-hidden'>
      <div className='px-4 py-2 bg-green-300 border-b border-green-400'>
        <h2 className='text-lg font-medium text-gray-800'>{title}</h2>
      </div>
      <div className='p-4'>
        {children}
      </div>
    </div>
  )
}

export default Card
