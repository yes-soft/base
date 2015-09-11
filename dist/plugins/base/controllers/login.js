angular.module('app')
    .controller('app.login', ['$scope', '$stateParams', '$location', 'utils', 'settings',
        function ($scope, $stateParams, $location, utils, settings) {

            $scope.filter = {};

            $scope.login = function () {
                utils.async("POST", settings.apiPath + "/login", $scope.filter).then(function (res) {
                    //  console.log(res);
                    localStorage.setItem("displayName", res.body.displayName || res.body.name);
                    localStorage.setItem("username", $scope.filter.username);
                    localStorage.setItem("password", $scope.filter.password);
                    var hash = decodeURIComponent($location.search()["return"]);
                    if (hash)
                        location.hash = hash;
                    $location.search("return", null);

                }, function (err) {
                    utils.alert(err.message);
                });
            };
        }
    ]);