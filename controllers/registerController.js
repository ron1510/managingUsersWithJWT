const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data },
}

const fsPromises = require('fs').promises
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({
            'error': 'Please provide a username and password'
        })
    }
    const duplicate = userDB.users.find(person => person.username === user)
    if (duplicate) {
        return res.status(409).json({
            'error': 'this username is already taken'
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(pwd, 10)
        const newUser = {
            "username": user,
            "roles": {"user": 2001},
            "password": hashedPassword
        }
        userDB.setUsers([...userDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        )
        res.status(201).json({ 'success': `New User ${user} Created!` })
    }
    catch (err) {
        res.status(500).json({'error': err.message})
    }
}

module.exports = {handleNewUser}