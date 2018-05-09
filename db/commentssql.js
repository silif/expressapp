var postSQL = {
    // insertByPoster : 'INSERT INTO post(poster,ptitle,pcontent,pzone) VALUES(?,?,?,?)',
    // getAllPostsOrderByTime:'SELECT * FROM post ORDER BY pdate',
    // allPostsByPoster:'SELECT * FROM post WHERE poster=? ORDER BY pdate',
    // getPostByPid:'SELECT * FROM post WHERE pid=?',
    getCommentsByPid:'SELECT * FROM comments WHERE pid =?',
    insertComment:'INSERT INTO comments(commentby,commentto,commentcontent,pid) VALUES(?,?,?,?)'
};
module.exports = postSQL;