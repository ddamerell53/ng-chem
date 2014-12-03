'use strict';

var app = angular.module('ngChemApp');

/** Factories for querying APIs **/
app.factory('ChEMBLFactory',[ '$http', function ($http) {
	
	var chembl_base_url = "http://www.ebi.ac.uk/chemblws/compounds/";

	return {
        querySmiles: function(input_smiles) {
        	
        	//send smiles off to ChEMBL web service - populate returned data into our table
        	$http.get(chembl_base_url + 'smiles/' + input_smiles + '.json')
                   .success(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    console.log(data);
					    return {resp:"success", message:'successfully got smiles'};
					  })
                   .error(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    console.log(data);
					    //add an error
					    
					    return {resp:"danger", message:'there was a problem talking to the chembl api for smiles'};
					  });

        	

        },
        queryChemblId: function(input_chembl_id){
        	//send chembl id off to ChEMBL web service - populate returned data into our table
        	$http.get($rootScope.chembl_base_url + input_chembl_id + '.json')
                   .success(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    return {resp:"success", message:'successfully got chembl id'};
					  })
                   .error(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    console.log(data);
					    //add an error
					    return {resp:"danger", message:'there was a problem talking to the chembl api for chembl id'};
					  });
        },
        queryInChi: function(input_inchi) {
        	//send inchi off to ChEMBL web service - populate returned data into our table
        	$http.get($rootScope.chembl_base_url + input_inchi + '.json')
                   .success(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    return {resp:"success", message:'successfully got inchi'};
					  })
                   .error(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    console.log(data);
					    //add an error
					    return {resp:"danger", message:'there was a problem talking to the chembl api for inchi'};
					  });
        },
        queryInChiKey: function(input_inchikey) {
        	http://www.ebi.ac.uk/chemblws/compounds//QFFGVLORLPOAEC-SNVBAGLBSA-N.json
        	//send inchi off to ChEMBL web service - populate returned data into our table
        	$http.get($rootScope.chembl_base_url + 'stdinchikey/' + input_inchikey + '.json')
                   .success(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    return {resp:"success", message:'successfully got inchikey'};
					  })
                   .error(function(data, status, headers, config) {
					    // this callback will be called asynchronously
					    // when the response is available
					    console.log(data);
					    //add an error
					    return {resp:"danger", message:'there was a problem talking to the chembl api for inchikey'};
					  });
        },

    };
}]);