const User = require('../Model/User');
const Request = require('../Model/Request');
const request = require('request');

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest,
    deleteRequest:deleteRequest
};

/**
 * Procesa una petición GET de un webhook
 * @param req
 * @param res
 */
function getRequest(req, res){
    _processRequest('post', req, (err) => {
        if(!err) return res.status(200).send('Ok');
        else if(err === 200) return res.status(200).send('Ok');
        else if(err === 404) return res.status(404).send('Not found');
        else return res.status(404).send('Not available now')
    });
}

/**
 * Procesa una petición POST de un webhook
 * @param req
 * @param res
 */
function postRequest(req, res){
    _processRequest('post', req, (err) => {
        if(!err) return res.status(200).send('Ok');
        else if(err === 200) return res.status(200).send('Ok');
        else if(err === 404) return res.status(404).send('Not found');
        else return res.status(404).send('Not available now')
    });
}

/**
 * Método interno que se encarga de registrar la petición y devolver el código
 * de estado adecuado
 * @param method
 * @param req
 * @param cb(err) donde err es un número que representa el código de estado HTTP
 * @private
 */
function _processRequest(method, req, cb){
    User.findOne({ap: req.params.ap}, (err, user) => {
        if(err) return cb(503);
        if(!user) return cb(404);

        if(req.headers && req.headers.host)
            delete req.headers.host;

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        let request = new Request({
            userId: user._id,
            method: method,
            ip: ip,
            headers: JSON.stringify(req.headers),
            body: JSON.stringify(req.body)
        });

        request.save(err => {
            if(err) return cb(503);
            else{
                if(user.firebase){
                    let url = process.env.API_PATH + '/admin';
                    _sendNewRequestFCM(user.firebase, url, (err)=>{
                        return cb(200);
                    })
                }else{
                    return cb(200);
                }
            }
        });
    });
}

/**
 * Elimina una petición, comprobando que pertenece al usuario actualmente logado
 * @param req
 * @param res
 */
function deleteRequest(req, res){
    if(!req.user){
        return res.redirect('/');
    }

    let requestId = req.params.requestId;
    Request.findOne({_id: requestId}, (err, request) => {
        if(err)      return res.json({success: false, error: 'No se pudo eliminar la petición'});
        if(!request) return res.json({success: false, error: 'Acceso denegado'});
        if(req.user._id === request.userId){
            request.remove(err => {
                if(err)      return res.json({success: false, error: 'No se pudo eliminar la petición'});
                else         return res.json({success: true});
            });
        }else return res.json({success: false, error: 'Acceso denegado'});
    });
}

/**
 * Envía una notificación a FCM para avisar al usuario de que ha llegado una request
 * @param {string} deviceId Token de identidad del dispositivo del usuario
 * @param {string, null} url Url a la que enviar al usuario o null para no enviar a ningún sitio
 * @param {function} cb(err)
 * @private
 */
function _sendNewRequestFCM(deviceId, url,  cb){
    let body = {
        "data": {
            "title": "Nueva Notificación",
            "message": "Ha llegado una petición para ti",
            "icon": "/images/icon.png",
        },
        "to": deviceId
    };
    if(typeof url === 'string') body.data.url = url;

    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key='+process.env.FIREBASE_MESSAGING_KEY
        },
        body: JSON.stringify(body)
    }, (err, response, body) => {
        if(err){
            console.error(err);
            return cb(true);
        }else if(response.statusCode >= 400){
            console.error(body);
            return cb(true);
        }else{
            return cb();
        }
    });

}