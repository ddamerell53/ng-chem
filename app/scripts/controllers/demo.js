'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
var app = angular.module('ngChemApp');



app.controller('DemoCtrl', [ '$scope', '$rootScope', '$state', 'ChEMBLFactory', 'MessageFactory', 'CBHCompoundBatch', '$timeout', '$stateParams', 'projectKey', function ($scope, $rootScope, $state, ChEMBLFactory, MessageFactory, CBHCompoundBatch, $timeout, $stateParams, projectKey) {

        $scope.addCustomField = function() {
          var newItemNo = $scope.cust_fields_count + 1;
          $scope.molecule.metadata.custom_fields.push( { 'name':'', 'value':'', 'id':newItemNo } );
          $scope.cust_fields_count++;
        };
        $scope.filedata = {};
        $scope.removeCustomField = function(number) {

          var filteredFields = $scope.molecule.metadata.custom_fields.filter(function(element) {
            return element.id != number;
          });

          $scope.molecule.metadata.custom_fields = filteredFields;
          

        };
        $rootScope.headline = "Wizard"
        $rootScope.subheading= "Welcome to the ChemReg wizard"        
        $rootScope.glyphicon = "flash";


//User has pressed cancel or finished a registration - clear out all of the populated data
    $scope.startAgain = function(flowfiles) {
        $scope.struc_col_selected={ name:"", value:"Please select"} ;
        $scope.format_not_detected = false;
        $scope.file_error = "";
        $scope.singleMol = CBHCompoundBatch.getSingleMol(); //
        $scope.finalData = {"objects" :[]}; //
        $scope.custom_field_mapping = { }; //
        $scope.warningNumber = 0; //
        $scope.uploaded_file_name = ""; //
        $scope.file_extension = "";

        $scope.struc_col_options = [ { name:"", value:"Please select"} ]; //
        $scope.struc_col_str = ""; //
        $scope.validated = { "warnings": {
                            "inorganicCount": "0",
                            "painsCount": "0",
                            "saltCount": "0",
                            "tautomerCount": "0"
                          }
                        }; //
        $scope.validatedData = {};//
        $scope.input_string = {"inputstring":"",
                            "dataTypes" : ["Auto-detect", "Smiles", "INCHI"],
                            "dataTypeSelected" : "Auto-detect"};
        $scope.dragmodels = {
        selected: null,
        lists: {"headers": []}
        };
        $scope.dropmodels = {
            selected: null,
            lists: [] //will be replaced by database fields
        }
        $scope.binmodels = {
            selected: null,
            lists: { "ignored": [] } //will be replaced by database fields
        }

        angular.forEach(flowfiles, function(file) {
            file.cancel();
        });
        $scope.headers_not_retrieved = false;
        $scope.ids_not_processed = false;
        $scope.molecule = { 'molfile' : "", 
                        'molfileChanged': function() { 
                            CBHCompoundBatch.validate(projectKey ,$scope.molecule.molfile
                                                        ).then(
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

        $scope.cust_fields_count = 0
        $scope.custom_fields = [];
        $scope.custom_field_choices = [];

        //Get the backend defined list of custom fields
        CBHCompoundBatch.fetchExistingFields(projectKey).then(
            function(data){
                //add each of the pinned custom fields
                angular.forEach(data.data.fieldNames, function(value) {
                    //Add the pinned custom fields
                    if (value.id){
                        $scope.cust_fields_count ++;
                        value.id = $scope.cust_fields_count ;
                        value.value = "";
                        $scope.molecule.metadata.custom_fields.push(value);
                    } else {
                        $scope.custom_field_choices.push(value.name);
                    }
                    
                });
                

            }, function(error){
                console.log(error);
            });


            

        //do we need any back-end resetting here?
    
    };

    $scope.getValueTypeAhead = function(field){
        if (field.allowedValues){
            return field.allowedValues.split(",");
        }else{
            return [];
        }
    }

    $scope.cancelFile =function(field){
        $scope.headers_not_retrieved=false;
        $scope.file_error=false;
    }

    $scope.startAgain([]);
    $scope.formData = {};

  

	$scope.myData = [ ];

    //config object for the progress bar
    $scope.wizard = {
        'step': 0,
        'totalSteps': 4,
        'dynamic': 0,
        'max': 100,
    };




	$scope.alerts = [
        /*{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }*/
	];


	$scope.parsed_input = [ {"smiles": "COc1ccc2[C@@H]3[C@H](COc2c1)C(C)(C)OC4=C3C(=O)C(=O)C5=C4OC(C)(C)[C@H]6COc7cc(OC)ccc7[C@@H]56", "chemblId": "CHEMBL446858", "passesRuleOfThree": "No", "molecularWeight": 544.59, "molecularFormula": "C32H32O8", "acdLogp": 7.67, "knownDrug": "No", "stdInChiKey": "GHBOEFUAGSHXPO-UWXQAFAOSA-N", "species": null, "synonyms": null, "medChemFriendly": "Yes", "rotatableBonds": 2, "acdBasicPka": null, "alogp": 3.63, "preferredCompoundName": null, "numRo5Violations": 1, "acdLogd": 7.67, "acdAcidicPka": null},
                      {"smiles": "CN1C(=O)N(C)c2ncn(C)c2C1=O", "chemblId": "CHEMBL113", "passesRuleOfThree": "Yes", "molecularWeight": 194.19, "molecularFormula": "C8H10N4O2", "acdLogp": -0.63, "knownDrug": "Yes", "stdInChiKey": "RYYVLZVUVIJVGH-UHFFFAOYSA-N", "species": "NEUTRAL", "synonyms": "Coffeine,SID104171124,SID11110908,Methyltheobromine,Caffeine,Cafcit,NoDoz Caplets and Chewable Tablets,SID124879556,Theine", "medChemFriendly": "Yes", "rotatableBonds": 0, "acdBasicPka": 0.52, "alogp": -0.10, "preferredCompoundName": "CAFFEINE", "numRo5Violations": 0, "acdLogd": -0.63, "acdAcidicPka": null} ];
    $scope.parsed_input.map(function(d){d.smiles = btoa(d.smiles)});

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


    $scope.assignFileId = function(id, ext, file) {
        $scope.startAgain();
        $scope.uploaded_file_name = id;
        $scope.file_extension = ext;
        $scope.headers_not_retrieved = false;
        $scope.parseHeaders();
    }

    $scope.mapFilePage = function(){
        if ($scope.file_extension=="cdx" || $scope.file_extension=="cdxml"){
            $scope.valFiles({});
            $state.go("projects.project.demo.map.multiple");
        }else {
            $state.go("projects.project.demo.map.file");
        }
        

    }

    $scope.isFileExcel = function() {
        return ($scope.file_extension == 'xls' || $scope.file_extension == 'xlsx');
    }

	$scope.parseInput = function (){
        $scope.filedata.flow.files=[];
        $scope.validatedData = {};
        $scope.ids_not_processed = false;
        $scope.format_not_detected = false;
        $scope.input_string.splitted = {}
        var split = splitInput($scope.input_string.inputstring,$scope.dataTypeSelected);
        if ($scope.input_string.dataTypeSelected != "Auto-detect"){
            //Override if user sets a preference
            split.type = scope.input_string.dataTypeSelected;
        }else{
            if (split.type=="unknown"){
                $scope.format_not_detected = true;
            }
            
        }

		$scope.input_string.splitted = split;
        if (split){
            $scope.processInput();
        }
                
    };

    $scope.processInput = function(){

            CBHCompoundBatch.validateList(projectKey, $scope.input_string.splitted).then(
                function(data){
                    data.total=data.objects.length;
                    $scope.validatedData = data;
                }, function(error){
                    $state.go('projects.project.demo.add.multiple');
                    $scope.ids_not_processed = true;
                });
            
    };

    //export our resultset to either SD or Excel files
    //if user has uploaded an Excel file, use that and create a new worksheet in the file with the exported data
    //if the user has uploaded a SD file, use that and add our data to the existing molecules
    $scope.export = function(file_type) {
        /*CBHCompoundBatch.export(file_type).then(
            function(data) {
                console.log(data);
            }
        )*/
        CBHCompoundBatch.query({multiple_batch_id : $scope.validatedData.currentBatch, format: file_type}).then(function(result){
            //$scope.finalData.objects = result.objects;
        });
    }



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
        $scope.finalData.objects = [];
        $scope.singleMol = CBHCompoundBatch.getSingleMol(projectKey);
         CBHCompoundBatch.saveSingleCompound(projectKey, 
            $scope.molecule.molfile, 
            $scope.molecule.metadata.custom_fields, 
            $scope.molecule.metadata.stereoSelected
            ).then(
            function(data){
                $scope.singleMol = data.data;
                $scope.finalData.objects.push(data.data);
                $scope.validatedData.currentBatch = data.data.multipleBatchId;
               
            }, function(error){
                $scope.validated = { 'errors': { 'invalidMolecule': true } };
            });

    };

    $scope.setupMapping = function(){
                //set up test lists of droppables here
        $scope.dragmodels = {
            selected: null,
            lists: {"headers": []}
        };
        $scope.dropmodels = {
            selected: null,
            lists: [] //will be replaced by database fields
        }
        $scope.binmodels = {
            selected: null,
            lists: { "ignored": [] } //will be replaced by database fields
        }
    }
    $scope.setupMapping();

    

    $scope.messages = MessageFactory.getMessages();

    $scope.saveMultiBatchMolecules = function(){
        CBHCompoundBatch.saveMultiBatchMolecules(projectKey,$scope.validatedData.currentBatch, $scope.molecule.metadata.custom_fields).then(
            function(data){
                /*CBHCompoundBatch.query(projectKey, {multiple_batch_id : $scope.validatedData.currentBatch}).then(function(result){
                    $scope.finalData.objects = result.objects;
                    $scope.finalData.meta = result.meta;
                });*/
            }, function(error){
                $scope.validated = { 'errors': { 'invalidMolecule': true } };
        });
    };

    //for the mapping step of lists of smiles/inchis
    $scope.mapCustomFieldsToMols = function(isFile) {
        var mapping_obj = false;
        if (isFile){
            mapping_obj = $scope.saveCustomFieldMapping();
        }
        
        CBHCompoundBatch.saveBatchCustomFields(projectKey,$scope.validatedData.currentBatch, $scope.molecule.metadata.custom_fields, mapping_obj).then(
            function(data){
                $scope.validatedData = (data.data);
            }, function(error){
                console.log(error);
            }
        );
        
    };

    $scope.paginateNext = function() {
        CBHCompoundBatch.paginate($scope.finalData.meta.next).then(
                function(data) {
                    $scope.finalData.objects = result.objects;
                    $scope.finalData.meta = result.meta;
                }
            );
    }

    $scope.paginatePrev = function() {
        CBHCompoundBatch.paginate($scope.finalData.meta.previous).then(
                function(data) {
                    $scope.finalData.objects = result.objects;
                    $scope.finalData.meta = result.meta;
                }
            );
    }




    $scope.saveCustomFieldMapping = function() {
        //create a new json object containing the drag, drop and bin models as they are
        //pass to the backend to rationalise when reading the file
        //translate appropriate datafields so that they go into custom_fields under the correct parameter. (dropmodels)
        //use others as-is (dragmodels)
        //and do not add the rest (binmodels)
        var mapping_obj = {};
        mapping_obj.new_fields = []
        mapping_obj.remapped_fields = {}
        angular.forEach($scope.dragmodels.lists.headers, function(value, key) {
            mapping_obj.new_fields.push(value.label);
        });
        angular.forEach($scope.dropmodels.lists, function(value) {
            mapping_obj.remapped_fields[value.name] = []
            angular.forEach(value.list, function(i_key) {
                mapping_obj.remapped_fields[value.name].push(i_key.label);    
            });
            
        });

        //mapping_obj.remapped_fields = $scope.dropmodels.lists
        mapping_obj.ignored_fields = $scope.binmodels.lists.ignored

        return mapping_obj;

    };

    //these things

    $scope.updateStrucCol = function(str){
        //If it is a real structure column then try to process the file
        if (str != "Please select"){
            $scope.struc_col_str = str;  
            $scope.processFiles();
        }
        //CBHCompoundBatch.testStructureColumn();      
    }

    $scope.parseHeaders = function() {
        //call service to pull out headers from uploaded file
        //service backend detects file type
        //returns object which is populated into the list for map page
        if ($scope.file_extension=="cdx" || $scope.file_extension=="cdxml"){

        }else{
        $scope.dragmodels.lists.headers = [];
        $scope.setupMapping();
        $scope.file_error = "";

        CBHCompoundBatch.fetchHeaders(projectKey, $scope.uploaded_file_name).then(

            function(data){

                //do something with the returned data
                angular.forEach(data.data.headers, function(value, key) {
                  $scope.dragmodels.lists.headers.push({label: value});
                  $scope.struc_col_options.push({ name:value, value:value});
                });
            }, function(error){
                $scope.headers_not_retrieved = true;
            });

        //call to populate droppable fields
        CBHCompoundBatch.fetchExistingFields(projectKey).then(
            function(data){
                //do something with the returned data
                angular.forEach(data.data.fieldNames, function(value) {
                    //create a blank list for that custom field
                    //"BW_ID", "Formula", "Mass_mg", "MolWeight"
                    value.list = [];
                    $scope.dropmodels.lists.push(value);
                    //now try to automap the headers to the fields
                    
                });
                

            }, function(error){
                console.log(error);
            });

        }
        if (!$scope.isFileExcel()){
            $scope.processFiles();
        }
        
    };


    //convert our molfile or excel file containing smiles into CBHCompoundBatch objects 
    //so they can be used in the validate methods provided for SMILES/InChi lists
    //this method also needs to pass the field mapping from the map page
    $scope.processFiles = function() {
        CBHCompoundBatch.validateFiles(projectKey,$scope.uploaded_file_name, $scope.struc_col_str ).then(
                function(data){
                    $scope.validatedData = data;
                }, function(error){
                    $scope.file_error = "file_not_processed";
                }
            )
    }



    $scope.automap = function() {
        console.log("Automap being called");
        angular.forEach($scope.dropmodels.lists, function(value) {
            //console.log(key);
            angular.forEach($scope.dragmodels.lists.headers, function(hdr, k) {
                if (hdr.label == value.name) {
                    $scope.dragmodels.lists.headers.splice(k, 1);
                    value.list.push(hdr);
                }
            });

        });



        
    };


    $scope.resetMappingForm = function() {
        //put all the draggable fields back to where they came from (assuming no automapping is displayed)
        //loop through binmodels and put back into dragmodels
        angular.forEach($scope.binmodels.lists.ignored, function(value) {
            $scope.dragmodels.lists.headers.push(value);
        });
        $scope.binmodels.lists.ignored = [];
        //loop through dropmodels and put into dragmodels
        angular.forEach($scope.dropmodels.lists, function(value) {
            if (value.list.length == 1){
                $scope.dragmodels.lists.headers.push(value.list[0]);
                value.list = [];
            }
            value.list = [];
        });

    };

    $scope.getMessage = function(lookup_str){
        return MessageFactory.getMessage(lookup_str);

    };

    $scope.isStrucColUnspecified = function() {
        //indicates to the "next" button on mapping files page that the structure column has been specified
        return ($scope.struc_col_str == "");
    }







}]);

app.controller('MessageCtrl', function ($scope){
	

});


