"use strict";

(function($){
    $('#my-form').submit( processPutMovie );
    homePage();

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
                $('#main-area').append( $(`<div class="closed" onclick=displayMovie(${data[i].movieId}) id = movieId${data[i].movieId} >${data[i].title}</div>`));
                $('#main-area').append($("</div>"));           
            };
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
    $.ajax({
        url: `https://localhost:44325/api/movie/${id}`,
        dataType: 'json',
        type: 'Get',
        contentType: 'application/json',
        success: function( data, textStatus, jQxhr ){
            if( $(`#movieId${id}`).hasClass("open"))
            {
                $(`#movieId${id}`).removeClass("open")
                $(`#movieId${id}`).addClass("closed")
                $(`#movieId${id}`).html(`${data.title}`);
            }else{
                $(`#movieId${id}`).removeClass("closed");
                $(`#movieId${id}`).addClass("open");
                $(`#movieId${id}`).empty();
                $(`#movieId${id}`).html(`Movie Id: ${data.movieId}, Title:${data.title}, Genre:${data.genre}</div>`);         
            }
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
    
}

function addAMovie() {
    $('#main-area').empty();
    $("#my-form").show();
}
