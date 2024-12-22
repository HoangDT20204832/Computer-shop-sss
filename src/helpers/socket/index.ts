import { io } from 'socket.io-client'
//kết nối tới socket ở phía server
const connectSocketIO = () => {
  const socket = io(process.env.NEXT_PUBLIC_API_HOST as string)

  return socket
}
export default connectSocketIO