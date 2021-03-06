let express = require("express");
let path = require("path");
let multer = require("multer");


const UserController = require("../controller/UserController");
const WorkController = require("../controller/WorkController");
const FollowController = require("../controller/FollowController");
const StatisticsController = require("../controller/StatisticsController");

const adminRouter = express.Router();
module.exports = adminRouter;
//注册接口s
adminRouter.post("/Register", UserController.Register());
//发送邮件的接口
adminRouter.post("/send", UserController.send());
//邮箱校验的接口
adminRouter.get("/check/:id", UserController.check());
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
//存储头像
adminRouter.post("/storePortrait", UserController.storePortrait());
//查询用户信息
adminRouter.post("/queryUserByID", UserController.queryUserByID());
//根据关键字搜索用户
adminRouter.post("/updateUserByID", UserController.updateUserByID());
//关注
adminRouter.post("/Follow", FollowController.Follow())
//取消关注
adminRouter.post("/unFollow", FollowController.unFollow())
//查询某用户的关注列表
adminRouter.get("/getFollowList", FollowController.getFollowList())
//查询用户的粉丝列表
adminRouter.post("/getFansList", FollowController.getFansList());
//根据关键字搜索用户
adminRouter.post("/queryUserByStr", FollowController.queryUserByStr());


 
//作品信息显示接口
adminRouter.get("/getWorks", WorkController.getWorks())
//上传作品图片的接口
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
//搜索作品的接口
adminRouter.post("/queryWorks", WorkController.queryWorks());
//根据作品ID删除作品
adminRouter.post("/DeleteWork", WorkController.DeleteWork());
//点赞作品
adminRouter.post("/likeWork", WorkController.likeWork());
//取消对作品的赞
adminRouter.post("/dislike", WorkController.dislike());
//查询点赞状态
adminRouter.post("/likeStatus", WorkController.likeStatus());
//获取点赞数
adminRouter.post("/getLikesNum", WorkController.getLikesNum());


adminRouter.post("/queryWorkNum", StatisticsController.queryWorkNum());
adminRouter.post("/queryWorkType", StatisticsController.queryWorkType());
adminRouter.post("/queryCommentNum", StatisticsController.queryCommentNum());
adminRouter.post("/queryLikeNum", StatisticsController.queryLikeNum());




 
