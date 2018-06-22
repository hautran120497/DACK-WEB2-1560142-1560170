
$(document).ready(function () {
    $("#btn-gainvip").trigger('click');

    var admin = localStorage.getItem('admin');
    console.log(admin);
    if (!admin) $(location).attr("href", './index.html');
});

$('#btn-logout').click(function () {
    localStorage.removeItem('admin');
    console.log(localStorage.getItem('admin'));
    $(location).attr("href", './index.html');
})

$('#btn-home').click(function(){
    $('#btn-gainvip').trigger('click');
});

$("#btn-gainvip").click(function () {
    //load dasgboard
    $('#header-conent').html('GIAN VIP REQUEST');
    $.ajax({
        url: "./requests/gainvip.htm",
        cache: true,
        success: function (source) {
            var template = Handlebars.compile(source);
            var _data;
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/users/gainvip",
                success: function (data) {
                    data.forEach(element => {
                        element.createdAt = moment(element.createdAt).format("DD/MM/YYYY HH:mm:ss");
                        element.updatedAt = moment(element.updatedAt).format("DD/MM/YYYY HH:mm:ss");
                    });
                    _data = data;
                },
                complete: function () {
                    $('#main-content').html(template({ users: _data }));
                    $('#datatable').DataTable();
                }
            });

        }
    });
});

$("#btn-categories").click(function () {
    //load dasgboard
    $('#header-conent').html('CATEGORIES');

    $.ajax({
        url: "./categories/categories.htm",
        cache: true,
        success: function (source) {
            var template = Handlebars.compile(source);
            var _data;
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/categories",
                success: function (data) {
                    data.forEach(element => {
                        element.createdAt = moment(element.createdAt).format("DD/MM/YYYY HH:mm:ss");
                        element.updatedAt = moment(element.updatedAt).format("DD/MM/YYYY HH:mm:ss");
                    });
                    _data = data;
                },
                complete: function () {
                    $('#main-content').html(template({ categories: _data }));
                    $('#datatable').DataTable();
                }
            });

        }
    });
});

$("#btn-customers").click(function () {
    $('#header-conent').html('CUSTOMERS');

    $.ajax({
        url: "./customers/customers.htm",
        cache: true,
        success: function (source) {
            var template = Handlebars.compile(source);
            var _data;
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/users",
                success: function (data) {
                    data.forEach(element => {
                        if (element.gainvipAt)
                            element.gainvipAt = moment(element.gainvipAt).format("DD/MM/YYYY");
                        else
                            element.gainvipAt = null;
                        element.createdAt = moment(element.createdAt).format("DD/MM/YYYY");
                    });
                    _data = data;
                },
                complete: function () {
                    $('#main-content').html(template({ customers: _data }));
                    $('#datatable').DataTable();
                }
            });
        }
    });
});

