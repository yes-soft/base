angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'group',
                "plugins/base/templates/forms/group.html"
            );
            schemaFormDecoratorsProvider.createDirective(
                'group',
                "plugins/base/templates/forms/group.html"
            );
        }
    ]);

angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {


            var datetimepicker = function(name, schema, options) {
                if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key  = options.path;
                    f.type = 'datetimepicker';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(datetimepicker);


            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'datetimepicker',
                "plugins/base/templates/forms/datetimepicker.html"
            );
            schemaFormDecoratorsProvider.createDirective(
                'datetimepicker',
                "plugins/base/templates/forms/datetimepicker.html"
            );
        }
    ]);