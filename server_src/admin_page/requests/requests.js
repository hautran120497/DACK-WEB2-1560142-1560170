$('.btn-accept').click(function () {
    var username = $(this).attr('username');
    gainuser(1, username, function(){
        $('#'+username).fadeOut(300);
    });
});

$('.btn-deny').click(function () {
    var username = $(this).attr('username');
    gainuser(0, username, function(){
        $('#'+username).fadeOut(300);
    });
});