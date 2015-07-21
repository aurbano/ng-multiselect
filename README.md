# Angular Multiselect
Angular directive for multiselect elements with a nice UX.

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

### Customization
Using the `ms-config` you can pass an object with the following configuration options:

* **`hideOnBlur`**: Only show the dropdown when the input is focused
* **`showSelected`**: Show the elements that have already been selected
* **`itemTemplate`**: function that takes each element from ms-options and returns what should be displayed on the list. It defaults to the element itself. Use sce.trustAsHtml if you want to add custom HTML here.
* **`labelTemplate`**: function that takes each selected element, and displays it on the label list. This goes inside the `<span class="label"></span>`. Use `$sce.trustAsHtml()` if you want to add custom HTML here.

## Demo
### [Dynamic data](http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/)
<iframe src="http://embed.plnkr.co/TrwUBp1odAYmBPRarK5k/" height="400" width="100%" style="border:solid 1px #efefef; box-shadow:rgba(0,0,0,0.1) 0 0 20px"></iframe>

-----------
*By [Alejandro U. Alvarez](http://urbanoalvarez.es) - MIT License*

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/ng-multiselect/readme)](https://github.com/aurbano)
