'use strict'

const apiKey = 'gaBrSCn1y76EcopcT1uTCB3w6rnRU1c9Q5iVxGa6';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

/*
Takes and object and turns it into an array via object.keys
maps over the array and stringifies it to url readable key:value pairs
joins the array values to one string and returns that string
*/
function formatQueryParams(params){
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`)
    return queryItems.join('&');
}



/*
Take the results and pull out the appropriate information
Format relevant info into proper html to display
If second query, clear the first results to display only the second results, iterated.
*/
function displayResults(results){
    $('#results-list').empty();

    //for each item in the array, extract name and url and format via html
    for(let i=0; i<results.limit; i++){
        $('#results-list').append(
            `<li>
                <p><strong>${results.data[i].fullName}</strong>: <a href="${results.data[i].url}">website</a></p> 
                <p>${results.data[i].description}<p>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
} 

/*
Takes the object passed through and turns into an array
Maps through the array and formats as a url paramter complient array of strings
Joins the array into one single string and returns that
*/
function formatParams(param){
    const paramStr = Object.keys(param)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`)
    return paramStr.join('&');
}

/* 
getParks will add the user input to the search url to create api url
Implement the native fetch api, add response.ok, then to conver response to JSON
Then when conversion complete, run through displayResults function to format HTML properly
*/
function getParks(states, limit=10){
    
    //split the string by the delimiter ', ' into an array
    //then map through each item and adjust to a new string, url parameter compliant 
    const stateArr = states.split(", ")
        .map(item => `stateCode=${encodeURIComponent(item)}`);
    const stateStr = stateArr.join('&');

    //list params in object to be formatted to url compliant
    const params = {
        limit,
        api_key: apiKey
    };

    
    const queryStr = formatParams(params);

    const url = searchURL+'?'+stateStr+'&'+queryStr;

    fetch (url)
      .then(response => {
          if(response.ok){
              return response.json();
          }
          throw new Error (response.statusText);
      })
      .then(responseJSON => displayResults(responseJSON))
      .catch(error => { 
          $('#js-error').text(`Error: ${error.message}`);
      })
}



/* 
This function is what's teed up once the page loads
Watches to see when the form is submitted
Prevents default submission and sets user to the value from the input
Passes that value to the function get Repo
*/
function watchForm(){
    $('form').submit(e =>{
        e.preventDefault();
        const states = $('#search-state').val();
        const max = $('#max-results').val()
        getParks(states, max);
    });
}

$(watchForm);