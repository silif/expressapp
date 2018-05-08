var UserSQL = {
    insert: 'INSERT INTO user(id,uname,uage,ugender) VALUES(?,?,?,?)',
    queryAll: 'SELECT * FROM user',
    update:'UPDATE user SET uname=?, uage=?, ugender=? WHERE id=?',
    getUserById: 'SELECT * FROM user WHERE id = ? ',
    loginsql:'SELECT * FROM user WHERE uname = ? AND password = ? ',
    register:'INSERT INTO user(uname,password) VALUES(?,?)'
};
module.exports = UserSQL;