(function NRCScroll() {
    var min_thumbnail_height = 10000;

    function measure() {
        $('a.thumbnail-link').each(function() {
            var img = $(this).parent().find('img').eq(0);
            var h = img.height();
            if (h > 0) min_thumbnail_height = Math.min(min_thumbnail_height, h);
        });
    }

    function activateThumbnailImages() {
        $('a.thumbnail-link').each(function() {
            var img = $(this).parent().find('img').eq(0);
            img.attr('src', img.attr('data-src'));
        });
    }

    function showIndex() {
        var w = $('#nrc-scroll-index').width();
        var h = $('#nrc-scroll-index').height();
        $('#nrc-scroll-content')
            .css({opacity: 0.1});
        $('#nrc-scroll-index')
            .css('visibility', 'visible')
            .css('width', '1px')
            .css('height', '1px')
            .animate({height: h, width: w}, 200);
    }

    function hideIndex() {
        var w = $('#nrc-scroll-index').width();
        var h = $('#nrc-scroll-index').height();
        $('#nrc-scroll-index')
            .animate({height: 0, width: 0}, 200, function() {
                $('#nrc-scroll-index')
                    .width(w + 'px')
                    .height(h + 'px')
                    .css('visibility', 'hidden');
            });
        $('#nrc-scroll-content')
            .css('opacity', 1);
    }

    function greyHover(e) {
        $(this)
            .css("background", e.type === "mouseenter" ? "grey" : "black")
    }

    function createIndex() {
        $('#nrc-scroll-index-hover').remove();
        var index_hover_div = $('<div>')
            .click(showIndex)
            .attr('id', 'nrc-scroll-index-hover')
            .css('position', 'fixed')
            .css('z-index', '10000')
            .css('background', 'black')
            .css('color', 'white')
            .css('text-align', 'center')
            .css('font-family', 'Arial')
            .css('font-size', '20px')
            .text('►')
            .hover(greyHover)
            .css('cursor', 'pointer')
            .css('width', '28px')
            .css('padding-top', '3px')
            .css('height', '26px')
            .css('top', '0px')
            .css('left', '0px');

        var index_div = $('<div>')
            .click(function(e) { e.stopPropagation(); })
            .attr('id', 'nrc-scroll-index')
            .css('position', 'fixed')
            .css('background', 'white')
            .css('visibility', 'hidden')
            .css('text-align', 'left')
            .css('overflow', 'hidden')
            .css('font-family', 'Arial')
            .css('font-size', '20px')
            .css('z-index', '10000')
            .css('top', '0px')
            .css('border', '3px solid darkgrey')
            .css('left', '28px')
            .appendTo(index_hover_div);

        var last_label = '';
        $('a.thumbnail-link').each(function(index) {
            label = $(this).closest('ul').closest('li').find('span').text();
            var link = 'nrc-scroll-img' + index;
            if (label != last_label) {
                $('<a>')
                    .attr('href', '#' + link)
                    .click(hideIndex)
                    .css('margin', '2px')
                    .css('padding', '0 9px')
                    .css('display', 'block')
                    .css('text-overflow', 'ellipsis')
                    .hover(function(e) { $(this).css("background", e.type === "mouseenter" ? "#EEE" : "white") })
                    .text(label)
                    .appendTo(index_div);
                last_label = label;
            }
        });

        return index_hover_div;
    }

    function layout() {
        $(document.body)
            .append($('<div>')
                .attr('id', 'nrc-scroll-main')
                .css('position', 'absolute')
                .css('background', 'white')
                .css('z-index', '10000')
                .css('top', '0px')
                .css('left', '0px')
                .append(
                    $('<div>')
                        .attr('id', 'nrc-scroll-content')
                        .css('overflow', 'hidden')
                        .css('background', 'white'),
                    addScrollButton('▲', -1),
                    addScrollButton('▼', 1),
                    createIndex()
                )
            );
        $('a.thumbnail-link').each(addPage);
    }
    function addPage(index) {
        var url = $(this).attr('href');
        var base = url.slice(0, url.lastIndexOf('/'));
        var h = $(this).parent().find('img').eq(0).height();
        var link = 'nrc-scroll-img' + index;

        function addImg(index, w, offset) {
            $('<div>')
                .attr('id', link)
                .addClass('nrc-scroll-image')
                .css('padding', '0')
                .css('margin', '-2px 0 0 -18px')
                .append($('<img>')
                    .css('left', '-' + offset + 'px')
                    .css('width', 2 * w + 'px')
                    .css('position', 'relative')
                    .attr('src', base + '/page_full_' + index + '.jpg')
                )
                .appendTo($('#nrc-scroll-content'));
        }

        var width = $(document.body).width();
        var w = (h==min_thumbnail_height ? width : width/2) + 30;
        addImg(0, w, 0);
        addImg(1, w, 0);
        if (h == min_thumbnail_height) {
          addImg(0, w, width);
          addImg(1, w, width);
        }
    }

    function requestFullScreen() {
        document.documentElement.webkitRequestFullScreen();
        addCss('::-webkit-scrollbar { display: none; }');
    }

    function remove() {
        $('#nrc-scroll-main').remove();
        $(document.body).css('overflow-x', 'auto');
        addCss('::-webkit-scrollbar { display: auto; }');
    }

    function addCss(css) {
        $('<div>', {html: '<style>' + css + '</style'}).appendTo('body');
    }

    function enable() {
        console.log('NRC Scroll: Full screen scroll mode enabled');
        remove();
        measure();
        layout();
        scroll();
    }

    function addFullScreenButton() {
        localStorage.NRCScrollMsg = localStorage.NRCScrollMsg || 'x';
        if (localStorage.NRCScrollMsg < 'xxxxx') {
            localStorage.NRCScrollMsg += 'x';
            $('<div>')
                .css('position', 'absolute')
                .css('background', 'white')
                .css('font-size', '30px')
                .css('z-index', '10000')
                .css('left', '50px')
                .css('top', '50px')
                .append($('<div>')
                    .css('border', '5px solid red')
                    .css('padding', '15px')
                    .animate({opacity: 0.3}, 4000, function() { $(this).parent().remove(); })
                    .html('Welkom. Gebruik de nieuwe ⬍ knop<br>om NRC Scroll te activeren.')
                )
            .appendTo($(document.body));
        }

        $('<div>')
            .click(requestFullScreen)
            .html('⬍')
            .attr('id', 'nrc-scroll-button')
            .css('cursor', 'pointer')
            .css('display', 'block')
            .css('float', 'left')
            .css('color', 'white')
            .css('background', 'black')
            .css('text-align', 'center')
            .css('font-family', 'Arial')
            .css('font-size', '16px')
            .css('border-radius', '3px')
            .css('width', '18px')
            .css('height', '14px')
            .css('padding', '0px 5px 10px 5px')
            .css('margin', '0 6px 0 0')
            .attr('title', 'de hele krant in full-screen tonen (NRC Scroll)')
            .hover(greyHover)
            .insertBefore($('#FullPageButton'));
        $('#PageTitle')
            .css('width', ($('#PageTitle').width() - 36) + 'px');
    }

    window.onresize = function() {
        if (screen.height - $(window).height() < 20) {
            enable();
        } else {
            remove();
        }
    };

    $(window).scroll(function() {
        if (document.body.scrollTop > 1000) {
            localStorage.url = document.location.href;
            localStorage.scrollTop = $(document.body).scrollTop();
        }
        $(document.body).css('overflow-x', 'hidden');
    });

    function scroll() {
        if (localStorage.url === document.location.href) {
            $(document.body).scrollTop(localStorage.scrollTop);
        }
    }

    function addScrollButton(label, direction) {
        return $('<div>')
            .attr('id', 'nrc-scroll-button-' + label)
            .click(function() {
                var h = $(document.body).height();
                var scrollTop = $(document.body).scrollTop();
                $(document.body).animate({scrollTop: scrollTop + direction * h}, 200);
            })
            .hover(greyHover)
            .css('position', 'fixed')
            .css('z-index', '10000')
            .css('background', 'black')
            .css('color', 'white')
            .css('text-align', 'center')
            .css('font-family', 'Arial')
            .css('font-size', '24px')
            .text(label)
            .css('cursor', 'pointer')
            .css('padding-top', '3px')
            .css('width', '28px')
            .css('height', '28px')
            .css('bottom', 0)
            .css(direction == 1 ? 'right' : 'left', 0);
    }

    activateThumbnailImages();
    addFullScreenButton();

    console.log('NRC Scroll: added button');
})();
