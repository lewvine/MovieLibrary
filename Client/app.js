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
                for(var i=0;i < data.length; i++){
                    $('#response pre').append( $('<div>' + data[i].title + '</div>') );
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