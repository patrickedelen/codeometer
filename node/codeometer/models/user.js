var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    team: [String],
    totalLines: {type: Number, default: 0},
    reports: [{
        lines : Number,
        date  : {type: Date, default: Date.now}
    }]
});


module.exports = mongoose.model('User', userSchema);