angular.module('app')
    .controller('app.document.detail', ["$scope", "$stateParams", '$location', 'utils', '$modal',
        function ($scope, $stateParams, $location, utils, $modal) {
            var allPage = {
                paper: {
                    icon: "fa fa-credit-card red",
                    name: " 稿　纸",
                    page: "d.paper"
                },
                content: {
                    icon: "fa yellow fa-flag",
                    name: " 正　文",
                    page: "d.content"
                },
                flows: {
                    icon: "fa pink fa-rocket",
                    name: " 流　程",
                    page: "d.flows"
                },
                countersign: {
                    icon: "fa blue fa-check",
                    name: " 会　签",
                    page: "d.countersign"
                },
                checked: {
                    icon: "fa purple fa-edit",
                    name: " 签　阅",
                    page: "d.checked"
                },
                relevance: {
                    icon: "fa green fa-exchange",
                    name: " 关　联",
                    page: "d.relevance"
                },
                interface: {
                    icon: "fa green fa-exchange",
                    name: " 接　口",
                    page: "d.interface"
                }
            };
            var id = $stateParams.id ? $stateParams.id : $scope.$parent.detailUid;
            var page = $stateParams.page;

            $scope.opinionAction = {
                show: function ($event) {
                    $scope.showOfIdea = true;
                },
                stopPropagation: function ($event) {
                    $event.stopPropagation();
                },
                hide: function () {
                    $scope.showOfIdea = false;
                },
                setOpinion: function (opinion) {
                    $scope.opinion = opinion.memo;
                    $scope.showOfIdea = false;
                },
                add: function () {
                    var val = $scope.newOpinion;
                    if (val) {
                        utils.async("POST", "opinion/add", {"memo": val}, function (res) {
                            $scope.opinions.push(res);
                            $scope.newOpinion = "";
                            $scope.opinion = val;
                        });
                    }
                },
                delete: function (opinion, index) {
                    $scope.opinions.splice(index, 1);
                    utils.async("POST", "opinion/delete", {"unid": opinion.unid});
                }
            };

            var isEdits = ",rcode,dunits,gwnofull,gtlimit,title,dperson,tel,";

            $scope.isReadonly = function (val) {
                return isEdits.indexOf(","+val+",") == -1;
            };

            $scope.btnFlow = function (flow) {
                if (flow == "分发") {
                    var modalInstance = $modal.open({
                        animation: false,
                        size: 'lg',
                        controller: 'app.document.detail.action',
                        templateUrl: 'plugins/document/templates/f.distribute.html',
                        resolve: {
                            res: function () {
                                return $scope.res;
                            }
                        }
                    });
                    modalInstance.result.then(function (selects) {
                        console.log("选中的值:", selects);
                    }, function () {
                    });
                } else {
                    alert("还没做这个流程");
                }
            };

            $scope.link = function () {
                var pageKeys = [];
                pageKeys.push("paper");
                pageKeys.push("content");
                pageKeys.push("flows");
                // if (page == "backlogs") {
                pageKeys.push("countersign");
                // }
                pageKeys.push("checked");
                //if (page == "swbynottransferred") {
                pageKeys.push("relevance");
                pageKeys.push("interface");
                // }
                setPages(pageKeys);

                if ($scope.paper && $scope.paper.button) {
                    $scope.paper.button.forEach(function (btn) {
                        if (btn.indexOf("下一步") != -1) {
                            $scope.hasNextStep = true;
                            utils.async("GET", "opinion").then(function (result) {
                                $scope.opinions = result.opinion;
                            });
                        }
                    });
                }
            };
            function setPages(pageKeys) {
                var pages = [];
                pageKeys.forEach(function (page) {
                    pages.push({
                        icon: allPage[page].icon,
                        key: page,
                        page: "plugins/document/templates/" + allPage[page].page + ".html",
                        name: allPage[page].name
                    });
                });
                $scope.pages = pages;
            }

            function img(res) {
                var data = [];
                res.forEach(function (r) {
                    var css, ram, data, ras;
                    ram = r.source.substr(r.source.indexOf("."));
                    data = ram.split(".");
                    for (var i = 0; i < data.length; i++) {
                        var rem = data[i];
                    }
                    r.houzui = "." + rem;
                    var cssName = {
                        ".xls": "ico ico-file ico-file-2",
                        ".xlsx": "ico ico-file ico-file-2",
                        ".doc": "ico ico-file ico-file-3",
                        ".docx": "ico ico-file ico-file-3",
                        ".ppt": "ico ico-file ico-file-4",
                        ".pptx": "ico ico-file ico-file-4",
                        ".rar": "ico ico-file ico-file-6",
                        ".zip": "ico ico-file ico-file-7",
                        ".html": "ico ico-file ico-file-10",
                        ".js": "ico ico-file ico-file-11",
                        ".xml": "ico ico-file ico-file-12",
                        ".css": "ico ico-file ico-file-12",
                        ".pdf": "ico ico-file ico-file-17",
                        ".txt": "ico ico-file ico-file-22",
                        ".jpg": "ico ico-file ico-file-31",
                        ".gif": "ico ico-file ico-file-32",
                        ".png": "ico ico-file ico-file-33",
                        ".bmp": "ico ico-file ico-file-34"
                    };
                    var ext = r.houzui;
                    if (cssName.hasOwnProperty(r.houzui)) {
                        r.css = cssName[ext];
                    } else {
                        r.css = 'ico ico-file ico-file-1';
                    }

                    data = r.size / 1024;
                    data = parseFloat(data).toFixed(1);
                    if (r.size < 1024) {
                        r.size = r.size + "字节";
                    }
                    if (1 < data < 1024 && r.size > 1024) {
                        r.size = data + "KB";
                    }
                    if (data > 1024) {
                        ras = data / 1024;
                        ras = parseFloat(ras).toFixed(1);
                        r.size = ras + "MB";
                    }
                });
            }

            $scope.init = function () {
                var namespace = [$stateParams.name, page, id].join("/");
                utils.async("GET", namespace).then(function (res) {
                    res = res.body;
                    $scope.res = res;
                    $scope.isEdit = res.isEdit;
                    $scope.paper = res.paper;
                    $scope.lowCenterSW = res.lowCenterSW;
                    $scope.centerSW = res.centerSW;
                    if (res.paper)
                        $scope.deptyj = res.paper.deptyj;
                    $scope.process = res.process;
                    if (res.process)
                        $scope.maintainLog = res.process.maintainLog;
                    if (res.getatm && res.getatm.length > 0) {
                        img(res.getatm);
                    }
                    $scope.getatm = res.getatm;
                    $scope.relation = res.relation;
                    $scope.interface = res.interface;
                    $scope.counterSign = res.counterSign;
                    $scope.flows = res.flows;
                    $scope.countersigns = res.countersigns;
                    $scope.readed = res.readed;
                    $scope.unread = res.unread;
                    $scope.distribute = res.distribute;
                    $scope.status = res.status;
                    $scope.nextStep = res.nextStep;
                    $scope.interface = res.interface;
                    $scope.relevance = res.relevance;
                    $scope.company_paper = res.company_paper;
                    $scope.paperType = res.paperType;
                    $scope.link();
                    //$scope.contentUrl = "static/vendor/officeCtl/officectl.html";
                });
            };
            $scope.tabSelect = function (page) {
                if (!$scope.contentUrl && page.key == "content") {
                    $scope.contentUrl = "plugins/document/templates/officeCtl/officectl.html";
                }
            };
            $scope.action = {
                goContent: function () {
                    window.open("demo.pdf");
                },
                goNextStep: function () {
                    utils.doAction($stateParams.name, "detail", id, "nextStep");
                },
                goDomDiscard: function () {
                    utils.doAction($stateParams.name, "detail", id, "goDomDiscard");
                },
                distribute: function () {
                    utils.doAction($stateParams.name, "detail", id, "distribute");
                },
                transferred: function () {
                    utils.doAction($stateParams.name, "detail", id, "transferred");
                },
                withdrew: function () {
                    utils.doAction($stateParams.name, "detail", id, "withdrew");
                },
                close: function () {
                    $scope.$parent.events.trigger("closeDetail");
                }
            };

            $scope.init();
        }]);