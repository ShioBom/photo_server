let express = require("express");
let path = require("path");
let multer = require("multer");

const upload = multer({ dest: "./public/upload/" });

const UserController = require("../controller/UserController");
const WorkController = require("../controller/WorkController");
const FollowController = require("../controller/FollowController");

const adminRouter = express.Router();
module.exports = adminRouter;
//注册接口s
adminRouter.post("/Register", UserController.Register());
//登录接口
adminRouter.post("/Login", UserController.Login());
//查询关注的人数
adminRouter.post("/getFollowerNum",UserController.getFollowNum());
//查询粉丝数
adminRouter.post("/getFansNum", UserController.getFansNum());
//查询作品数
adminRouter.post("/getWorkNum", UserController.getWorkNum());
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
//发布作品
adminRouter.post("/releaseWork", WorkController.releaseWork());
