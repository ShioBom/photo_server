let dbhelper = require("../../lib/dbHelper");
let fs = require("fs");
const send = require("../../lib/sendMail");
const crypto = require("crypto");

module.exports = log_RegController = {
  Register: function() {
    return function(req, res, next) {
      let body = req.body;
      let params = [body.uname, body.upwd,body.email];
      let querySQL = "SELECT * FROM userinfo WHERE u_name=?;";
      let insertSQL = "INSERT INTO userinfo(`u_name`,`u_pwd`,`u_email`) VALUES(?,?,?);";
      console.log(body.uname);
      //验证用户名是否已经存在
      dbhelper.query(querySQL, body.uname, function(err, result) {
        if (!err) {
          if (result.length === 0) {
            //向数据库插入数据
            dbhelper.query(insertSQL, params, function(err, result) {
              if (!err) {
                if (result.affectedRows >= 1) {
                  res.json({
                    msg: "注册成功",
                    status: 1
                  });
                } else {
                  res.json({
                    msg: "注册失败",
                    status: -1
                  });
                }
              } else {
                res.json("insert出错了!");
              }
            });
          } else {
            res.json({
              msg: "用户名已存在",
              status: 0
            });
          }
        } else {
          res.json("select出错了!");
        }
      });
    };
  },
  /**
   * @description 向邮箱发送邮件的接口
   */
  send:function(){
    return function (req, res, next){
      console.log(req.body.email);
      let date = new Date();
      date.setMinutes(date.getMinutes() + 20);
      let timer = date.getTime();
      //加密
      var cipher = crypto.createCipher('aes192', "secret");
      //利用注册的邮箱和失效时间生成一串数据做伪路径加到链接后面
      var enc = cipher.update(req.body.email + "|" + timer, 'utf8', 'hex'); //编码方式从utf-8转为hex;
      enc += cipher.final('hex'); //编码方式从转为hex;
      console.log("enc" + enc);
      //这个按钮一点击,则向后台发送数据
      let strContent = `<a href="http://192.168.137.1:3001/admin/check/${enc}">点击链接激活账号</a>`;
      //查询数据库,拿到邮箱账号
      //给当前注册用户绑定的邮箱发送信息
      send(req.body.email, strContent);
      res.json({status:1,msg:"激活邮件已经发送到您的邮箱,请确认激活"})
    }
  },
  /**
   * @description 邮箱校验的接口
   */
  check:function(){
    return function(request, response, next){
      //解密
      let text = request.params.id;//邮箱账号加时间戳
      var decipher = crypto.createDecipher('aes192', "secret");
      var dec = decipher.update(text, 'hex', 'utf8'); //编码方式从hex转为utf-8;
      dec += decipher.final('utf8'); //编码方式从utf-8;
      var arr = dec.split("|");//分割成邮箱和时间两部分
      var date = new Date();
      //如果时间是大于当前时间,说明在规定时间内验证了
      if (arr[1] > date.getTime()) {
        let sql = "UPDATE userinfo SET u_status=1  WHERE u_email=? ";
        dbhelper.query(sql, arr[0], function (err) {
          if (!err) {
            response.json({msg:"验证成功"});
          }
        })
      } else {
        response.json({
          msg: "验证失败!"
        });
      }
    }
  },
  Login: function() {
    return function(req, res, next) {
      let body = req.body;
      console.log(req);
      let params = [body.uname, body.upwd];
      let querySQL = "SELECT * FROM userinfo WHERE u_name=? AND u_pwd=?;";
      dbhelper.query(querySQL, params, function(err, result) {
        if (!err) {
          if (result.length >= 1) {
            res.json({
              msg: "登录成功",
              status: 1,
              id: result[0].u_id,
              portrait: result[0].u_portrait
            });
          } else {
            console.log("用户名或密码错误!");
            res.json({
              msg: "用户名或密码错误",
              status: -1
            });
          }
        } else {
          res.json("query出错了!");
        }
      });
    };
  },
  getFollowNum: function() {
    return function(req, res, next) {
      let sql =
        "SELECT COUNT(u_id) AS follower_num FROM user_follow WHERE u_id=? AND following IS NOT NULL;";
      let params = req.body.id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({
            status: 1,
            msg: "成功获取到关注的人总数",
            result: result[0].follower_num
          });
        } else {
          res.json({
            status: -1,
            msg: "获取关注的人数失败"
          });
          console.log(err);
        }
      });
    };
  },
  getFansNum: function() {
    return function(req, res, next) {
      let sql =
        "SELECT COUNT(u_id) AS fans_num FROM user_follow  WHERE u_id=? AND follower IS NOT NULL;";
      let params = req.body.id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({
            status: 1,
            msg: "成功获取到粉丝总数",
            result: result[0].fans_num
          });
        } else {
          res.json({
            status: -1,
            msg: "获取粉丝数失败"
          });
          console.log(err);
        }
      });
    };
  },
  getWorkNum: function() {
    return function(req, res, next) {
      let sql = "SELECT COUNT(u_id) AS work_num FROM works WHERE u_id =?;";
      let params = req.body.id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({ status: 1, msg: "成功获取到作品总数", result:result[0].work_num });
        } else {
          res.json({
            status: -1,
            msg: "获取作品数失败"
          });
          console.log(err);
        }
      });
    };
  },
  //上传头像并返回头像路径
  uploadPortrait: function () {
    return function (req, res, next) {
      var file = req.file;
      var u_id=req.u_id;
      console.log(file,u_id);
      var pathName =
        "public/img/portrait/"+
          Math.random()
            .toString()
            .split(".")[1] +
          Date.now() +
          "." +
          file.originalname.split(".")[1];
        fs.rename(req.file.path, pathName, function (err) {
          if (err) {
            throw err;
          }
        });

      res.json({ status: 1, path: pathName.replace("public","http://192.168.137.1:3001") });
      console.log("upload头像成功！")
    };
  },
  //将头像数据存储到数据库中去
  storePortrait: function () {
    return function (req, res, next) {
        let sql =
          "UPDATE userinfo SET u_portrait = ? WHERE u_id = ?";
        let src = req.body.path;
        let params = [
          src,
          req.body.u_id,
        ];
        console.log(params);
        dbhelper.query(sql, params, (err, result) => {
          if (!err) {
            res.json({status:1,msg:"头像更改成功"});
          } else {
            console.log(err);
          }
        });
      }
  },
  //查询用户信息
  queryUserByID: function () {
    return function (req, res, next) {
      let sql =
        "SELECT `u_name`,`u_sex`,`u_email`,`u_signature`,`u_birthday` FROM userinfo WHERE u_id=?;";
      let params = req.body.u_id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          if(result.length>=1){
            res.json({
              status: 1,
              msg: "成功获取到用户信息",
              result: result[0]
            });
          }else{
            res.json({
              status: 0,
              msg: "没有匹配的用户,确定登录了吗",
              result: result[0]
            });
          }
        } else {
          res.json({
            status: -1,
            msg: "用户信息获取接口异常"
          });
          console.log(err);
        }
      });
    };
  },
  //修改用户信息
  updateUserByID: function () {
    return function (req, res, next) {
      let sql =
        "UPDATE likes_tb SET l_status=1 WHERE w_id=? AND u_id = ?;";
      let params = [
        req.body.w_id,
        req.body.u_id];
        console.log(params)
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          if (result.affectedRows >= 1) {
            res.json({
              status: 1,
              msg: "信息修改成功",
            });
          } else {
            res.json({
              status: 0,
              msg: "信息修改失败",
            });
          }
        } else {
          res.json({
            status: -1,
            msg: "用户信息修改接口异常"
          });
        }
      });
    };
  },
};