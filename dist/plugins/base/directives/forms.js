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

                var uploader = function(name, schema, options) {
                    if (schema.type === 'string' && schema.format == 'uploader') {
                        var f = schemaFormProvider.stdFormObj(name, schema, options);
                        f.key  = options.path;
                        f.type = 'uploader';
                        options.lookup[sfPathProvider.stringify(options.path)] = f;
                        return f;
                    }
                };

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

})(angular);