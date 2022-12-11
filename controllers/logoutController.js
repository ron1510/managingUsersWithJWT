const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data },
}
const path = require('path');
const fsPromises = require('fs').promises;

const handleLogout = async (req, res) => {
    //client delete the access token also

    const cookies = req.cookies
    if (!cookies?.jwt) {return res.sendStatus(204)}
    const refreshToken = cookies.jwt

    //is refreshToken in the DB
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24*60*60*1000});
        return res.sendStatus(204)
    }
    

    const filteredUsers = userDB.users.filter(person => person.refreshToken !== refreshToken)
    curUser = {...foundUser, refreshToken: ''}
    userDB.setUsers([...filteredUsers, curUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(userDB.users)
    )

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure : true});
    return res.sendStatus(204)
}

module.exports = {handleLogout}