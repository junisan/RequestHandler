const {checkSchema} = require('express-validator/check');

let newAdmin = checkSchema({
    name: {
        in: ['body'],
        isLength: {
            errorMessage: 'Se requiere un nombre de al menos 3 caracteres',
            options: { min: 8}
        }
    },
    passwd: {
        in: ['body'],
        isLength: {
            errorMessage: 'El pass debe tener al menor 8 caracteres',
            options: { min: 8}
        }
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'El mail debe ser válido'
        }
    }
});

let editAdmin = checkSchema({
    passwd: {
        custom: {
            options: (value, {req, location, path}) => {
                if(!value) return true;
                return value.length >= 8;
            },
            errorMessage: 'El pass debe tener al menos 8 caracteres'
        }
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'El mail debe ser válido'
        }
    }
});

let userChangePass = checkSchema({
    passwd: {
        in: ['body'],
        isLength: {
            errorMessage: 'El pass debe tener al menor 8 caracteres',
            options: { min: 8}
        }
    }
});

module.exports = {
    newAdmin: newAdmin,
    editAdmin: editAdmin,
    userChangePass: userChangePass
};
