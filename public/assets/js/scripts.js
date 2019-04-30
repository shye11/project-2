$(function() {

    // This is the back button on the dynamic options
    $(document).on("click",".backButton",function(e){
        e.preventDefault;
        $(".optionSidebar").hide();
        $(".frameworkSidebar").show();
        return false;
    });


    // When an element is clicked, we show the specific sidebar
    // Todo: get the current logged in UserId
    $(".editable").on("click",function(){        

        var option = $(this).attr("data-option");
        id = 1; // user 1
        var url = "/sidebars/"+option;
        console.log(option);
       
        $(".optionSidebar").load(url, function(){
            $(".frameworkSidebar").hide();
            $(".optionSidebar").show();
        })
        return false;
    });

    // This saves and dynamically updates the framework options
    $(".frameworkOption").on("change",function(){
        var element = $(this).attr("data-option"); // get the element
        var value = $(this).find(":selected").attr("value"); // get the option 
        var url = "/element/"+element+"/"+value;
        $("#"+element).load(url,function(){
            console.log("loaded "+element+"/"+value);
        });
        
        // api to send the option to mysql
        $.ajax("/api/layout/", {
            type: "PUT",
            data:{
                column: element,
                option: value
            },
          }).then(
            function() {
                console.log("saved "+element+"/"+value);
              //location.reload();
            }
          );

    });

    $(document).on("submit",".customizationForm",function(e){
        e.preventDefault();
        console.log( $( this ).serialize() );
        
        // api to send the option to mysql
        $.ajax($(this).attr("action"), {
            type: "PUT",
            data: $(this).serializeArray(),
          }).then(
            function() {
                // console.log("saved "+element+"/"+value);
              //location.reload();
            }
          );

    });
    
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

    // $(".login-form").on("submit",function (){
    //     $.ajax("/login", {
    //         type: "POST",
    //         username: $(".username").val(),
    //         password: $(".password").val()
    //       }).then(
    //         function() {
    //             console.log("login successful")
    //           //location.reload();
    //         }
    //       );
    // });



