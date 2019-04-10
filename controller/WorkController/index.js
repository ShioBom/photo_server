let dbhelper = require("../../lib/dbHelper");
let fs = require("fs");

module.exports = {
  getWorks: function() {
    return function(req, res, next) {
      let querySQL =
        "SELECT w_id,w.u_id,w_img,w_content,w_title,u_name,u_portrait FROM works ";
      querySQL += "AS w INNER JOIN userinfo AS u ON w.u_id=u.u_id;";
      dbhelper.query(querySQL, [], function(err, result) {
        if (!err) {
          res.json(result);
        } else {
          res.json("查询作品信息出错了!");
        }
      });
    };
  },
  upload: function() {
    return function(req, res, next) {
      console.log(req.files);
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
        fs.rename(req.files[i].path, pathName, function(err) {
          if (err) {
            throw err;
          }
        });
        arrPath.push({ path: pathName }); //保存的图片路径
      }
      console.log(arrPath);
      res.json({ status: 1, data: arrPath });
    };
  },
  getType:function(){
    return function(req,res,next){
      let sql = "SELECT * FROM sort_tb";
      dbhelper.query(sql, [], function(err, result) {
        if (!err) {
          res.json(result);
        } else {
          res.json("查询作品分类出错了!");
        }
      });
    }
  }
};
