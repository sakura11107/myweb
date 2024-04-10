var express = require('express');
var router = express.Router();
const Account = require('../model/AccountSchema')

/*连接数据库 */
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/accounts');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'连接失败'));


// Account.create({
//   item: '购买食材',
//       date: new Date(),
//       amount: 50.00,
//       category: 'expense',
//       note: '购买了牛奶、面包和水果'
// })

router.all('/',function(req,res,next){
  res.send('登陆界面')
})


/*记账本列表 */
router.get('/accounts', function(req, res, next) {
  Account.find({})
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => {
      next(err);
    });
});

//添加账单
router.post('/accounts/add', async function (req, res, next) {
  try {
    const{item, date, amount, category, note} =req.body;
    const newAccount = new Account({
      item,
      date: new Date(date),
      amount,
      category,
      note
    });
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (err) {
    console.error('Error adding account:', err);
    res.status(500).json({ error: 'Failed to add account' });
  }
});

//更新账单
router.put('/accounts/:id', async function(req, res, next) {
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
router.delete('/accounts/:id', async function(req, res, next) {
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
