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
        $("html, body").animate({ scrollTop: $('#'+target).height() }, 1000);
        return false;
    });

});