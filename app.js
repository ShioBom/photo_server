let express = require("express");
let bodyParser = require("body-parser");

let app = express();
app.use(express.static("./public"));
app.listen(3001,()=>{
    console.log("服务器启动成功");
})
//解决跨域问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //项目上线后改成页面的地址
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
//配置post请求中间件
app.use(bodyParser.urlencoded({
    extended: true,
    limit: "500mb"
}));
app.use(bodyParser.json({limit:'50mb'}));
app.use("/admin", require("./route/adminRouter"));