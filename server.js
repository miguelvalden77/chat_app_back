const { Server } = require("socket.io")

const io = new Server({ cors: "http://localhost:5173" })

const onlineUsers = []

io.on("connection", (socket) => {

    socket.on("addNewUser", (userId) => {

        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({ userId, socketId: socket.id })
    })

    io.emit("getOnlineUsers", onlineUsers)

    // Add user
    socket.on("sendMessage", (message) => {
        console.log({ message })
        const user = onlineUsers.find(user => user.userId == message.receiver)
        console.log({ user, onlineUsers, message })

        if (user) {
            io.to(user.socketId).emit("getMessage", message)
        }
    })

    io.on("disconnect", () => {

        onlineUsers = onlineUsers.filter(user => user.socketId != socket.id)
        io.emit("getOnlineUsers", onlineUsers)
    })
})

io.listen(3000)