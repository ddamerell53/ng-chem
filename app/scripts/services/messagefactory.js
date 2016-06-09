'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.MessageFactory
 * @description
 * # MessageFactory
 * Factory class providing simple access to system messages. Each message is stored with a unique key inside a JSON object 
 * so that it can be referenced and reused in the front end and also by the angular-info-box library. 
 * Messages are stored in sections appropriate for their usage.
 * @returns {object} MessageFactory the factory object with access to the methods.
 */
angular.module('chembiohubAssayApp')
  .factory('MessageFactory', function (){

    var MessageFactory = {}

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.MessageFactory#MessageFactory.getMessage
     * @methodOf chembiohubAssayApp.MessageFactory
     * @description
     * Get the message from the internal messages. if it's there return it, else return an empty string to avoid null pointers.
     * @param {string} lookup_str  The key of the message to be retrieved.
     *
     */
    MessageFactory.getMessage = function(lookup_str) {

      if(messages[lookup_str]){
        return messages[lookup_str];
        //we will elaborate on this to pluralize, add specified numbers etc - get this simple lookup working first
      }
      else {
        return "";
      }

    }

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.MessageFactory#MessageFactory.getMessages
     * @methodOf chembiohubAssayApp.MessageFactory
     * @description
     * Get the message object containing all messages. Used to pass through to another library or method which may be unable to directly access the factory.
     *
     */
    MessageFactory.getMessages = function(){
        return messages;
    }

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.MessageFactory#MessageFactory.getLegends
     * @methodOf chembiohubAssayApp.MessageFactory
     * @description
     * Get the legends object containing all legends. Used to pass through to another library or method which may be unable to directly access the factory.
     *
     */
    MessageFactory.getLegends = function() {
        return legends;
    }

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.MessageFactory#MessageFactory.getStatuses
     * @methodOf chembiohubAssayApp.MessageFactory
     * @description
     * Get the statuses object containing all statuses. Used to pass through to another library or method which may be unable to directly access the factory.
     *
     */
    MessageFactory.getStatuses = function() {
        return statuses;
    }

    /**
     * @ngdoc method
     * @name chembiohubAssayApp.MessageFactory#MessageFactory.getUploadActions
     * @methodOf chembiohubAssayApp.MessageFactory
     * @description
     * Get the upload_actions object containing all upload_actions strings. Used to pass through to another library or method which may be unable to directly access the factory.
     *
     */
    MessageFactory.getUploadActions = function() {
        return upload_actions;
    }

    //we can maybe use this factory in the future for administering / editing messages?
    //move the message text to a backend service?

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.MessageFactory#messages
     * @propertyOf chembiohubAssayApp.MessageFactory
     * @description
     * Object which holds key value pairs of system messages.
     *
     */
    var messages = {
        //"home": {
            wizard_intro_text: "To upload multiple compounds you will need a list of SMILES; an InChI key or list of InChI keys; or either a SD, ChemDraw or Excel file.",
            projects_help: "If you believe you should have access to projects not shown or the functions available for each are not what you expect, contact your administrator",
            project_list_filter_help: "Narrow down the project list using this quick search box. Results will filter on project name and will match any part of the name, not just from the start.",
            plate_list_filter_help: "Narrow down the plate list using this quick search box. Results will filter on plate name and description.",

        //},
        //"add": {
            drawing_label_suppl: "Sketcher window provided by ChemDoodle.",
            drawing_label: "Draw your molecule here",
            file_upload_help_text: "Excel(xlsx), ChemDraw xml or SD files are accepted. For more detailed information, see the Help section.",
            assay_file_upload_help_text: "Excel(xlsx) are accepted. For more detailed information, see the Help section.",
            assay_file_use_template: "The system assumes that you are using data created from one of the available downloadable templates. Please ensure you have used this or your data may not map properly.",
            ids_not_processed: "No SMILES or InChI identifiers could be processed, please check the format, remove any spaces and try again.",
            
            file_error: "File cannot be processed even though the format appears valid. If you have questions please contact the ChemBio Hub team.",
            file_format_error: "File cannot be processed, the format is invalid. Files must be xlsx, cdxml, cdx or sdf format and labelled as such.",
            file_too_large: "File contains too many records to be able to process in one action - please consider splitting your input file into smaller parts or asking your administrator to increase the file size limits.",
            oops: "Oops, should not have got here, if you have not pressed back on the browser, gone to an outdated bookmark or lost your data by refreshing please let the AssayReg team know. Click cancel to restart.",

        //},
        //"map": {
            mapping_fields_help: "Drag column fields from your file to the appropriate custom mapping, or leave undragged to create a new custom field with that name.",
        //},

        //"batch_reg":{
            edit_mode_unavailable_projects: "You cannot add single and edit at the same time. Edit and Add are only available when editing one project at a time where you have editor rights on that project.",

            edit_mode: "When in Edit mode, individual fields can be edited using the pencil icon and data can be filled down like in Excel. Edit and Add are only available when searching for one project at a time where you have editor rights on that project.",
            batch_reg_total_processed_0: "No substances were processed.",
            batch_reg_total_processed_1: "One substance was processed and:",
            batch_reg_total_processed_other : "substances were processed of which:",

            batch_reg_new_to_chemireg_other : "We check all of the projects you have access to to get this total.  If the number is zero it means all of your compounds already exist in AssayReg.",           
            batch_prereg_to_public_single: "This substance is valid and was already registered as public.  A new private batch of this will be registered in this project.",
            batch_prereg_to_project_single: "This substance is valid and was already registered to this project.  A new private batch of this will be registered in this project.",
            batch_reg_new_to_chemireg_single: "This substance is not publically registered in ChemBio Hub AssayReg. The first batch of this substance will be registered to this project.",

        //(change)
            batch_overlaps: "Number of substances which have already been registered. New private batches will be registered in this project for each of these.",
            smiles_field: "Each line of data will be interpreted as a separate SMILES or InChI identifier. If you would like to be able to register compounds with a different type of identifier, please let the ChemBio Hub team know.",
            batch_duplicates: "Duplicate structures (with identical InChI keys).",
            batch_errors_single: "Number of errors in processing the molecule, possibly due to invalid valency",
            batch_errors_other: "Number of molecules could not be processed and will be ignored. They are located at positions ",
            field_errors_other: "Number of errors when attempting to map the fields in your uploaded data to the fields in AssayReg.",
        //(change)
            batch_reg_recent_registration_error: "You have already registered this batch today. Are you sure you wish to continue?",
        //make "conintue" the button icon?
        
        //"finish": {
            registration_success: "No batches were registered with the ids and properties shown below",
            registration_none_success: "No molecules were registered",
            registration_error: "An unknown error occurred when registering compounds, the ChemBio Hub team have been notified and will contact you when the issue has been investigated.",
        //}:
            justSaved: "This data was recently saved, click start again or go back to the project page.",

            //mapped from existing freetext fields
            image_more_details: "Click the image for more details about that molecule",
            unmapped_values_written: "Any unmapped values will be written anyway.  User should contact administrator if they want the field to be available to the whole project.",
            mapped_values_written: "Mapped values will be written to the specified field against the project.  User should contact administrator if they want extra project fields.",
            total_values: "Total number of records submitted.",
            valid_structure_values: "Records with a valid structure as interpreted by AssayReg. If this result is zero for an Excel file you may need to identify the SMILES field below.",
            no_valid_structure_values: "Records with no valid structure as interpreted by AssayReg. This type of record can still be registered and searched for inventory management purposes.",
            error_total_values: "Data records that contain errors and cannot be processed. Check your input data and the info column below.",
            inchi_matching: "Compounds submitted have been compared to each other using their InChI key to detect duplicate structures and stereoisomers.",
            new_to_chemireg: "Compounds or items not previously registered to this project. These compounds or items may be present in other projects.",
            project_match_values: "Some of your compounds or items are already registered to this project. New batches of these compounds or items will be created in this project.",
            chemireg_match_values: "Some duplicate compounds have been detected in your data.",
            duplicate_count_values: "No duplicate compounds have been detected in your data.",

            project_data_field_download: "Download records from the table in Excel or SDF format. Note that the export function is only available when one project is selected and you are an editor of that project.",


    }

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.MessageFactory#statuses
     * @propertyOf chembiohubAssayApp.MessageFactory
     * @description
     * Object which holds key value pairs of system statuses.
     *
     */
    var statuses = {
        status_1: {
            name: "New",
            explanation: "The data has not been added to any project you have access to previously."
        },
        status_2: {
            name: "Duplicated record",
            explanation: "This data has been added previously with the exact same fields and values to this project."
        },
        status_3: {
            name: "Could not generate InChi",
            explanation: "For compound records, this indicates that the structure was recognised but contains bond types which are incompatible with the way we generate UOX IDs."
        },
        status_4: {
            name: "Data not processable",
            explanation: "For compound records in ChemDraw or SDF format, this indicates that the structure was incompatible with our conversion software and could not be recognised in the format inputted."
        },
        status_5: {
            name: "SMILES not processable",
            explanation: "For compound records in Excel format, the autodetected SMILES column for this record contained an invalid SMILES string and could not be processed."
        },
        status_6: {
            name: "Overlap",
            explanation: "For compound records, this indicates that an identical structure has been added to the system previously with different metadata or by another user where you have permission to see their uploaded data."
        },
    }

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.MessageFactory#upload_actions
     * @propertyOf chembiohubAssayApp.MessageFactory
     * @description
     * Object which holds key value pairs of system upload action messages.
     *
     */
    var upload_actions = {
        action_1 : {
            name: "New Batch",
            explanation: "This record will be added to the database when you click 'Save these records'"
        },
        action_2 : {
            name: "Ignore",
            explanation: "This record will not be added to the database when you click 'Save these records'. Records which are automatically set to 'Ignore' contain incorrect or unprocessable structural data. You can choose to add these records as blinded compounds - the structural position will be ignored but a record will be created containing any additional data fields associated with the structure."
        }
    }

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.MessageFactory#legends
     * @propertyOf chembiohubAssayApp.MessageFactory
     * @description
     * Object which holds key value pairs of system legends (for documenation images and explanations).
     *
     */
    var legends = {
        legend_uox_id: {
            name: "UOx ID",
            explanation: "A unique identifier for this compound in this project. For each UOx ID there can be multiple batches."
        },
        legend_batch_id: {
            name: "Batch ID",
            explanation: "A sample of this compound - each time you re-register a compound you get a new batch. Batch IDs will soon be sequential per UOx ID. For each UOx ID there can be multiple batches"
        },
    }

    return MessageFactory;
  });
