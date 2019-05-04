$(function() {



    // hamburger menu
    $(document).on("click",".hamburger",function(e){
        e.preventDefault();
        var currentNav = $(this);
        if(currentNav.hasClass("open")){
           if($(this).hasClass("off-canvas")){ 
             $("#sitewrapper").removeClass('open'); // for off-canvas
           } 
            currentNav
                .removeClass("open")
                .parent()
                .find("ul").removeClass("open");
        } else {
            if($(this).hasClass("off-canvas")){ 
                $("#sitewrapper").addClass('open'); // for off-canvas
            }
            currentNav
                .addClass("open")
                .parent()
                .find("ul").addClass("open");
        }
    });

    // when the mouse leaves, hide the nav
    $("nav").on('mouseleave',function(){
        $("#sitewrapper,nav,.hamburger, nav ul").removeClass("open")
    });

    $(".jumper").on("click",function(){
        var target = $(this).attr("data-target");
        $('html, body').animate({
            scrollTop: $('#'+target).offset().top
        }, 1000);    
        return false;
    });

    
    $(".login-action").on("click",function(){
        $(".modal-content").removeClass("show");
        $(".overlay,.modal-content.login").addClass("show");
        return false;
    });
    
    $(".signup-action").on("click",function(){
        $(".modal-content").removeClass("show");
        $(".overlay,.modal-content.signup").addClass("show");
        return false;
    });

    
    $(".cancel-action").on("click",function(){
        $(".modal-content,.overlay").removeClass("show");
        return false;
    });
    
    
    $(".login-form").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/login',
            data: {
                username: $(".login-form #username").val(),
                password: $(".login-form #password").val()
            },
            success: function(data)
            {
               window.location = "/framework";
            },
            error: function (ajaxContext) {
                $(".login-form").addClass("error");
                setTimeout(function(){$(".login-form").removeClass("error");},2000);
            }
        });
        return false;
    
    });
    
    $(".signup-form").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/signup',
            data: {
                name: $(".signup-form #name-signup").val(),
                username: $(".signup-form #username-signup").val(),
                password: $(".signup-form #password-signup").val()
            },
            success: function(data)
            {
               window.location = "/framework";
            },
            error: function (ajaxContext) {
                $(".signup-form").addClass("error");
                setTimeout(function(){$(".signup-form").removeClass("error");},2000);
            }
        });
        return false;
    
    });
  
      $(".logout-action").on("click", function(e){
        e.preventDefault();
        console.log('LOGING OUT');
        $.ajax({
            type: "GET",
            url: '/logout',
            success: function(response){
                console.log("logged out");
                window.location = "/";
            }
        });

    $(".carousel.carousel-option-one").slick({
        lazyLoad: 'ondemand',
        dots: false,
        slidesToShow: 1,
        centerMode: false,
    });
    $(".carousel.carousel-option-two").slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        fade: true,
        cssEase: 'linear'
    });
    $(".carousel.carousel-option-three").slick({
        lazyLoad: 'ondemand',
        dots: true,
        slidesToShow: 1,
        centerMode: true,
    });

});