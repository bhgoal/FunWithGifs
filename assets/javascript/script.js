// giphy api key H6iVL2wZikmz4JFyIELiwNQtVY5RVvAr

var topics = ["Cake", "Cookies", "Brownies", "Ice\u00a0Cream"];

// Variable to track offset of results returned when user requests to load more gifs
var offset = 0;


function initialTabs() {
    $(".list-group-item-action").remove();
    $("#nav-tabContent").empty();
    for (i = 0; i < topics.length; i++) {
        makeTab(topics[i]);
    }
}
initialTabs();


// Generates new subject tab and new content box for subject
function makeTab(input) {
    var newTab = $("<a>");
    newTab.addClass("list-group-item list-group-item-action");
    newTab.attr({"id":input, "href":`#list-${input}`, "role":"tab", "data-searched":false});
    newTab.text(input);
    $("#list-tab").append(newTab);
    
    var newTabContent = $("<div>");
    newTabContent.addClass("tab-pane fade");
    newTabContent.attr({"id":`list-${input}`, "role":"tabpanel"});
    $("#nav-tabContent").append(newTabContent);

    
}



//$('#list-tab a').on('click', runQuery);

$('div').on('click', "#list-tab a", checkClick);

// Function for persistance across tab clicks- Once a tab has performed search and loaded gifs, subsequent clicks will not redo search and erase previous results
function checkClick(e) {
    e.stopPropagation();
    e.preventDefault()
    console.log($(this).attr("data-searched"));
    if ($(this).attr("data-searched") === "false") {
        runQuery(this, 0);
    } else {
        console.log("no search");
        $(this).tab('show') 
    }

}


function runQuery(selectedTab, offsetinput) {
    $(selectedTab).tab('show') 

    // Update tab status to already searched
    $(selectedTab).attr("data-searched", true);
    var subject = $(selectedTab).attr("id");

    // Constructing a queryURL using the input subject
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${subject}&limit=10&offset=${offsetinput}&api_key=H6iVL2wZikmz4JFyIELiwNQtVY5RVvAr`;

    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function(response) {
        console.log(queryURL);

        console.log(response);
        // storing the data from the AJAX request in the results variable
        searchResults = response.data;

        // Looping through each result item
        for (var x = 0; x < searchResults.length; x++) {

            // Creating and storing a div tag
            var gifDiv = $("<div>");

            // Split input string into individual letters
            var ratingSplit = searchResults[x].rating.split();

            // For each letter in string..
            for (var i = 0; i < ratingSplit.length; i++) {
                // ..capitalize letter
                ratingSplit[i] = ratingSplit[i].toUpperCase();
            }
            // Join words back into single string
            var rating = ratingSplit.join(" ");
            console.log(rating);

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: " + rating);

            // Creating and storing an image tag
            var resultGif = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            resultGif.attr({"src": searchResults[x].images.fixed_height_still.url, "data-state": "still", "data-still": searchResults[x].images.fixed_height_still.url, "data-animate": searchResults[x].images.fixed_height.url});
            resultGif.addClass("gif img-fluid");

            // Appending the paragraph and image tag to the gifDiv
            gifDiv.append(p);
            gifDiv.append(resultGif);

            // Prependng the gifDiv to the HTML page
            console.log($(`#list-${subject}`));
            $("#list-" + subject).append(gifDiv);
        }

        // Create Load More button at bottom of results
        var loadMoreButton = $("<button>");
            loadMoreButton.addClass("btn btn-primary");
            loadMoreButton.attr("id", "moreGifButton");
            loadMoreButton.text("Load more");
            $(`#list-${subject}`).append(loadMoreButton);
        

    });
};

function displayBox() {
    var gifDiv = $("<div>");

    // Split input string into individual letters
    var ratingSplit = searchResults[x].rating.split();

    // For each letter in string..
    for (var i = 0; i < ratingSplit.length; i++)
    {   // ..capitalize letter
        ratingSplit[i].toUpperCase();
    }
    // Join words back into single string
    var rating = ratingSplit.join(" ");

    // Creating a paragraph tag with the result item's rating
    var p = $("<p>").text("Rating: " + rating);

    // Creating and storing an image tag
    var resultGif = $("<img>");
    // Setting the src attribute of the image to a property pulled off the result item
    resultGif.attr({"src": searchResults[x].images.fixed_height_still.url, "data-state": "still", "data-still": searchResults[x].images.fixed_height_still.url, "data-animate": searchResults[x].images.fixed_height.url});
    resultGif.addClass("gif img-fluid");

    // Appending the paragraph and image tag to the gifDiv
    gifDiv.append(p);
    gifDiv.append(resultGif);

    // Prependng the gifDiv to the HTML page
    console.log($(`#list-${subject}`));
    $("#list-" + subject).append(gifDiv);
}




// Listener and function for pausing/playing gifs
$("div").on("click", ".gif", gifClick);

function gifClick(e) {
    e.stopPropagation();
    e.preventDefault();
    // Create vars for animated and still gif URLs
    var state = $(this).attr("data-state");
    var still = $(this).attr("data-still");
    var animate = $(this).attr("data-animate");
    console.log(state);
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", animate);
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", still);
      $(this).attr("data-state", "still");
    }
};


// This function handles events where one button is clicked
$("#searchButton").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();
    event.stopPropagation();

    // Grab the text from input box, trim beginning/ending whitespace
    var search = $("#searchForm").val().trim();

    // Split input string into individual words
    var searchSplit = search.split(" ");

    // For each word in string..
    for (var i = 0; i < searchSplit.length; i++)
    {   // ..capitalize first character of word
        searchSplit[i] = searchSplit[i].charAt(0).toUpperCase() + searchSplit[i].substr(1);
    }
    // Join words back into single string
    search = searchSplit.join(" ");
    // Replace spaces in string with Unicode NBSP
    search = search.replace(/\s+/g, '\u00a0');
    // Input added to topic array
    topics.push(search);

    makeTab(search);

    // Reset search box to placeholder
    $("#searchForm").val("");

    // Auto-search the user's new search
    $('#' + search).trigger("click");
});


// Listener and function for Load More Gifs button
$(document.body).on("click", "#moreGifButton", loadMore); 
function loadMore(e) {
    e.preventDefault();
    // Set query offset to 10 so that results return unique gifs
    offset += 10;

    runQuery($("a.active"), offset);
    // Hide old button, new one will be generated in runQuery function at bottom of page
    $("#moreGifButton").remove();
   
};