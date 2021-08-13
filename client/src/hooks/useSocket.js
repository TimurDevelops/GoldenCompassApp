import io from 'socket.io-client'
import {serverUrl} from '../config.json';

const socket = io(serverUrl, {transports: ['websocket'], upgrade: false});

export const useSocket = () => {
  return { socket }
}
