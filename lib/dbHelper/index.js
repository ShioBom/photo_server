let mysql = require("mysql")

//1创建连接词汇
let pool = mysql.createPool(require("../dbConfig"));

function query(sql, params, callback) {
    pool.getConnection(function (err, conn) {
        // conn链接对象
        if (!err) {
            conn.query(sql, params, callback);
            conn.release();
        } else {
            callback(err, null, null);
        }
    })
}
module.exports = {
    query
};