var _proID;
var added;
$(function () {
    _proID = getUrlParameter('proID');
    loadProductByID(_proID);
    $('txtShotPrice').hide();


    if (!localStorage.getItem('userName')) {
        $('#btnBid').hide();
        $('#btnShotPrice').hide();
    }

    isWatchlistAdded(function () {
        $('#addWatchList').css("color","red");
    });

    initImage();
});

$("#btnShotPrice").click(function(){
    var body = {
        username :  localStorage.getItem('userName'),
        proID : _proID
    }
    swal(`Buy it now?`, {
        buttons: {                        
            confirm: {
                text: "OK",
            },
        },
    }).then((value)=>{
     $.ajax({
        url: 'http://localhost:3000/bids/oneshot',
        type: 'POST',
        dataType: 'json',
        timeout: 10000,
        contentType: 'application/json',
        data: JSON.stringify(body)
    }).done(function (data) { 
        swal('SUCCESS');
    });
});   

});

var currentPrice;
var stepPrice;
var countDownDate;

function initImage()
{
    // $('.image_list').closest('li').on('click',function(){
    //     alert('a');
    // })
    // var images = $('.image_list li');
    // console.log(images);
    // var selected = $('.image_selected img');

    // images.each(function()
    // {
    //     var image = $(this);
    //     image.on('click', function()
    //     {
    //         var imagePath = new String(image.data('image'));
    //         selected.attr('src', imagePath);
    //     });
    // });
}

var loadProductByID =function(proID){
    $.ajax({
        url: 'http://localhost:3000/products/'+proID,
        dataType: 'json',
        timeout: 10000
    }).done(function (data) { 
        console.log(data);
        $('#proName').html(data.proName);
        $('#bidCount').html(data.bidCount);
        var date = new Date(data.remainTime);
        var temp = formatDate(date); 
        countDownDate = new Date(temp).getTime();
        currentPrice= data.currentPrice;
        $('#currentPrice').html(data.currentPrice);
        $('#txtDescription').html(data.description);
        stepPrice=data.stepPrice;
        addImage(data.proID,data.images);
        $(`#img-0`).trigger('click');
        if (data.shotPrice) {
            $('#ShotPrice').show();
            $('#txtShotPrice').html(data.shotPrice);
            console.log(data.shotPrice);
        }
        $('#userSell').html(data.username);
    });
};

var addImage=function(proID, images){
    $.each(images,function(idx,image){
        var html = `<li id= "img-${idx}" data-image="http://localhost:3000/image/products/${proID}/${image}"><img src="http://localhost:3000/image/products/${proID}/${image}"></li>`;
        // console.log(`${html}`);
        $('.image_list').append(html);
        $(`#img-${idx}`).click(function(){
            var imagePath = new String($(this).data('image'));
            $('.image_selected img').attr('src', imagePath);
        });
    });


};

// <li class = "image-item"><img src="http://localhost:3000/image/products/${proID}/${image}"></li>



$("#btnBid").click(function(){
    swal({
       title: "ĐẤU GIÁ", 
       text: "Vui lòng chọn giá cao hơn giá hiện tại!",
       content: {                
        element: "input",
        attributes: {
            placeholder: "Your price",
            type: "number",
            min: currentPrice + stepPrice,
            step: stepPrice,
            value:currentPrice + stepPrice,
        },                            
    },
}).then((value) => {
    if ((value % stepPrice) === 0) {

        console.log(value);           
        swal(`Your price: ${value}`, {
            buttons: {                        
                confirm: {
                    text: "OK",
                    value: value,
                },
            },
        }).then((value)=>{
                    //click ok
                    if (value) {
                        var body = {
                            username: localStorage.getItem('userName'),
                            proID:_proID,
                            maxPrice: value
                        };

                        var jsonToPost = JSON.stringify(body);
                        $.ajax({
                            url: 'http://localhost:3000/bids',
                            type: 'POST',
                            dataType: 'json',
                            timeout: 10000,
                            contentType: 'application/json',
                            data: jsonToPost
                        }).done(function(data) {
                            swal("Chúc mừng bạn!", "Đấu giá thành công!", "success");
                            loadProductByID(_proID);
                            
                        }).fail(function(xhr, status, err) {
                            swal("Rất tiếc!", "Đấu giá không thành công!", "error");
                            loadProductByID(_proID);
                        });
                    }

                });                   

    }

    else{
        swal("Giá không hợp lệ!");
    }

});
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};



// cập nhập thời gian sau mỗi 1 giây
var x = setInterval(function() {

    // $("#remainTime").remove();
    // Lấy thời gian hiện tại
    var now = new Date().getTime();

    // Lấy số thời gian chênh lệch
    var distance = countDownDate - now;

    // Tính toán số ngày, giờ, phút, giây từ thời gian chênh lệch
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 
    // HIển thị chuỗi thời gian trong thẻ p
    var timeOut= days + " Ngày " + hours + ":" + minutes + ":" + seconds;
    // $("#remainTime").append(timeOut);
    $('#remainTime').html(timeOut);

    // Nếu thời gian kết thúc, hiển thị chuỗi thông báo
    if (distance < 0) {
        clearInterval(x);
        $('#remainTime').html("Đã kết thúc");
    }
}, 1000);

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

$('#bidHistory').on('click', function(){
    $('#bid_log_content').empty();

    $.ajax({
        url: 'http://localhost:3000/bids/bidlog/'+_proID,
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {
        if (data) {
            $.each(data, function(idx, item) {
                var time = moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss");      
                var html = "<tr><td>"+idx+"</td> <td>"+time+"</td> <td>"+item.username +"</td> <td>"+ item.price+" VNĐ </td> </tr>";
                $('#bid_log_content').append(html);
            });    
        }else{
            $('#bid_log_content').append("Chưa có lượt ra giá nào.");
        }
    });
    $("#modalBidLog").modal();

});

$('#addWatchList').click(function(){

    if (added) {
        return;
    }else{
        if (localStorage.getItem('userName')) {

            var body={
                proID: _proID
            }
            $.ajax({
                url: 'http://localhost:3000/users/watchlist/'+localStorage.getItem('userName'),
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                contentType: 'application/json',
                data: JSON.stringify(body)
            }).done(function (data) {
                console.log(data);
                $('#addWatchList').css("color","red");
            });

        }else{
            swal('Dang nhap di ban!');
        }
    }
});

var isWatchlistAdded = function(fn){
    $.ajax({
        url: 'http://localhost:3000/users/watchlist/'+localStorage.getItem('userName')+'?proID='+_proID,
        dataType: 'json',
        timeout: 10000,
    }).done(function (data) {
        $.each(data, function(idx, item){
            if(item && item.proID && (item.proID == _proID)) {
                fn();
            }
        });
    });
};