'use strict';

jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

});

/* Small function to apply a tick to steps which have been completed */
function applyTicks(current_step) {
    if(current_step == "add") {
        $('span.glyphicon.add').addClass('hidden');
        $('span.glyphicon.map').addClass('hidden');
        $('span.glyphicon.validate').addClass('hidden');
    }
    else if(current_step == "map") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.map').addClass('hidden');
        $('span.glyphicon.validate').addClass('hidden');
    }
    else if (current_step == "validate") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.map').removeClass('hidden');
        $('span.glyphicon.validate').addClass('hidden');
    }
    else if(current_step == "finish") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.map').removeClass('hidden');
        $('span.glyphicon.validate').removeClass('hidden');
    }
}