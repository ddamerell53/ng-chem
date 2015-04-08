'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CompoundListSetup
 * @description
 * # CompoundListSetup
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .service('CompoundListSetup', [ 'CBHCompoundBatch', '$rootScope', '$stateParams', '$q', 'urlConfig', function (CBHCompoundBatch, $rootScope, $stateParams, $q, urlConfig) {
    
    //var CompoundListSetup = {};
    this.configObject = {};
    this.configObject.projectKey = '';
    this.configObject.compounds = [];
    this.configObject.totalServerItems = 0;
    this.configObject.pagingOptions = {
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1
    };
    this.configObject.filters = {};
    this.configObject.baseUrl = urlConfig.cbh_compound_batches.list_endpoint;
    console.log(urlConfig);
    this.configObject.paramsUrl = "";
    this.configObject.gridOptions = {    data: 'gridconfig.configObject.compounds',
                                                      showColumnMenu:true,
                                                      enableColumnReordering:true,
                                                      totalServerItems: 'gridconfig.configObject.totalServerItems',
                                                      enablePaging: true,
                                                      pagingOptions: this.configObject.pagingOptions,
                                                      showFooter: true,
                                                      enableRowSelection: false,
                                                      enableColumnResize: true,
                                                      enableCellSelection: true,
                                                      rowHeight: 200,
                                                      columnDefs: [//{ field: "smiles", displayName: "Structure", cellTemplate:"views/img-template.html"  },
                                                                    { field: "ctab", displayName: "Structure", width: '20%', cellTemplate:"views/img-template.html", cellClass: 'white-bg' },
                                                                    { field: "chemblId", displayName: "UOx ID", width: '20%', cellTemplate:"<div class='ngCellText'><a ng-click='openSingleMol(row.getProperty(col.field), row.getProperty(\"id\"))'>{{row.getProperty(col.field)}}</a></div>" },
                                                                    { field: "id", displayName: "Batch ID", width: '10%' },
                                                                    { field: "created", displayName: "Added on", cellFilter: 'date', width: '10%' },
                                                                    { field: "createdBy", displayName: "Added by", width: '10%' },
                                                                    { field: "molecularWeight", displayName: "Mol Weight" },
                                                                    { field: "knownDrug", displayName: "Known Drug", visible: false },
                                                                    { field: "stdInChiKey", displayName: "Std InChi Key", visible: false },
                                                                    { field: "medChemFriendly", displayName: "MedChem Friendly", visible: false },
                                                                    { field: "passesRuleOfThree", displayName: "Ro3 Pass", visible: false },
                                                                    { field: "preferredCompoundName", displayName: "Name", visible: false },
                                                                    { field: "molecularFormula", displayName: "Formula", visible: false },
                                                                    { field: "numRo5Violations", displayName: "Ro5 Violations", visible: false },
                                                                    { field: "rotatableBonds", displayName: "Rotatable Bonds", width: '15%' },
                                                                    { field: "acdLogp", displayName: "acdLogp", visible: false }]
                                                };

    this.initializeGridParams = function(project_key, extra_filters) {
        var defer = $q.defer();
        this.configObject.projectKey = project_key;
        var rslt = this.getPagedDataAsync(this.configObject.pagingOptions.pageSize, this.configObject.pagingOptions.currentPage, extra_filters).then(function(result){          
          return result;
        });

        defer.resolve(rslt);
        return defer.promise;
    };

    this.getPagedDataAsync = function (pageSize, page, extra_filters) {
      var defer = $q.defer();
      var offset = parseInt(page - 1) * parseInt(pageSize);
      var coreFilters = {'limit': pageSize, 'offset': offset };

      angular.extend(this.configObject.filters, extra_filters);
      angular.extend(this.configObject.filters, coreFilters);


      var rslt = CBHCompoundBatch.query(this.configObject.projectKey, this.configObject.filters).then(function(result) {
        defer.resolve(result);

        
      });
      return defer.promise;
    };

    this.exportFullResults = function(format) {

      var exportsJson = angular.copy(this.configObject.filters);

      angular.extend(exportsJson, {'format': format, responseType: 'arraybuffer', limit:0, offset: 0});

      var rslt = CBHCompoundBatch.export(exportsJson).then(function(result) {
        var objectUrl = URL.createObjectURL(result);
        window.open(objectUrl, '_self');
        URL.revokeObjectURL(objectURL);
      });
    }
    
    
  }]);
