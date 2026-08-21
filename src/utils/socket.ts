import io, { type Socket } from "socket.io-client"

// Singleton — one socket instance shared across the whole app.
// Calling io() multiple times creates multiple separate connections,
// which means listeners and emits end up on different sockets.
let socket: Socket | null = null;

export const createsocketconnection = (): Socket => {
    if (!socket || socket.disconnected) {
        if (location.hostname == "localhost") {
            socket = io(import.meta.env.VITE_DEVELOP_BASE_URL);
        } else {
            socket = io("/", { path: "/api/socket.io" })
        }
    }
    return socket;
};

export const disconnectsocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};