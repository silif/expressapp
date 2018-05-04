var UserSQL = {
    insert: 'INSERT INTO user(id,uname,uage,ugender) VALUES(?,?,?,?)',
    queryAll: 'SELECT * FROM user',
    update:'UPDATE user SET uname=?, uage=?, ugender=? WHERE id=?',
    getUserById: 'SELECT * FROM user WHERE id = ? ',
};
module.exports = UserSQL;