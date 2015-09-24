angular.module('app')
    .controller('app.authority', ['$scope', '$stateParams', 'utils', 'settings',
        function ($scope, $stateParams, utils, settings) {
            var self = $scope;
          //  self.config = {'title': "权限配置"};

            //utils.async("GET", settings.menuApi, {}).then(function (res) {
            //
            //    var data = res.body;
            //    if (!angular.isArray(data)) {
            //        data = data.items;
            //    }
            //    var menus = data.sort(function (a, b) {
            //        return a.order - b.order;
            //    });
            //
            //  //  self.menus = utils.menus.initMenus(settings.menuRoot, menus);
            //});
            // console.log(self.menus);

        }]);