'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:HandsOnCompoundTable
 * @description
 * # HandsOnCompoundTable
 */
angular.module('ngChemApp')
  .directive('handsoncompoundtable', function () {
    return {
      template: '<div id="test"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
                 var data = [
                      {
                        title: "<a href='http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691'>Professional JavaScript for Web Developers</a>",
                        description: "This <a href='http://bit.ly/sM1bDf'>book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.",
                        comments: "I would rate it &#x2605;&#x2605;&#x2605;&#x2605;&#x2606;",
                        cover: "http://ecx.images-amazon.com/images/I/51bRhyVTVGL._SL50_.jpg"
                      },
                      {
                        title: "<a href='http://shop.oreilly.com/product/9780596517748.do'>JavaScript: The Good Parts</a>",
                        description: "This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.",
                        comments: "This is the book about JavaScript",
                        cover: "http://ecx.images-amazon.com/images/I/51gdVAEfPUL._SL50_.jpg"
                      },
                      {
                        title: "<a href='http://shop.oreilly.com/product/9780596805531.do'>JavaScript: The Definitive Guide</a>",
                        description: "<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.",
                        comments: "I've never actually read it, but the <a href='http://shop.oreilly.com/product/9780596805531.do'>comments</a> are highly <strong>positive</strong>.",
                        cover: "http://ecx.images-amazon.com/images/I/51VFNL4T7kL._SL50_.jpg"
                      }
                    ],
                    container1,
                    hot1;



                var container = document.createElement('DIV');
                element[0].appendChild(container);
                hot1 = new Handsontable(container, {
                    data: data,
                    colWidths: [200, 200, 200, 80],
                    colHeaders: ["Title", "Description", "Comments", "Cover"],
                    columns: [
                      
                      {data: "cover", renderer: coverRenderer}
                    ]
                  });
  
              // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
              function strip_tags(input, allowed) {
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
              
                // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
                allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
              
                return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
              }
              
             
              function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value),
                  img;
              
                if (escaped.indexOf('http') === 0) {
                  img = document.createElement('IMG');
                  img.src = value;
              
                  Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                    e.preventDefault(); // prevent selection quirk
                  });
              
                  Handsontable.Dom.empty(td);
                  td.appendChild(img);
                }
                else {
                  // render as text
                  Handsontable.renderers.TextRenderer.apply(this, arguments);
                }
              
                return td;
              }
              


      },
      scope: {}
    };
  });
