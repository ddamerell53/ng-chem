'use strict';

//http://bahmutov.calepin.co/inject-valid-constants-into-angular.html


var lightApp = angular.module('lightApp', [
        'angular-underscore/filters', 
    'schemaForm', 
    'pascalprecht.translate', 
    'ui.select', 
    'ui.sortable'
  ]);

/**
 * @ngdoc overview
 * @name index
 * @description
 * ## Welcome to the ShowYourWorking angular API docs

 This documentation provides detailed information of methods involved in the front end app for ShowYourWorking.

These are screens of the main views of the application and will hopefully provide a useful shortcut to parts of the app you may wish to examine.

###<a name="project-list">Project list</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/project-list.png) 

| I want to look at... | I need to go to... |
|------|------------|
| 1. Where the project list comes from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Project-API#get-projects">GET Projects to list all projects</a> |
| 2. Adding a new project | <a href="#add-project">Add New Project modal</a> |
| 3. Changing permissions on a project | <a href="#proj-permissions">Change permissions modal</a> |
| 4. Adding data to a project | <ul><li><a href="#add-single">add a single record</a></li><li><a href="#add-multiple">add multiple records</a></li></ul> |
| 5. Finding your data | <a href="#search-results">Search page</a> |


The default project types are the ones that are loaded during the "setupdatabase_and_index" script. In order to change these, use the django admin. Project types are meant to be the "base classes" from which users build the fields of their projects. This can be used to keep the number of field definitions manageable.

If you wish to set up a template for a project type to prepopulate the fields, find the custom field config id of the other project you want to attach to the project type and put that ID into the admin interface for the new project type.

In the skinningconfig admin it is possible to change some of the default configuration of the app as described below:

    File errors from backend    -> Whether the file upload message should be the backend exception or not
    Enable smiles input         -> Whether there should be a SMILES input box
    Data manager email          -> Contact details for who to email if you have a problem with the system.
    Data manager name

###<a name="add-project">Add a new project or edit an existing project</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/add-new-proj.png) 

For more information on how projects are saved, see <a href="https://github.com/thesgc/chembiohub_ws/wiki/Project-API#post-project">POST Project to create a project</a>

| I want to look at... | I need to go to... |
|------|------------|
| 1. Where the project types come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Project-Type-API#get-project-types">GET Project Types</a> |
| 2. Where the project fields come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Tabular-Data-Schema-API">Tabular Data Schema API</a> |

###<a name="proj-permissions">Change permissions on a project</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/proj-permissions.png) 

| I want to look at... | I need to go to... |
|------|------------|
| 1. Where the different permissions come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Project-Permission-API#get-project-permissions">GET Project Permissions</a> |
| 2. Where the users come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/User-API#get-users">GET Users</a> |

###<a name="add-single">Add a single record</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/add-single.png) 

| I want to look at... | I need to go to... |
|------|------------|
| 1. Where the chemical sketcher comes from | (link) |
| 2. How chemistry validation happens | <a href="https://github.com/thesgc/chembiohub_ws/blob/master/cbh_chem_api/compounds.py#L951">Compound addition API</a> |
| 3. Where the project fields come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Tabular-Data-Schema-API">Tabular Data Schema API</a>  |

###<a name="add-multiple">Add multiple records from a file</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/add-multiple.png) 

For a full description of the flow of importing data from file, please see <a href="https://github.com/thesgc/chembiohub_ws/wiki/Data-Import">Data Import</a>.

| I want to look at... | I need to go to... |
|------|------------|
| 1. How the file gets uploaded | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Flow-File-and-Download-API#post-flowfile-when-uploading">POST FlowFile (When Uploading)</a> |
| 2. How data validation happens | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Bulk-Upload-API#post-validate-files">POST Validate Files</a> |
| 3. Where the temporary results come from and how they are displayed | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Bulk-Upload-API#get-list-of-temp-batches">GET List of Temp Batches</a> |
| 4. Where the chemical image comes from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Chemical-Search-API#get-chemical-search">GET Chemical Search</a> |
| 5. Where the decision of new/existing batches happens | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Bulk-upload-validation-response-attributes">Bulk upload validation response attributes</a> |
| 6. Where the headers come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Tabular-Data-Schema-API">Tabular Data Schema API</a>  |

###<a name="data-mapping">Mapping new fields to existing data fields</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/data-mapping.png) 

| I want to look at... | I need to go to... |
|------|------------|
| 1. Where the column options come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Tabular-Data-Schema-API">Tabular Data Schema API</a>   |
| 2. How the mapping takes place | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Bulk-Upload-API#post-update-multiple-batch-custom-fields">POST Update Multiple Batch Custom Fields</a> |

###<a name="search-results">Search Results page</a>

![](https://raw.githubusercontent.com/thesgc/chembiohub_ws/master/wiki-images/Overview-Screengrabs/search-list.png) 

| I want to look at... | I need to go to... |
|------|------------|
| 1. How the project filter works | <a href="https://github.com/thesgc/chembiohub_ws/wiki/The-ChemBio-Hub-Search-API-and-its-configuration#project-selector">Search API - Project Selector</a> |
| 2. How the column filters work | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Search-and-Sort-JSON-Format">Search and Sort JSON Format</a> |
| 3. How edit mode works | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Compound-Batch-API#patch-compound-or-inventory-batch">PATCH Compound or Inventory Batch</a> |
| 4. WHere the column headers come from | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Tabular-Data-Schema-API">Tabular Data Schema API</a>   |
| 5. How clone a record works | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Bulk-Upload-API#post-update-temp-batches">POST Update Temp Batches</a> |
| 6. How the cells are renderered | <ul><li><a href="http://showyourworking.github.io/docs/#/api/chembiohubAssayApp.directive:handsoncompoundtablev2">Handsoncompoundtablev2 Angular directive</a></li><a href="http://showyourworking.github.io/docs/#/api/chembiohubAssayApp.service:renderers">renderers Angular service</a><li></li></ul> |
| 7. How export works | <a href="https://github.com/thesgc/chembiohub_ws/wiki/Data-Export">Data Export</a> |


 * 
 */
var chembiohubAssayApp =  angular.module('chembiohubAssayApp', [
    'chemdoodleAngular',
    'lightApp',
    'ngAnimate',
    // 'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngGrid',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ui.ace',
    'dndLists',
    'flow',
    'ngClipboard',
    'ngRaven',
    'angular-underscore/filters', 
    'schemaForm', 
    'pascalprecht.translate', 
    'ui.select', 
    'ui.sortable',
    'angularUtils.directives.dirPagination',
    'angular-info-box',
    'elasticui',
    'schemaForm-file-upload',
    //'schemaForm-chemdoodle',
    'xeditable',
  ]);
