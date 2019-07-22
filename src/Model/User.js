const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

let userSchema = mongoose.Schema({
    id: String,
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwd: {type: String, required: true},
    ap: {type: String, required: true, unique: true},
    admin: {type: Boolean, default: false},
    firebase: {type:String}
});

userSchema.pre('save', function(next){
    let user = this;

    if(!this.isModified('passwd')) return next();

    bcrypt.hash(user.passwd, 10, (err, hash) => {
        if(err) return next(err);
        user.passwd = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(passw, cb){
    bcrypt.compare(passw, this.passwd, (err, isMatch) => {
        if(err) return cb(err);
        else return cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);