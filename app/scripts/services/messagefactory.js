'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.MessageFactory
 * @description
 * # MessageFactory
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
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
            wizard_intro_text: "To upload multiple compounds you will need a list of SMILES; an InChi key or list of InChi keys; or either a SD, Chemdraw or Excel file.",
            projects_help: "Clicking Add Compounds will take you to a wizard where you can add single or batches of compounds from files, SMILES, sketches and InChi keys.",

        //},
        //"add": {
            smiles_or_id_label: "Paste your SMILES or IDs here",
            file_upload_label: "Or upload a file here",
            drawing_label_suppl: "Sketcher window provided by ChemDoodle.",
            drawing_label: "Draw your molecule here",
            smiles_or_id_help_text: "IDs can be any of the following formats: InCHI, InCHI key, SMILES, CAS numbers, Sigma aldrich catalogue numbers",
            file_upload_help_text: "Excel(xlsx), Chemdraw XML or SD files are accepted. For more detailed information, see the Help section",
            drawing_help_text: "Draw the molecule you would like to register. If salts or hydrates are required, draw these as neutral molecules alongside",
            sd_invalid: "The SD file uploaded was not of a valid format, please verify",
            cdmxl_invalid: "The Chemdraw XML file uploaded was not of a valid format, please verify",
            mol_success: "$$ [records were] succesfully digitised as displayed below",
            sd_mol_invalid: "The molecules at lines line in the sd file were not valid due to valency or similar errors, please check and re-upload",
            cdmxl_mol_invalid: "The molecule in the uploaded file was not of a valid format due to valency errors or miscelaneous non-chemical content",
            drawing_mol_invalid: "The drawn molecule was not of a valid format due to valency errors or miscelaneous non-chemical content",
            mol_pains_hits_warning: "$$ [molecules are] classified as Pan Assay Interference Compounds - are you sure you wish to register these?",
            mol_pains_hits_success: "No molecules are classified as Pan Assay Interference Compounds",
            mol_pains_hits_tooltip: null,
            no_headers: "Headers could not be retrieved from the uploaded file, please check the format and try again.",
            no_data: "No data to process was found in the file, please check the file and try again.",
            ids_not_processed: "No Smiles or Inchi identifiers could be processed, please check the format, remove spaces and try again.",
            
            file_error: "File cannot be processed even though the format apears valid, if you have questions please contact the chembiohub team.",
            file_format_error: "File cannot be processed, the format is invalid. Files must be XLSX, cdxml, cdx or sdf format and labelled as such.",
            total_batches: "The total numer of records added in this file or dataset",
            oops: "Oops, should not have got here, if you have not pressed back on the browser, gone to an outdated bookmark or lost your data by refreshing please let the ChemReg team know. Click cancel to restart.",

        //},
        //"map": {
            map_label: "Map the fields in your SD file to those in the registration system",
            help_text: "Known fields have already been mapped, other fields that you would like displayed should be dragged to the 'other' section",
            mapping_fields_help: "Drag column fields from your file to the appropriate custom mapping, or leave undragged to create a new custom field with that name.",
            source_id_label: "Checking for re-uploaded source ids for these molecules",
            source_id_none_success: "No source id specified",
            source_id_success: "No re-uploaded molecules found",
            source_id_error: "$$ [molecules were] found with existing records in the database - ignore or re-upload with a different id",
        //},
        //"validate": {
            validate_label: "We have standardised the format the substances added, here are the results",
            metals_label: "Breaking any bonds to group I or II metals",
            metals_none_success: "No bonds to group I or II metals were found",
            metals_success: "$$ group I or II metals had their [bonds] removed",
            tautomer_label: "Standardising structural tautomers",
            tautomer_redraw_none_success: "No tautomers were redrawn",
            tautomer_redraw_success: "Tautomers or charge-separated systems were redrawn as shown for search purposes",
            neutralise_and_salts_label: "Checking for salts or charges",
            neutralise_and_salts_none_success: "No salts or charges to neutralise were found",
            neutralise_success: "$$ [salts were] found, these were neutralised and the salt was removed for the default search",
            isotope_label: "Checking for isotopic labelling",
            isotope_none_success: "No isotopically labelled compounds were found, if you were expecting one or more, please check your drawings",
            isotope_success: "$$ [records were] found with isotopes and the structures were standardised as shown, if you were expecting more - please check your drawings",
            isotope_error: "$$ [records were] found with errors in the isotope layer, pick an action for each molecule",
            stereochemistry_label: "Removing stereochemistry for default search",
            stereochemistry_none_success: "No specific enantiomers found",
            stereochemistry_error: "$$ [records were] re-drawn to enable search, molecules will be registered as the drawn enantiomer",
        //},

        //"batch_reg":{
            substance_submission_rules: "When a new molecule is registered to ChemBioHub ChemReg a substance record and a batch record are generated. For existing substances a new batch will be created unless the substance is private and in another project*.  Private substance records and associated batch records can only be viewed by members of the project. Once a substance record is made public, additional batches of the substance may be added in any project by any user. *The creation a new substance record for a substance that already exists in ChemReg is possible (but not advised).",
            batch_reg_total_processed_0: "No substances were processed.",
            batch_reg_total_processed_1: "One substance was processed and:",
            batch_reg_total_processed_other : "substances were processed of which:",

            batch_reg_new_to_chemreg_other : "We check all of the projects you have access to to get this total.  If the number is zero it means all of your compounds already exist in ChemReg.",           
            batch_without_structure: "Number of substances which do not have a chemical structure against them.",

            batch_prereg_project_doesnt_allow: "This substance is valid and was already registered. A new batch cannot be registered due to project restrictions.",

            batch_prereg_to_public_single: "This substance is valid and was already registered as public.  A new private batch of this will be registered in this project.",
            batch_prereg_to_project_single: "This substance is valid and was already registered to this project.  A new private batch of this will be registered in this project.",
            batch_reg_new_to_chemreg_single: "This substance is not publically registered in ChemBio Hub ChemReg. The first batch of this substance will be registered to this project.",

        //(change)
            batch_overlaps: "Number of substances which have already been registered. New private batches will be registered in this project for each of these.",
            file_too_large: "File larger than hte current maximum size of 1000 compounds. Support for larger files is coming soon. Please contact the ChemBio Hub team if you need to do large uploads.",
            file_types : ".xlsx, .sdf, .cdx and .cdxml files are currently supported by chemreg. In Excel files the structure column should be in SMILES and the headers should be at the top of the dataset. Data should be on the first worksheet of the workbook. When registering salts via chemdraw it is importeant to use the \"group\" feature to ensure the salt is interpretted as a single record. If you would like to be able to register a different file type, please let the chembiohub team know.",
            smiles_field: "Each line of data will be interpretted as a separate SMILES or INCHI identifier. If you would like to be able to register compounds with a different type of identifier, please let the chembiohub team know.",
            batch_duplicates: "Duplicate structures (with identical INCHI keys).",
          

            batch_errors_0: "No errors were found",
                        batch_errors_single: "Number of errors in processing the molecule, possibly due to invalid valency",

            batch_errors_1: "1 of the molecules could not be processed and will be ignored. It is located at position ",
            batch_errors_other: "Number of molecules could not be processed and will be ignored. They are located at positions ",
            field_errors_other: "Number of errors when attempting to map the fields in your uploaded data to the fields in chemreg.",
        //(change)
            batch_reg_recent_registration_error: "You have already registered this batch today. Are you sure you wish to continue?",
        //make "conintue" the button icon?
        
        //"finish": {
            registration_success: "No batches were registered with the ids and properties shown below",
            registration_none_success: "No molecules were registered",
            registration_error: "An unknown error occurred when registering compounds, the chembiohub team have been notified and will contact you when the issue has been investigated.",
        //}:
            justSaved: "This data was recently saved, click start again or go back to the project page.",

            //mapped from existing freetext fields
            image_more_details: "Click the image for more details about that molecule",
            unmapped_values_written: "Any unmapped values will be written anyway.  User should contact administrator if they want the field to be available to the whole project.",
            mapped_values_written: "Mapped values will be written to the specified field against the project.  User should contact administrator if they want extra project fields.",
            total_values: "This is the total number of records that have been submitted via the form above.",
            valid_structure_values: "These records have a valid structure as interpretted by chemreg based upon the data you have provided. If this result is zero for an Excel file you will need to 'map' your SMILES field below.",
            no_valid_structure_values: "These records have no valid structure as interpretted by chemreg based upon the data you have provided. When registered this type of record can still be searched and can be used for inventory management.",
            error_total_values: "These structures contain errors and cannot be processed - check your input data and the info column below.",
            inchi_matching: "The compounds submitted have been matched up against each-other using what is known as an INCHI key to give the total number of unique compounds. This should pick out identical structures taking into account any stereochemical features represented by the input data.",
            new_to_chemreg: "ChemReg has not registered these compounds in this project. They may be present in other projects but currently to migrate a compound, you re-register it.",
            project_match_values: "Some of these compounds have structural matches within this project so will be assigned as a new batch of that compound.",
            chemreg_match_values: "Some compounds are duplicated within the submitted data based upon matching using the INCHI chemical identifier.",
            duplicate_count_values: "No compounds are duplicated within the submitted data based upon matching using the INCHI chemical identifier.",


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
