// src/socket.js
let _io = null;
export const initSocket = (io) => { _io = io; };
export const getIo = () => _io;
