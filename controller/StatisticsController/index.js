let dbhelper = require("../../lib/dbHelper");
let fs = require("fs");

module.exports = log_RegController = {
    queryWorkType: function () {
        return (req, res, next) => {
            let sql = "SELECT DISTINCT s_type FROM sort_tb WHERE s_id IN(SELECT s_id FROM works WHERE u_id =?);"
            dbhelper.query(sql, req.body.u_id, (err, result) => {
                if (!err) {
                    if (result.length >= 1) {
                        let data = [];
                        result.forEach(ele => {
                            data.push(ele.s_type);
                        })
                        res.json({ status: 1, msg: "数据获取成功", data });
                    } else {
                        res.json({ status: 0, msg: "你还没有发布过作品哦" });
                    }
                } else {
                    res.json({ status: -1, msg: "数据库操作失败！" });
                    console.log(err);
                }
            })
        }
    },
    queryWorkNum: function () {
        return (req, res, next) => {
            let sql = "SELECT COUNT(s_id) AS num FROM works WHERE u_id=? GROUP BY s_id;"
            dbhelper.query(sql, req.body.u_id, (err, result) => {
                if (!err) {
                    if (result.length >= 1) {
                        let data = []
                        result.forEach(ele => {
                            data.push(ele.num);
                        });
                        res.json({ status: 1, msg: "数据获取成功", data });

                    } else {
                        res.json({ status: 0, msg: "你还没有发布过作品哦" });
                    }
                } else {
                    res.json({ status: -1, msg: "数据库操作失败！" });
                    console.log(err);
                }
            })
        }
    },
    queryCommentNum: function () {
        return (req, res, next) => {
            let params = [
                req.body.date1,
                req.body.date2,
                req.body.u_id
            ]
            console.log(params);
            let sql = `SELECT DATE_FORMAT( c_time,"%Y-%m-%d") AS c_time,COUNT(*) AS num FROM comment_tb `
            sql += `WHERE c_time BETWEEN ? AND ? AND w_id IN (SELECT w_id FROM works WHERE u_id = ?) `
            sql += `GROUP BY  DATE_FORMAT( c_time,"%Y-%m-%d")`
            dbhelper.query(sql, params, (err, result) => {
                if (!err) {
                    if (result.length >= 1) {
                        res.json({ status: 1, msg: "数据获取成功", result });
                    } else {
                        res.json({ status: 0, msg: "你还没有发布过作品哦" });
                    }
                } else {
                    res.json({ status: -1, msg: "数据库操作失败！" });
                    console.log(err);
                }
            })
        }
    },
    queryLikeNum: function () {
        return (req, res, next) => {
            let params = [
                req.body.date1,
                req.body.date2,
                req.body.u_id
            ]
            let sql = `SELECT DATE_FORMAT( l_time, "%Y-%m-%d" ) AS l_time,COUNT(*) AS num FROM likes_tb `
            sql +=`WHERE l_status=1 AND l_time BETWEEN ? AND ? AND w_id IN (SELECT w_id FROM works WHERE u_id = ?)`
            sql += `GROUP BY  DATE_FORMAT( l_time,"%Y-%m-%d")`;
            dbhelper.query(sql, params, (err, result) => {
                if (!err) {
                    if (result.length >= 1) {

                        res.json({ status: 1, msg: "数据获取成功", result });

                    } else {
                        res.json({ status: 0, msg: "你还没有发布过作品哦" });
                    }
                } else {
                    res.json({ status: -1, msg: "数据库操作失败！" });
                    console.log(err);
                }
            })
        }
    },
};