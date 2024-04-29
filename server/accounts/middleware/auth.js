const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema');

module.exports = async function(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'tellrisk'); // 解析JWT
    const user = await User.findById(decoded.userId); // 从数据库中获取用户信息
    if (!user) {
      throw new Error();
    }
    req.user = user; // 将用户信息添加到请求对象中
    next();
  } catch (error) {
    res.status(401).json({ error: '未经授权的访问' });
  }
};
