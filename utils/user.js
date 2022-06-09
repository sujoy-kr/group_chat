const users = []

const pushUser = ({ id, username, group }) => {
    const user = {
        id,
        username,
        group,
    }
    users.push(user)
    return user
}

// find current user from id
const getCurrentUser = (id) => {
    return users.find((user) => user.id === id)
}

// User leaves chat
const userLeave = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Get group users
const getGroupUsers = (group) => {
    return users.filter((user) => user.group === group)
}

module.exports = {
    pushUser,
    getCurrentUser,
    userLeave,
    getGroupUsers,
}
