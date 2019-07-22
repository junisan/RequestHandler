const User = require('../Model/User');
const Request = require('../Model/Request');
const {validationResult } = require('express-validator/check');

module.exports = {
    showHome: showHome,
    showAdmin: showAdmin,
    firebaseTokenAdmin: firebaseTokenAdmin,
    login: login,
    logout: logout,
    changePass:changePass
};

/**
 * Show home page (login page)
 * @param req
 * @param res
 */
function showHome(req, res){
    if(typeof req.session.user !== 'undefined'){
        return res.redirect('/admin');
    }
    return res.render('pages/index', { title: 'Express' });
}

/**
 * Process the login form submitted
 * @param req
 * @param res
 */
function login(req, res){
    let requestUser = {
        username: req.body.username,
        passwd: req.body.passwd
    };
    User.findOne({name: requestUser.username})
        .exec((err, user) => {
            if(err){
                console.error(err);
                return res.status(500).json({error: "Something wrong"});
            }

            if(!user){
                return res.render('pages/index', { error: 'Usuario no encontrado' });
            }

            user.comparePassword(requestUser.passwd, (err, isMatch) => {
                if(isMatch && !err){
                    req.session.user = user;
                    return res.redirect('/admin');
                }else return res.render('pages/index', { error: 'Usuario no encontrado.' });
            });
        });
}

/**
 * Process the logout request
 * @param req
 * @param res
 */
function logout(req, res){
    req.session.reset();
    return res.redirect('/')
}

/**
 * Show admin dashboard
 * @param req
 * @param res
 */
function showAdmin(req, res) {
    if(!req.user){
        return res.redirect('/');
    }

    let apiUrl = process.env.API_PATH;

    Request.find({userId: req.user._id}).sort({created_at: -1}).exec((err, requests) => {
        return res.render('pages/admin',{
            user: req.user,
            apiUrl: apiUrl,
            errors: err,
            requests: requests
        });
    });

}

/**
 * Actualiza el token de firebase enviado por el cliente
 * @param req
 * @param res
 */
function firebaseTokenAdmin(req, res){
    User.update({'_id': req.user._id}, {firebase: req.body.token}, {upsert: true}, function(err){
        if(err) return res.json({success: false});
        else return res.json({success: true});
    });
}

/**
 * Allows the currently logged-in user to change their password
 * @param req
 * @param res
 * @returns {*}
 */
function changePass(req, res){
    if(!req.user){
        return res.redirect('/');
    }

    const errorsRequest = validationResult(req);
    if(!errorsRequest.isEmpty()){
        return res.status(400).json({success: false, formerror: errorsRequest.array()});
    }

    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user) return res.status(500).json({success: false, error: 'Error al realizar la operación'});
        user.passwd = req.body.passwd;
        user.save(err => {
            if(err) return res.status(500).json({success: false, error: 'Error al realizar la operación'});
            else return res.status(200).json({success: true});
        })
    })
}