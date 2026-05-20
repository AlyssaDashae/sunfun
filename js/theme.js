'use strict';
// jQuery code is in here

$(function () {

    if ($('#home-page').length > 0) {
        //Main Slide Flexslider 
        $('.main-slider').flexslider({
            animation: "slide",
            slideshow: false,
            directionNav: false,
            controlNav: true,
            smoothHeight: true
        });
        $('.fullscreen-slider .prev').on('click', function () {
            $('.main-slider').flexslider('prev');
            return false;
        });
        $('.fullscreen-slider .next').on('click', function () {
            $('.main-slider').flexslider('next');
            return false;
        });


        //Gallery Flexslider 
        $('.gallery-flexslider').flexslider({
            animation: "slide",
            slideshow: true,
            directionNav: false
        });
        $('.gallery-slider .prev').on('click', function () {
            $('.gallery-flexslider').flexslider('prev');
            return false;
        });
        $('.gallery-slider .next').on('click', function () {
            $('.gallery-flexslider').flexslider('next');
            return false;
        });

        //Hotel Flexslider 
        $('.hotel-flexslider').flexslider({
            animation: "slide",
            slideshow: false,
            directionNav: false,
            controlNav: false
        });
        $('.hotel-rooms .prev').on('click', function () {
            $('.hotel-flexslider').flexslider('prev');
            return false;
        });
        $('.hotel-rooms .next').on('click', function () {
            $('.hotel-flexslider').flexslider('next');
            return false;
        });


        //Blog Flexslider 
        $('.blog-flexslider').flexslider({
            animation: "slide",
            slideshow: false,
            directionNav: false,
            controlNav: false
        });
        $('.home-blog .prev').on('click', function () {
            $('.blog-flexslider').flexslider('prev');
            return false;
        });
        $('.home-blog .next').on('click', function () {
            $('.blog-flexslider').flexslider('next');
            return false;
        });
        //Testimonial Flexslider 
        $('.testimonial-flexslider').flexslider({
            animation: "slide",
            slideshow: true,
            directionNav: false,
            controlNav: false
        });
        $('.testimonial-slider .prev').on('click', function () {
            $('.testimonial-flexslider').flexslider('prev');
            return false;
        });
        $('.testimonial-slider .next').on('click', function () {
            $('.testimonial-flexslider').flexslider('next');
            return false;
        });

        $(function () {
            if ($('.video-bg').length > 0) {
                $('.my-background-video').bgVideo({
                    showPausePlay: false
                });

                var player = document.getElementById("video1");

                $('#play').on('click', function () {
                    player.play();
                    $('#play').css({"display": "none"});
                    $('#pause').css({"display": "inline-block"});
                });
                $('#pause').on('click', function () {
                    player.pause();
                    $('#play').css({"display": "inline-block"});
                    $('#pause').css({"display": "none"});
                });
            }
        });

        $(function () {

            // Find all YouTube videos
            var $allVideos = $("iframe[src^='http://www.youtube.com']"),
                    // The element that is fluid width
                    $fluidEl = $("body");

            // Figure out and save aspect ratio for each video
            $allVideos.each(function () {

                $(this)
                        .data('aspectRatio', this.height / this.width)

                        // and remove the hard coded width/height
                        .removeAttr('height')
                        .removeAttr('width');

            });

            // When the window is resized
            // (You'll probably want to debounce this)
            $(window).resize(function () {

                var newWidth = $fluidEl.width();

                // Resize all videos according to their own aspect ratio
                $allVideos.each(function () {

                    var $el = $(this);
                    $el
                            .width(newWidth)
                            .height(newWidth * $el.data('aspectRatio'));

                });

                // Kick off one resize to fix all videos on page load
            }).resize();

        });

        $(function () {
            var nowTemp = new Date();
            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

            var checkin = $('#dpd1').datepicker({
                onRender: function (date) {
                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
                }
            }).on('changeDate', function (ev) {
                if (ev.date.valueOf() > checkout.date.valueOf()) {
                    var newDate = new Date(ev.date)
                    newDate.setDate(newDate.getDate() + 1);
                    checkout.setValue(newDate);
                }
                checkin.hide();
                $('#dpd2')[0].focus();
            }).data('datepicker');
            var checkout = $('#dpd2').datepicker({
                onRender: function (date) {
                    return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                }
            }).on('changeDate', function (ev) {
                checkout.hide();
            }).data('datepicker');
        });

    }


    if ($('#canvas-bg').length > 0) {
        (function () { // canvas header

            var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

            // Main
            initHeader();
            addListeners();

            function initHeader() {
                width = window.innerWidth;
                height = window.innerHeight;
                target = {x: 0, y: height};

                largeHeader = document.getElementById('canvas-bg');
                largeHeader.style.height = height + 'px';

                canvas = document.getElementById('banner-canvas');
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');

                // create particles
                circles = [];
                for (var x = 0; x < width * 0.5; x++) {
                    var c = new Circle();
                    circles.push(c);
                }
                animate();
            }

            // Event handling
            function addListeners() {
                window.addEventListener('scroll', scrollCheck);
                window.addEventListener('resize', resize);
            }

            function scrollCheck() {
                if (document.body.scrollTop > height)
                    animateHeader = false;
                else
                    animateHeader = true;
            }

            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                largeHeader.style.height = height + 'px';
                canvas.width = width;
                canvas.height = height;
            }

            function animate() {
                if (animateHeader) {
                    ctx.clearRect(0, 0, width, height);
                    for (var i in circles) {
                        circles[i].draw();
                    }
                }
                requestAnimationFrame(animate);
            }

            // Canvas manipulation
            function Circle() {
                var _this = this;

                // constructor
                (function () {
                    _this.pos = {};
                    init();
                    console.log(_this);
                })();

                function init() {
                    _this.pos.x = Math.random() * width;
                    _this.pos.y = height + Math.random() * 100;
                    _this.alpha = 0.1 + Math.random() * 0.3;
                    _this.scale = 0.1 + Math.random() * 0.3;
                    _this.velocity = Math.random();
                }

                this.draw = function () {
                    if (_this.alpha <= 0) {
                        init();
                    }
                    _this.pos.y -= _this.velocity;
                    _this.alpha -= 0.0005;
                    ctx.beginPath();
                    ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
                    ctx.fillStyle = 'rgba(255, 255, 255,' + _this.alpha + ')';
                    ctx.fill();
                };
            }

        })();

    }


    if ($('#blog-single-page').length > 0) {

        //Relative Blog Flexslider 
        (function () {

            // store the slider in a local variable
            var $window = $(window),
                    flexslider = {vars: {}};
            // tiny helper function to add breakpoints
            function getGridSize() {
                return (window.innerWidth < 1200) ? 1 :
                        (window.innerWidth < 1201) ? 1 : 2;
            }
            $window.on('load', function () {
                $('.rel-blog-slider').flexslider({
                    animation: "slide",
                    slideshow: true,
                    directionNav: false,
                    controlNav: false,
                    itemWidth: 210,
                    itemMargin: 15,
                    minItems: getGridSize(), // use function to pull in initial value
                    maxItems: getGridSize() // use function to pull in initial value
                });
                $('.rel-blog-slider .prev').on('click', function () {
                    $('.rel-blog-slider').flexslider('prev');
                    return false;
                });
                $('.rel-blog-slider .next').on('click', function () {
                    $('.rel-blog-slider').flexslider('next');
                    return false;
                });
            });
            // check grid size on resize event
            $window.resize(function () {
                var gridSize = getGridSize();
                flexslider.vars.minItems = gridSize;
                flexslider.vars.maxItems = gridSize;
            });
        }());
    }

    if ($('header').length > 0) {
        // Smooth Page Scroll
        // ---------------------------------------------------------------------------------------   
        $('.primary-navbar > li > a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $('.primary-navbar > li > a').removeClass('active');
            $(this).addClass('active');
            var header_height = $('.main-header').outerHeight(true);
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top - header_height}, 1000);
        });

        // Submenu Window Width
        // ---------------------------------------------------------------------------------------  
        if ($(window).width() > 767) {
            $("ul.primary-navbar li li").mouseover(function () {
                if ($(this).children('ul').length == 1) {
                    var parent = $(this);
                    var child_menu = $(this).children('ul');
                    if ($(parent).offset().left + $(parent).width() + $(child_menu).width() > $(window).width()) {
                        $(child_menu).css('left', '-' + $(parent).width() + 'px');
                    } else {
                        $(child_menu).css('left', $(parent).width() + 'px');
                    }
                }
            });
        }

        /*------------------- Header Offcanvas Add  -------------------*/
        $(".nav-trigger").on("click", function (e) {
            e.stopPropagation();
            $(".main-header .navigation").toggleClass("off-canvas");
        });
    }




    /*------------------- Scroll To Top Animate -------------------*/
    $('.to-top').on('click', function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // prettyPhoto
    // ---------------------------------------------------------------------------------------
    if ($().prettyPhoto) {
        $("a[data-gal^='prettyPhoto']").prettyPhoto({
            theme: 'dark_square'
        });
    }


});

$(window).on('load', function () {

    /*------------------- Page Loader Starts  -------------------*/
    setTimeout(function () {
        $("#loading").fadeOut(300);
    }, 3100);
    /**
     * ==============================
     *  Custom Scroll Style
     * ==============================
     */
    if ($(window).width() < 767) {
        if ($(".main-header").length) {
            $(".navigation").mCustomScrollbar({
                theme: "dark-2",
                scrollButtons: {
                    enable: false
                }
            });
        }

    }

    //Our Dining
    if (jQuery('.isotope-item').length > 0) {
        if (jQuery().isotope) {
            var jQuerycontainer = jQuery('.isotope'); // cache container
            jQuerycontainer.isotope({
                itemSelector: '.isotope-item'
            });
            jQuery('.filtrable a').on('click', function () {
                var selector = jQuery(this).attr('data-filter');
                jQuery('.filtrable li').removeClass('active');
                jQuery(this).parent().addClass('active');
                jQuerycontainer.isotope({filter: selector});
                return false;
            });
            jQuerycontainer.isotope('layout'); // layout/layout
        }

        jQuery(window).resize(function () {
            if (jQuery().isotope) {
                jQuery('.row.isotope').isotope('layout'); // layout/relayout on window resize
            }
        });
        jQuery('#product-filter').isotope({filter: '.tab-2'});
    }
});
/*------------------- Sticky Header Starts  -------------------*/
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 5) {
        $('.main-header').addClass('is-sticky');
    }
    else {
        $('.main-header').removeClass('is-sticky');
    }

    if ($(this).scrollTop() > 100) {
        $('.to-top').css({bottom: '-25px'});
    }
    else {
        $('.to-top').css({bottom: '-150px'});
    }
});
/*------------------- Sticky Header Ends  -------------------*/
var map;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: -33, lng: 151}
    });

    var image = 'assets/img/mapicon.png';

    var beachMarker = new google.maps.Marker({
        position: {lat: -33.890, lng: 151.274},
        map: map,
        icon: image
    });
}

if ($().countdown) {
    var newYear = new Date();
    newYear = new Date(newYear.getFullYear() + 1, 1 - 1, 1);
    $('#defaultCountdown').countdown({until: newYear});
}