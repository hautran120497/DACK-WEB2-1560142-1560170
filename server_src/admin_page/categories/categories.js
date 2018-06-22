$('.btn-delete').click(function () {
    var catID = $(this).attr('catID');

    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            delete_categories(catID, function () {
                $('#' + catID + '-info').fadeOut(300);
            });
    
          swal(
            'Deleted!',
            'Categories has been deleted.',
            'success'
          );
        }
      })
});

$('.btn-edit').click(function () {
    var catID = $(this).attr('catID');
    $('#' + catID + '-edit').toggle(300);
});

$('.btn-save').click(function () {
    var catID = $(this).attr('catID');
    var catName = $(this).attr('catName');
    var txtCatName = $('#txt-' + catID).val();
    if(!txtCatName) {
        swal({
            title: 'Error!',
            text: 'Category Name is Empty!',
            type: 'error',
            confirmButtonText: 'ok'
          })
    }else if(txtCatName != catName) {
        updateCategories(catID, { catName: txtCatName }, function () {
            $('#name-'+catID).html(txtCatName);
        })
    }
    $('#' + catID + '-edit').toggle(300);
});

$('#btn-add').click(function(){
    var txtCatName = $('#txt-add-catName').val();
    if(!txtCatName){
        swal({
            title: 'ERROR!',
            text: 'Category name is empty!',
            type: 'error',
            confirmButtonText: 'ok'
          })
    }else{
        addCategories({catName : txtCatName},function(){
            $("#btn-categories").trigger('click');
        })
    }
})