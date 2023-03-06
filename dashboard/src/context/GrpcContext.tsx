import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import React, { useMemo } from 'react'
import { ForkClient } from '@/proto/Forkserver.client'
import { ENV } from '@/config/constants'
import useConfigStore from '@/config/store'


interface IGrpcContext {
  forkClient: ForkClient
}

const defaultValue: IGrpcContext = {
  forkClient: new ForkClient(new GrpcWebFetchTransport({
    baseUrl: ENV.FORK_SERVER_ENDPOINT,
    format: 'binary'
  }))
}

const GrpcContext = React.createContext<IGrpcContext>(defaultValue)

export const GrpcContextProvider = ({ children }: { children: React.ReactNode }) => {
  const forkServerEndpoint = useConfigStore((state) => state.forkServerEndpoint)

  const forkClient = useMemo<ForkClient>(() => {
    return new ForkClient(new GrpcWebFetchTransport({
      baseUrl: forkServerEndpoint,
      format: 'binary'
    }))
  }, [forkServerEndpoint])

  return <GrpcContext.Provider value={{ forkClient }}>{children}</GrpcContext.Provider>
}

export const useGrpcContext = () => {
  const context = React.useContext(GrpcContext)
  if (context === undefined) {
    throw new Error('useGrpcContext must be used within a GrpcContextProvider')
  }

  return context
}

export default GrpcContextProvider
