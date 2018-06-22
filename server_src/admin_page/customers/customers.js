$('kbd').remove();

$('.btn-delete').click(function () {
  var username = $(this).attr('username');

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
      delete_user(username, function () {
        $('#' + username).fadeOut(300);
      });

      swal(
        'Deleted!',
        'Customer has been deleted.',
        'success'
      )
    }
  })
});
