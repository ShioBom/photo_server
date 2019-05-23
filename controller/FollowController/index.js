let dbhelper = require("../../lib/dbHelper");
let async = require("async");
module.exports = {
  Follow: function() {
    return function(req, res, next) {
      function isFollow(callback) {
        let params = [req.body.uid, req.body.fid];
        let querySQL =
          "SELECT `u_id`,`following` FROM user_follow WHERE u_id=? AND following=?";
        dbhelper.query(querySQL, params, function(err, result) {
          if (!err) {
            callback(null, result);
          }
        });
      }
      function insertFollower(callback) {
          let params = [req.body.uid, req.body.fid];
          let sql = "INSERT INTO user_follow(`u_id`,`following`)VALUES(?,?);";
          dbhelper.query(sql, params, function(err, result) {
            if (!err) {
              if (result.affectedRows >= 1) {
                callback(null);
              } else {
                res.json({
                  msg: "关注失败",
                  status: -1
                });
              }
            }
          });
        
      }
      function insertFans(callback) {
        let params = [req.body.fid, req.body.uid];
        let sql = "INSERT INTO user_follow(`u_id`,`follower`)VALUES(?,?);";
        dbhelper.query(sql, params, function(err, result) {
          if (!err) {
            if (result.affectedRows >= 1) {
              callback(null);
            } else {
              res.json({
                msg: "关注失败",
                status: -1
              });
            }
          }
        });
      }
      async.series([insertFollower, insertFans], (err, result) => {
        if (!err) {
          console.log("添加关注成功");
          res.json({status:1,msg:"添加关注成功了！！！"});
        } else {
          console.log(err);
        }
      });
    };
  },
  unFollow: function() {
    return function(req, res, next) {
      function deleteFollower(callback) {
        let params = [req.body.uid, req.body.fid];
        let sql = "DELETE FROM user_follow WHERE u_id = ? AND following=?;";
        dbhelper.query(sql, params, (err, result) => {
          if (!err) {
            console.log(result);
            if (result.affectedRows >= 1) {
                callback(null);
            //   res.json({ msg: "取消关注成功!", status: 1 });
            } else {
              res.json({ msg: "取消关注失败!", status: -1 });
            }
          } else {
            console.log("数据库操作失败!", err);
          }
        });
      }
      function deleteFans(callback) {
        let params = [req.body.fid, req.body.uid];
        console.log(params);
        let sql = "DELETE FROM user_follow WHERE u_id = ? AND follower=?;";
        dbhelper.query(sql, params, (err, result) => {
          if (!err) {
            console.log(result);
            if (result.affectedRows >= 1) {
                callback(null);
            //   res.json({ msg: "取消关注成功!", status: 1 });
            } else {
              res.json({ msg: "取消关注失败!", status: -1 });
            }
          } else {
            console.log("数据库操作失败!", err);
          }
        });
      }
      async.series([deleteFollower,deleteFans],(err,result)=>{
          if(!err){
              console.log("取消关注成功");
              res.json({status:1,msg:"取消关注成功"})
          }
      })
    };
  },
  getFollowList: function() {
    return function(req, res, next) {
      let params = req.body.u_id;
      let sql =
        "SELECT `following`,`u_portrait`,`u_name` FROM user_follow AS f INNER JOIN ";
      sql += "userinfo AS u ON f.following=u.u_id WHERE f.u_id=?;";
      dbhelper.query(sql, params, function(err, result) {
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
            });
          }
        } else {
          res.json({
            msg: "数据库查询失败",
            status: -1
          });
        }
      });
    };
  },
  getFansList(){
      return function(req,res,next){
          let params = req.body.u_id;
          console.log(params)
            let sql = "SELECT DISTINCT `follower`,`u_portrait`,`u_name` FROM user_follow AS f INNER JOIN userinfo AS u ON f.follower=u.u_id WHERE f.u_id=?;";
          dbhelper.query(sql, params, function (err, result) {
              if (!err) {
                  if (result.length >= 1) {
                      res.json({
                          msg: "查询粉丝列表成功",
                          status: 1,
                          result
                      });
                  } else {
                      res.json({
                          msg: "还没有任何人关注你",
                          status: -1
                      });
                  }
              } else {
                  res.json({
                      msg: "数据库查询失败",
                      status: -1
                  });
                  console.log(err);
              }
          });
      }
  },
  //根据关键字查询用户
  queryUserByStr(){
    return function (req, res, next) {
      console.log(req.body.keyword)
      let sql =
        "SELECT `u_id`,`u_name`,`u_portrait` FROM userinfo WHERE u_name LIKE ?;";
      dbhelper.query(sql, req.body.keyword, function (err, result) {
        if (!err) {
          if (result.length >= 1) {
            res.json({
              msg: "成功查询到用户数据",
              status: 1,
              result
            });
          } else {
            res.json({
              msg: "没有与该关键字匹配的用户",
              status: 0
            });
          }
        } else {
          res.json({
            msg: "数据库查询失败，sql语句执行出错",
            status: -1
          });
          console.log(err);
        }
      });
    }
  },
};
