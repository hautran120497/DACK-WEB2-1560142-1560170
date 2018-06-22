$(function(){
    loadCategory();
});


var loadCategory = function() { 

    $.ajax({
        url: 'http://localhost:3000/categories',
        dataType: 'json',
        timeout: 10000
    }).done(function(data) {
        $.each(data, function(idx, item) {  
            var html2 = "<option value="+item.catID+">"+item.catName+"</option>";
            $('#selectCatID').append(html2);          
            var html = "<li class='catItem' data-id="+ item.catID +"><a href='javascript:;'>"+ item.catName +"</a></li>";
            $('.category-list').append(html);
            
            // console.log(html2);
        });
    });
};

function initCustomDropdown()
{
    if($('.custom_dropdown_placeholder').length && $('.custom_list').length)
    {
        var placeholder = $('.custom_dropdown_placeholder');
        var list = $('.custom_list');
    }

    placeholder.on('click', function (ev)
    {
        if(list.hasClass('active'))
        {
            list.removeClass('active');
        }
        else
        {
            list.addClass('active');

        }

        $(document).one('click', function closeForm(e)
        {
            if($(e.target).hasClass('clc'))
            {
                $(document).one('click', closeForm);
            }
            else
            {
                list.removeClass('active');
            }
        });

    });

    $('.custom_list a').on('click', function (ev)
    {
        ev.preventDefault();
        var index = $(this).parent().index();

        placeholder.text( $(this).text() ).css('opacity', '1');

        if(list.hasClass('active'))
        {
            list.removeClass('active');
        }
        else
        {
            list.addClass('active');
        }
    });


    $('select').on('change', function (e)
    {
        placeholder.text(this.value);

        $(this).animate({width: placeholder.width() + 'px' });
        console.log(placeholder.text(this.value));
    });
}