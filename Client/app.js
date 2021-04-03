"use strict";

(function($){
    $('#new-movie-form').submit( processPostMovie );
    var movies = homePage();

})(jQuery);

function homePage() {
    hideAddmovie();
    $.ajax({
        url: 'https://localhost:44325/api/movie/',
        dataType: 'json',
        type: 'Get',
        contentType: 'application/json',
        success: function( data, textStatus, jQxhr ){
            $('#main-area').empty();
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

function processPostMovie( e ){
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
            homePage();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });

    e.preventDefault();
    $("#new-movie-form")[0].reset();
}

function processPutMovie( e ){
    var dict = {
        Title : this["title"].value, //Find MovieId where title = this;
        Director: this["director"].value,
        Genre: this["genre"].value
    };
    let id = this['id'].value;

    $.ajax({
        url: 'https://localhost:44325/api/movie/' + id,
        dataType: 'json',
        type: 'Put',
        contentType: 'application/json',
        data: JSON.stringify(dict),
        success: function( data, textStatus, jQxhr ){
            homePage();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });

    e.preventDefault();
}
function addAMovie() {
    $("#new-movie-form").show();
}
function hideAddmovie() {
    $("#new-movie-form").hide();
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
    rowValues.push("<div class='row align-items-center'>");
    rowValues.push('<img src="images/grayDefault.png" alt="Gray placeholder image" class="img-responseive col-3">');
    rowValues.push(`<div class='row col-9' id='movieInner${movie.movieId}'>`);
    rowValues.push("Place Holder");
    // Populate inner values later
    rowValues.push("</div>")
    rowValues.push("</div>");
    rowValues.push("</div>");
    rowValues.push("</div>");
    return rowValues.join("");
}

function generateMain(id) {
    let rowValues = [];
    
    let outer = $('#movieOuter' + id);
    let title = outer.attr("data-title");
    rowValues.push(`<div class="col-10 text-center">${title}</div>`);
    rowValues.push(`<div class="btn btn-primary col-2" onclick="movieDetails(${id})">Details</div>`);
    $('#movieInner' + id).html(rowValues.join(""));
}

// Change to details screen with update image, edit, delete, and back buttons
function movieDetails(id) {
    let outer = $(`#movieOuter${id}`);
    let rowValues = [];
    $(`#movieInner${id}`).empty();
    rowValues.push("<div class='row col-12'><div class='col-5'>Title:</div><div class='col-4'>Director:</div><div class='col-3'>Genre:</div></div>")
    rowValues.push("<div class='row col-12'>");
    rowValues.push(`<div class='col-5'>${outer.attr("data-title")}</div>`);
    rowValues.push(`<div class='col-4'>${outer.attr("data-director")}</div>`);
    rowValues.push(`<div class='col-3'>${outer.attr("data-genre")}</div>`);
    rowValues.push("</div>");
    rowValues.push("<div class='row col-12'><br></div>")
    rowValues.push("<div class='row col-12'><br></div>")
    rowValues.push("<div class='row col-12'>");
    rowValues.push(`<div class='btn btn-primary col-3' onclick="generateMain(${id})">Back</div>`);
    rowValues.push(`<div class='btn btn-warning col-3' onclick="editDetails(${id})">Edit</div>`);
    rowValues.push(`<div class='btn btn-info col-3' onclick="updateImage(${id})">Update Image</div>`);
    rowValues.push(`<div class='btn btn-danger col-3' onclick="deleteMovie(${id})">Delete Entry</div>`)
    rowValues.push("</div>");
    $(`#movieInner${id}`).html(rowValues.join(""));

}
function editDetails(id) {
    let outer = $(`#movieOuter${id}`);
    $(`#movieInner${id}`).empty();
    let rowValues = [];
    rowValues.push("<div class='row col-12'>");
    rowValues.push(`<form class='col-12' id="form${id}">`);
    rowValues.push(`<input type="hidden" name="id" value=${id} />`);
    rowValues.push("<label class='col-3'>Title:</label>");
    rowValues.push(`<input class ='col-6' type="text" name="title" value="${outer.attr("data-title")}" />`);
    rowValues.push("<br>");
    rowValues.push("<label class='col-3'>Director:</label>");
    rowValues.push(`<input class ='col-6' type="text" name="director" value="${outer.attr("data-director")}" />`);
    rowValues.push("<br>");
    rowValues.push("<label class='col-3'>Genre:</label>");
    rowValues.push(`<input class ='col-6' type="text" name="genre" value="${outer.attr("data-genre")}" />`);
    rowValues.push("<br>");
    rowValues.push(`<div class='btn btn-danger' onclick="movieDetails(${id})">Cancel</div>`);
    rowValues.push("<button type='submit' class='btn btn-primary'>Confirm</button>");
    rowValues.push('</form>');
    rowValues.push("</div>");
    $(`#movieInner${id}`).html(rowValues.join(""));
    $('#form' + id).submit( processPutMovie );
}

function updateImage(id) {
    alert(id);
}