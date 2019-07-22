$(function(){
    /**
     * Processes the error in the ajax request and shows it more pretty
     * @param result Result of ajax error call
     */
    function processFormError(result){
        var errorString = '';
        if(result.hasOwnProperty('responseJSON') && result.responseJSON.formerror){
            errorString = 'Errores al crear el usuario:'+"<br>";
            for(var i = 0; i < result.responseJSON.formerror.length; i++){
                errorString += result.responseJSON.formerror[i].msg + "<br>";
            }
        }
        else if(result.hasOwnProperty('responseJSON') && result.responseJSON.error){
            errorString += result.responseJSON.error + "<br>";
        }
        else errorString = 'No se pudo contactar con el servidor';
        alertify.error(errorString);
    }

    /**
     * When user click on save new user form
     */
    $('#newForm').submit(function(e){
        e.preventDefault();
        var data = {
            name: $('#usernameForm').val(),
            passwd: $('#passwordForm').val(),
            email: $('#emailForm').val(),
            admin: $('#adminForm').is(':checked')
        };
        if(data.passwd !== $('#password2Form').val()){
            alertify.error('Las contraseñas no coinciden');
            return false;
        }
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method') || 'post',
            dataType: 'json',
            data: data,
            success: function(result){
                if(result.hasOwnProperty('success') && result.success === true){
                    $('#newForm')[0].reset();
                    alertify.success('Se ha creado el usuario');
                }
            },
            error: function(result){
                processFormError(result, true);
            }
        });

        return false;
    });

    /**
     * When user click on edit user form
     */
    $('#editForm').submit(function(e){
        console.log('a');
        e.preventDefault();
        var data = {
            passwd: $('#passwordForm').val(),
            email: $('#emailForm').val(),
            admin: $('#adminForm').is(':checked')
        };
        if(data.passwd !== $('#password2Form').val()){
            alertify.error('Las contraseñas no coinciden');
            return false;
        }
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method') || 'post',
            dataType: 'json',
            data: data,
            success: function(result){
                if(result.hasOwnProperty('success') && result.success === true){
                    alertify.success('Se ha editado el usuario');
                }
            },
            error: function(result){
                processFormError(result, true);
            }
        });

        return false;
    });

    /**
     * When user click on delete user
     */
    $('#deleteUserBtn').click(function(e){
        var userId = $(this).attr('data-id');
        alertify.confirm("Borramos al usuario "+userId+"? Se borrarán también sus peticiones recibidas", function(){
            $.ajax({
                url: window.location.pathname + '/delete',
                method: 'post',
                dataType: 'json',
                data: {},
                success: function(result){
                    if(result.hasOwnProperty('success') && result.success === true){
                        window.location = '/admin/manage';
                    }
                },
                error: function(result){
                    processFormError(result, true);
                }
            });
        });
    });
});