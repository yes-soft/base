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
            }
        ]);

    angular.module('yes.ui').config(
        ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
            function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'uploader',
                    "plugins/base/templates/forms/uploader.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'select2',
                    "plugins/base/templates/forms/uploader.html"
                );
            }
        ]);

})(angular);