let express = require("express");
let path = require("path");
let fs = require("fs");
let multer = require("multer");

const upload = multer({ dest: "./public/upload/" });

const log_RegController = require("../controller/log_RegController");
const WorkController = require("../controller/WorkController");
const FollowController = require("../controller/FollowController");

const adminRouter = express.Router();
module.exports = adminRouter;
//注册接口s
adminRouter.post("/Register", log_RegController.Register());
//登录接口
adminRouter.post("/Login", log_RegController.Login())
//作品信息显示接口
adminRouter.get("/getWorks", WorkController.getWorks())
//关注
adminRouter.post("/Follow", FollowController.Follow())
//取消关注
adminRouter.post("/unFollow", FollowController.unFollow())
//查询某用户的关注列表
adminRouter.get("/getFollowList", FollowController.getFollowList())
//上传图片的接口
adminRouter.post("/upload", upload.array("files", 6), WorkController.upload());
//获取作品分类列表
adminRouter.get("/getType", WorkController.getType());
