var  gainuser = function (isAccepted, username, fn){
    $.ajax({
        url: 'http://localhost:3000/users/gainvip/' + username,
        dataType: 'json',
        timeout: 10000,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({isAccepted : isAccepted})
    }).done(function (data) {
       fn();
    }).fail(function (xhr, textStatus, error) {
        console.log(textStatus);
        console.log(error);
    });
}