import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.AWS_SERVER;
export const socket = io(URL);