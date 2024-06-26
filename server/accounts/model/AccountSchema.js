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
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
