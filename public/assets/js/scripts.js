$(function() {

    // our goal is to load a form based on the element clicked
    $(".editable").on("click",function(){
        var data = $(this).attr("data-id");
        var url = "/forms/"+data;
        console.log(data);
        console.log(url);
        $("#sidebar").load(url, function(){

        })
        return false;
    });

    //frameworks 
    $(".frameworkOption").on("change",function(){
        var element = $(this).attr("data-option");
        var value = $(this).find(":selected").attr("value");
        console.log(element);
        console.log(value);
        var url = "/element/"+element+"/"+value;
        $("#"+element).load(url);
        id = 1; // user 1
        $.ajax("/api/layout/" + id, {
            type: "PUT",
            data:{
                    column: element,
                    option: value
            },
          }).then(
            function() {
              //location.reload();
            }
          );

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

    $( ".sortable" ).sortable({
        helper: "clone",
        placeholder: "sortable-placeholder"
    });

    $( ".sortable" ).disableSelection();

    $(document).on("click",".btn-add",function(){
        var html = $(".sortable li").eq(0).html();
        $("<li style='display: none;'>"+html+"</li>")
            .prependTo(".sortable")
            .find("input")
            .attr("placeholder","")
            .parent()
            .slideDown();
        $('.sortable').sortable("refresh").sortable("refreshPositions");
        if($(".sortable li").length == 1){ 
            $(".btn-remove:visible").addClass("disabled");  
        } else {
            $(".btn-remove:visible").removeClass("disabled");  
        }
        return false;
    });

    $(document).on("click",".btn-remove",function(){
        if($(".sortable li:visible").length > 1){ $(this).parent().slideUp(); }
        $('.sortable').sortable("refresh").sortable("refreshPositions");
         // remove only one
         if($(".sortable li:visible").length == 1){ 
            $(".btn-remove").addClass("disabled");  
        } else {
            $(".btn-remove").removeClass("disabled");  
        }
        return false;
    });
});
