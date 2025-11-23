import User from "../model/user.model.js";  

export default function registerUserStatusHandlers(io, socket, onlineUsers) {
    const userId = socket.userId;

    // console.log(`User ${userId} connected to socket`);

    onlineUsers.set(userId, socket.id);

    const onlineUserIds = Array.from(onlineUsers.keys());

    io.emit("online-users", onlineUserIds);


    socket.on("online-users", () => {
        const currentOnlineUsers = Array.from(onlineUsers.keys());
        // console.log(`Client ${userId} requested online users:`, currentOnlineUsers);
        socket.emit("online-users", currentOnlineUsers);
    });

    socket.on("disconnect", async () => {
        // console.log(`User ${userId} disconnected`);
        onlineUsers.delete(userId);


        await User.findByIdAndUpdate(userId, {
            lastSeen: new Date(),
        }).catch(err => console.error('Error updating lastSeen:', err));

        const updatedOnlineUsers = Array.from(onlineUsers.keys());

        io.emit("online-users", updatedOnlineUsers);
    });
}