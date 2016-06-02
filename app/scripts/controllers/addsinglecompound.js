'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl
 * @description
 * # AddsinglecompoundCtrl
 * This controller is used to power the registration of compounds via the Chemdoodle sketcher. It creates a batch containing a single record, mirroring an SD file containing one record, 
 * so that the same validation, temporary data  and saving pathways can be used.
 */
angular.module('chembiohubAssayApp')
    .controller('AddSingleCompoundCtrl', ['$scope', '$rootScope', '$timeout', '$filter', '$state', '$stateParams', 'CBHCompoundBatch', 'ProjectFactory', 'MessageFactory', 'mol', 'projectList','FlowFileFactory', 
        function($scope, $rootScope, $timeout, $filter, $state, $stateParams, CBHCompoundBatch, ProjectFactory, MessageFactory, mol, projectList, FlowFileFactory) {

            //need a combination of the initial setup of the add compounds page and the edit part of the single mol popup
            var project_key = $stateParams.project_key;
              $scope.clonedMol = angular.copy(mol);
                    
                    $scope.mol = angular.copy(mol);
                    $scope.mol.molecule = $scope.mol.ctab;
                    $scope.mol.id = null;
                 if($scope.clonedMol.id){
                    $scope.idToClone = $scope.clonedMol.id;
                 }else{
                    $scope.idToClone = null;
                 }


            /* File attachment functions */

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.success
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Call a POST command to save the uploaded attachment file's URL and unique identifier against the batch record.
             * and also the saved record. This function is injected into the angular schema form file upload widget.
             * @param {object} file  the FlowFile object to be uploaded
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             *
             */
            $scope.success = function(file, form_key) {
                //apply the urls of the flowfile object to the correct custom field of $scope.mol.custom_fields - find the attachments array and add it
                //put a new method in FlowFileFactory

                //TODO handle error here
                var AttachmentFactory = FlowFileFactory.cbhChemFlowFile;
                AttachmentFactory.get({
                    'identifier': file.uniqueIdentifier
                }, function(data) {
                    //add this to attachments in the form element (find it by form key in mol.custom_fields)
                    var downloadUri = data.download_uri
                    var attachment_obj = {
                        url: downloadUri,
                        printName: file.name,
                        mimeType: file.file.type,
                    }
                    $scope.mol.custom_fields[form_key[0]].attachments.push(attachment_obj)

                })

            };

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.removeFile
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Remove a file from the list of uploaded files on a File Upload field's attachments object. This is to remove it from the display
             * and also the saved record. This function is injected into the angular schema form file upload widget.
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             * @param {integer} index  the position of the upoaded file in the attachments list
             * @param {string} url  the URL fo the file to be used as a condition check for removal.
             *
             */
            $scope.removeFile = function(form_key, index, url) {
                $scope.mol.custom_fields[form_key[0]].attachments = $filter('filter')($scope.mol.custom_fields[form_key[0]].attachments, function(value, index) {
                    return value.url !== url; })
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.sizeCheck
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Check an uploaded file for attachment is less than 20Mb. File is removed from the upload queue if it exceeds this limit.
             * This function is injected into the angular schema form file upload widget.
             * @param {object} file  the FlowFile object to be checked for file size limits
             * @param {string} form_key  the identity of the form, allowing multiple forms on the page to use this function
             * @returns {boolean} boolean  false returned if validation fails
             *
             */
            $scope.sizeCheck = function(file, form_key){
                
                //get the file
                if (file.size > 20000000) {
                    //cancel the file
                    file.flowObj.removeFile(file);
                    //get the form element ad change the validation message, mark as invalid
                    alert("This system has a file size limit of 20Mb per file. Please try with a smaller file.");
                    return false;
                    

                }
                
            }
            

            $scope.editMode = false;

            $scope.cbh.statename = $state.current.name;


            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.revert
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Revert the drawn compound back to the cloned version,
             * broadcast setMolecule in order to update the directive for chemdoodle
             *
             */
            $scope.revert = function(){
                $scope.mol = angular.copy($scope.clonedMol);
                $scope.mol.molecule = $scope.mol.ctab;
                $scope.mol.id = null;
                if(!$scope.idToClone){
                    $scope.mol.molecule = "";
                    $scope.mol.ctab = "";
                }
                $rootScope.$broadcast("setMolecule");
                $scope.errormess = "";   
                $scope.dataReady = false;
                $scope.dataset = undefined;           
            }

            $scope.errormess = "";  
            $scope.doArchiveItem = false;
            $scope.dataReady = false;
            $scope.compoundBatches = {data:[], 
                sorts:[],
                excluded: [],
                redraw: 0,
                columns: []};
            var orderBy = $filter('orderBy');

            var projid = project_key;
            $scope.projectWithCustomFieldData;

            angular.forEach(projectList.objects, function(myproj) {
                if (myproj.project_key === projid) {
                    $scope.projectWithCustomFieldData = myproj;
                    $scope.projectObj = myproj;
                }
            });


            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * The name openedTaggingDropdown is defined in the schema of the data addition UI for tag fields
             * This function pulls back the dropdown autocomplete from the back end and sends it to the appropriate directive via a broadcast
             * @param {string} openedTaggingDropdown  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("openedTaggingDropdown", function(event, args){
                var filters = {};
                filters.pids = $scope.projectObj.id;
                
                filters.autocomplete_field_path = "custom_fields." + args.key;
                filters.autocomplete = args.autocomplete;
                CBHCompoundBatch.queryv2(filters).then(function(result) {
                    $rootScope.$broadcast("autoCompleteTaggingData", result);
                });
                
            })

            var myform = $scope.projectWithCustomFieldData.schemaform.form;

            var len = Math.ceil(myform.length / 2);

            $scope.myform = angular.copy(myform);
            angular.forEach($scope.myform, function(item) {
                        item['feedback'] = "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }";
                        item['disableSuccessState'] = true;

                    });
            $scope.$on("moleculeChanged", function(){
                $scope.dataReady = false;
                $scope.dataset = undefined;
            });


        /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.createMultiBatch
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Create a multiple batch object based on a drawing in the add single page (this is currently doen with multiple batches for consistency but would probaly be better done with single compounds)
             *
             */


            $scope.createMultiBatch = function(){
                $scope.currentlyLoading = true;
                CBHCompoundBatch.createMultiBatch(
                    $scope.dataset).then(
                        function(data){
                            $scope.currentlyLoading = false;
                            $scope.filesInProcessing = false;
                            $scope.dataset.config = data.data;
                            $scope.dataReady = true;
                            //$scope.compoundBatches.uncuratedHeaders = data.data.headers;
                           

                            //$scope.imageCallback();
                            $scope.compoundBatches.data =data.data.objects;
                            $scope.compoundBatches.savestats = data.data.savestats;
                            //$scope.totalCompoundBatches = data.data.batchstats.total;


                            //Here we change the URL without changing the state
                             /*$state.go ($state.current.name, 
                                    {"mb_id" : $scope.dataset.config.multiplebatch,
                                    "project_key": $stateParams.project_key}, 
                                    { location: true, 
                                        inherit: false, 
                                        relative: $state.$current, 
                                        notify: true });*/
                            // $stateParams.mb_id = $scope.datasets[$scope.current_dataset_id].config.multiplebatch;

                            //returns a multiple batch id and a status
                            //Run a second get request to get a list of compounds
                        },
                        function(error){
                            
                            $scope.dataset.config.errors = [MessageFactory.getMessage("data_not_processed")];
                            
                            $scope.dataset.config.status = "add";
                            $scope.dataReady = false;
                            $scope.currentlyLoading = false;

                 }); 
            }

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.validateDrawn
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Validate the valancies etc of the drawn molecule by sending it to the back end.
             * This could be better accomplished with the new chemical search API.
             */
            $scope.validateDrawn  = function(){
                //validate the drawn compound using the same mechanism as validation from file
                var conf = {
                        "multiplebatch": null,
                        "sketch": $scope.mol.molecule,
                        "type": "sketch",
                        "custom_fields": $scope.mol.custom_fields,
                        "supplementaryFields": $scope.mol.supplementaryFields,
                        "project_key" : project_key,
                        "struccol" : "",
                        "state" : "validate"};
                //also need to get the project and supplementary field data through
                $scope.dataset = {
                    "config": conf,
                    "cancellers" : []
                };
                $scope.createMultiBatch();
                $scope.$broadcast("schemaFormValidate");
            }
            
            //validation of form happens here
            
            //should also do basic form validation as well
            


            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.validateOtherFormData
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @param {object} myForm form object which needs validating
             * @description
             * Standard schemaform submission code for validation of the custom fields when saving a molecule.
             * Buttons that do not want this onSubmit function to run but are inside the form are implemented as <button type="button"></button>
             */
            $scope.validateOtherFormData = function(myForm){
                $scope.errormess = "";
                //this step is necessary to ensure that required fields have data
                //and for validation check on the form as a whole to fail if required fields are missing
                //don't look for this in the angular schema form examples - it's not there...
                $scope.$broadcast("schemaFormValidate");
                if(myForm.$valid && !myForm.$pristine){
                    $scope.saveTemporaryCompoundData();
                }
                else if(myForm.$pristine){
                    $scope.errormess = "You must add some data before you can submit your form.";
                }
                else {
                    $scope.errormess = "You have required fields missing or incorrect data - please correct these and try again.";
                }
                //TODO: account for string being too long for text field length (1028 chars)

            };




            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.saveTemporaryCompoundData
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Save single molecule and redirect the user to the search page
             */
            $scope.saveTemporaryCompoundData = function(){
                $scope.currentlyLoading = true;
                $scope.dataset.config.custom_fields = $scope.mol.custom_fields;
                var callback = function(){

                    $scope.cbh.justAdded = true;
                $state.transitionTo("cbh.searchv2", 
                                        {encoded_query: $filter("encodeParamForSearch")({"field_path": "multiple_batch_id", "value": $scope.dataset.config.multiplebatch + ""}), 
                             pids : [$scope.projectObj.id]},
                            { location: true, 
                                            inherit: false, 
                                            relative: null, 
                                            notify: true }
                                        );
                }
                CBHCompoundBatch.saveMultiBatchMolecules($scope.dataset.config).then(
                        function(data){
                            $scope.cbh.hideSearchForm=true;
                            if($scope.idToClone && $scope.doArchiveItem){
                               $scope.clonedMol.properties.archived = "true";
                               $scope.clonedMol.project_key = $scope.projectWithCustomFieldData.project_key;
                               CBHCompoundBatch.patch($scope.clonedMol).then(function(data) {
                                    CBHCompoundBatch.reindexModifiedCompound(data.id).then(function(reindexed) {
                                        callback();
                                    });
                                }, function(error){
                                    $scope.currentlyLoading = false;
                                });
                                
                            }else{
                                callback();
                            }
                            
                            
                            

                        }, function(error){
                            $scope.currentlyLoading = false;
                        }
                    )       
            }


            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.addSupplementaryField
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Add an extra supplementary data field when editing a molecule's data
             */
            $scope.addSupplementaryField = function(){
            	//do we have any supplementary fields already?
            	if ($scope.mol.supplementaryFields.length > 0){
            		//order the supplementary fields by id
            		$scope.mol.supplementaryFields = orderBy($scope.mol.supplementaryFields, 'id');
            		//get the last item in the list's ID
            		angular.forEach($scope.mol.supplementaryFields, function(supField, sindex){
            			
            			if (sindex == ($scope.mol.supplementaryFields.length - 1)){
            				//increment that number by 1
            				var newId = (supField.id + 1);
            				//create a new object with that ID
	            			//push to supplementaryFields
            				$scope.mol.supplementaryFields.push({
								id: newId,
								name: "",
								value: "",
							});
            			}
            		});
	            	
	            	
            	}
            	else {
            		//add the first one
					$scope.mol.supplementaryFields.push({
						id: 0,
						name: "",
						value: "",
					});          		
            	}
            	
            };



            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:AddSingleCompoundCtrl#$scope.removeSupplemetaryField
             * @methodOf chembiohubAssayApp.controller:AddSingleCompoundCtrl
             * @description
             * Remove a supplementary data field when editing a molecule's data
             * @param {int} removeId  The id of the field to be removed
             */
            $scope.removeSupplemetaryField = function(removeid){
            	//pop item with this ID from supplementary fields

            	var itemToRemove = $filter('filter')($scope.mol.supplementaryFields, {id: removeid}, true);
            	$scope.mol.supplementaryFields.splice( $scope.mol.supplementaryFields.indexOf(itemToRemove[0]), 1 );
            }
            $scope.myschema = angular.copy($scope.projectWithCustomFieldData.schemaform.schema);


    }]);