import io from 'socket.io-client';
const ENDPOINT = "ws://172.20.10.2:3000/mediasoup";
const socket = io(ENDPOINT, { transports: ['websocket'] });

export const useSocket = () => {

	return socket
}