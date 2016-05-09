'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.FlowFileFactory
 * @description
 * # FlowFileFactory
 * Factory which provides convenient, parameterised access to file-related web service endpoints.
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} object Object containing keyed $resource objects
 */
angular.module('chembiohubAssayApp')
  .factory('FlowFileFactory', [ '$resource', 'urlConfig', function ($resource, urlConfig){
    
    /**
     * @ngdoc property
     * @name chembiohubAssayApp.FlowFileFactory#cbhFlowfile
     * @propertyOf chembiohubAssayApp.FlowFileFactory
     * @description
     * Resource alias for accessing the FlowFile API for data upload with option to pull back a single file by ID.
     * @param {string} [fileId] unique ID for a FlowFile object
     */
    var cbhFlowfile = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_flowfiles/:fileId', {fileId: '@fileId'});

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.FlowFileFactory#cbhAttachments
     * @propertyOf chembiohubAssayApp.FlowFileFactory
     * @description
     * Resource alias for accessing the FlowFile API for file attachments with option to pull back a single file by ID.
     * @param {string} flowfile unique ID for a FlowFile object
     */
    var cbhAttachments = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_attachments', {
      flowfile: urlConfig.instance_path.url_frag + 'datastore/cbh_flowfiles/' + '@flowfile',
      data_point_classification:  "@data_point_classification",
      chosen_data_form_config: "@chosen_data_form_config",
      sheet_name: "@sheetname",
    });

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.FlowFileFactory#cbhBaseAttachment
     * @propertyOf chembiohubAssayApp.FlowFileFactory
     * @description
     * Part of the old assayreg implementation - now deprecated
     * @deprecated
     * @param {string} flowfile unique ID for a FlowFile object
     */
    var cbhBaseAttachment = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_base_attachments', {
      flowfile: urlConfig.instance_path.url_frag + 'datastore/cbh_flowfiles/' + '@flowfile',
      data_point_classification:  "@data_point_classification",
    });

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.FlowFileFactory#cbhSaveAttachment
     * @propertyOf chembiohubAssayApp.FlowFileFactory
     * @description
     * Part of the old assayreg file upload API - left here by way of example code but not currently used.
     * @deprecated
     */
    var cbhSaveAttachment = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_attachments/save_temporary_data/', {sheetId: '@sheetId'})

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.FlowFileFactory#cbhChemFlowFile
     * @propertyOf chembiohubAssayApp.FlowFileFactory
     * @description
     * Resource for accessing file attachment files for individual batch records. Optional parameter (identifier) to pull back a single file.
     * @param {string} identifier angular library for constructing webservice calls from URLs.
     */
    var cbhChemFlowFile = $resource(urlConfig.instance_path.url_frag + 'cbh_flowfiles/:identifier', {identifier: '@identifier'});

    return {

      "cbhFlowfile": cbhFlowfile,
      "cbhAttachments": cbhAttachments,
      "cbhSaveAttachment": cbhSaveAttachment,
      "cbhBaseAttachment": cbhBaseAttachment,
      "cbhChemFlowFile": cbhChemFlowFile,


    }

    
  }]);
