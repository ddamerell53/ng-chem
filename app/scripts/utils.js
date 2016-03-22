'use strict';

Array.prototype.chunk = function(chunkSize) {
    var array=this;
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
        })
    );
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

/* Small function to apply a tick to steps which have been completed */
function applyTicks(current_step) {
    if(current_step == "intro" || current_step == "add") {
        $('span.glyphicon.add').addClass('hidden');
        $('span.glyphicon.map').addClass('hidden');
        $('span.glyphicon.validate').addClass('hidden');
    }

    else if (current_step == "validate") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.validate').addClass('hidden');
        $('span.glyphicon.map').addClass('hidden');
    }
     else if(current_step == "map") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.validate').removeClass('hidden');
        $('span.glyphicon.map').addClass('hidden');
    }
    else if(current_step == "finish") {
        $('span.glyphicon.add').removeClass('hidden');
        $('span.glyphicon.map').removeClass('hidden');
        $('span.glyphicon.validate').removeClass('hidden');
    }
}

function splitInput(in_str) {

    var data = [];
    var re=/\r\n|\n\r|\n|\r/g;
    var splitted = in_str.replace(re,"\n").split("\n");
    if (splitted.length == 1){
        //try delimiting on commas
        if (splitted[0].trim()==""){
            return false;
        }
    }
    splitted = $.map(splitted, $.trim);

    splitted.clean("");
    splitted.clean(undefined);
    //return some json
    var isSingleType=true;
    var firstType="";
    jQuery.each(splitted, function(index, value) {

        //work out if it's SMILES or InChi (for now)
        var input_type = smilesOrInchi(value);

        if(index == 0){
            firstType = input_type;
        }
        if(input_type != firstType){
            isSingleType = false;
        }
        data.push(value.trim());
    });
    if (isSingleType){
        return {"type": firstType, "objects": data};
    }else{
        return false;
    }
}

function smilesOrInchi(in_str) {
    //if it starts with InChi, it's inchi
    //otherwise SMILES (for now)
    var type_str = "";
    //is it inchi?InChI=1S/([^/]+)(?:/[^/]+)*\\S
    if (in_str.trim().match(/^([^J][A-Za-z0-9@+\-\[\]\(\)\\=#$.]+)$/)){
        type_str = "Smiles"
    }
    else if (in_str.trim().match(/^((InChI=)?[^J][0-9BCOHNSOPrIFla+\-\(\)\\\/,pqbtmsih]{6,})$/ig) ){
        type_str = "InChi";
    }
    //is it inchikey?
    // else if (27===in_str.length && '-'===in_str[14] && '-'===in_str[25] && !!in_str.match(/^([0-9A-Z\-]+)$/)) {
    //     type_str = "InChi Key"
    // }
    //is it a chembl id?
    else if (in_str.trim().match(/^((CHEMBL)?[0-9])$/)) {
        type_str = "ChEMBL ID"
    }
    else {
        type_str = "unknown"
    }
    return type_str;
}

function prepCustomFields(customFields){
    var obj = {};
        var fields = customFields.map(function(d){
            if (d.name && d.value){
                obj[d.name] = d.value;
            }
        });
    return obj;

}