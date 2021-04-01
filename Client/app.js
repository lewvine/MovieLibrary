(function($){
    function processForm( e ){
        var dict = {
        	Title : this["title"].value, //Find MovieId where title = this;
        	Director: this["director"].value
        };

        $.ajax({
            url: 'https://localhost:44325/api/movie/',
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            data: JSON.stringify(dict),
            success: function( data, textStatus, jQxhr ){
                $('#response pre').empty();
                $('.movie-item').empty();
                for(let i=0;i < data.length; i++){
                    $('#response pre').append( $('<div id = movieId' + data[i].movieId + '>' + data[i].title + '</div>') );            
                    displayMovie(data[i]);
                };
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });

        e.preventDefault();
    }

    $('#my-form').submit( processForm );
})(jQuery);

function displayMovie(movieObject) {
    var tbody = $('#movies-table tbody');
    if (tbody.length >= 0) {
        tbody.append(`<tr class="movie-item"><td>${movieObject.movieId}</td><td>${movieObject.title}</td><td>${movieObject.director}</td><td>${movieObject.genre}</td></tr>`);
    } else {
        $('#movies-table').append('<tr><td>value</tr></td>');
    }
}

