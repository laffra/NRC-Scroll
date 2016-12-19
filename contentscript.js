(function NRCScroll() {
    var reload_icon = 'http://digitaleeditie.nrc.nl/static/' +
        'css/media/images/buttons/nomal-page.png';
    var min_h = 10000;
    function measure() {
        $('a.thumbnail-link').each(function() {
            var img = $(this).parent().find('img').eq(0);
            var h = img.height();
            if (h > 0) min_h = Math.min(min_h, h);
        });
    }
    function images() {
        $('a.thumbnail-link').each(function() {
            var img = $(this).parent().find('img').eq(0);
            img.attr('src', img.attr('data-src'));
        });
    }
    function layout() {
        var width = $(document.body).width();
        var content_div = $('<div>')
            .attr('id', 'nrc-scroll-container')
            .css('position', 'absolute')
            .css('overflow', 'hidden')
            .css('width', width + 'px')
            .css('z-index', '10000')
            .css('top', '0');

        var index_w = 0;
        var index_h = 0;
        setTimeout(function() {
            index_w = $('#nrc-scroll-index').width();
            index_h = $('#nrc-scroll-index').height();
        }, 100);
        var inside_index = false;
        var index_hover_div = $('<div>')
            .mouseenter(function() {
                inside_index = true;
                $('#nrc-scroll-index')
                    .css('visibility', 'visibile')
                    .css('height', '1px')
                    .animate({height: index_h, width: index_w}, 200);
            })
            .mouseleave(function() {
                inside_index = false;
                setTimeout(function() {
                    if (!inside_index) {
                        $('#nrc-scroll-index')
                            .animate({height: 0, width: 0}, 200, function() {
                                $('#nrc-scroll-index').css('visibility', 'hidden')
                            });
                    }
                }, 500);
            })
            .css('position', 'fixed')
            .css('z-index', '10000')
            .css('background', 'black')
            .css('color', 'white')
            .css('text-align', 'center')
            .css('font-family', 'Arial')
            .css('font-size', '20px')
            .text('i')
            .css('cursor', 'pointer')
            .css('width', '28px')
            .css('padding-top', '3px')
            .css('height', '26px')
            .css('top', '42px')
            .css('left', '6px');
        var index_div = $('<div>')
            .attr('id', 'nrc-scroll-index')
            .css('position', 'fixed')
            .css('padding', '9px')
            .css('background', 'white')
            .css('visibility', 'hidden')
            .css('text-align', 'left')
            .css('overflow', 'hidden')
            .css('font-family', 'Arial')
            .css('font-size', '20px')
            .css('z-index', '10000')
            .css('top', '42px')
            .css('border', '3px solid darkgrey')
            .css('left', '34px')
            .appendTo(index_hover_div);
        var last_label = '';
        var count = 0;
        $('a.thumbnail-link').each(function() {
            var url = $(this).attr('href');
            var base = url.slice(0, url.lastIndexOf('/'));
            var h = $(this).parent().find('img').eq(0).height();
            var link = 'nrc-scroll-img' + count++;
            label = $(this).closest('ul').closest('li').find('span').text();

            function addImg(index, w, offset) {
                $('<div>')
                    .attr('id', link)
                    .css('padding', '0')
                    .css('margin', '-2px 0 0 0')
                    .append($('<img>')
                        .css('left', '-' + offset + 'px')
                        .css('width', 2 * w + 'px')
                        .css('position', 'relative')
                        .attr('src', base + '/page_full_' + index + '.jpg')
                    )
                    .appendTo(content_div);
                console.log('add ' + label);
                if (label != last_label) {
                    $('<a>')
                        .attr('href', '#' + link)
                        .click(function() {
                            $('#nrc-scroll-index')
                                .animate({height: 0, width: 0}, 200, function() {
                                    $('#nrc-scroll-index').css('visibility', 'hidden')
                                });
                        })
                        .css('margin', '2px')
                        .css('display', 'block')
                        .css('text-overflow', 'ellipsis')
                        .text(label)
                        .appendTo(index_div);
                    last_label = label;
                }
            }

            var w = h==min_h ? width : width/2;
            addImg(0, w, 0);
            addImg(1, w, 0);
            if (h == min_h) {
              addImg(0, w, width);
              addImg(1, w, width);
            }
        });
        var reload = $('<img>')
            .attr('id', 'nrc-scroll-reload')
            .attr('src', reload_icon)
            .attr('alt', 'terug')
            .click(function() {
                document.location = 'http://digitaleeditie.nrc.nl/overzicht/NH';
            })
            .text('X')
            .css('cursor', 'pointer')
            .css('font-size', '14px')
            .css('position', 'fixed')
            .css('top', '2px')
            .css('left', '-10px')
            .css('padding', '5px')
            .css('z-index', '10001')
            .css('margin', '0 0 0 11px');
        $(document.body)
            .empty()
            .append(reload, content_div, index_hover_div);
    }
    function enable() {
        measure();
        layout();
    }
    images();
    $('<button>')
        .click(enable)
        .text('NRC Scroll')
        .css('font-size', '14px')
        .css('padding', '5px')
        .css('margin', '0 0 0 11px')
        .appendTo($('#Sections'));
    console.log('NRC Scroll added button');
})();
