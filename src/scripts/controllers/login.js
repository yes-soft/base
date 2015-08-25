angular.module('app')
    .controller('app.login.index', ['$scope', '$stateParams', '$location', '$resource', 'utils', 'ENV','toastr',
        function ($scope, $stateParams, $location, $resource, utils, ENV,toastr) {

            $scope.filter = {};

            $scope.login = function () {
                utils.async("POST", ENV.apiPath + "/login", $scope.filter).then(function (res) {
                    //  console.log(res);
                    localStorage.setItem("displayName", res.body.displayName || res.body.name);
                    localStorage.setItem("username", $scope.filter.username);
                    localStorage.setItem("password", $scope.filter.password);
                    var hash = decodeURIComponent($location.search()["return"]);
                    if (hash)
                        location.hash = hash;
                    $location.search("return", null);

                }, function (err) {
                    toastr.error("用户名或者密码不正确！",{
                        timeOut:3000
                    });
                    utils.alert(err.message);
                });
            };
        }
    ]);