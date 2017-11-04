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





/*Input Evaluation Function*/

testString = "var myTest = 1;" +
            "while(true){ myTest += 1 }" +
            "postMessage(myTest);";


checkUserCode(testString); 

/**/
function checkUserCode(str, question) {
    var myWorker = null,
    window.URL = window.URL || (window.webkitURL);      // initialize variables

    /* (Stack Overflow comment) we are creating a new javascript file using blob. We just use the string passed to the function, and assign it to the Blob(content,type). */
    var workerData = new Blob([testString], { type: "text/javascript" });

    initWorker(workerData);

    function initWorker(data) {
        if (typeof (Worker) === undefined) {        // check if browser supports web workers 
            alert('No webworker supported');
            return false;
        }

        /* (Stack Overflow comment) create the new web worker as we dont have an external file, we have to create a url for our blob using createObjectURL. link will look like blob:d3958f5c-0777-0845-9dcf-2cb28783acaf */
        myWorker = new Worker(window.URL.createObjectURL(data));

        /* listen for messages sent back by the worker */
        myWorker.onmessage = function (e) {
            clearTimeout(timeoutError);     // clear the error timeout so it doesn't fire
            deleteWorker(myWorker);     // delete the actual worker once we have the return
            handleWorkerReturn(e);      // pass return to handler function
            
        };

        var timeoutError = setTimeout(function() {
            alert("Timeout error thrown");
            deleteWorker(myWorker);
        }, 5 * 1000);
    }

    function deleteWorker(w){
        window.w.terminate();
        delete window.w;
    }

    function handleWorkerReturn(e) {
        console.log(e);
        console.log(e.data);
    }

}
