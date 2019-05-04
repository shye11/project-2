$(function() {

    $.fn.filepond.registerPlugin(FilePondPluginImagePreview);
    $.fn.filepond.registerPlugin(FilePondPluginFileEncode);
    $.fn.filepond.registerPlugin(FilePondPluginFileValidateSize);

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

            if($('.file').length) {  
                initializeFileUploader(".file");
            };

        });
        return false;
    });

    // When an element is clicked, we show the specific sidebar
    // Todo: get the current logged in UserId
    $(document).on("click",".bodyEditable",function(){        

        var cols = $(this).attr("data-cols");
        var index = $(this).attr("data-index");
        var url = "/sidebars/body/"+index;
        console.log("columns : "+ cols+ " && index : "+ index);
       
        $(".optionSidebar").load(url, function(){
            $(".frameworkSidebar").hide();
            $(".optionSidebar").show();
            $(".optionSidebar textarea").trumbowyg({
                btns: [
                    ['viewHTML'],
                    ['formatting'],
                    ['strong', 'em'],
                    ['link'],
                    ['insertImage'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                    ['unorderedList', 'orderedList'],
                    ['horizontalRule'],
                    ['removeformat'],
                    ['fullscreen']
                ],
                autogrow: true,
            }).on('tbwblur', function () {
                $(".customizationForm").submit();
            });
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

    $(document).on("blur",".customizationForm input,.customizationForm textarea",function(e){

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
                getPage();
            }
          );
    });

    var temporaryBody = {};
    var bodySample = {
        title: '',
        option: 'two-columns',
        customization: {
            columnOne: '',
            columnTwo: '',
            columnThree: '',
            columnFour: '',
        }
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
    }


});

$("body").on("click",function(e){
    if (!$(e.target).closest("#modal-signup,#modal-login").length) {
        $(".modal-content,.overlay").removeClass("show");
    }
});


$(".extra-options.design").on("click",function(){
    if( $("#sidebar").hasClass("show")){
        $("#sidebar").removeClass("show");
    } else {
        $("#sidebar").addClass("show");
    }
    return false;
});


if(window.location.hash) {
   if(window.location.hash == "#login"){
       $(".login-action").click();
   };
   if(window.location.hash == "#signup"){
    $(".signup-action").click();
    };
} 

function initializeFileUploader(className) {
    
    var file = $(className);
    var currentFile;

    // First register any plugins
    $.fn.filepond.setDefaults({
        maxFileSize: '3MB'
    });

    // Turn input element into a pond
    file.filepond();

    file.filepond('allowFileEncode',true);

    // Set allowMultiple property to true
    file.filepond('allowMultiple', false);

    
}

// Listen for addfile event
$(document).on('FilePond:addfile', function(e) {
    console.log('file added event', e);
    $(".fileInput").blur();
    //console.log(e.detail.file.getFileEncodeDataURL());
    currentFile = e.detail.file.getFileEncodeDataURL();
    console.log("currentFile",currentFile);
    $(".fileInput").val(currentFile);
    
});



