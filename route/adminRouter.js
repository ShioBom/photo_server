let express = require("express");
let path = require("path");
let multer = require("multer");

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
//设置上传头像的路径
let upload = multer({ dest: "./public/img/portrait/" });
//上传头像并返回头像地址
adminRouter.post("/uploadPortrait", upload.single('file'), UserController.uploadPortrait());
adminRouter.post("/storePortrait", UserController.storePortrait());


//作品信息显示接口
adminRouter.get("/getWorks", WorkController.getWorks())
//关注
adminRouter.post("/Follow", FollowController.Follow())
//取消关注
adminRouter.post("/unFollow", FollowController.unFollow())
//查询某用户的关注列表
adminRouter.get("/getFollowList", FollowController.getFollowList())
//查询用户的粉丝列表
adminRouter.post("/getFansList", FollowController.getFansList());
//上传图片的接口
upload = multer({ dest: "./public/upload/" });
adminRouter.post("/upload", upload.array("files", 20), WorkController.upload());
//获取作品分类列表
adminRouter.get("/getType", WorkController.getType());
//发布作品
adminRouter.post("/releaseWork", WorkController.releaseWork());
//获取作品图片数据
adminRouter.post("/getWorkDetail", WorkController.getWorkDetail());
//获取作品评论信息
adminRouter.post("/getComments", WorkController.getComments());
//发布评论
adminRouter.post("/addComment", WorkController.addComment());
//查询登录用户已经发布的作品
adminRouter.post("/getOwnWorks", WorkController.getOwnWorks());

 
