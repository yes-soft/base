(function (angular) {
    'use strict';
    angular.module('yes.ui').config(
        ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
            function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'select2',
                    "plugins/base/templates/forms/select2.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'select2',
                    "plugins/base/templates/forms/select2.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'uploader',
                    "plugins/base/templates/forms/uploader.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'uploader',
                    "plugins/base/templates/forms/uploader.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'gallery',
                    "plugins/base/templates/forms/gallery.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'gallery',
                    "plugins/base/templates/forms/gallery.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'editor',
                    "plugins/base/templates/forms/editor.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'editor',
                    "plugins/base/templates/forms/editor.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'datePicker',
                    "plugins/base/templates/forms/datePicker.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'datePicker',
                    "plugins/base/templates/forms/datePicker.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'dateTimePicker',
                    "plugins/base/templates/forms/dateTimePicker.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'dateTimePicker',
                    "plugins/base/templates/forms/dateTimePicker.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'dateRangePicker',
                    "plugins/base/templates/forms/dateRangePicker.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'dateRangePicker',
                    "plugins/base/templates/forms/dateRangePicker.html"
                );


                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'label',
                    "plugins/base/templates/forms/label.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'label',
                    "plugins/base/templates/forms/label.html"
                );

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'checkboxes-inline',
                    "plugins/base/templates/forms/checkboxes-inline.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'checkboxes-inline',
                    "plugins/base/templates/forms/checkboxes-inline.html"
                );

            }
        ]);

})(angular);