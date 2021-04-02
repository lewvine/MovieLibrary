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
                $('#main-area').append($("<div class='row'>"));
                $('#main-area').append( $(`<div data-title="${data[i].title}" data-genre="${data[i].genre}" data-director="${data[i].director}" class="closed" onclick=displayMovie(${data[i].movieId}) id = movieId${data[i].movieId} >${data[i].title}<button onclick='deleteMovie(${data[i].movieId})' class="btn btn-warning">Delete</button></div>`));
                $('#main-area').append($("</div>"));
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