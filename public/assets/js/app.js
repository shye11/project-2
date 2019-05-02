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
    $(document).on("click",".editable",function(){        

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
        
        // api to send the option to mysql
        $.ajax("/api/layout/", {
            type: "PUT",
            data:{
                column: element,
                option: value
            },
          }).then(
            function() {

                getPage();
            }
          );

    });

    $(document).on("blur",".customizationForm input",function(e){

        $(".customizationForm").submit();
        
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
              location.reload(true);
            }
          );
    });

    var temporaryBody = {};
    var bodySample = {
        title: '',
        option: 'two-columns',
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
            saveBodyOptions(body);
        },
        update: function(event, ui){
            var items = [];
            $(".sortable li input:visible").each(function(){
                items.push($(this).val());
            });
            var sortedIDs = $( ".sortable" ).sortable( "toArray" );
            console.log("sortedIDs",sortedIDs);
            console.log(items);
          
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
        saveBodyOptions(body);

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
        saveBodyOptions(body);
        return false;
    });

    $(document).on("blur",".bodyInput",function(){

        var index = $(this).parent().index();
        body[index].title = $(this).val();
        saveBodyOptions(body);

    });

    $(document).on("change",".bodyOption",function(){

        var index = $(this).parent().index();
        body[index].option = $(this).val();
        saveBodyOptions(body);
        
    });


    function saveBodyOptions(arr) {
        // api to send the option to mysql
        console.log("data",arr);
        $.ajax("/api/bodyOptions", {
            type: "PUT",
            data: {body:arr},
          }).then(
            function() {

                getPage();
                
            }
          );
    }

    function getPage(){
        $("#main-content").empty();
        $("#main-content").load("element/preview/page",function(){

        });
    }


});



/*
TODO:
    1. create function/route to save to DB
    2. create update the user input
*/