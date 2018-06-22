$(function() {
    HandlebarsIntl.registerWith(Handlebars);
    //indext.html
    loadTopBid();
    loadTopPrice();
    loadTopNearExpiration();
    //product.html
    // sortProduct();
    //product_detail.html
    //bid_log.html


    if(key){ 
        loadProductsByKeyword(key);
    }else if(_catID){
        loadProductsByCatID(_catID);
    }else{
        loadProducts();
    }
    // else
    // if(_catID){
    //     _option = 6;
    //     loadProductsByCatID(_catID);
    // }//else{
    //     loadProducts();
    // }
    
    // loadProducts();

    // loadProductsByKeyword('na');
    var pathname = $(location).attr('href');
    console.log(pathname);

    //load more product khi kéo cuối trang
    $(window).scroll(function() {   
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            
            loadProducts();
        }

    });

});

var currenPage=0;
var limit=10;
// Sắp xếp theo tiêu chí
var _option = 0;
//search by key word

var key=sessionStorage.getItem('keyWord');
var _catID=sessionStorage.getItem('catID');

$('#btnSearch').on('click', function () {
    sessionStorage.setItem('keyWord',$("#txtKeyWord").val());  
    if ($(location).attr('href') !== /$\/product\.html/) {
        $(location).attr('href', 'product.html');
    }else{
        loadProductsByKeyword(sessionStorage.getItem('keyWord'));
    }   

});

$(".category-list").on('click','.catItem',function(){
   sessionStorage.setItem('catID', $(this).data('id'));
   if ($(location).attr('href') !== /$\/product\.html/) {
        $(location).attr('href', 'product.html');
    } else{
        loadProductsByCatID(sessionStorage.getItem('catID'));

    }
});

var addIMG = function(data){
    $.each(data,function(idx,product){

        $.ajax({
            url: 'http://localhost:3000/products/image/'+product.proID,
            dataType: 'json',
            timeout: 10000
        }).done(function (images) { 
            $(`.img-${product.proID}`).attr('src',`http://localhost:3000/image/products/${product.proID}/${images.images[0]}`);
        });
        // $('');
    });
};

var loadProducts;
loadProducts = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit='+limit+'&offset='+currenPage,
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#product-list').append(html);
        addIMG(data);
        currenPage+=limit;
        // $('.product_item').removeAttr("display");
        $('.product_item').fadeIn(400, function() {
            $(this).removeAttr('style');
        });       
    });
};

var loadProductsByPrice;
loadProductsByPrice = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit='+ limit +'&offset='+ currenPage +'&order=initPrice&sort=asc',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#product-list').append(html);
        addIMG(data);
        currenPage+=limit;
        // $('.product_item').removeAttr("display");
        $('.product_item').fadeIn(400, function() {
            $(this).removeAttr('style');
        });  
    });

};

var loadProductsByName;
loadProductsByName = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit='+limit+'&offset='+currenPage+'&order=proName&sort=asc',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#product-list').append(html);
        addIMG(data);
        currenPage+=limit;
        // $('.product_item').removeAttr("display");
        $('.product_item').fadeIn(400, function() {
            $(this).removeAttr('style');
        });  
    });

};

var reset = function(){
    $('.product_item').remove();
    currenPage=0;
    _keyWord='';
    _catID='';

};

$('.shop_sorting_button').each(function()
{
    $(this).on('click', function()
    {
        $('.sorting_text').text($(this).text());
        var option = $(this).attr('data-isotope-option');
        option = JSON.parse(option);
        console.log(option);            
        if(option.sortBy === "price-desc"){
            reset();
            _option = 1;
            loadProductsByPrice();
        }else{
            reset();
            _option = 2;
            loadProductsByName();
        }
    });
});

var loadTopPrice = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit=5&order=currentPrice&sort=desc',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#topPrice').append(html);
        addIMG(data);
    });
};
var loadTopBid = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit=5&order=bidCount&sort=desc',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#topBid').append(html);
        addIMG(data);
    });
};
var loadTopNearExpiration = function () {
    $.ajax({
        url: 'http://localhost:3000/products?limit=5&nearend=1',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#topNearExpiration').append(html);
        addIMG(data);
    });
};

var loadProductsByKeyword = function(keyWord){
    $.ajax({
        url: 'http://localhost:3000/products?limit='+limit+'&offset='+currenPage+'&keyword='+ keyWord,
        dataType: 'json',
        timeout: 10000
    }).done(function (data) { 

        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#product-list').append(html);
        addIMG(data);      
        currenPage+=limit;
        console.log(data.length);
        $('.product_item').fadeIn(400, function() {
            $(this).removeAttr('style');
        });
        if (data.length<limit) {
            sessionStorage.removeItem('keyWord');            
        } 
        
    });
};

var loadProductsByCatID = function(catID){
    $.ajax({
        url: 'http://localhost:3000/products?limit='+limit+'&offset='+currenPage+'&catID='+ catID,
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {        
        $('#num_product').html(data.length);
        var source = $('#product-template').html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#product-list').append(html);
        addIMG(data);       
        currenPage+=limit;
        $('.product_item').fadeIn(400, function() {
            $(this).removeAttr('style');
        });
        if (data.length<limit) {
            sessionStorage.removeItem('catID');            
        }
    });
};



