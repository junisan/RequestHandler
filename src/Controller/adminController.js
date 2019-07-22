const User = require('../Model/User');
const Request = require('../Model/Request');
const {validationResult } = require('express-validator/check');

module.exports = {
    manageAdmins: manageAdmins,
    newAdmin: newAdmin,
    showEditAdmin:showEditAdmin,
    editAdmin:editAdmin,
    deleteAdmin: deleteAdmin
};

function manageAdmins(req, res){
    if(!req.user || !req.user.admin || !req.user.admin === true){
        return res.redirect('/');
    }

    User.find({}, (err, users) => {
        return res.render('pages/manageAdmin', {
            err: err,
            users: users,
            user: req.user
        });
    });
}

function showEditAdmin(req, res){
    if(!req.user || !req.user.admin || !req.user.admin === true){
        return res.redirect('/');
    }

    User.findOne({_id: req.params.idUser}, (err, user) => {
        return res.render('pages/manageAdminEdit', {
            err: err,
            userForm: user,
            user: req.user
        });
    });
}

function newAdmin(req, res){
    if(!req.user || !req.user.admin || !req.user.admin === true){
        return res.status(401).json({success: false, error: 'forbidden'});
    }
    const errorsRequest = validationResult(req);
    if(!errorsRequest.isEmpty()){
        return res.status(400).json({success: false, formerror: errorsRequest.array()});
    }

    User.findOne().or([{name: req.body.name}, {email: req.body.email}]).exec((err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({success: false, error: 'Error en base de datos'});
        }
        if(result){
            if(result.name === req.body.name) return res.status(400).json({success: false, error: 'Nombre ya en uso'});
            else return res.status(400).json({success: false, error: 'Email ya en uso'});
        }

        let newUser = new User({
            name: req.body.name,
            passwd: req.body.passwd,
            email: req.body.email,
            ap: require('crypto').createHash('md5').update(new Date().toString()).digest("hex"),
            admin: (typeof req.body.admin !== 'undefined' ) ? req.body.admin : false
        });

        newUser.save(err => {
            if(err){
                console.error(err);
                return res.status(500).json({success: false, error: 'Error en base de datos'});
            }
            else return res.status(200).json({success: true});
        });
    });
}

function editAdmin(req, res, next){
    if(!req.user || !req.user.admin || !req.user.admin === true){
        return res.status(401).json({success: false, error: 'forbidden'});
    }
    const errorsRequest = validationResult(req);
    if(!errorsRequest.isEmpty()){
        return res.status(400).json({success: false, formerror: errorsRequest.array()});
    }

    User.findOne({email: req.body.email, _id: {'$ne' : req.params.idUser}}, (err, emailInUse) => {
        if(err){
            console.error(err);
            return res.status(500).json({success: false, error: 'Error en base de datos'});
        }
        if(emailInUse){
            return res.status(400).json({success: false, error: 'Email ya en uso'});
        }

        User.findOne({_id: req.params.idUser}, (err, user) => {
            if(err){
                console.error(err);
                return res.status(500).json({success: false, error: 'Error en base de datos'});
            }
            if(!user){
                return res.status(404).json({success: false, error: 'No se encontró el usuario'});
            }

            user.email = req.body.email;
            user.admin = (req.body.admin) ? req.body.admin : false;
            if(req.body.passwd){
                user.passwd = req.body.passwd;
            }

            user.save(err => {
                if(err){
                    console.error(err);
                    return res.status(500).json({success: false, error: 'Error en base de datos'});
                }
                else return res.status(200).json({success: true});
            });
        });
    });

}

function deleteAdmin(req, res){
    if(!req.user || !req.user.admin || !req.user.admin === true){
        return res.status(401).json({success: false, error: 'forbidden'});
    }
    let idUser = req.params.idUser;

    //Delete requests
    Request.remove({userId: idUser}, (err) => {
        if(err){
            console.error(err);
            return res.status(500).json({success: false, error: 'Error en base de datos'});
        }
        User.remove({_id: idUser}, (err) => {
            if(err){
                console.error(err);
                return res.status(500).json({success: false, error: 'Error en base de datos'});
            }
            return res.status(200).json({success: true});
        });
    });
}