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

    var temporaryBody = {};
    var bodySample = {
        title: '',
        option: 'option-one',
        customization: {}
    }

    $( ".sortable" ).sortable({
        helper: "clone",
        placeholder: "sortable-placeholder",
        start: function (event, ui) {
            var currPos1 = ui.item.index();
            console.log("currPos1",currPos1);
            temporaryBody = body[currPos1];
            body.splice(currPos1,1); // remove 1 item from index
        },
        stop: function (event, ui) {
            var currPos2 = ui.item.index();
            console.log("currPos2",currPos2);
            body.splice(currPos2, 0, temporaryBody); // insert item into index and delete none
        },
        update: function(event, ui){
            var items = [];
            $(".sortable li input:visible").each(function(){
                items.push($(this).val());
            });
            var sortedIDs = $( ".sortable" ).sortable( "toArray" );
            console.log("sortedIDs",sortedIDs);
            console.log(items);
            console.log(body);
        }
    });

    $( ".sortable" ).disableSelection();

    $(document).on("click",".btn-add",function(){
        var html = $(".sortable li").eq(0).html();
        $("<li style='display: none;'>"+html+"</li>")
            .appendTo(".sortable")
            .find("input")
            .attr("value","")
            .attr("placeholder","")
            .parent()
            .slideDown();
        
        body.push(bodySample);

        
        $('.sortable').sortable("refresh").sortable("refreshPositions");
        if($(".sortable li").length == 1){ 
            $(".btn-remove:visible").addClass("disabled");  
        } else {
            $(".btn-remove:visible").removeClass("disabled");  
        }
        return false;
    });

    $(document).on("click",".btn-remove",function(){
        if($(".sortable li:visible").length > 1){ 
            $(this).parent().slideUp(); 
            var index = $(this).parent().index();
            body.splice(index,1);
            console.log(body);
        }
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



/*
TODO:
    1. create function/route to save to DB
    2. create update the user input
*/