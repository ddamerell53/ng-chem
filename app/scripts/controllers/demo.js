'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
var app = angular.module('ngChemApp');



app.controller('DemoCtrl', [ '$scope', '$rootScope', '$state', 'ChEMBLFactory', 'CBHCompoundBatch', '$timeout', function ($scope, $rootScope, $state, ChEMBLFactory, CBHCompoundBatch, $timeout) {

	$scope.formData = {};

    $scope.molecule = { 'molfile' : "", 
                        'molfileChanged': function() { 

                            CBHCompoundBatch.validate($scope.molecule.molfile).then(
                                                        function(data){
                                                            $scope.validated = data.data;
                                                        }, function(error){
                                                            $scope.validated = { 
                                                                'warnings': {
                                                                    'inorganicCount':"0"
                                                                }, 'errors': { 
                                                                    'invalidMolecule': true 
                                                                } 
                                                            } 
                            }); 
                                                      },
                        'metadata': { 
                            'stereoSelected': {
                                                name:'1', 
                                                value:'as drawn'
                                               },
                            'labbook_id':'',
                            'custom_fields':  [

                                              ]

                                              
                        }
                        
                     };

	$scope.myData = [ ];

    //config object for the progress bar
    $scope.wizard = {
        'step': 0,
        'totalSteps': 4,
        'dynamic': 0,
        'max': 100,
    };

    $scope.singleMol = CBHCompoundBatch.getSingleMol();



	$scope.alerts = [
        /*{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }*/
	];

    $scope.validated = { "warnings": {
                            "inorganicCount": "0",
                            "painsCount": "0",
                            "saltCount": "0",
                            "tautomerCount": "0"
                          }
                        };

	$scope.parsed_input = [ {"smiles": "COc1ccc2[C@@H]3[C@H](COc2c1)C(C)(C)OC4=C3C(=O)C(=O)C5=C4OC(C)(C)[C@H]6COc7cc(OC)ccc7[C@@H]56", "chemblId": "CHEMBL446858", "passesRuleOfThree": "No", "molecularWeight": 544.59, "molecularFormula": "C32H32O8", "acdLogp": 7.67, "knownDrug": "No", "stdInChiKey": "GHBOEFUAGSHXPO-UWXQAFAOSA-N", "species": null, "synonyms": null, "medChemFriendly": "Yes", "rotatableBonds": 2, "acdBasicPka": null, "alogp": 3.63, "preferredCompoundName": null, "numRo5Violations": 1, "acdLogd": 7.67, "acdAcidicPka": null},
                      {"smiles": "CN1C(=O)N(C)c2ncn(C)c2C1=O", "chemblId": "CHEMBL113", "passesRuleOfThree": "Yes", "molecularWeight": 194.19, "molecularFormula": "C8H10N4O2", "acdLogp": -0.63, "knownDrug": "Yes", "stdInChiKey": "RYYVLZVUVIJVGH-UHFFFAOYSA-N", "species": "NEUTRAL", "synonyms": "Coffeine,SID104171124,SID11110908,Methyltheobromine,Caffeine,Cafcit,NoDoz Caplets and Chewable Tablets,SID124879556,Theine", "medChemFriendly": "Yes", "rotatableBonds": 0, "acdBasicPka": 0.52, "alogp": -0.10, "preferredCompoundName": "CAFFEINE", "numRo5Violations": 0, "acdLogd": -0.63, "acdAcidicPka": null} ];
    $scope.parsed_input.map(function(d){d.smiles = btoa(d.smiles)});
	$scope.input_string = {"inputstring":"",
                            "dataTypes" : ["Auto-detect", "Smiles", "INCHI"],
                            "dataTypeSelected" : "Auto-detect"};

	$scope.gridOptionsSingle = { data: 'molecule',
                                   showColumnMenu:false,
                                    enableColumnReordering:false,
                                    columnDefs: [//{ field: "smiles", displayName: "Structure", cellTemplate:"img-template.html" },
                                                { field: "metadata.labbook_id", displayName: "Labbook ID"},
                                                { field: "metedata.stereoSelected.value", displayName: "Stereochem" },
                                                { field: "molecularWeight", displayName: "Mol Weight" },
                                                { field: "knownDrug", displayName: "Known Drug" },
                                                { field: "stdInChiKey", displayName: "Std InChi Key" },
                                                { field: "acdLogp", displayName: "acdLogp" }]
                                  };
    $scope.gridOptionsBatch = { data: 'parsed_input',
                                   showColumnMenu:true,
                                    enableColumnReordering:true,
                                    columnDefs: [//{ field: "smiles", displayName: "Structure", cellTemplate:"img-template.html" },
                                                { field: "metadata.labbook_id", displayName: "Labbook ID"},
                                                { field: "chemblId", displayName: "Chembl ID" },
                                                { field: "molecularWeight", displayName: "Mol Weight" },
                                                { field: "knownDrug", displayName: "Known Drug" },
                                                { field: "stdInChiKey", displayName: "Std InChi Key" },
                                                { field: "acdLogp", displayName: "acdLogp" }]
                                  };

    $scope.uploaded_file_name = "";

    $scope.assignFileId = function(id) {
        $scope.uploaded_file_name = id;
        console.log($scope.uploaded_file_name);
    }

	$scope.parseInput = function (){
        $scope.input_string.splitted = {}
        var split = splitInput($scope.input_string.inputstring,$scope.dataTypeSelected);
        if ($scope.input_string.dataTypeSelected != "Auto-detect"){
            //Override if user sets a preference
            split.type = scope.input_string.dataTypeSelected;
        }
		$scope.input_string.splitted = split;
    };

    $scope.processInput = function(){
            CBHCompoundBatch.validateList($scope.input_string.splitted).then(
                function(data){
                    $scope.validatedData = data;
                }
            );
    };
        
		





    $scope.warningNumber = 0;

    $scope.$watch('validated', function(){
      $scope.warningNumber = parseInt($scope.validated.warnings.inorganicCount) + parseInt($scope.validated.warnings.tautomerCount) + parseInt($scope.validated.warnings.saltCount) + parseInt($scope.validated.warnings.painsCount);
    });

    $scope.addAlert = function(message, alert_type){
      $scope.alerts.push({msg: message || 'There has been an error!', type : alert_type || "danger" });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    //$scope.stereoSelected = { name:'1', value:'as drawn'};
    //call this to save data to the DB
    $scope.saveSingleMol = function() {
        //send this to the service for saving data
        //form fields bound to the scope molecule object
        //this may be performed during the transition to the finish page - any results to be shown need a promise for that page.

        //submit
        $scope.singleMol = CBHCompoundBatch.getSingleMol();
         CBHCompoundBatch.saveSingleCompound($scope.molecule.molfile, $scope.molecule.metadata.custom_fields).then(
            function(data){
                $scope.singleMol = data.data;
                $scope.finalData.objects = [data.data];
               
            }, function(error){
                $scope.validated = { 'errors': { 'invalidMolecule': true } };
            });

    };

    
    //set up test lists of droppables here
    $scope.dragmodels = {
        selected: null,
        lists: {"headers": []}
    };
    $scope.dropmodels = {
        selected: null,
        lists: { } //will be replaced by database fields
    }
    $scope.binmodels = {
        selected: null,
        lists: { "ignored": [] } //will be replaced by database fields
    }


$scope.finalData = {"objects":[]};


    $scope.saveMultiBatchMolecules = function(){
        CBHCompoundBatch.saveMultiBatchMolecules($scope.validatedData.currentBatch, $scope.molecule.metadata.custom_fields).then(
            function(data){
                CBHCompoundBatch.query({multiple_batch : $scope.validatedData.currentBatch}).then(function(result){
                    $scope.finalData.objects = result.objects;
                });
            }, function(error){
                $scope.validated = { 'errors': { 'invalidMolecule': true } };
        });
    }
    $scope.parseHeaders = function() {
        //call service to pull out headers from uploaded file
        //service backend detects file type
        //returns object which is populated into the list for map page
        $scope.dragmodels.lists.headers = [];

        CBHCompoundBatch.fetchHeaders($scope.uploaded_file_name).then(
            function(data){
                //do something with the returned data
                angular.forEach(data.data.headers, function(value, key) {
                  $scope.dragmodels.lists.headers.push({label: value});
                });

            }, function(error){
                console.log(error);
            });

        //call to populate droppable fields
        CBHCompoundBatch.fetchExistingFields().then(
            function(data){
                //do something with the returned data
                angular.forEach(data.data.fieldNames, function(value, key) {
                    //create a blank list for that custom field
                    //"BW_ID", "Formula", "Mass_mg", "MolWeight"
                    $scope.dropmodels.lists[value.name] = [];
                    //now try to automap the headers to the fields
                    

                });
                

            }, function(error){
                console.log(error);
            });

        
    }

    $scope.automap = function() {
        console.log("Automap being called");
        angular.forEach($scope.dropmodels.lists, function(value, key) {
            //console.log(key);
            angular.forEach($scope.dragmodels.lists.headers, function(hdr, k) {
                if (hdr.label == key) {
                    $scope.dragmodels.lists.headers.splice(k, 1);
                    $scope.dropmodels.lists[key].push(hdr);
                }
            });

        });



        
    }


    $scope.resetMappingForm = function() {
        //put all the draggable fields back to where they came from (assuming no automapping is displayed)
        //loop through binmodels and put back into dragmodels
        angular.forEach($scope.binmodels.lists.ignored, function(value, key) {
            $scope.binmodels.lists.ignored.pop(value);
            $scope.dragmodels.lists.headers.push(value);
        });
        //loop through dropmodels and put into dragmodels
        angular.forEach($scope.dropmodels.lists, function(value, key) {
            angular.forEach(value, function(inner_value, inner_key) {
                value.pop(inner_value);
                $scope.dragmodels.lists.headers.push(inner_value);
            });
        });

    }

        


    $scope.validatedData = {};



}]);

app.controller('MessageCtrl', function ($scope){
	

});


