var express = require('express');
var router = express.Router();
const User = require('../model/UserSchema');
const authMiddleware = require('../middleware/auth');
const Account = require('../model/AccountSchema');

router.get('/user',authMiddleware,async function(req, res, next) {
  try{
    //展示用户名和密码
    const userId = req.user._id;
    const user = await User.findOne({_id:userId});
    res.json(user);
  }catch(e){
    console.error(e);
  }
});

router.post('/user',authMiddleware,async function(req,res,next){
  try{
    //用户修改用户名或密码
    const userId = req.user._id;
    const username = req.body.username;
    const password = req.body.password;

    // 如果请求中包含了新的用户名，则更新用户名
    if (username) {
        // 检查数据库中是否已存在相同用户名的用户
        const existingUser = await User.findOne({ username: username });
        // 如果存在相同用户名的用户，并且该用户 ID 不等于当前用户 ID，则返回用户名已存在的错误消息
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: '用户名已存在' });
        }
        // 使用 updateOne 方法更新数据库中的用户信息，将当前用户的用户名更新为新的用户名
        const updateUsername = await User.updateOne(
        { _id: userId },
        { $set: { username: username } }
        );
        console.log('用户名已更新:', updateUsername);
    }
    // 如果请求中包含了新的密码，则更新密码
    if (password) {
        // 使用 updateOne 方法更新数据库中的用户信息，将当前用户的密码更新为新的密码
        const updatePassword = await User.updateOne(
        { _id: userId },
        { $set: { password: password } }
        );
        console.log('密码已更新:', updatePassword);
    }
    // 更新后再次获取用户信息，以便展示更新后的用户名和密码
    const updatedUser = await User.findById(userId);
    // 返回更新后的用户信息
    res.json(updatedUser);
  }catch(e){
    console.log(e);
  }

});

router.delete('/user', authMiddleware, async function(req, res, next) {
  try {
    const userId = req.user._id;
    // 在数据库中查找并删除对应用户
    await User.findByIdAndDelete(userId);
    await Account.deleteMany({userid:userId});
    // 返回成功消息给客户端
    res.json({ message: '账号删除成功' });
  } catch (e) {
    console.error('Error deleting user:', e);
    res.status(500).json({ message: '删除账号时出现错误' });
  }
});

module.exports = router;
