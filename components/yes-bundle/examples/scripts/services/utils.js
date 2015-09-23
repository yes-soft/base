angular.module("yes.utils", ['yes.common']).factory('utils', function () {
    console.log("load utils");
    return {
        "test": true
    };
});