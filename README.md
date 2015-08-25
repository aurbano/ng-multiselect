# Angular Multiselect
Angular directive for multiselect elements with a nice UX.


## Demos
### [Custom Formatting](http://embed.plnkr.co/fVLjq9/preview)

<iframe src="http://embed.plnkr.co/s2GFxXBXf1vderC0XCvP/" height="480" width="100%" style="border:solid 1px #efefef; box-shadow:rgba(0,0,0,0.1) 0 0 20px"></iframe>

### [Dynamic data](http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/)

<iframe src="http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/" height="480" width="100%" style="border:solid 1px #efefef; box-shadow:rgba(0,0,0,0.1) 0 0 20px"></iframe>

### [Custom Template](http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/)

<iframe src="http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/" height="480" width="100%" style="border:solid 1px #efefef; box-shadow:rgba(0,0,0,0.1) 0 0 20px"></iframe>

## Getting started

1. Download [ng-multiselect.js](https://github.com/aurbano/ng-multiselect/blob/master/dist/ng-multiselect.js) and [ng-multiselect.css](https://github.com/aurbano/ng-multiselect/blob/master/dist/ng-multiselect.css) and add to your project. Or get automatically:

    ```bash
    bower install ng-multiselect
    ```

2. Add the module to the app:
    ```js
    angular.module('myApp', ['aurbano.multiselect'])
    ```
3. Profit!

## Usage

Add the element in the view:

```html
<multiselect placeholder="Select users..."
             ms-model="multiselect.selected"
             ms-config="multiselect.config"
             ms-options="multiselect.options">
</multiselect>
```

The parameters are:
* `ms-model`: The model where the selection will be stored.
* `ms-config`: Configuration object to customize the behavior (see below).
* `ms-options`: Array with options to offer.
* `template-url`: [Optional] The URL of a valid Angular template. See [views/ng-multiselect-view.html](https://github.com/aurbano/ng-multiselect/blob/master/views/ng-multiselect-view.html) for the default one.

### Customization
Using the `ms-config` you can pass an object with the following configuration options:

* **`hideOnBlur`**: Only show the dropdown when the input is focused
* **`showSelected`**: Show the elements that have already been selected
* **`itemTemplate`**: function that takes each element from ms-options and returns what should be displayed on the list. It defaults to the element itself. Use sce.trustAsHtml if you want to add custom HTML here.
* **`labelTemplate`**: function that takes each selected element, and displays it on the label list. This goes inside the `<span class="label"></span>`. Use `$sce.trustAsHtml()` if you want to add custom HTML here.

*__Note__: If you change the template using a custom template URL, these options might no longer work.*

#### CSS
Angular Multiselect plays nicely with Bootstrap. If you don't use bootstrap you might want to add CSS to fit the classes used, or specify your own template URL with different ones.

The HTML template used is this:

```html
<div class="multiselect">
    <div class="multiselect-labels">
        <span class="label label-default multiselect-labels-lg"
              ng-repeat="element in msModel">
            <span ng-bind-html="config.labelTemplate(element)"></span>
            <a href="" ng-click="$event.preventDefault(); multiselect.deleteSelected($index)" title="Remove element">
                <i class="fa fa-times"></i>
            </a>
        </span>
    </div>
    <input ng-show="multiselect.options.length > 0"
           placeholder="'+attrs.placeholder+'"
           type="text"
           class="form-control"
           ng-model="multiselect.filter"
           ng-focus="multiselect.focusFilter()"
           ng-blur="multiselect.blurFilter()" />
    <div ng-show="msModel.length < multiselect.options.length && multiselect.options.length === 0 && !multiselect.options.$resolved">
        <em>Loading...</em>
    </div>
    <ul class="dropdown-menu"
        role="menu"
        ng-show="multiselect.displayDropdown && multiselect.options.length > 0">
        <li ng-repeat="element in multiselect.filtered = (multiselect.options | filter:multiselect.filter) track by $index"
            role="presentation"
            ng-class="{active: $index == multiselect.currentElement}">
            <a href=""
               role="menuitem"
               ng-click="$event.preventDefault(); multiselect.selectElement($index)"
               ng-bind-html="config.itemTemplate(element)"></a>
        </li>
    </ul>
</div>
```

-----------
*By [Alejandro U. Alvarez](http://urbanoalvarez.es) - MIT License*

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/ng-multiselect/readme)](https://github.com/aurbano)
