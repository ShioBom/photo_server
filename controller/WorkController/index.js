let dbhelper = require("../../lib/dbHelper");
let fs = require("fs");
let async = require("async");

module.exports = {
  //拿到所有的作品数据
  getWorks: function () {
    return function (req, res, next) {
      let querySQL =
        "SELECT w_id,w.u_id,w_img,w_content,w_title,u_name,u_portrait FROM works ";
      querySQL += "AS w INNER JOIN userinfo AS u ON w.u_id=u.u_id;";
      dbhelper.query(querySQL, [], function (err, result) {
        if (!err) {
          res.json({status:1,msg:"作品数据获取成功",result});
        } else {
          res.json("查询作品信息出错了!");
          console.log(err)
        }
      });
    };
  },
  //根据关键字查询作品
  queryWorks: function () {
    return function (req, res, next) {
      let params = req.body.keyword;
      let sql = "SELECT `w_id`,`w_img`,`w_content`,`w_title`,works.u_id,`u_name`,`u_portrait` FROM works ,userinfo WHERE works.u_id=userinfo.u_id AND CONCAT(`w_content`,`w_title`)LIKE ?;"
      dbhelper.query(sql, params, function (err, result) {
        if (!err) {
          if (result.length >= 1) {
            res.json({ status: 1, msg: "数据获取成功", result });
          } else {
            res.json({ status: 0, msg: "没有与该关键字匹配的数据呢！" });
          }
        } else {
          res.json({ status: -1, msg: "查询数据库遇到问题了" });
        }
      });
    };
  },
  //将作品图片存储到服务器中去
  upload: function () {
    return function (req, res, next) {
      var file = req.files;
      var arrPath = [];
      for (var i = 0; i < file.length; i++) {
        var pathName =
          "public/upload/" +
          Math.random()
            .toString()
            .split(".")[1] +
          Date.now() +
          "." +
          file[i].originalname.split(".")[1];
        fs.rename(req.files[i].path, pathName, function (err) {
          if (err) {
            throw err;
          }
        });
        arrPath.push({ path: pathName }); //保存的图片路径
      }
      res.json({ status: 1, data: arrPath });
      console.log("upload成功！")
    };
  },
  //获得作品分类
  getType: function () {
    return function (req, res, next) {
      let sql = "SELECT * FROM sort_tb";
      dbhelper.query(sql, [], function (err, result) {
        if (!err) {
          res.json(result);
        } else {
          res.json("查询作品分类出错了!");
        }
      });
    };
  },
  //发布作品，并将作品数据存储到数据库中去
  releaseWork: function () {
    return function (req, res, next) {
      function addWork(cb) {
        let insertSQL =
          "INSERT INTO works(`w_id`,`w_img`,`w_content`,`w_title`,`u_id`,`s_id`) VALUES(?,?,?,?,?,?);";
        let coverPic = "http\:\/\/192.168.137.1\:3001\/upload\/" + req.body.photos[0].src;
        let params = [
          req.body.w_id,
          coverPic,
          req.body.w_content,
          req.body.w_title,
          req.body.u_id,
          req.body.w_sort
        ];
        dbhelper.query(insertSQL, params, (err, result) => {
          if (!err) {
            cb(err, result);
          } else {
            console.log(err);
          }
        });
      }
      function addPhotos(cb) {
        let params = [];
        req.body.photos.forEach(ele => {
          let src = "http\:\/\/192.168.137.1\:3001\/upload\/" + ele.src;
          let arr = [ele.p_id, req.body.w_id, src, ele.width, ele.height];
          params.push(arr);
        });
        let insertSQL = "INSERT INTO photos_tb VALUES ?";
        dbhelper.query(insertSQL, [params], (err, result) => {
          if (!err) {
            cb(err, result);
          } else {
            console.log(err);
          }
        });
      }
      async.series([addPhotos, addWork], (err, values) => {
        if (!err) {
          res.json({ status: 1, msg: "作品添加成功" });
        } else {
          res.json({ status: -1, msg: "作品添加失败" });
        }
      });
    };
  },
  //获取作品详情
  getWorkDetail: function () {
    return function (req, res, next) {
      let sql =
        "SELECT u.u_id,u_name,`u_portrait`,w.w_id,`w_title`,`w_content`,`src`,`width`,`height` FROM works AS w,photos_tb AS p,userinfo AS u WHERE u.u_id =? AND w.w_id=? AND w.w_id=p.w_id AND u.u_id=w.u_id;";
      let params = [req.body.u_id, req.body.w_id];
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {

          console.log(result[0].width);
          res.json({ status: 1, msg: "作品详情获取成功", result: JSON.stringify(result) });
        } else {
          res.json({ status: -1, msg: "获取图片数据失败" })
          console.log(err);
        }
      })
    }
  },
  //获取作品评论数据
  getComments: function () {
    return function (req, res, next) {
      let sql =
        "SELECT `u_name`,`u_portrait`,`c_comment`,`c_time` FROM comment_tb AS c JOIN userinfo AS u ON c.u_id=u.u_id WHERE w_id=?;";
      let params = req.body.w_id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({ status: 1, msg: "获取评论数据成功", result })
        } else {
          res.json({ status: -1, msg: "获取评论数据失败" })
          console.log(err);
        }
      })
    }
  },
  //发表评论
  addComment: function () {
    return function (req, res, next) {
      let sql = "INSERT INTO comment_tb(`c_comment`,`u_id`,`w_id`) VALUES(?,?,?)";
      let params = [
        req.body.c_comment,
        req.body.u_id,
        req.body.w_id
      ];
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({ status: 1, msg: "评论成功" })
        } else {
          res.json({ status: -1, msg: "评论失败" })
          console.log(err);
        }
      })
    }
  },
  //获取个人作品信息
  getOwnWorks: function () {
    return function (req, res, next) {
      let sql = "SELECT * FROM works WHERE u_id=?;";
      let params = req.body.u_id;
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          res.json({ status: 1, result: result })
        } else {
          res.json({ status: -1, msg: "获取信息失败" })
          console.log(err);
        }
      })
    }
  },
  //删除作品
  DeleteWork: function () {
    return function (req, res, next) {
      function DeleteWork(cb) {
        let insertSQL =
          "DELETE FROM works WHERE w_id=?;";
        let params = req.body.w_id;
        dbhelper.query(insertSQL, params, (err, result) => {
          if (!err) {
            cb(err, result);
          } else {
            console.log(err);
          }
        });
      }
      function DeletePhotos(cb) {
        let params = req.body.w_id;
        let insertSQL = "DELETE FROM photos_tb WHERE w_id=?;";
        dbhelper.query(insertSQL, [params], (err, result) => {
          if (!err) {
            cb(err, result);
          } else {
            console.log(err);
          }
        });
      }
      function DeleteReviews(cb) {
        let params = req.body.w_id;
        let insertSQL = "DELETE FROM comment_tb WHERE w_id=?;";
        dbhelper.query(insertSQL, params, (err, result) => {
          if (!err) {
            cb(err, result);
          } else {
            console.log(err);
          }
        });
      }
      async.series([DeleteReviews, DeletePhotos, DeleteWork], (err, values) => {
        if (!err) {
          res.json({ status: 1, msg: "作品删除成功" });
        } else {
          res.json({ status: -1, msg: "作品删除失败" });
        }
      });
    };
  },
  /**
   * @description 点赞接口
   */
  likeWork: function () {
    return function (req, res, next) {
      let insertSQL = "INSERT INTO likes_tb(w_id,u_id) VALUES(?,?);"
      let params = [
        req.body.w_id,
        req.body.u_id
      ];
      dbhelper.query(insertSQL, params, (err, result) => {
        if (!err) {
          if (result.affectedRows >= 1) {
            res.json({ status: 1, msg: "点赞成功" })
          } 
        }else{
          let updateSQL = "UPDATE likes_tb SET l_status=1 WHERE w_id=? AND u_id = ? AND l_status=0;"
          dbhelper.query(updateSQL,params,(err,result)=>{
            if(!err){
              result.affectedRows>=1 ? res.json({ status: 1, msg: "点赞成功" }):res.json({ status: -1, msg: "点赞失败" })
            }else{
              res.json({ status: -1, msg: "点赞接口异常" })
            }
          })
        }
      })
    }
  },
  /**
  * @description 取消点赞
  */
  dislike: function () {
    return function (req, res, next) {
      let params = [
        req.body.w_id,
        req.body.u_id,
      ];
      let sql = "UPDATE likes_tb SET l_status=0 WHERE w_id=? AND u_id = ? AND l_status=1;";
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          if(result.affectedRows>=1){
            res.json({ status: 1, msg: "取消点赞成功" })
          }else{
            res.json({ status: 0, msg: "取消点赞失败" })
          }
        } else {
          res.json({status:-1,msg:"取消点赞接口异常"})

          console.log(err);
        }
      })
    }
  },
  /**
  * @description 判断是否点赞
  */
  likeStatus: function () {
    return function (req, res, next) {
      let params = [
        req.body.w_id,
        req.body.u_id,
      ]
      let sql = "SELECT l_status FROM likes_tb WHERE w_id=? AND u_id=? AND l_status=1;";
      dbhelper.query(sql, params, (err, result) => {
        if (!err) {
          if (result.length >= 1) {
            res.json({ status: 1, msg: "已经点过赞了，不能再点赞" })
          } else {
            res.json({ status: 0, msg: "可以进行点赞操作" })
          }
        } else {
          res.json({ status: -1, msg: "数据获取失败" })
          console.log(err);
        }
      })
    }
  },
  /**
  * @description 获取点赞数
  */
  getLikesNum: function () {
    return function (req, res, next) {
      let sql = " SELECT COUNT(u_id) AS likes_count FROM likes_tb WHERE l_status=1 AND w_id=?;";
      dbhelper.query(sql, req.body.w_id, (err, result) => {
        if (!err) {
          res.json({ status: 1, msg: "成功获取到点赞数", result: result[0].likes_count })
        } else {
          res.json({ status: -1, msg: "数据获取失败" })
          console.log(err);
        }
      })
    }
  },
};
