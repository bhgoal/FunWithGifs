// giphy api key H6iVL2wZikmz4JFyIELiwNQtVY5RVvAr

var topics = ["Cake", "Cookies", "Brownies", "Ice\u00a0Cream"];

function initialTabs() {
    $(".list-group-item-action").remove();
    $("#nav-tabContent").empty();
    for (i = 0; i < topics.length; i++) {
        makeTab(topics[i]);
    }
}
initialTabs();

function makeTab(input) {
    var newTab = $("<a>");
    newTab.addClass("list-group-item list-group-item-action");
    newTab.attr({"id":input, "href":`#list-${input}`, "role":"tab"});
    newTab.text(input);
    $("#list-tab").append(newTab);
    
    var newTabContent = $("<div>");
    newTabContent.addClass("tab-pane fade");
    newTabContent.attr({"id":`list-${input}`, "role":"tabpanel"});
    newTabContent.text("Test test test test test test test test test test test test test");
    $("#nav-tabContent").append(newTabContent);
}




$('#list-tab a').on('click', runQuery);

function runQuery(e) {
    e.preventDefault()
    $(this).tab('show') 
    // Grabbing and storing the data-animal property value from the button
    var subject = $(this).attr("id");

    // Constructing a queryURL using the animal name
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${subject}&limit=10&api_key=H6iVL2wZikmz4JFyIELiwNQtVY5RVvAr`;

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
        var searchResults = response.data;

        // Looping through each result item
        for (var x = 0; x < searchResults.length; x++) {

          // Creating and storing a div tag
          var gifDiv = $("<div>");

          // Creating a paragraph tag with the result item's rating
          var p = $("<p>").text("Rating: " + searchResults[x].rating);

          // Creating and storing an image tag
          var resultGif = $("<img>");
          // Setting the src attribute of the image to a property pulled off the result item
          resultGif.attr({"src": searchResults[x].images.fixed_height_still.url, "data-state": "still", "data-count": x});
          resultGif.addClass("gif");

          // Appending the paragraph and image tag to the animalDiv
          gifDiv.append(p);
          gifDiv.append(resultGif);

          // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
          console.log($(`#list-${subject}`));
          $("#list-" + subject).prepend(gifDiv);
        }

        $(".gif").on("click", function() {
            // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
            var state = $(this).attr("data-state");
            var count = $(this).attr("data-count");
            console.log(state);
            console.log(count);
            // If the clicked image's state is still, update its src attribute to what its data-animate value is.
            // Then, set the image's data-state to animate
            // Else set src to the data-still value
            if (state === "still") {
              $(this).attr("src", searchResults[count].images.fixed_height.url);
              $(this).attr("data-state", "animate");
            } else {
              $(this).attr("src", searchResults[count].images.fixed_height_still.url);
              $(this).attr("data-state", "still");
            }
        });
    });
};


// This function handles events where one button is clicked
$("#searchButton").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // Grab the text from input box, trim beginning/ending whitespace
    var search = $("#searchForm").val().trim();
    console.log(search);

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
    console.log(search);
    // Input added to topic array
    topics.push(search);

    makeTab(search);
    

    // Reset search box to placeholder
    $("#searchForm").val("");

    // Create listener for topic tabs
    $('#list-tab a').on('click', runQuery);
    // Auto-search the user's new search
    $('#' + search).trigger("click");
});
