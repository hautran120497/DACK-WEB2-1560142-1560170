$(function(){
    loadMyProducts();
    loadSucessfulBid();
    loadBidding();
    loadWatchlist();
    loadMyProductTimeOut();
});

var editProID;

var loadMyProductTimeOut;
loadMyProductTimeOut = function () {
    console.log(localStorage.getItem('userName'));
    $.ajax({
        url: 'http://localhost:3000/products?username='+localStorage.getItem('userName')+'&isTimeOut=1',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
     $.each(data, function(idx, item) {  
        var html ="<tr>"+
        "<td>"+ idx + "</td>"+
        "<td><a href='product_detail.html?proID="+item.proID+"'>"+ item.proName + "</a></td>"+
        "<td>"+ item.bidCount + "</td>"+
        "<td>"+ item.currentPrice + "</td>"+
        "<td>"+ item.maxBidder + " [<a href='javascript:;'>Cộng điểm</a>]" + "</td>"+
        +"</tr>";
        $('#my-productTimeOut').append(html);
    });   
 });
};

var loadMyProducts;
loadMyProducts = function () {
    $('#my-product').empty();
    console.log(localStorage.getItem('userName'));
    $.ajax({
        url: 'http://localhost:3000/products?username='+localStorage.getItem('userName'),
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
     $.each(data, function(idx, item) {  
        var html ="<tr>"+
        "<td>"+ idx + "</td>"+
        "<td><a href='product_detail.html?proID="+item.proID+"'>"+ item.proName + "</a></td>"+
        
        "<td>"+ item.bidCount + "</td>"+
        "<td>"+ item.currentPrice + "</td>"+
        "<td>"+ item.maxBidder + " [<a class='kickOut' id='btnkick-"+ item.proID +"' data-proID='"+item.proID+"' username='"+ item.maxBidder +"' href='javascript:;' style='color:red'>Kick</a>]" + "</td>"+
        "<td><i class='fas fa-edit' ></i></td>"+
        +"</tr>";
        $('#my-product').append(html);

        $(`#btnkick-${item.proID}`).click(function(){
            var body = {
                username :  $(this).attr('username'),
                proID :  $(this).data('proID')
            }
            swal(`Kick him now?`, {
                buttons: {                        
                    confirm: {
                        text: "OK",
                    },
                },
            }).then((value)=>{
                $.ajax({
                    url: 'http://localhost:3000/bids/kick',
                    type: 'POST',
                    dataType: 'json',
                    timeout: 10000,
                    contentType: 'application/json',
                    data: JSON.stringify(body)
                }).done(function (data) { 
                    swal('SUCCESS');
                    loadMyProducts();
                });
            });
        });
    });   
 });
};






var loadSucessfulBid;
loadSucessfulBid = function () {
    $.ajax({
        url: 'http://localhost:3000/products?maxBidder='+localStorage.getItem('userName'),
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
     $.each(data, function(idx, item) {  
        var html ="<tr>"+
        "<td>"+ idx + "</td>"+
        "<td><a href='product_detail.html?proID="+item.proID+"'>"+ item.proName + "</a></td>"+
        
        "<td>"+ item.username + "</td>"+
        "<td>"+ item.bidCount + "</td>"+
        "<td>"+ item.currentPrice + "</td>"+
        +"</tr>";
        $('#successfulBid').append(html);
    });   
 });
};

var loadBidding;
loadBidding = function () {

    $.ajax({
        url: 'http://localhost:3000/bids?username='+localStorage.getItem('userName'),
        dataType: 'json',
        timeout: 10000
    }).done(function (dataBid) {        
        $.each(dataBid, function(idx, bidProduct) {  
            $.ajax({
                url: 'http://localhost:3000/products/'+bidProduct.proID,
                dataType: 'json',
                timeout: 10000
            }).done(function (product) {        
                var html =`<tr style="color: ${product.maxBidder == localStorage.getItem('userName')?'blue':''}" >`+
                "<td>"+ idx + "</td>"+
        "<td><a href='product_detail.html?proID="+product.proID+"'>"+ product.proName + "</a></td>"+
                
                "<td>"+ product.username + "</td>"+
                "<td>"+ product.bidCount + "</td>"+
                "<td>"+ product.currentPrice + "</td>"+
                "<td>"+ product.maxBidder + "</td>"+
                +"</tr>";
                $('#bidding').append(html);
            });
        });   
    });
};

var loadWatchlist;
loadWatchlist = function () {
    $.ajax({
        url: 'http://localhost:3000/users/watchlist/'+localStorage.getItem('userName'),
        dataType: 'json',
        timeout: 10000
    }).done(function (dataWatch) {        
        $.each(dataWatch, function(idx, watchlisProduct) {  
            $.ajax({
                url: 'http://localhost:3000/products/'+watchlisProduct.proID,
                dataType: 'json',
                timeout: 10000
            }).done(function (product) {        
                var html ="<tr>"+
                "<td>"+ idx + "</td>"+
        "<td><a href='product_detail.html?proID="+product.proID+"'>"+ product.proName + "</a></td>"+
                
                "<td>"+ product.username + "</td>"+
                "<td>"+ product.bidCount + "</td>"+
                "<td>"+ product.currentPrice + "</td>"+
                "<td>"+ product.maxBidder + "</td>"+
                +"</tr>";
                $('#watchlist').append(html);
            });
        });   
    });
};

$('#fa-edit').click(function(){
    editProID = $(this).data('id');
    $("#modalEditProduct").modal();
});

