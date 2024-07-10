const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  note: {
    type:String,
    required:true
  },
  sort: {
    type: String,
    enum: ['文化休闲', '日用百货', '餐饮美食', '交通出行', '生活服务', '医疗保健'],
    required: true
  },
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
