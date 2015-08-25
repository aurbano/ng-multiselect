/**
 * Angular Multiselect
 * Directive for multiselect fields, with labels for the selected items
 *
 * Usage:
 * <multiselect placeholder="Placeholder for the input"
 *              ms-model="model"
 *              ms-options="select options"
 *              ms-config="configObject"
 *              ms-change="changeFunction(newVal, oldVal)"/>
 *
 * ms-config takes an object with the following optional options (all booleans are false by default):
 *      - hideOnBlur: Only show the dropdown when the input is focused
 *      - showSelected: Show the elements that have already been selected
 *      - itemTemplate: function that takes each element from ms-options and returns what should be displayed on the list.
 *                      defaults to the element itself. Use sce.trustAsHtml if you want to add custom HTML here.
 *      - labelTemplate: function that takes each selected element, and displays it on the label list. This goes inside the
 *                       <span class="label"></span>. Use sce.trustAsHtml if you want to add custom HTML here.
 *
 * @author Alejandro U. Alvarez
 * @homepage https://github.com/aurbano/ng-multiselect
 */
angular.module('aurbano.multiselect', [])
  .directive('multiselect', ['$compile', '$templateCache', function($compile, $templateCache) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            msModel: '=',
            msOptions: '=',
            msConfig: '=',
            msChange: '&'
        },
        controller: ['$scope',
            function($scope){
                /* -------------------------------- *
                 *      Configuration defaults      *
                 * -------------------------------- */
                $scope.config = $scope.msConfig;
                if(typeof($scope.config) === 'undefined'){
                    $scope.config = {};
                }
                if(typeof($scope.config.itemTemplate) === 'undefined'){
                    $scope.config.itemTemplate = function(elem){
                        return elem;
                    };
                }
                if(typeof($scope.config.labelTemplate) === 'undefined'){
                    $scope.config.labelTemplate = function(elem){
                        return elem;
                    };
                }
                if(typeof($scope.config.modelFormat) === 'undefined'){
                    $scope.config.modelFormat = function(elem){
                        return elem;
                    };
                }
                $scope.$watch('msOptions', function(){
                    _filterOptions();
                });

                /* -------------------------------- *
                 *          Multiselect setup       *
                 * -------------------------------- */
                if($scope.msModel === null || typeof($scope.msModel) === 'undefined'){
                    $scope.msModel = [];
                }
                if($scope.msOptions === null || typeof($scope.msOptions) === 'undefined'){
                    $scope.msOptions = [];
                }
                $scope.multiselect = {
                    filter: '',
                    filtered: [],
                    options: $scope.msOptions,
                    displayDropdown: true,
                    deleteSelected: function(index){
                        var oldVal = angular.copy($scope.msModel);

                        $scope.msModel.splice(index, 1);

                        $scope.msChange({
                            newVal: $scope.msModel,
                            oldVal: oldVal
                        });

                        _filterOptions();
                    },
                    selectElement: function(index){
                        var oldVal = angular.copy($scope.msModel);

                        $scope.msModel.push($scope.multiselect.filtered[index]);

                        $scope.msChange({
                            newVal: $scope.msModel,
                            oldVal: oldVal
                        });

                        $scope.multiselect.filter = '';

                        _filterOptions();
                    },
                    focusFilter: function(){
                        $scope.multiselect.currentElement = 0;
                        if($scope.config.hideOnBlur){
                            $scope.multiselect.displayDropdown = true;
                        }
                    },
                    blurFilter: function(){
                        $scope.multiselect.currentElement = null;
                        if($scope.config.hideOnBlur){
                            $scope.multiselect.displayDropdown = false;
                        }
                    },
                    currentElement: null
                };

                if($scope.config.hideOnBlur){
                    $scope.multiselect.displayDropdown = false;
                }

                /* -------------------------------- *
                 *           Helper methods         *
                 * -------------------------------- */

                var _filterOptions = function(){
                    if($scope.msModel === null){
                        $scope.multiselect.options = $scope.msOptions;
                        return;
                    }
                    $scope.multiselect.options = $scope.msOptions.filter(function(each){
                        return $scope.msModel.indexOf(each) < 0;
                    });
                };
            }
        ],
        link: function(scope, element, attrs){
            //element.html('<div ng-include="ng-multiselect-view.html"></div>');
            if(!attrs.templateUrl){
              var template = '<div class="multiselect">' +
                             '    <div class="multiselect-labels">' +
                             '         <span class="label label-default multiselect-labels-lg" ng-repeat="element in msModel">' +
                             '             <span ng-bind-html="config.labelTemplate(element)"></span>' +
                             '             <a href="" ng-click="$event.preventDefault(); multiselect.deleteSelected($index)" title="Remove element">' +
                             '                 <i class="fa fa-times"></i>' +
                             '             </a>' +
                             '          </span>'+
                             '    </div>' +
                             '    <input ng-show="multiselect.options.length > 0" placeholder="'+attrs.placeholder+'" type="text" class="form-control" ng-model="multiselect.filter" ng-focus="multiselect.focusFilter()" ng-blur="multiselect.blurFilter()" />' +
                             '    <div ng-show="msModel.length < multiselect.options.length && multiselect.options.length === 0 && !multiselect.options.$resolved"><em>Loading...</em></div>'+
                             '    <ul class="dropdown-menu" role="menu" ng-show="multiselect.displayDropdown && multiselect.options.length > 0">' +
                             '      <li ng-repeat="element in multiselect.filtered = (multiselect.options | filter:multiselect.filter) track by $index" role="presentation" ng-class="{active: $index == multiselect.currentElement}">' +
                             '        <a href="" role="menuitem" ng-click="$event.preventDefault(); multiselect.selectElement($index)" ng-bind-html="config.itemTemplate(element)"></a>' +
                             '      </li>' +
                             '    </ul>' +
                             '</div>';
              var templateWrapped = '<script type="text/ng-template" id="ng-multiselect-view.html">' +
                                      template +
                                    '</script';
              
              $compile(templateWrapped)(scope);
              element.after(templateWrapped);

              $templateCache.put('ng-multiselect-view.html', template);
            }

            // Compile the container
            //$compile(element)(scope);
            
            //Pass the attributes to the template
            scope.attrs = attrs;
            element.on('keydown', function(e){
                var code = e.keyCode || e.which;
                switch(code){
                    case 40: // Down arrow
                        scope.$apply(function(){
                            scope.multiselect.currentElement++;
                            if(scope.multiselect.currentElement >= scope.multiselect.filtered.length){
                                scope.multiselect.currentElement = 0;
                            }
                        });
                        break;
                    case 38: // Up arrow
                        scope.$apply(function(){
                            scope.multiselect.currentElement--;
                            if(scope.multiselect.currentElement < 0){
                                scope.multiselect.currentElement = scope.multiselect.filtered.length - 1;
                            }
                        });
                        break;
                    case 13: // Enter
                        scope.$apply(function(){
                            scope.multiselect.selectElement(scope.multiselect.currentElement);
                        });
                        break;
                    default:
                        scope.$apply(function(){
                            scope.multiselect.currentElement = 0;
                        });
                }
            });
        },
        template: function(elem, attrs){
          var url = attrs.templateUrl || 'ng-multiselect-view.html';
          return '<div ng-include="\''+url+'\'"></div>';
        }
    };
}]);