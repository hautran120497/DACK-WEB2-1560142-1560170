var delete_user = function (username, fn) {
    $.ajax({
        url: 'http://localhost:3000/users/' + username,
        dataType: 'json',
        timeout: 10000,
        type: 'DELETE',
        contentType: 'application/json',
    }).done(function (data) {
        fn();
    }).fail(function (xhr, textStatus, error) {
        console.log(textStatus);
        console.log(error);
    });
}