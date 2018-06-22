$( document ).ready(function() {
	 localStorage.setItem('admin', false);
	$('#frm-signin').submit(function(e) {
		e.preventDefault();

			$('#frm-signin').ajaxSubmit({
			beforeSubmit: function(formData, jqForm, options) {
                
			},
			success: function showResponse(responseText, statusText, xhr, $form) {
				localStorage.setItem('admin', true);
                $( location ).attr("href", './home.html');
			},
			error : function(err){
				swal({
					title: 'Error!',
					text: err.responseText,
					type: 'error',
					confirmButtonText: 'OK'
				  })
			}
			});

		return false;
	});
});