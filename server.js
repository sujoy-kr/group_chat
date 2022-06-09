const express = require('express')
const path = require('path')
const http = require('http')

const formatMessage = require('./utils/message')
const {
    pushUser,
    getCurrentUser,
    userLeave,
    getGroupUsers,
} = require('./utils/user')

// get port
const config = require('./config/config')
const PORT = config.PORT

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const botName = 'Welcome Bot'

// run when client Connects
io.on('connection', (socket) => {
    socket.on('joinGroup', ({ username, group }) => {
        pushUser({ id: socket.id, username, group })
        socket.join(group)
        socket.emit(
            'message',
            formatMessage(botName, `Welcome to ${group} group.`)
        )

        socket.broadcast
            .to(group)
            .emit(
                'message',
                formatMessage(botName, `${username} joined the chat`)
            )

        io.to(group).emit('getGroupUsers', getGroupUsers(group))
    })

    socket.on('sendMessage', (message) => {
        const user = getCurrentUser(socket.id)
        io.to(user.group).emit('message', formatMessage(user.username, message))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.group).emit(
                'message',
                formatMessage(botName, `${user.username} disconnected`)
            )
            io.to(user.group).emit('getGroupUsers', getGroupUsers(user.group))
        }
    })
})

// use public folder as static folder
app.use(express.static(path.join(__dirname, '/public')))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
