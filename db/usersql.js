var UserSQL = {
    insert: 'INSERT INTO user(id,uname,uage,ugender) VALUES(?,?,?,?)',
    queryAll: 'SELECT * FROM user',
    update:'UPDATE user SET uname=?, uage=?, ugender=? WHERE id=?',
    getUserById: 'SELECT * FROM user WHERE id = ? ',
    loginsql:'SELECT uname ,avatar FROM user WHERE uname = ? AND password = ? ',
    getUserInfo:'SELECT uname ,avatar FROM user WHERE uname = ?',

    register:'INSERT INTO user(uname,password) VALUES(?,?)',
    updateAvatar:'UPDATE user SET avatar=? WHERE uname=?'
};
module.exports = UserSQL;