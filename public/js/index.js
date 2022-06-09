const socket = io()
const { username, group } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const leaveGroupBtn = document.getElementById('leaveGroupBtn')
const sendMessageBtn = document.getElementById('sendMessageBtn')
const message = document.getElementById('message')
const messages = document.getElementById('messages')
const groupName = document.getElementById('groupName')
const activeUserUl = document.getElementById('activeUserUl')

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

groupName.innerText = capitalize(group)

socket.on('message', (message) => {
    displayMessage(message)
    messages.scrollTop = messages.scrollHeight
})

socket.emit('joinGroup', { username, group })

socket.on('getGroupUsers', (users) => {
    displayUsers(users)
})

leaveGroupBtn.addEventListener('click', () => {
    window.location.href = 'index.html'
})

sendMessageBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (message.value) {
        socket.emit('sendMessage', message.value)
        message.value = ''
        message.focus()
    }
})

const displayMessage = ({ username, message, time }) => {
    const newMessage = document.createElement('div')
    newMessage.className = 'message'
    newMessage.innerHTML = `<p class="nameTime"><span>${username}</span> ${time}</p>
    <p class="sentMessage">
        ${message}
    </p>`
    messages.appendChild(newMessage)
}

const displayUsers = (users) => {
    console.log(users)
    activeUserUl.innerText = ''
    users.forEach((user) => {
        const li = document.createElement('li')
        li.innerText = user.username
        activeUserUl.appendChild(li)
    })
}
