var delete_categories = function (catID, fn) {
    $.ajax({
        url: 'http://localhost:3000/categories/' + catID,
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

var updateCategories = function(catID, body, fn){
    $.ajax({
        url: 'http://localhost:3000/categories/' + catID,
        dataType: 'json',
        timeout: 10000,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body)
    }).done(function (data) {
        fn();
    }).fail(function (xhr, textStatus, error) {
        console.log(textStatus);
        console.log(error);
    });
}


var addCategories = function(body, fn){
    $.ajax({
        url: 'http://localhost:3000/categories',
        dataType: 'json',
        timeout: 10000,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(body)
    }).done(function (data) {
        fn();
    }).fail(function (xhr, textStatus, error) {
        console.log(textStatus);
        console.log(error);
    });
}