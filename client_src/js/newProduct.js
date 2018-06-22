$(function(){

    $('#datetimepicker2').datetimepicker({
        locale: 'vi'
    });
    $('#txtuserName').val(localStorage.getItem('userName'));


});
$('#product_form').submit(function (e) {

    // var _proName = $('#txtProName').val();
    // if (_proName.length === 0) {
    //     alert('Please input a valid value');
    //     return;
    // }
    // var _catID = $( "#selectCatID" ).val();

    // var _initPrice = $('#txtInitPrice').val();
    // if (_initPrice.length === 0) {
    //     alert('Please input a valid value');
    //     return;
    // }
    // var _stepPrice = $('#txtStepPrice').val();
    // if (_stepPrice.length === 0) {
    //     alert('Please input a valid value');
    //     return;
    // }
    // var _sortPrice = $('#txtSortPrice').val();
    // if (_sortPrice === 0) {
    //     alert('Please input a valid value');
    //     return;
    // }
    // var _description = $('#txtDescription').val();
    // if (_description.length === 0) {
    //     alert('Please input a valid value');
    //     return;
    // }

    // $("#product_form").ajaxSubmit({url: 'localhost:3000/products', type: 'post'})
    
    e.preventDefault();
    $('#product_form').ajaxSubmit({
        beforeSubmit: function(formData, jqForm, options) {
        },
        success: function showResponse(responseText, statusText, xhr, $form) {
            swal(`SUCCESS`, {
                buttons: {       
                    confirm: true
                },
            });
        },
        error : function showResponse(responseText, statusText, xhr, $form) {
            swal(`ERROR`, {
                buttons: {       
                    confirm: true
                },
            });
        },
    });
    return false; 
    // var body = {
    //     proName: _proName,
    //     catID: _catID,
    //     initPrice: _initPrice,
    //     stepPrice: _stepPrice,
    //     sort
    // };

    // $.ajax({
    //     url: 'http://localhost:3000/users',
    //     dataType: 'json',
    //     timeout: 10000,

    //     type: 'POST',
    //     contentType: 'application/json',
    //     data: JSON.stringify(body)
    // }).done(function(data) {
    //     // console.log(data);
    //     alert('Added');
    // }).fail(function(xhr, textStatus, error) {
    //  console.log(textStatus);
    //  console.log(error);
    //  console.log(xhr);
    // });
});

$(function() {
    $('#txtDescription').summernote();
});