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
 */
angular.module('aurbano.multiselect', []).directive('multiselect', function() {
    return {
        restrict: 'E',
        scope: {
            msModel: '=',
            msOptions: '=',
            msConfig: '=',
            msChange: '&'
        },
        replace: true,
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

                $scope.format = {
                    item: function(){
                        if(typeof($scope.multiselect.options) === 'undefined'){
                            return [];
                        }
                        return $scope.multiselect.options.map($scope.config.itemTemplate);
                    },
                    label: function(){
                        if(typeof($scope.msModel) === 'undefined'){
                            return [];
                        }
                        return $scope.msModel.map($scope.config.labelTemplate);
                    }
                };
            }
        ],
        link: function(scope, element, attrs){
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
            //var template = $(elem).find('template');
            return  '<div class="multiselect">' +
                    '   <div class="multiselect-labels">' +
                    '       <span class="label label-default multiselect-labels-lg" ng-repeat="element in format.label()">' +
                    '           <span ng-bind-html="element"></span>' +
                    '           <a href="" ng-click="multiselect.deleteSelected($index)" title="Remove element">' +
                    '               <i class="fa fa-times"></i>' +
                    '           </a>' +
                    '       </span>'+
                    '   </div>' +
                    '   <input placeholder="'+attrs.placeholder+'" type="text" class="form-control" ng-model="multiselect.filter" ng-focus="multiselect.focusFilter()" ng-blur="multiselect.blurFilter()" />' +
                    '   <ul class="dropdown-menu" role="menu" ng-show="multiselect.displayDropdown">' +
                    '       <li ng-repeat="element in multiselect.filtered = (multiselect.options | filter:multiselect.filter) track by $index" role="presentation" ng-class="{active: $index == multiselect.currentElement}">' +
                    '           <a href="" role="menuitem" ng-click="multiselect.selectElement($index)" ng-bind-html="config.itemTemplate(element)"></a>' +
                    '       </li>' +
                    '   </ul>' +
                    '</div>';
        }
    };
});
