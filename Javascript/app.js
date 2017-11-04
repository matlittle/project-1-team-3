$(document).ready(function()
{

	$(".secondPageLayout").fadeOut();
    $(".thirdPageLayout").fadeOut();
    $(".fourthPageLayout").fadeOut();
    

	 
    $("#readyUp").click(function(){                     // this will fade out the initial start page
        $(".firstPageLayout").fadeOut();                // fades out first page 
        $(".secondPageLayout").fadeIn();            // fades in second page 
    });


    $("").click(function()
    {
        $("").fadeOut();
        // fades in the question page on button click
        $(".").fadeOut();
        $("").fadeIn();

    });
});