var express = require('express');
var router = express.Router();
const Account = require('../model/AccountSchema');
const User = require('../model/UserSchema');
const authMiddleware = require('../middleware/auth');

/*连接数据库 */
var mongoose = require('mongoose');
const { lock } = require('./login');
mongoose.connect('mongodb://127.0.0.1:27017/accounts');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'连接失败'));

/*记账本列表 */
router.get('/accounts',authMiddleware, async function(req, res, next) {
  try {
      const userId = req.user._id; // 从请求对象中获取用户的唯一 ID
      console.log(userId);
      const accounts = await Account.find({ userid: userId });
      res.json(accounts);
  } catch (error) {
      console.error(error);
  }
});

//添加账单
router.post('/accounts/add',authMiddleware, async function (req, res, next) {
  try {
    const{item, date, amount, category, note} =req.body;
    const userId = req.user._id;
    const newAccount = new Account({
      item,
      date: new Date(date),
      amount,
      category,
      note,
      userid:userId
    });
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (err) {
    console.error('Error adding account:', err);
    res.status(500).json({ error: 'Failed to add account' });
  }
});

//更新账单
router.put('/accounts/:id', authMiddleware,async function(req, res, next) {
  try {
    const { id } = req.params;
    const { item, date, amount, category, note } = req.body;
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      {
        item,
        date: new Date(date),
        amount,
        category,
        note
      },
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(updatedAccount);
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

//删除账单
router.delete('/accounts/:id', authMiddleware,async function(req, res, next) {
  const accountId = req.params.id;
  try {
    await Account.findByIdAndDelete(accountId);
    res.status(204).send(); // 返回删除成功的响应
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
})

module.exports = router;
