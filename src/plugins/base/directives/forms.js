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
                    'uploader',
                    "plugins/base/templates/forms/uploader.html"
                );
            }
        ]);
    
    angular.module('yes.ui').config(
            ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
                function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

                    schemaFormDecoratorsProvider.addMapping(
                        'bootstrapDecorator',
                        'gallery',
                        "plugins/base/templates/forms/gallery.html"
                    );
                    schemaFormDecoratorsProvider.createDirective(
                        'gallery',
                        "plugins/base/templates/forms/gallery.html"
                    );
                }
            ]);

    angular.module('yes.ui').config(
        ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
            function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

                schemaFormDecoratorsProvider.addMapping(
                    'bootstrapDecorator',
                    'editor',
                    "plugins/base/templates/forms/editor.html"
                );
                schemaFormDecoratorsProvider.createDirective(
                    'editor',
                    "plugins/base/templates/forms/editor.html"
                );
            }
        ]);

})(angular);