$(function() {

    // our goal is to load a form based on the element clicked
    $(".editable").on("click",function(){
        var data = $(this).attr("data-id");
        var url = "/forms/"+data
        $("#sidebar").load(url, function(){

        })
        return false;
    });

    //frameworks 
    $(".frameworkOption").on("change",function(){
        var element = $(this).attr("data-option");
        var value = $(this).find(":selected").val();
        console.log(element);
        console.log(value);
        var url = "/element/"+element+"/"+value;
        $("#navigation-container").load(url);

    }); 

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

    $("nav").on('mouseleave',function(){

        $("#sitewrapper,nav,.hamburger, nav ul").removeClass("open")

    });
});
