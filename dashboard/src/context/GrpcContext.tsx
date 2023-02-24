import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import React from 'react'
import { ForkClient } from '@/proto/Forkserver.client'

const GRPC_SERVICE_HOST = 'http://127.0.0.1:3000'

const GRPC_TRANSPORT = new GrpcWebFetchTransport({
  baseUrl: GRPC_SERVICE_HOST,
  format: 'binary'
})

interface IGrpcContext {
  forkClient: ForkClient
}

const defaultValue: IGrpcContext = {
  forkClient: new ForkClient(GRPC_TRANSPORT)
}

const GrpcContext = React.createContext<IGrpcContext>(defaultValue)

export const GrpcContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <GrpcContext.Provider value={defaultValue}>{children}</GrpcContext.Provider>
}

export const useGrpcContext = () => {
  const context = React.useContext(GrpcContext)
  if (context === undefined) {
    throw new Error('useGrpcContext must be used within a GrpcContextProvider')
  }

  return context
}

export default GrpcContext
