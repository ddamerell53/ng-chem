'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.searchUrlParams
 * @description
 * # searchUrlParams
 * Provider in the ngChemApp.
 */


angular.module('ngChemApp')
    .factory('searchUrlParams', function($filter) {

        // Private variables

        // Private constructor

        var SearchUrlParams = {};



        SearchUrlParams.setup = function(stateParams, searchForm) {

            function setStructure(key) {
                searchForm.molecule.molfile = stateParams[key];
                // $rootScope.searchMolfile = $stateParams[key];
                if (stateParams[key].indexOf("ChemDoodle") < 0) {
                    searchForm.smiles = stateParams[key];
                }
            };

            searchForm.molecule.molfileChanged = function() {};
            searchForm.fpValue = stateParams.fpValue;
            searchForm.dateStart = stateParams.created__gte;
            searchForm.dateEnd = stateParams.created__lte;
            if (angular.isDefined(stateParams.project__project_key__in)) {
                searchForm.project__project_key__in = stateParams.project__project_key__in.split(",");
            }
            if (stateParams.search_custom_fields__kv_any) {
                searchForm.search_custom_fields__kv_any = stateParams.search_custom_fields__kv_any.split(",");;
            } else {
                searchForm.search_custom_fields__kv_any = [];
            }
            if (stateParams.related_molregno__chembl__chembl_id__in) {
                var items = stateParams.related_molregno__chembl__chembl_id__in.split(",");

                searchForm.related_molregno__chembl__chembl_id__in = stateParams.related_molregno__chembl__chembl_id__in.split(",");
            }
            if (stateParams.functional_group) {
                searchForm.functional_group = stateParams.functional_group;
            }
            var myschema = {};
            var myform = {};
            if (stateParams.with_substructure) {
                searchForm.substruc = "with_substructure";
                setStructure("with_substructure");

            } else if (stateParams.flexmatch) {
                searchForm.substruc = "flexmatch";
                setStructure("flexmatch");

            } else if (stateParams.similar_to) {
                searchForm.substruc = "similar_to";
                setStructure("flexmatch");

            } else {
                searchForm.substruc = "with_substructure";
            }
            return this.fromForm(searchForm);
      }

      SearchUrlParams.fromForm = function(searchForm){

            var params = {}
            if (searchForm.project__project_key__in) {
                params["project__project_key__in"] = searchForm.project__project_key__in.join(",");
            }
            if (searchForm.related_molregno__chembl__chembl_id__in) {
                params["related_molregno__chembl__chembl_id__in"] = searchForm.related_molregno__chembl__chembl_id__in.join(",");
            } else {
                delete params.related_molregno__chembl__chembl_id__in;
            }
            //it would be great to automagically populate a pasted smiles string into the sketcher
            //for now though, just send the smiles to the web service
            if (searchForm.functional_group) {
                params["functional_group"] = searchForm.functional_group;
            }

            if (searchForm.smiles) {
                params[searchForm.substruc] = searchForm.smiles;
            } else if (searchForm.molecule && searchForm.molecule.molfile != "") {
                params[searchForm.substruc] = searchForm.molecule.molfile
            }

            if (!angular.equals([], searchForm.search_custom_fields__kv_any) && angular.isDefined(searchForm.search_custom_fields__kv_any)) {
                //var encodedCustFields = btoa(JSON.stringify(searchForm.custom_fields));
                var encodedCustFields = searchForm.search_custom_fields__kv_any.join(",");
                params.search_custom_fields__kv_any = encodedCustFields;
            }

            if (searchForm.dateStart) {
                var formattedStart = $filter('date')(searchForm.dateStart, 'yyyy-MM-dd');
            }
            if (searchForm.dateEnd) {
                var formattedEnd = $filter('date')(searchForm.dateEnd, 'yyyy-MM-dd');
            }
            //params.created__range = "(" +  formattedStart + "," + formattedEnd + ")";
            params.created__gte = formattedStart;
            params.created__lte = formattedEnd;


            var stateUrl = "/search?";

            //we now need to put the parameters we've generated from this search into a string which can be used as filters by the export options.
            //the export will not tolerate present but empty params so we have to only add them if they are present.
            var func_group_frag = (searchForm.functional_group) ? ("functional_group=" + encodeURIComponent(searchForm.functional_group) + "&") : "";
            var project_frag = (searchForm.project__project_key__in) ? ("project__project_key__in=" + searchForm.project__project_key__in.join(",") + "&") : "";
            var flexmatch_frag = (params.flexmatch) ? ("flexmatch=" + encodeURIComponent(params.flexmatch) + "&") : "";
            var with_substructure_frag = (params.with_substructure) ? ("with_substructure=" + encodeURIComponent(params.with_substructure) + "&") : "";
            var similar_to_frag = (params.similar_to) ? ("similar_to=" + encodeURIComponent(params.similar_to) + "&") : "";
            var fpValue_frag = (params.fpValue) ? ("fpValue=" + params.fpValue + "&") : "";
            var created__gte_frag = (params.created__gte) ? ("created__gte=" + params.created__gte + "&") : "";
            var created__lte_frag = (params.created__lte) ? ("created__lte=" + params.created__lte + "&") : "";
            // var smiles_frag = (params.smiles) ? ("smiles=" + params.smiles + "&") : "";
            var cust_field_frag = (encodedCustFields) ? ("search_custom_fields__kv_any=" + encodedCustFields + "&") : "";
            var related_molregno__chembl__chembl_id__in_frag = (params.related_molregno__chembl__chembl_id__in) ? ("related_molregno__chembl__chembl_id__in=" + params.related_molregno__chembl__chembl_id__in + "&") : "";
            var paramsUrl = project_frag + func_group_frag + flexmatch_frag + related_molregno__chembl__chembl_id__in_frag + with_substructure_frag + similar_to_frag + fpValue_frag + created__gte_frag + created__lte_frag + cust_field_frag;



            return {
                "searchForm": searchForm,
                "params": params,
                "paramsUrl": paramsUrl
            };

        };

        return SearchUrlParams;

        // Public API for configuration


    });