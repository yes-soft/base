angular.module('app')
    .controller('app.login', ['$scope', '$stateParams', '$location', 'utils', 'settings','toastr',
        function ($scope, $stateParams, $location, utils, settings ,toastr) {
            $scope.filter = {};
            $scope.login = function () {
                if($scope.filter.username == null || $scope.filter.username == ""){
                    toastr.warning("用户名不能为空!");
                    return;
                }
                if($scope.filter.password == null || $scope.filter.password == ""){
                    toastr.warning("密码不能为空!");
                    return;
                }

                utils.async("POST", settings.apiPath + "/login", $scope.filter).then(function (res) {
                    localStorage.setItem("displayName", res.body.displayName || res.body.name);
                    localStorage.setItem("username", $scope.filter.username);
                    localStorage.setItem("password", $scope.filter.password);
                    var hash = decodeURIComponent($location.search()["return"]);
                    if (hash)
                        location.hash = hash;
                    $location.search("return", null);
                }, function (err) {
                    toastr.warning(err.message);
                });
            };
        }
    ]);