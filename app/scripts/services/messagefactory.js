'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.MessageFactory
 * @description
 * # MessageFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('MessageFactory', function (){
    // Service logic
    // ...

    var MessageFactory = {}

    MessageFactory.getMessage = function(lookup_str) {
      //get the message from the internal messages
      //if it's there return it
      //else return an empty string so that the i is not displayed if there is no message
      if(messages[lookup_str]){
        return messages[lookup_str];
        //we will elaborate on this to pluralize, add specified numbers etc - get this simple lookup working first
      }
      else {
        //return "Message could not be found, please check config"
        return "";
      }

    }
    MessageFactory.getMessages = function(){
        return messages;
    }
    MessageFactory.getLegends = function() {
        return legends;
    }

    //we can maybe use this factory in the future for amdinistrering / editing messages?
    //move the message text to a backend service?

    var messages = {
        //"home": {
            wizard_intro_text: "To upload multiple compounds you will need a list of SMILES; an InChI key or list of InChI keys; or either a SD, ChemDraw or Excel file.",
            projects_help: "Clicking Add Compounds or Add Items will take you to a new page where you can add single compounds/items or batches of compounds/items from files, SMILES or InChI keys.",

        //},
        //"add": {
            drawing_label_suppl: "Sketcher window provided by ChemDoodle.",
            drawing_label: "Draw your molecule here",
            file_upload_help_text: "Excel(xlsx), ChemDraw xml or SD files are accepted. For more detailed information, see the Help section.",
            ids_not_processed: "No SMILES or InChI identifiers could be processed, please check the format, remove any spaces and try again.",
            
            file_error: "File cannot be processed even though the format appears valid. If you have questions please contact the ChemBio Hub team.",
            file_format_error: "File cannot be processed, the format is invalid. Files must be xlsx, cdxml, cdx or sdf format and labelled as such.",
            oops: "Oops, should not have got here, if you have not pressed back on the browser, gone to an outdated bookmark or lost your data by refreshing please let the AssayReg team know. Click cancel to restart.",

        //},
        //"map": {
            mapping_fields_help: "Drag column fields from your file to the appropriate custom mapping, or leave undragged to create a new custom field with that name.",
        //},

        //"batch_reg":{
            edit_mode_unavailable_projects: "Edit mode is only available when editing one project at a time where you have editor rights on that project.",

            edit_mode: "When in Edit mode, individual fields can be edited using the pencil icon and data can be filled down like in Excel. Edit mode is only available when editing one project at a time where you have editor rights on that project.",
            batch_reg_total_processed_0: "No substances were processed.",
            batch_reg_total_processed_1: "One substance was processed and:",
            batch_reg_total_processed_other : "substances were processed of which:",

            batch_reg_new_to_chemreg_other : "We check all of the projects you have access to to get this total.  If the number is zero it means all of your compounds already exist in AssayReg.",           
            batch_prereg_to_public_single: "This substance is valid and was already registered as public.  A new private batch of this will be registered in this project.",
            batch_prereg_to_project_single: "This substance is valid and was already registered to this project.  A new private batch of this will be registered in this project.",
            batch_reg_new_to_chemreg_single: "This substance is not publically registered in ChemBio Hub AssayReg. The first batch of this substance will be registered to this project.",

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
            new_to_chemreg: "Compounds or items not previously registered to this project. These compounds or items may be present in other projects.",
            project_match_values: "Some of your compounds or items are already registered to this project. New batches of these compounds or items will be created in this project.",
            chemreg_match_values: "Some duplicate compounds have been detected in your data.",
            duplicate_count_values: "No duplicate compounds have been detected in your data.",

            project_data_field_download: "Download records from the table in Excel or SDF format, or a summary of the required data fields for this project. This document gives an indication as to the type of data expected for each field (date, text etc.) and the allowed values for multiple value fields.",


    }

    var legends = {
        legend_uox_id: {
            name: "UOx ID",
            explanation: "A unique identifier for this compound in this project. For each UOx ID there can be multiple batches."
        },
        // legend_alogp: {
        //     name: "alogP",
        //     explanation: "Legend text for alogp"
        // },
        // legend_rotatable_bonds: {
        //     name: "Rotatable Bonds",
        //     explanation: "Legend text for Rotatable BondsLegend text for Rotatable BondsLegend text for Rotatable BondsLegend text for Rotatable BondsLegend text for Rotatable Bonds"
        // },
        legend_batch_id: {
            name: "Batch ID",
            explanation: "A sample of this compound - each time you re-register a compound you get a new batch. Batch IDs will soon be sequential per UOx ID. For each UOx ID there can be multiple batches"
        },
        // legend_medchem_friendly: {
        //     name: "MedChem Friendly",
        //     explanation: "Legend text for MedChem Friendly"
        // },
        //create more in this format here
    }

    return MessageFactory;
  });
