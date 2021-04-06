"use strict";

(function($){
    $('#new-movie-form').submit( processPostMovie );
    $("#image-upload").submit( uploadImage );
    hideAddMovie();
    hideSearchMovie();
    getMovies();
    mainMenuButtons();
    let input = document.getElementById("movieTitle");
    input.addEventListener('input', updateMovies);


})(jQuery);

function uploadImage(e) 
{
    e.preventDefault();
    let formData = new FormData();
    let file_data = $("#myFile").prop("files")[0];
    formData.append("file", file_data);
    $.ajax({
        url: 'https://localhost:44325/api/movie/upload/1',
        type: 'Put',
        data: formData,
        cache : false,
        processData: false,
        contentType: false,
        success: function( data, textStatus, jQxhr ){
            alert("File uploaded");
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert("Error");
            console.log( errorThrown );
        }
    });


}
function getMovies() {
    $("#main-area").empty();
    $.ajax({
        url: 'https://localhost:44325/api/movie/',
        dataType: 'json',
        type: 'Get',
        contentType: 'application/json',
        success: function( movies, textStatus, jQxhr ){
            displayMovies(movies);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function getMoviesForSearch() {
    $("#main-area").empty();
    $.ajax({
        url: 'https://localhost:44325/api/movie/',
        dataType: 'json',
        type: 'Get',
        contentType: 'application/json',
        success: function( movies, textStatus, jQxhr ){
            displayMoviesForSearch(movies);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function displayMoviesForSearch(movies) {
    for(let i=0;i < movies.length; i++){
        $('#main-area').append(generateMovieRow(movies[i]));
        movieDetails(movies[i].movieId);  
    };
}

function displayMovies(movies){
    for(let i=0;i < movies.length; i++){
        $('#main-area').append(generateMovieRow(movies[i]));
        generateMain(movies[i].movieId);  
    };
}

function resetSearch() {
    $('#main-area .movie').map(
        function(){
            this.style.display = "block";
        }
    );
    
    $("#movieTitle").val("");
}
function updateMovies(e){
    let searchProperty = $("#searchField")[0].value;

    let searchField = e.target.value.toLowerCase();
    if(searchField != ""){
        $('#main-area .movie').map(
            function(){
                if(this.dataset[searchProperty].toLowerCase().includes(searchField)){
                    this.style.display = "block";
                }else{
                    this.style.display = "none";
                }
            }
        );
    }else{
        $('#main-area .movie').map(
            function(){
                this.style.display = "block";
            }
        );
    }
};

function homePage() {
    $("#main-area").empty();
    hideAddMovie();
    getMovies();
    hideSearchMovie();
    mainMenuButtons();
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
    $("#search-movie-form").hide();
    $("#search-movie-form")[0].reset();
    getMovies();
    addMenuButtons();
}
function showSearch() {
    $("#search-movie-form").show();
    getMoviesForSearch();
    $("#new-movie-form").hide();
    $("#new-movie-form")[0].reset();
    searchMenuButtons();
}
function hideAddMovie() {
    $("#new-movie-form").hide();
    $("#new-movie-form")[0].reset();
    mainMenuButtons();
}

function hideSearchMovie() {
    $("#search-movie-form").hide();
    mainMenuButtons();
    resetSearch();
    mainMenuButtons();
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
    rowValues.push(`<div class='movie row mt-1 mb-1' id='movieOuter${movie.movieId}'`);
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

function mainMenuButtons() {
    $("#home-btn").removeClass("btn-primary");
    $("#home-btn").addClass("btn-secondary");
    $("#add-btn").removeClass("btn-secondary");
    $("#add-btn").addClass("btn-primary");
    $("#search-btn").removeClass("btn-secondary");
    $("#search-btn").addClass("btn-primary");
}

function addMenuButtons() {
    $("#home-btn").removeClass("btn-secondary");
    $("#home-btn").addClass("btn-primary");
    $("#add-btn").removeClass("btn-primary");
    $("#add-btn").addClass("btn-secondary");
    $("#search-btn").removeClass("btn-secondary");
    $("#search-btn").addClass("btn-primary");

}

function searchMenuButtons() {
    $("#home-btn").removeClass("btn-secondary");
    $("#home-btn").addClass("btn-primary");
    $("#add-btn").removeClass("btn-secondary");
    $("#add-btn").addClass("btn-primary");
    $("#search-btn").removeClass("btn-primary");
    $("#search-btn").addClass("btn-secondary");
}