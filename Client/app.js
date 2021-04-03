"use strict";

(function($){
    $('#my-form').submit( processPutMovie );
    var movies = homePage();

})(jQuery);

// function displayMovie(movieObject) {
//     var tbody = $('#movies-table tbody');
//     if (tbody.length >= 0) {
//         tbody.append(`<tr class="movie-item"><td>${movieObject.movieId}</td><td>${movieObject.title}</td><td>${movieObject.director}</td><td>${movieObject.genre}</td></tr>`);
//     } else {
//         $('#movies-table').append('<tr><td>value</tr></td>');
//     }
// }

function homePage() {
    $("#my-form").hide();
    $.ajax({
        url: 'https://localhost:44325/api/movie/',
        dataType: 'json',
        type: 'Get',
        contentType: 'application/json',
        success: function( data, textStatus, jQxhr ){
            $('#main-area').empty();
            $('#main-area').append($("<div class='row'>Movie</div>"));
            for(let i=0;i < data.length; i++){
                $('#main-area').append(generateMovieRow(data[i]));
                generateMain(data[i].movieId);
            };
            return data;           
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function processPutMovie( e ){
    var dict = {
        Title : this["title"].value, //Find MovieId where title = this;
        Director: this["director"].value,
        Genre: this["genre"].value
    };

    $.ajax({
        url: 'https://localhost:44325/api/movie/',
        dataType: 'json',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(dict),
        success: function( data, textStatus, jQxhr ){
            $('#response pre').append( $('<div class="open" id = movieId' + data.movieId + '>' + data.title + '</div>') );
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });

    e.preventDefault();
}

function displayMovie(id){  
    var element = document.querySelector(`#movieId${id}`);
    var title = element.dataset.title;
    var genre = element.dataset.genre;
    var director = element.dataset.director;

    if( element.className == "open")
    {
        element.className = "closed";
        element.innerHTML = `Title: ${title}, Genre: ${genre}, Director: ${director}`;
    }else{
        element.className = "open";
        element.innerHTML = `${title}`;     
    };
}

function addAMovie() {
    $('#main-area').empty();
    $("#my-form").show();
}

function deleteMovie(id){
    $.ajax({
        url: `https://localhost:44325/api/movie/${id}`,
        dataType: 'json',
        type: 'Delete',
        contentType: 'application/json',
        success: function( data, textStatus, jQxhr ){
            console.log("This movie was successfully delete");
            homePage();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

// Avoiding repetition by saving data-fields to outer most layer of this.
// Other methods will retrieve values from this layer to set internal parts
function generateMovieRow(movie) {
    let rowValues = [];
    // Outer most div holds all of the information needed to populate internal divs
    rowValues.push(`<div class='row mt-1 mb-1' id='movieOuter${movie.movieId}'`);
    rowValues.push(` data-title="${movie.title}" data-genre="${movie.genre}" data-director="${movie.director}">`);
    rowValues.push("<div class='col-9'>");
    // Changes to inner values here
    rowValues.push(`<div class='row align-items-center' id='movieInner${movie.movieId}'>`);
    rowValues.push("Place Holder");
    // Populate inner values later
    rowValues.push("</div>");
    rowValues.push("</div>");
    rowValues.push("</div>");
    return rowValues.join("");
}

function generateMain(id) {
    let rowValues = [];
    
    let outer = $('#movieOuter' + id);
    let title = outer.attr("data-title");
    rowValues.push('<img src="images/grayDefault.png" alt="Gray placeholder image" class="img-responseive col-3">');
    rowValues.push(`<div class="col-7 text-center">${title}</div>`);
    rowValues.push(`<div class="btn btn-primary col-2" onclick="movieDetails(${id})">Details</div>`);
    $('#movieInner' + id).html(rowValues.join(""));
}

function movieDetails(id) {
    alert(id);
}

function oldCode() {
    let rowValues = [];
    rowValues.push("<div class='row'>");
    rowValues.push("<div class='col-9'");
    rowValues.push()
    rowValues.push("<div");
    rowValues.push(` data-title="${movie.title}" data-genre="${movie.genre}" data-director="${movie.director}"`);
    rowValues.push(` class="closed" onclick=displayMovie(${movie.movieId}) id = movieId${movie.movieId}>`);
    rowValues.push(`${movie.title}`);
    rowValues.push(`<button onclick='deleteMovie(${movie.movieId})' class="btn btn-danger">Delete</button>`);
    rowValues.push("</div>");
    rowValues.push("</div>")
    return rowValues.join("");
}