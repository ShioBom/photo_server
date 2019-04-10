let dbhelper = require("../../lib/dbHelper");
module.exports = log_RegController={
    Register:function(){
        return function (req, res, next) {
            let body = req.body;
            let params = [body.uname, body.upwd];
            let querySQL = "SELECT * FROM userinfo WHERE u_name=?;";
            let insertSQL = "INSERT INTO userinfo(`u_name`,`u_pwd`) VALUES(?,?);";
            console.log(body.uname)
            //验证用户名是否已经存在
            dbhelper.query(querySQL, body.uname, function (err, result) {
                if (!err) {
                    if (result.length === 0) {
                        //向数据库插入数据
                        dbhelper.query(insertSQL, params, function (err, result) {
                            if (!err) {
                                if (result.affectedRows >= 1) {
                                    res.json({
                                        msg: "注册成功",
                                        status: 1
                                    })
                                } else {
                                    res.json({
                                        msg: "注册失败",
                                        status: -1
                                    })
                                }
                            } else {
                                res.json("insert出错了!");
                            }
                        })
                    } else {
                        res.json({
                            msg: "用户名已存在",
                            status: 0
                        })
                    }
                } else {
                    res.json("select出错了!");
                }
            })
        }
    },
    Login:function(){
        return function (req, res, next) {
            let body = req.body;
            console.log(req);
            let params = [body.uname, body.upwd];
            let querySQL = "SELECT * FROM userinfo WHERE u_name=? AND u_pwd=?;";
            dbhelper.query(querySQL, params, function (err, result) {
                if (!err) {
                    if (result.length >= 1) {
                        res.json({
                            msg: "登录成功",
                            status: 1,
                            id: result[0].u_id,
                            portrait: result[0].u_portrait
                        })
                    } else {
                        console.log("用户名或密码错误!")
                        res.json({
                            msg: "用户名或密码错误",
                            status: -1
                        })
                    }
                } else {
                    res.json("query出错了!");
                }
            })
        }
    },
}