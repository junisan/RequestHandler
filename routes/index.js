let express = require('express');
let router = express.Router();

let userController = require('../src/Controller/userController');
let apiController = require('../src/Controller/apiController');
let adminController = require('../src/Controller/adminController');
let validator     = require('../src/Utils/validation');

router.get('/', userController.showHome);
router.post('/', userController.login);
router.get('/logout', userController.logout);

// middleware: load session user into the request
router.use(function(req, res, next){
    if(req.session && req.session.user){
        req.user = req.session.user;
        delete req.user.passwd;
        req.session.user = req.user;
        return next();
    } else next();
});


router.get('/admin', userController.showAdmin);
router.post('/admin/pass', validator.userChangePass, userController.changePass);
router.post('/admin/token', userController.firebaseTokenAdmin);


router.get('/admin/manage', adminController.manageAdmins);
router.post('/admin/manage/new', validator.newAdmin, adminController.newAdmin);
router.get('/admin/manage/:idUser', adminController.showEditAdmin);
router.post('/admin/manage/:idUser', validator.editAdmin, adminController.editAdmin);
router.post('/admin/manage/:idUser/delete', adminController.deleteAdmin);

router.post('/api/:requestId/delete', apiController.deleteRequest);
router.get('/api/:ap([a-f0-9]{32})', apiController.getRequest);
router.post('/api/:ap([a-f0-9]{32})', apiController.postRequest);


module.exports = router;
