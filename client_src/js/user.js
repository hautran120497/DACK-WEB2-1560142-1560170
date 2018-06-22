$(function(){
	//
	$('#login').show();
	$('#userInfo').hide();

	if (localStorage.getItem('userName')) {
		$('#login').hide();
		$('#userInfo').show();
		$('#userName').append(localStorage.getItem('userName'));
	}

});

$('#btn-gainvip').on('click',function(){

    $.ajax({
        url: 'http://localhost:3000/users/gainvip/'+localStorage.getItem('userName'),
        type: 'POST',
        dataType: 'json',
        timeout: 10000,
        contentType: 'application/json'
    }).done(function (data) { 
        swal('SUCCESS');
    });
});

//
$('#resetPWD').on('click', function(){
	$("#modalResetPWD").modal();    		
});
//show modal login register
$('#login').on('click', function()
{
	if (localStorage.getItem('userName')===null) {
		$("#modalLogin").modal();    		
	}else{
		$(location).attr('href', 'profile.html');
	}
});
//Xu ly dang nhap
$('#btnLogin').on('click',function(){

	var _userName = $('#txtUser').val();
	if (_userName === 0) {
		alert('Ten dang nhap khong duoc trong');			
	}
	var _pwd = $('#txtPWD').val();    
	if (_pwd === 0) {
		alert('Mat khau khong duoc trong');
	}

	var dataToPost={
		username:_userName,
		password:_pwd		
	};
	var jsonToPost = JSON.stringify(dataToPost);

	$.ajax({
		url: 'http://localhost:3000/users/'+_userName,
		dataType: 'json',
		timeout: 10000
	}).done(function (data) {
		console.log(data);
		if (data.isValidated) {
			//
			$.ajax({
				url: 'http://localhost:3000/auth/login',
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: jsonToPost
			}).done(function(data) {
				console.log(data);
				if(data.auth){
					localStorage.setItem('userName',_userName);
					location.reload();				
				}else{
					swal("Mật khẩu không đúng");
				}

			}).fail(function(xhr, status, err) {
				if (!xhr.responseJSON.auth) {
					swal("Thông tin đăng nhập không đúng");
				}	        
			});
			//
		}else{
			console.log(_userName);
			$.ajax({
				url: 'http://localhost:3000/users/validate/'+_userName,
				type: 'POST',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json'
			}).done(function(data){
				console.log(data);
			}).fail(function(xhr, status, err){
				
			});
			swal({
				title: "Tài khoản chưa kích hoạt!",
				text: "Vui lòng kích hoạt email!",
				icon: "warning",
				button: "OK"
			});
		}
	});       
});

//xu ly dang xuat
$('#logout').on('click',function(){
	swal({
		title: "LOGOUT!", 
		text: "Bạn muốn đăng xuất?",
		buttons: {
			cancel: true,
			confirm: true
		},
	}).then((confirm)=>{
		if(confirm){
			localStorage.removeItem('userName');
			location.reload();
		}
	});
});
//xu ly doi mat khau
$('#btnResetPWD').on('click',function(){

	var _pwd = $('#txtOldPassword').val();
	if (_pwd.length === 0) {
		swal('Please input a valid value');
		return;
	}
	var _newPWD = $('#txtNewPassword').val();
	if (_newPWD.length<6) {
		swal('Password failed!','Mat khau phai dai it nhat 6 ky tu','error');
		return;
	}
	var _reNewPWD = $('#txtConfirmNewPWD').val();
	if (_reNewPWD === 0) {
		swal('Please input a valid value');
		return;
	}
	if (_reNewPWD !== _newPWD) {
		swal('Mật khẩu không khớp');
		return;
	}

	var dataToPost={
		username:localStorage.getItem('userName'),
		password:_pwd		
	};
	var jsonToPost = JSON.stringify(dataToPost);

	$.ajax({
		url: 'http://localhost:3000/auth/login',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		contentType: 'application/json',
		data: jsonToPost
	}).done(function(data) {
		console.log(data);
		if(data.auth){
			var body={
				password: _newPWD
			}
			$.ajax({
				url: 'http://localhost:3000/users/'+ localStorage.getItem('userName'),
				type: 'PUT',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json',
				data: JSON.stringify(body)
			}).done(function(data) {
				console.log(data);			
				swal({
					title: "Thành công!", 
					text: "Đổi mật khẩu thành công.",
					buttons: {
						cancel: true,
						confirm: true
					},
				}).then((confirm)=>{
					if(confirm){
						localStorage.removeItem('userName');
						location.reload();
					}
				});
			}).fail(function(xhr, status, err){
				swal("Đổi mật khẩu thất bại.");
			});

		}else{
			swal("Mật khẩu không đúng");
		}
	});
});
//xu quen mat khau
$('#forgotPWD').on('click',function(){
	swal("Enter your registed username", {
		content: "input"
	})
	.then((value) => {
		if (value) {
			$.ajax({
				url: 'http://localhost:3000/users/resetpwd/'+ value,
				type: 'PUT',
				dataType: 'json',
				timeout: 10000,
				contentType: 'application/json'
			}).done(function(data) {			
				swal(`We sent new password to your email.`);
			}).fail(function(xhr, status, err) {
				swal(`Send failed!`);
			});

		}else{
			swal('email empty');
		}
	});

});

//xu ly register
$('#btnRegister').on('click', function () {

	var _userName = $('#txtUserName').val();
	if (_userName.length === 0) {
		swal('Please input a valid value');
		return;
	}
	var _email = $('#txtEmail').val();
	if (_email.length === 0) {
		swal('Please input a valid value');
		return;
	}
	if (_email.length===0) {
		swal('email empty!');
	}
	var _pwd = $('#txtPassword').val();
	if (_pwd<6) {
		swal('Password failed!','Mat khau phai dai it nhat 6 ky tu','error');
		return;
	}
	var _cfmpwd = $('#txtConfirmPWD').val();
	if (_cfmpwd === 0) {
		swal('Please input a valid value');
		return;
	}
	if (_cfmpwd !== _pwd) {
		swal('Mật khẩu không khớp');
		return;
	}
	var _phone = $('#txtPhone').val();
	if (_phone.length === 0) {
		swal('Please input a valid value');
		return;
	}

	var body = {
		username: _userName,
		password: _pwd,
		email: _email,
		phone: _phone,
		// captcha_response: grecaptcha.getResponse()
	};

	$.ajax({
		url: 'http://localhost:3000/users',
		dataType: 'json',
		timeout: 10000,

		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(body)
	}).done(function(data) {
		swal("Thành công!", "Tạo tài khoản thành công!", "success");
	}).fail(function(xhr, textStatus, error) {
		console.log(xhr);
		swal("Rất tiếc!", xhr.responseJSON.message , "error");
	});
});




