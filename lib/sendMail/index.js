const email = require("emailjs");
var server = email.server.connect({
    user: "15292061516@163.com", //邮箱发件人
    password: "tangyu1996", //SMTP服务默认是关闭的，那我们要发送的话，首先得开启,这是开启服务生成的授权码
    host: "smtp.163.com",//smtp服务器地址
    ssl: true
});
let sent = function (mail,str) {
    server.send({
        text: "这是邮件发送的内容",//邮件内容
        from: "15292061516@163.com", //发送者的邮箱
        to: mail, //接收者的邮箱
        subject: "这是一封测试邮件", //邮件主题
        attachment: [{
            data: str,//html代码
            alternative: true
        }]
    }, function (err, message) {
        console.log(err || message);
    });
}
module.exports = sent;