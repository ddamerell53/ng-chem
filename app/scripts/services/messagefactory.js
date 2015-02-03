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

    //we can maybe use this factory in the future for amdinistrering / editing messages?
    //move the message text to a backend service?

    var messages = {
        //"home": {
            wizard_intro_text: "To upload multiple compounds you will need a list of SMILES; an InChi key or list of InChi keys; or either a SD or Excel file.",
            projects_help: "Clicking Add Compounds will take you to a wizard where you can add single or batches of compounds from files, SMILES, sketches and InChi keys.",

        //},
        //"add": {
            smiles_or_id_label: "Paste your SMILES or IDs here",
            file_upload_label: "Or upload a file here",
            drawing_label_suppl: "Use the sketcher window to draw your compound. Sketcher window provided by ChemDoodle.",
            //drawing_label: "Draw a molecule here",
            smiles_or_id_help_text: "IDs can be any of the following formats: InCHI, InCHI key, SMILES, CAS numbers, Sigma aldrich catalogue numbers",
            file_upload_help_text: "Chemdraw XML or SD files only",
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
            batch_reg_total_processed_0: "No substances were processed",
            batch_reg_total_processed_1: "One substance was processed and",
            batch_reg_total_processed_other : "{} substances were processed of which",

            batch_reg_new_to_chemreg_0: "No substances are new to ChemBio Hub ChemReg.",
            batch_reg_new_to_chemreg_1 : "One substance is new to ChemBio Hub ChemReg. The first batch of this substance will be registered to this project", 
            batch_reg_new_to_chemreg_other : "{} substances are new to ChemBio Hub ChemReg. Initial batches of these substances will be registered in this project for each of these.",


            batch_prereg_to_project_0: "No substances were already been registered in this project.",
            batch_prereg_to_project_1: "One substance has already been registered in this project. A new batch will be registered for this.",
            batch_prereg_to_project_many: "{} substances have already been registered in this project. New batch will be registered for each of these.",


        //(change)
            batch_prereg_to_public_0: "No substances have already been registered as public.",
            batch_prereg_to_public_1: "One substance was already registered as public. A new batch of this will be registered in this project.",
            batch_prereg_to_public_many: "{} substances have already been registered as public. New batches will be registered in this project for each of these.",

        //(change)
            batch_reg_recent_registration_error: "You have already registered this batch today. Are you sure you wish to continue?",
        //make "conintue" the button icon?
        
        //"finish": {
            registration_success: "$$ [molecules were] registered with the ids and properties shown below",
            registration_none_success: "No molecules were registered",
            registration_error: "An unknown error occurred when registering compounds, the chembiohub team have been notified and will contact you when the issue has been investigated"
        //}:

        



    }

    return MessageFactory;
  });
