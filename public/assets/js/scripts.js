$(function() {
    $(".hamburger").on("click",function(e){
        e.preventDefault();
        var currentNav = $(this);
        if(currentNav.hasClass("open")){
            currentNav
                .removeClass("open")
                .parent().find("ul").removeClass("open");
        } else {
            currentNav
                .addClass("open")
                .parent().find("ul").addClass("open");
        }
    });

    $("nav").on('mouseleave',function(){

        $(".hamburger, nav ul").removeClass("open")

    });
});
