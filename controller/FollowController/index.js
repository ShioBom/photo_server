let dbhelper = require("../../lib/dbHelper");
module.exports = {
    Follow:function(){
        return function (req, res, next) {
            let params = [req.body.uid, req.body.fid]
            let querySQL = "SELECT `u_id`,`following` FROM user_follow WHERE u_id=? AND following=?";
            dbhelper.query(querySQL, params, function (err, result) {
                if (!err) {
                    if (result.length === 0) {
                        let sql = "INSERT INTO user_follow(`u_id`,`following`)VALUES(?,?);";
                        dbhelper.query(sql, params, function (err, result) {
                            if (!err) {
                                if (result.affectedRows >= 1) {
                                    res.json({
                                        msg: "关注成功",
                                        status: 1
                                    })
                                } else {
                                    res.json({
                                        msg: "关注失败",
                                        status: -1
                                    })
                                }
                            }
                        })
                    } else {
                        res.json({
                            msg: "该用户已经关注",
                            status: 0
                        })
                    }
                }
            })

        }
    },
    unFollow:function(){
        return function (req, res, next) {
            let params = [req.body.uid, req.body.fid];
            console.log(params);
            let sql = "DELETE FROM user_follow WHERE u_id = ? AND following=?;";
            dbhelper.query(sql, params, (err, result) => {
                if (!err) {
                    console.log(result);
                    if (result.affectedRows >= 1) {
                        res.json({ msg: "取消关注成功!", status: 1 });
                    } else {
                        res.json({ msg: "取消关注失败!", status: -1 });
                    }
                } else {
                    console.log("数据库操作失败!", err);
                }
            })
        }
    },
    getFollowList:function(){
       return function(req, res, next) {
            let params = [parseInt(req.query.uid)];
            let sql = "SELECT `following`,`u_portrait`,`u_name` FROM user_follow AS f INNER JOIN ";
            sql += "userinfo AS u ON f.following=u.u_id WHERE f.u_id=102;";
            dbhelper.query(sql, params, function (err, result) {
                if (!err) {
                    if (result.length >= 1) {
                        res.json({
                            msg: "查询数据库成功",
                            status: 1,
                            result
                        });
                    } else {
                        res.json({
                            msg: "你还没有关注任何人",
                            status: -1
                        })
                    }
                } else {
                    res.json({
                        msg: "数据库查询失败",
                        status: -1
                    })
                }
            })
        }
    }
}