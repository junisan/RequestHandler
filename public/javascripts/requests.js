/**
 * Generates the cUrl text that the user should insert into the console
 * @param $elem JQuery Textarea
 * @param headers Array of headers
 * @param body Array of body
 * @param method String "post"|"get"
 */
function generatecUrl($elem, headers, body, method){
    var headersString = '';
    var bodyString = '';
    for(var k in headers){
        if(headers.hasOwnProperty(k)){
            headersString += "-H '"+k+": "+headers[k]+ "' ";
        }
    }

    if(body){
        if(typeof body === "object"){
            let text = JSON.stringify(body);
            bodyString = "--data '"+text+"'";
        }else{
            bodyString = "--data '"+body+"'";
        }
    }

    $elem.text('curl ' + headersString + ' --request ' + method + ' ' +  bodyString + ' [URL]');
}

$(function(){

    /**
     * Foreach textarea...
     */
    $('textarea').each(function(index, item){
        let headers = $(this).data('headers');
        let body = $(this).data('body');
        let method = $(this).data('method') || 'POST';
        generatecUrl($(this), headers, body, method);
    });

    /**
     * Delete a Request
     */
    $('a[data-requestid]').on('click', function(e){
        e.preventDefault();
        var id = $(this).data('requestid');
        alertify.confirm("Borramos la notificación " + id, function(){
            $.ajax({
                url: '/api/'+id+'/delete',
                dataType: 'json',
                method: 'post',
                success: function(response){
                    if(response && response.success && response.success === true){
                        alertify.success("Se eliminó correctamente la petición " + id);
                        $('#request'+id).fadeOut(function(){
                           $('#request'+id).remove();
                        });
                    }else{
                        var error = response.error || 'Hubo un problema al eliminar la petición';
                        alertify.error(error);
                    }
                },
                error: function(response){
                    var error = response.error || 'Hubo un problema al eliminar la petición';
                    alertify.error(error);
                }
            })
        });
    });

    /**
     * Show alertify to change the password of the current logged user
     */
    $('#changePasswdBtn').click(function(e){
        e.preventDefault();
        alertify.prompt("Inserta el nuevo password", function(val, ev){
            ev.preventDefault();
            if(!val || val.length < 8){
                alertify.error('El password debe tener al menos ocho caracteres');
            }else{
                $.ajax({
                    url: '/admin/pass',
                    dataType: 'json',
                    method: 'post',
                    data: {passwd: val},
                    success: function(response){
                        if(response && response.success && response.success === true){
                            alertify.success("Se cambió correctamente la contraseña");
                        }else{
                            var error = response.error || 'Hubo un problema al cambiar la contraseña';
                            alertify.error(error);
                        }
                    },
                    error: function(response){
                        var error = response.error || 'Hubo un problema al cambiar la contraseña';
                        alertify.error(error);
                    }
                })
            }
        });
    });

});