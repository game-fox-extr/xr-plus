import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  chatSocket: Socket | null
  updateSocket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  chatSocket: null,
  updateSocket: null
})

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [sockets, setSockets] = useState<SocketContextType>({
    chatSocket: null,
    updateSocket: null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const socketUrl = new URL('/', window.location.href)
      const chatSocket = io(socketUrl.toString() + 'chat')
      const updateSocket = io(socketUrl.toString() + 'update')

      setSockets({ chatSocket, updateSocket })

      return () => {
        chatSocket.disconnect()
        updateSocket.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={sockets}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
