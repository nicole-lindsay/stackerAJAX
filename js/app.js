// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {

    // clone our result template code
    var result = $('.templates .question').clone();

    // Set the question properties in result
    var questionElem = result.find('.question-text a');
    questionElem.attr('href', question.link);
    questionElem.text(question.title);

    // set the date asked property in result
    var asked = result.find('.asked-date');
    var date = new Date(1000 * question.creation_date);
    asked.text(date.toString());

    // set the .viewed for question property in result
    var viewed = result.find('.viewed');
    viewed.text(question.view_count);

    // set some properties related to asker
    var asker = result.find('.asker');
    asker.html('<p>Name: <a target="_blank" href="https://stackoverflow.com/users/' + question.owner.user_id + '">' +
        question.owner.display_name +
        '</a></p>' +
        '<p>Reputation: ' + question.owner.reputation + '</p>'
    );

    return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
    var results = resultNum + ' results for <strong>' + query + '</strong>';
    return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error) {
    var errorElem = $('.templates .error').clone();
    var errorText = '<p>' + error + '</p>';
    errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

    // the parameters we need to pass in our request to StackOverflow's API
    var request = {
        tagged: tags,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'creation'
    };

    $.ajax({
        url: "https://api.stackexchange.com/2.2/questions/unanswered",
        data: request,
        dataType: "jsonp", //use jsonp to avoid cross origin issues
        type: "GET",
    })
        .done(function(result) { //this waits for the ajax to return with a succesful promise object
            var searchResults = showSearchResults(request.tagged, result.items.length);

            $('.search-results').html(searchResults);
            //$.each is a higher order function. It takes an array and a function as an argument.
            //The function is executed once for each item in the array.
            // a.k.a. for-loop :-)
            $.each(result.items, function(i, item) {
                var question = showQuestion(item);
                $('.results').append(question);
            });
        })
        .fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
            var errorElem = showError(error);
            $('.search-results').append(errorElem);
        });
};

var showInspiration = function(data) {
    // console.log(data);
    // clone our inspire template code
    var result = $('.templates .inspire').clone();

    // Set the username, is also a link to user profile
    var userElem = result.find('.link a');
    userElem.attr('href', data.user.link)
    userElem.text(data.user.display_name);

    // reputation
    var userRep = result.find('.rep');
    userRep.text(data.user.reputation);

    // user type
    var userType = result.find('.userType');
    userType.text(data.user.user_type);

    //accept rate
    var userAccept = result.find('.rate');
    userAccept.text(data.user.accept_rate);

    //post count
    var userPost = result.find('.post');
    userPost.text(data.post_count);

    //user score
    var userScore = result.find('.score');
    userScore.text(data.score);

    return result;
};

var getInspiration = function(inspo) {

    // the parameters we need to pass in our request to StackOverflow's API
    var params = {
        site: 'stackoverflow',
    };

    $.ajax({
        url: "https://api.stackexchange.com/2.2/tags/" + inspo + "/top-answerers/all_time",
        data: params,
        dataType: "jsonp", //use jsonp to avoid cross origin issues
        type: "GET",
    })
        .done(function(result) { //this waits for the ajax to return with a succesful promise object
            var searchResults = showSearchResults(inspo, result.items.length);

            $('.search-results').html(searchResults);
            //$.each is a higher order function. It takes an array and a function as an argument.
            //The function is executed once for each item in the array.
            // a.k.a. for-loop :-)
            $.each(result.items, function(i, item) {
                var people = showInspiration(item);
                $('.results').append(people);
            });
        })
        .fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
            var errorElem = showError(error);
            $('.search-results').append(errorElem);
        });
};

// var showInspiration = function(result) {
//     console.log(result);

//     // for (var i = 0; i < result.items.length; i++) {
//     //     //display name w/link to user profile
//     //     var clone = $('.link').clone().last();
//     //     clone.find('a').text(result.items[i].user.display_name).attr('href', result.items[i].user.link);
//     //     $('#results').append(clone);
//     //     //reputation
//     //     var cloneRep = $('.rep').clone().last();
//     //     cloneRep.text(result.items[i].user.reputation);
//     //     console.log(cloneRep);
//     //     $('#results').append(cloneRep);
//     // };
// };

//needs to get info from stackoverflow
// post count: result.items.post_count
// score: result.items.score
// reputation: result.items.user.reputation
// usertype: result.items.user.usertype
// accept: result.items.user.accept_rate

// var getInspiration = function(userInput) {
//     var params = {
//         'site': 'stackoverflow'
//     };
//     $.ajax({
//         url: "http://api.stackexchange.com/2.2/tags/" + userInput + "/top-answerers/all_time",
//         data: params,
//         dataType: "jsonp",
//         type: "GET",
//     })
//         .done(function(result) {
//             showInspiration(result);
//         });
// };

$(document).ready(function() {
    $('.unanswered-getter').submit(function(e) {
        e.preventDefault();
        // zero out results if previous search has run
        $('.results').html('');
        // get the value of the tags the user submitted
        var tags = $(this).find("input[name='tags']").val();
        getUnanswered(tags);
        $("input[name='tags']").val("");
    });

    $(".inspiration-getter").submit(function(event) {
        event.preventDefault();
        $('.results').html('');
        var inspo = $(this).find("input[name='answerers']").val();
        getInspiration(inspo);
        $("input[name='answerers']").val("");
    });
});