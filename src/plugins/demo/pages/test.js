define([], function () {
    "use strict";
    angular.module('app')
        .controller('app.demo.test', ['$scope',
            function ($scope) {

                //$scope.step1 = {name: 'step1', ok: true};
                //
                //$scope.step2 = {name: 'step2', ok: false};


                var self = $scope;


                self.init = function () {  // init 只运行一次.

                    // ..... todo ;
                    self.load();
                };


                self.action = {  // 绑定按钮操作行为.


                };

                // self.items  =    // 变量绑定.

                self.load = function () {  // load 回绑数据, 刷新数据.


                };


                self.init();

            }
        ]);
});