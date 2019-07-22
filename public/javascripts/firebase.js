$(function(){
    var config = {
        messagingSenderId: "550292707876"
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    if(Notification.permission !== 'granted'){
        $('#notificationAlertsAlert').show();
    }else{
        $('#notificationAlertsAlert').hide();
        requestPermission();
    }

    $('#activeNotif').on('click', function(e){
        e.preventDefault();
        requestPermission();
    });

    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);
        $('#noRequestAlert').hide();
        $('#newRequestAlert').show();
    });

    messaging.onTokenRefresh(function() {
        messaging.getToken().then(function(refreshedToken) {
            submitTokenToServer(refreshedToken);
        }).catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
        });
    });

    function requestPermission(){
        messaging.requestPermission()
            .then(function(){
                if($('#notificationAlertsAlert').is(':visible'))
                    $('#notificationAlertsAlert').fadeOut();
                return messaging.getToken();
            })
            .then(function(token){
                console.log(token);
                submitTokenToServer(token);
            })
            .catch(function(err){
                alertify.error('No se pudieron activar las notificaciones. ' + err);
                console.error(err);
            });
    }

    function submitTokenToServer(token){
        $.ajax({
            url: '/admin/token',
            dataType: 'json',
            method: 'post',
            data: {token: token},
            error: function(xhr, ajaxOptions, thrownError){
                console.error('It was not possible to send token to server :(');
            },
            success: function(response){
                if(!response || !response.success || response.success !== true){
                    alertify.error('No se pudieron activar las notificaciones. ');
                }
            }
        });
    }

});