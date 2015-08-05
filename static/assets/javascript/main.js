(function ($) {

    var tabcontent = $('#page_content'), yesmenus = $('.yesmenus'), deFun = ['self'];
    var formatStr = /\{([\s\S]+?)\}/g;
    String.prototype.format = function () {
        var me = this, args = (typeof arguments[0] === 'object')
            ? arguments[0]
            : arguments;
        return me.replace(formatStr, function (m, i) {
            return m == "{{}" || m == "{}}" ? i : args[i];
        });
    };
    String.prototype.len = function () {
        var len = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len++;
        }
        return len;
    };
    /**
     * 时间对象的格式化;
     */
    Date.prototype.format = function (format) {
        /*
         * eg:format="yyyy-MM-dd hh:mm:ss";
         */
        var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
            // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

// 自定jquery插件
    $.fn.extend({
        sl: function () {
            $(this).append(yestpl.loading);
        },
        cl: function (flag) {
            var me = this;
            $(me).find('div.widget-box-layer').remove();
        },
        isChildOf: function (b) {
            return this.parents(b).length > 0;
        },
        isChildAndSelfOf: function (b) {
            return this.closest(b).length > 0;
        },
        yestree: function (opts) {
            var yestree = this;
            var cfg = {
                url: ''//加载数据地址
            };
            cfg.url = $(yestree).attr("url");
            $.extend(cfg, opts);

            yestree.load = function (liObj) {
                var curID = '';
                var clsUl = $('.treebody ul');
                if (liObj) {
                    var liID = liObj.attr('rel');
                    var liData = liObj.data(liID);
                    curID = liData['c_id'];
                    clsUl = liObj.children('ul');
                }
                if (clsUl.html() != '') {
                    return;
                }
                var data;
                yesajax.get({
                    url: cfg.url.format(curID),
                    async: false,
                    owndeal: true,
                    callback: function (rdata) {
                        data = rdata;
                    }
                });
                if (!data.List || data.List.length == 0) {
                    return;
                }
                var clsStr = '<li rel="{0}" cname="{5}"><a class="{1}"><span class="menu-text">{2}</span>{3}</a>{4}</li>';
                $.each(data.List, function (i, it) {
                    var leafCls = "";
                    var downImg = "";
                    var childCls = "";
                    if (it['isleaf'] == '1') {
                        leafCls = 'showmenu';
                    } else {
                        leafCls = "dropdown-toggle";
                        downImg = '<b class="arrow icon-angle-down"></b>';
                        childCls = '<ul class="submenu" style="display:block;"></ul>';
                    }

                    var clsStrObj = $(clsStr.format(it['c_id'], leafCls, it['c_lname'], downImg, childCls, it['c_name']));
                    clsStrObj.data(it['c_id'], it);
                    if (it['isleaf'] != '1') {
                        clsStrObj.children('a').bind('click', function () {
                            var liObj = $(this).parent();
                            if (liObj.hasClass('open')) {
                                liObj.removeClass('open');
                                liObj.children('ul').hide();
                            } else {
                                yestree.load(liObj);

                                liObj.siblings("li").removeClass('open');
                                liObj.siblings("li").children('ul').hide();

                                liObj.addClass('open');
                                liObj.children('ul').show();
                            }
                        })
                    } else {
                        clsStrObj.children('a').bind('click', function () {
                            var liObj = $(this).parent();
                            $('.treebody ul li').removeClass('active');
                            liObj.addClass('active');
                            if (cfg.itemClk) {
                                cfg.itemClk(cfg, liObj);
                            }
                        })
                    }
                    clsUl.append(clsStrObj);
                });
            };
            yestree.reload = function () {
                yestree.load();
            };
            yestree.load();
            return yestree;
        }
    });
    var yes = {
        data: frameElement ? frameElement.data : {},
        msie: /msie/.test(navigator.userAgent.toLowerCase()),
        msie7: /msie 7\.0/.test(navigator.userAgent.toLowerCase()),
        msie5: /msie 5\.0/.test(navigator.userAgent.toLowerCase()),
        p: window.parent || window.parent.parent || window.parent.parent.parent || window,
        _p: window.parent.parent.parent || window.parent.parent || window.parent || window,
        w: window,
        h: window.parent.parent.parent.yes || window.parent.parent.yes || window.parent.yes || window.yes,
        top: function () {
            if (yes.isTop(yes.p)) {
                return yes.p;
            }
        },
        unload: function (msg) {
            var top = yes.top();
            if (frameElement) {
                $(frameElement).attr("unload", "true");
            }
            if (top && top.beforeUnload) {
                top.beforeUnload(msg);
            }
        },
        removeUnload: function () {
            var top = yes.top();
            if (frameElement) {
                $(frameElement).attr("unload", "false");
            }
            if (top && top.unBeforeUnload) {
                top.unBeforeUnload();
            }
        },
        apply: function (object, config) {
            if (object && config && typeof config === 'object') {
                for (var i in config) {
                    if (typeof config[i] === 'object' && object[i]) {
                        yes.apply(object[i], config[i]);
                        continue;
                    }
                    object[i] = config[i];
                }
            }
        },
        define: function (n, config) {
            if (config) {
                var _fn = window[n] = function (cfg) {
                    var me = this;
                    if (me.init) {
                        return me.init(cfg, _fn);
                    }
                };
                $.each(config, function (k, v) {
                    k == deFun[0] ? yes.apply(_fn, v) : _fn.prototype[k] = v;
                })
            }
        },
        isTop: function (w) {
            return w && w.istop ? true : false;
        },
        //获取html get参数值
        request: function (key, url) {
            var uri = url ? url : window.location.search;
            var re = new RegExp("" + key + "=([^&?]*)", "ig");
            return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
        },
        y: function () {
            return this.p.yes;
        },
        _y: function () {
            return this._p.yes;
        },
        gpv: function (parm) {
            var v = new Function("return " + parm + ";")();
            return v ? v : '';
        },
        isInt: function (val) {
            var re = /^[-]?[0-9]+$/;
            return re.test(val);
        },
        isFloat: function (val) {
            var re = /^[-]?[0-9]*[\.]?[0-9]+$/;
            return re.test(val);
        },
        isMoney: function (val) {
            var re = /^[\$\€\£\¥]?[-]?[0-9]*[\.]?[0-9]+$/;
            return re.test(val);
        },
        isHex: function (val) {
            var re = /^[a-fA-F0-9]+$/;
            return re.test(val);
        },
        isAlphaNumeric: function (val) {
            var re = /^[a-zA-Z0-9_-]+$/;
            return re.test(val);
        },
        isEmail: function (val) {
            var email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
            return email.test(val);
        },
        randid: function () {
            return "yes_" + new Date().getTime();
        },
        escapeId: function (id) {
            if (typeof id == 'undefined' || id == '' || id == null)
                return '';
            return String(id).replace(
                /([;&,\.\+\*\~'`:"\!\^#$%@\[\]\(\)=<>\|\/? {}\\])/g, '\\$1');
        },
        getTime: function () {
            return new Date().getTime().toString();
        },
        formInit: function () {
            $('.form-horizontal .yes_bigTitle').each(function () {
                $(this).bind({
                    blur: function () {
                        var me = $(this);
                        me.val(me.val().replace(/<\/?.+?>/gi, "").replace(/[\r\n]/gi, ""));
                    }
                });
            })
            $(".form-horizontal [o='true']").prop("readonly", true);
            $(".form-horizontal [o='true']").addClass("readonly");
            $(".form-horizontal [h='true']").hide();
        },
        selInput: function (obj, config) {
            var cfg = {
                u: '',//搜索的url
                vf: '',//表单的取值，为空则取下拉标签的值
                f: '{0}',//下拉显示每行的格式化字符串
                //如果值为'<label key="{typeno}" keyname="typeno" class="show">{name}</label>'这种格式，表示选中某条下拉数据后，会为一个名为keyname的字段设置key的值
                c: false,//是否不按输入搜索，true(不按输入搜索)，false(按输入及时搜索)
                isinput: false,//是否可手动输入
                isser: false,//在不按输入搜索的前提下，是否每次获得焦点重新获取下拉数据
                lidf: 'ye.ls',//根据获取url返回的json数据层级，到下拉数组即可
                selFirst: false,//是否默认选中第一条数据
                skey: '',
                sname: '',//取name为sname的input的值，以skey值为参数，进行数据搜索
                setnullfile: '',//选中某个下拉值时，为其它栏位设空值（多个serchbar级联时用到）
                triserfile: ''//选中某个下拉值时，为其它栏位触发搜索数据，如果要默认选中第一条数据，硬配置赋空值栏位
            };

            obj.initConfig = function (config) {
                $.extend(cfg, config);
                if (cfg.data) {
                    cfg.allData = cfg.data;
                }
            };
            obj.setData = function (objData) {
                cfg.data = objData;
            };
            obj.load = function () {
                if (obj.data('yescon') && obj.data('yescon') != '') {
                    return;
                }
                var combtn = '<label for="{0}" style="line-height:{1}px;position:absolute;right:0;cursor:pointer;margin:0;display:block;width:15px;text-align:center;border-left: 1px solid #ccc;">∨</label>';
                cfg.txtdiv = $('<div class="ysdiv" style="position:relative;"></div>');
                cfg.txtdiv.css('width', obj.css('width'));
                obj.after(cfg.txtdiv).next('div').append(obj.css('width', '100%'));
                if (cfg.showbtn) {
                    var objID = obj.attr('id');
                    if (!objID || objID == '') {
                        objID = obj.attr('name') + 'fid';
                        obj.attr('id', objID);
                    }
                    obj.before(combtn.format(objID, obj.outerHeight()));
                }
                cfg.pageShow = $('<div class="pagesroll" style="display:none;border-top:1px solid #ddd;width:100%;text-align:center;">'
                    + '<span class="uppage" style="float:left;margin-left:5px;cursor:pointer;"><</span><span class="curpage">1/1</span>'
                    + '<span class="downpage" style="float:right;margin-right:5px;cursor: pointer;">></span></div>');
                obj.after('<div class="yssugbox" style="position:absolute;z-index:1003;display:none;"><ul class="yssuglist"></ul></div>');
                obj.next('div.yssugbox').css('min-width', '60px');
                cfg.sugList = obj.next('div.yssugbox').children('ul.yssuglist').after(cfg.pageShow);
                if (cfg.c) {
                    obj.css('cursor', 'pointer');
                }
                if (!cfg.isinput) {
                    obj.prop('readonly', "readonly");
                }
                cfg.sugList.parent().width(obj.width());
                obj.bind({
                    blur: function () {
                        if (cfg.rediv) {
                            if (IsEmptyObj(obj.val())) {
                                cfg.rediv.show();
                            } else {
                                cfg.rediv.hide();
                            }
                        }
                    },
                    focus: function () {
                        if (cfg.rediv)
                            cfg.rediv.hide();

                        if (cfg.c) {
                            if (cfg.allData && cfg.allData.length > 0 && !cfg.isser) {
                                obj.initPage(cfg.allData);
                            } else {
                                obj.serchByUrl();
                                obj.initPage(cfg.allData);
                            }
                        }
                    },
                    keyup: function (e) {
                        obj.serchKeyDown(e);
                    },
                    click: function () {
                        obj.focus();
                    }
                });
                $(document).bind('click', function (e) {
                    var cliel = $(e.target);
                    if (cliel && cliel.length != '' && (cliel.parents('.ysdiv')[0] != cfg.txtdiv[0])) {
                        obj.blur();
                        obj.sugListHide();
                    }
                });
                if (cfg.c) {
                    obj.serchByUrl();
                }
            };
            obj.serchKeyDown = function (e) {
                var keyCode = e.keyCode;
                switch (keyCode) {
                    case 38:
                        if (cfg.sugSize) {
                            if (cfg.curSize == 1) {
                                cfg.curSize = cfg.sugSize + 1;
                            }
                            cfg.curSize = cfg.curSize - 1;
                            cfg.sugList.children('li').removeClass('selected');
                            $(cfg.sugList.children('li')[cfg.curSize - 1]).addClass('selected');
                        }
                        break;
                    case 40:
                        if (cfg.sugSize > 0) {
                            if (cfg.sugSize == cfg.curSize) {
                                cfg.curSize = 0;
                            }
                            cfg.curSize = cfg.curSize + 1;
                            cfg.sugList.children('li').removeClass('selected');
                            $(cfg.sugList.children('li')[cfg.curSize - 1]).addClass('selected');
                        }
                        break;
                    case 13:
                        if (cfg.curSize > 0) {
                            obj.setSelVal($(cfg.sugList.children('li')[cfg.curSize - 1]));
                            obj.focus();
                            obj.sugListHide();
                        }
                        break;
                    default:
                        if (!cfg.c) {
                            if ((keyCode >= 112 && keyCode <= 123) || (keyCode != 32 && (keyCode >= 16 && keyCode <= 46)) || keyCode == 9 || keyCode == 12 || keyCode == 144) {
                                break;
                            }
                            if (IsNotEmptyObj(cfg.u)) {
                                var objval = obj.val();
                                if (objval) {
                                    obj.serchByUrl({'serkey': objval});
                                }

                            }
                        }
                }
            };
            obj.serchByUrl = function (parm) {
                if (cfg.u == '') {
                    return;
                }
                var allparm = {};
                parm ? $.extend(allparm, parm) : false;
                if (cfg.skey != '') {
                    var sv = $('input[name="' + cfg.sname + '"]').val();
                    if (sv == '')
                        return;
                    else
                        allparm[cfg.skey] = sv;
                }
                yesajax.get({
                    url: cfg.u,
                    data: allparm,
                    async: false,
                    success: function (json) {
                        var data = json;
                        if (cfg.lidf) {
                            var lis = cfg.lidf.split('.');
                            $.each(lis, function (i, v) {
                                data = data[v];
                            });
                        }
                        cfg.allData = data;
                        if (cfg.allData && cfg.allData.length > 0) {
                            if (cfg.selFirst && obj.val() == '') {
                                obj.setSelVal($('<li class="pointer">' + cfg.f.format(cfg.allData[0]) + '</li>'), true);
                            }
                        }
                    }
                });
            };
            obj.sugListShow = function () {
                var data = cfg.data;
                cfg.sugList.empty();
                if (data && data.length > 0) {
                    $.each(data, function (i, v) {
                        var li = $('<li class="pointer">' + cfg.f.format(v) + '</li>');
                        li.data('hval', v);
                        cfg.sugList.append(li);
                        if (!cfg.c) {
                            if (cfg.sugList.children('li').length == 5) {
                                return;
                            }
                        }
                    });
                    cfg.sugSize = cfg.sugList.children('li').length;
                    if (cfg.sugSize > 0) {
                        cfg.curSize = 1;
                        $(cfg.sugList.children('li')[cfg.curSize - 1]).addClass('selected');
                    }

                    cfg.sugList.children('li').height(obj.outerHeight()).css('line-height', obj.outerHeight() + 'px');
                    cfg.sugList.find('li').bind({
                        click: function () {
                            var me = $(this);
                            obj.setSelVal(me);
                            if (!cfg.selmore)
                                obj.sugListHide();
                        },
                        mouseover: function () {
                            cfg.sugList.children('li').removeClass('selected');
                        }
                    });
                    cfg.sugList.parent().show();
                }
            };
            obj.setSelVal = function (me, setfirst) {
                if (cfg.curSize > 0 || setfirst) {
                    if (cfg.callback) {
                        cfg.callback(me.data('hval'));
                    }
                    var valText = me.text();
                    var label = me.find('label');
                    if (label.length > 0) {
                        valText = label.html();
                        var hdlval = label.attr('key');
                        var hdlname = label.attr('keyname');
                        if ($('input[name=' + hdlname + ']').length == 0) {
                            $(document.body).append('<input type="hidden" name="' + hdlname + '"/>');
                        }
                        var hdlvals = $('input[name=' + hdlname + ']').val();
                        if (hdlvals != '' && cfg.selmore) {
                            hdlval = obj.getMoreVal(hdlvals, hdlval);
                        }
                        $('input[name=' + hdlname + ']').val(hdlval);
                    }
                    if (cfg.vf && cfg.vf != '') {
                        valText = me.data('hval')[cfg.vf];
                    }
                    var valtexts = obj.val();
                    if (valtexts != '' && cfg.selmore) {
                        valText = obj.getMoreVal(valtexts, valText);
                    }
                    obj.val(valText);
                    if (cfg.setnullfile) {//级联清空值
                        $.each(cfg.setnullfile.split(','), function (i, v) {
                            $('[name="' + v + '"]').val('');
                        });
                    }
                    if (cfg.triserfile) {//级联下拉
                        $.each(cfg.triserfile.split(','), function (i, v) {
                            var yesobj = $('[name="' + v + '"]').data('yescon');
                            if (yesobj) {
                                yesobj.serchByUrl();
                            }
                        });
                    }
                    if (cfg.rediv)
                        cfg.rediv.hide();
                }
            };
            obj.getMoreVal = function (allval, nval) {
                var allvals = allval.split(',');
                var returnval = '';
                var issel = true;
                $.each(allvals, function (i, v) {
                    if (v != '') {
                        if (v != nval) {
                            if (returnval != '') {
                                returnval += ',';
                            }
                            returnval += v;
                        } else {
                            issel = false;
                        }
                    }
                });
                returnval = issel ? returnval + ',' + nval : returnval;
                return returnval;
            };
            obj.sugListHide = function () {
                if (cfg.sugList) {
                    cfg.sugList.parent().hide();
                }
                cfg.sugSize = undefined;
                cfg.curSize = undefined;
            };
            obj.initPage = function (allData) {//数据分页
                var CME = this;
                var CFG = {
                    pageSize: 8,
                    currentPage: 1,
                    nextPage: 2,
                    prevPage: 1,
                    allPage: 0,
                    pageData: [],
                    dataSize: 0,
                    prevEl: cfg.pageShow.find('.uppage'),
                    nextEl: cfg.pageShow.find('.downpage'),
                    pageEl: cfg.pageShow.find('.curpage')
                };
                CME.init = function () {
                    if (!allData || allData.length == 0) {
                        return;
                    }
                    CFG.pageData = allData;
                    CFG.dataSize = CFG.pageData.length;
                    if (CFG.dataSize > CFG.pageSize) {
                        cfg.pageShow.show();
                    } else {
                        cfg.pageShow.hide();
                    }
                    var yetPage = parseInt(CFG.dataSize / CFG.pageSize);
                    if (CFG.dataSize > yetPage * CFG.pageSize) {
                        yetPage++;
                    }
                    CFG.allPage = yetPage;
                    CME.loadCurentPage();
                };
                CME.loadCurentPage = function () {
                    if (CFG.currentPage < 1) {
                        CFG.currentPage = 1;
                        return false;
                    } else if (CFG.currentPage > CFG.allPage) {
                        CFG.currentPage = CFG.allPage;
                        return false;
                    }
                    var minSize = (CFG.currentPage - 1) * CFG.pageSize, maxSize = CFG.currentPage * CFG.pageSize;
                    if (CFG.currentPage == CFG.allPage)
                        maxSize = CFG.dataSize;
                    var nowData = [];
                    for (var i = 0; minSize < maxSize; minSize++) {
                        nowData[i] = CFG.pageData[minSize];
                        i++;
                    }
                    cfg.data = nowData;
                    obj.sugListShow(true);
                    $(CFG.pageEl).html(CFG.currentPage + '/' + CFG.allPage);
                };
                CME.init();
                $(CFG.prevEl).bind('click', function () {
                    --CFG.currentPage;
                    CME.loadCurentPage();
                });
                $(CFG.nextEl).bind('click', function () {
                    ++CFG.currentPage;
                    CME.loadCurentPage();
                });
            };
            obj.initConfig(config);
            obj.load();
            obj.data('yescon', obj);
            return obj;
        },
        openWrodFile: function (path) {
            var windowcfg = "height=" + screen.height + ",width=" + screen.width + ",resizable=yes,scroll=no,status=no,center=yes,help=no,minimize=yes,maximize=yes";
            window.open(yes_config_domain + '/resource/controls/officeCtl/officectl.html?doType=OF&open_url=' + path, "", windowcfg);
        },
        completePath: function (path) {
            if (path.indexOf("http://") == -1) {
                path = yes_config_domain + "/" + path;
            }
            return path;
        },
        msg: function (title, text, error) {
            this._p.$.gritter.add({
                title: title,
                text: text,
                class_name: (error == true || error == undefined
                    ? 'gritter-success'
                    : 'gritter-error')
                + ' gritter-light'
            });
        },
        getSize: function (el, type) {
            var bwidth = {
                left: parseInt($(el).css('border-left-width')) || 0,
                right: parseInt($(el).css('border-right-width')) || 0,
                top: parseInt($(el).css('border-top-width')) || 0,
                bottom: parseInt($(el).css('border-bottom-width')) || 0
            };
            var mwidth = {
                left: parseInt($(el).css('margin-left')) || 0,
                right: parseInt($(el).css('margin-right')) || 0,
                top: parseInt($(el).css('margin-top')) || 0,
                bottom: parseInt($(el).css('margin-bottom')) || 0
            };
            var pwidth = {
                left: parseInt($(el).css('padding-left')) || 0,
                right: parseInt($(el).css('padding-right')) || 0,
                top: parseInt($(el).css('padding-top')) || 0,
                bottom: parseInt($(el).css('padding-bottom')) || 0
            };
            switch (type) {
                case 'top' :
                    return bwidth.top + mwidth.top + pwidth.top;
                case 'bottom' :
                    return bwidth.bottom + mwidth.bottom + pwidth.bottom;
                case 'left' :
                    return bwidth.left + mwidth.left + pwidth.left;
                case 'right' :
                    return bwidth.right + mwidth.right + pwidth.right;
                case 'width' :
                    return bwidth.left + bwidth.right + mwidth.left + mwidth.right
                        + pwidth.left + pwidth.right + parseInt($(el).width());
                case 'height' :
                    return bwidth.top + bwidth.bottom + mwidth.top + mwidth.bottom
                        + pwidth.top + pwidth.bottom + parseInt($(el).height());
                case '+width' :
                    return bwidth.left + bwidth.right + mwidth.left + mwidth.right
                        + pwidth.left + pwidth.right;
                case '+height' :
                    return bwidth.top + bwidth.bottom + mwidth.top + mwidth.bottom
                        + pwidth.top + pwidth.bottom;
            }
            return 0;
        },
        openDialog: function (t, url, parm) {
            var level = 0;
            var dialog = null;
            var _t = new Date().getTime();
            var fe = frameElement ? frameElement : {level: 0};
            var yestop = yes.top();
            level = fe.level > -1 ? fe.level + 1 : 0, dialog = level < 1
                ? yestop.$('.open_panel')
                : window.parent.$('.open_panel');

            //url = url + (url.indexOf('?') > -1 ? '&_t=' + _t : '?_t=' + _t);
            if (dialog && dialog.length < 1) {
                dialog = $(yestpl.dialog.format({
                    title: t,
                    url: url
                    //url : YESBASEPATH + url
                }));
                //$('.page-content').append(dialog);
                yestop.$('.page-body').append(dialog);
            } else {
                var _dialog = dialog, dialog = $(yestpl.dialog.format({
                    title: t,
                    url: url
                    //url : YESBASEPATH + url
                }));
                _dialog.last().after(dialog);
            }
            dialog = yestop.$('.page-body').find('.open_panel:last');
            //dialog.sl();
            var iframe = dialog.find('iframe')[0];
            //yes.scrollIframeForIOS(iframe);
            iframe.data = parm ? parm.data : {};
            iframe.level = level;
            var pdata = parm.pdata, yespages = dialog.find('.yes_pages');
            if (pdata) {
                dialog.data({url: parm.url, pdata: parm.pdata});
                yespages.show();
            } else {
                yespages.hide();
            }
            var dn = dialog.next('.modal-backdrop:first'), zindex = yestop.yesbox.newIndex();
            if (parm && parm.dialog) {
                if (parm.dialog.width) {
                    dialog.css("width", parm.dialog.width + "px");
                }
                if (parm.dialog.height) {
                    dialog.css("height", parm.dialog.height + "px");
                    dialog.addClass("smallDialog");
                    dialog.find("iframe").attr("scrolling", "no");
                }
                if (parm.dialog.isnp) {//新的人员选择器
                    dialog.css("top", "0px");
                } else {
                    dialog.css("top", "46px");
                }
                if (parm.dialog.hideTitle) {
                    dialog.find(".widget-header").hide();
                }

            }
            dialog.css('z-index', zindex + 1);
            dn.css('z-index', zindex);
            dn.show();
            dialog.show();
            yestop.$("body").css('overflow-y', "hidden");
            yestop.resizewin();
            resizewin();

            dialog.draggable({handle: '.widget-header', opacity: 0.7, cursor: "move"});
            return dialog;
        },
        closeDialog: function () {
            var topw = yes.top();
            var dialog = $('.open_panel');
            dialog = dialog.length > 0 ? dialog : window.parent ? window.parent.$('.open_panel') : null;
            if (!dialog) {
                return;
            }
            var l = dialog.last(), modal = l.next(".modal-backdrop");
            var iframe = l.find('iframe');
            var cfg = null;
            if (iframe && iframe[0]) {
                cfg = iframe[0].data;
            }
            if (cfg && cfg.closeCB2) {
                if (!cfg.closeCB2(cfg)) {
                    return;
                }
            }
            if (topw && iframe.attr("unload") == "true") {
                topw.unBeforeUnload();
            }
            if (cfg && cfg.closeCB) {
                cfg.closeCB(cfg);
            }

            if (topw && dialog.length == 1) {
                if (topw) {
                    topw.$("body").css('overflow-y', "auto");
                }
            }
            iframe.attr('src', 'about:blank');
            if (dialog.length > 0) {
                l.remove();
                modal.remove();
            } else {
                l.hide();
                modal.hide();
            }
        },
        hideDialogTitle: function (hide) {
            var yestop = yes.top();
            var title = yestop.$('.page-body .open_panel:last .widget-header');
            if (hide && title.is(":visible")) {
                title.hide();
            }
            if (!hide && title.is(":hidden")) {
                title.show();
            }
            yestop.resizewin();
        },
        setDialogHeight: function (h) {
            var me = frameElement;
            if (me) {
                $(me).height(h);
                $(me).parent().height(h);
                $(me).parent().parent().height(h + $(me).parent().prev().height() + 2);
            }
        },
        hideDialog: function (hide) {
            var yestop = yes.top();
            var panel = yestop.$('.page-body .open_panel:last');
            if (hide && panel.is(":visible")) {
                panel.hide();
            }
            if (!hide && panel.is(":hidden")) {
                panel.show();
            }
            yestop.resizewin();
        },
        addTab: function (id, name, url, icon, data) {
            var randid = yes.randid(), linkMap = $('.linkMap');

            if (typeof(id) == 'object') {
                var bfn = $(id).attr("bfn"), pd = {data: {}};
                var type = $(id).attr("type");
                bfn = bfn ? yes.gpv(bfn) : false;
                if (bfn) {
                    var flag = true;
                    typeof(bfn) == "function" ? flag = bfn($(id), pd) : pd = {data: bfn};
                    var iframe = $("#iframeHome")[0];
                    if (flag) {
                        if (type == "add") {
                            var menu = pd.data;
                            yesflow.add({
                                menu: menu,
                                title: menu.title,
                                formUrl: yes_config_doc_edit.format(menu.htmlPath, menu.formName),
                                htmlPath: menu.htmlPath,
                                appid: menu.appid,
                                form: menu.formName,
                                dbName: menu.dbName,
                                hideScorll: menu.hideScorll,
                                callback: function () {//保存跟保存退出按钮，按下后回传调用
                                    //yes.closeDialog();
                                }
                            });
                        } else {
                            iframe ? iframe.data = pd.data : false;
                            linkMap.find('.yeschild').remove();
                            var el = $(id).parents('li:not(:first)'), name = $(id).find('.menu-text').text(), name = (name == '' ? $(id).text() : name), _el = $(yestpl.headactive.format($.trim(name)));
                            linkMap.append(_el);
                            if (el && el.length > 0) {
                                $.each(el, function (k, v) {
                                    var _name = $(v).find('a >.menu-text:first').text(), _name = (_name == '' ? $(v).text() : _name);
                                    _el.before(yestpl.headparent.format($.trim(_name)));
                                });
                            }
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                var iframe = $("#iframeHome");
                iframe.attr('src', url);
                iframe = iframe[0];
                var menu = data;
                if (menu.type == "add") {
                    yesflow.add({
                        menu: menu,
                        title: menu.title,
                        formUrl: yes_config_doc_edit.format(menu.htmlPath, menu.formName),
                        htmlPath: menu.htmlPath,
                        appid: menu.appid,
                        form: menu.formName,
                        dbName: menu.dbName,
                        hideScorll: menu.hideScorll,
                        wcloseCB: function () {
                            window.close();
                        },
                        callback: function () {//保存跟保存退出按钮，按下后回传调用
                            //yes.closeDialog();
                        }
                    });
                } else {
                    iframe ? iframe.data = data : false;
                    linkMap.find('.yeschild').remove();
                    linkMap.append('<li class="active yeschild"><span class="divider"><i class="icon-angle-right arrow-icon"></i></span>{0}</li>'.format(name));
                }
            }
            if ($("#sidebar").hasClass("display")) {
                $("#iframeHome").on('load', function () {
                    $("#sidebar").toggleClass("display");
                    $(this).off('load');
                });
                $("#menu-toggler").toggleClass("display");
            }
            resizewin();
            return true;
        },
        //将系列化后的表单数据解析成数值对
        getFormItems: function (formStr) {
            var fields = formStr.split("&");
            var rs = {};
            if (fields.length > 0) {
                $.each(fields, function (i, str) {
                    if (str.indexOf("=") > 0) {
                        var temp = str.split("=");
                        if (rs[temp[0]] && rs[temp[0]] != "") {
                            rs[temp[0]] += "," + temp[1];
                        } else {
                            rs[temp[0]] = temp[1];
                        }
                    }
                });
            }
            return rs;
        },
        //将系列化后的表单数据解析成数值对
        getDecodeFormItems: function (formStr) {
            var fields = formStr.split("&");
            var rs = {};
            if (fields.length > 0) {
                $.each(fields, function (i, str) {
                    if (str.indexOf("=") > 0) {
                        var temp = str.split("=");
                        if (rs[temp[0]] && rs[temp[0]] != "") {
                            rs[temp[0]] += "," + decodeURIComponent(temp[1].replace(/\+/gi, "%20"));
                        } else {
                            rs[temp[0]] = decodeURIComponent(temp[1].replace(/\+/gi, "%20"));
                        }
                    }
                });
            }
            return rs;
        },
        //获取文档数据项
        getDocItems: function (data) {
            var its = {};
            for (var itemKey in data) {
                if (itemKey != "Items") {
                    var items = data[itemKey];
                    var itemval = "";
                    if ($.isArray(items)) {
                        for (var i = 0; i < items.length; i++) {
                            if (i > 0) {
                                itemval += ",";
                            }
                            itemval += items[i];
                        }
                    } else {
                        itemval = items;
                    }
                    its[itemKey] = itemval;
                } else {
                    var items = data[itemKey];
                    for (var itemTemp in items) {
                        var itemval = "";
                        if ($.isArray(items[itemTemp].Values) && items[itemTemp].Values.length > 0) {
                            for (var i = 0; i < items[itemTemp].Values.length; i++) {
                                if (i > 0) {
                                    itemval += ",";
                                }
                                itemval += items[itemTemp].Values[i];
                            }
                        } else {
                            itemval = items[itemTemp].Values;
                        }
                        its[itemTemp] = itemval;
                    }
                }
            }
            its.yes_currusername = $.cookie("userName");
            its.yes_curruserid = $.cookie("userid");
            return its;
        },
        setFV: function (items, iform) {
            for (var itemTemp in items) {
                if (itemTemp.indexOf("$") == 0) {
                    continue;
                }
                if (iform.find("input[name='" + itemTemp + "']").length > 0) {
                    var t = iform.find("input[name='" + itemTemp + "']").prop("type");
                    if (t == "radio" || t == "checkbox") {
                        iform.find("input[name='" + itemTemp + "'][value='" + items[itemTemp] + "']").prop("checked", true);
                    } else {
                        iform.find("input[name='" + itemTemp + "']").val(items[itemTemp]);
                    }
                } else if (iform.find("textarea[name='" + itemTemp + "']").length > 0) {
                    iform.find("textarea[name='" + itemTemp + "']").text(items[itemTemp]);
                } else if (iform.find("select[name='" + itemTemp + "']").length > 0) {
                    iform.find("select[name='" + itemTemp + "']").val(items[itemTemp]);
                } else if (iform.find("label[name='" + itemTemp + "']").length > 0) {
                    iform.find("label[name='" + itemTemp + "']").html(items[itemTemp]);
                } else {
                    iform.append('<input type="hidden" name="' + itemTemp + '" value="" />');
                    iform.find("input[name='" + itemTemp + "']").val(items[itemTemp]);
                }
            }

        },
        //获取选择的人员信息
        getPersonData: function (data) {
            if (data && data.datas && data.datas.keys && data.datas.keys.length > 0) {
                var tkeys = data.datas.keys;
                var tdata = data.datas.data;

                var ids = [];
                var names = [];
                var mobiles = [];
                $.each(tkeys, function (i, key) {

                    if (tdata[key]["type"] == "group") {
                        ids.push("U_" + tdata[key]["id"]);
                    } else {
                        ids.push(tdata[key]["id"]);
                    }
                    names.push(tdata[key]["name"]);
                    mobiles.push(tdata[key]["mobile"]);
                });
                return {ids: ids, names: names, mobiles: mobiles, data: data.toString()};
            }
        },
        js_getDPI: function () {
            var arrDPI = [];
            if (window.screen.deviceXDPI != undefined) {
                arrDPI[0] = window.screen.deviceXDPI;
                arrDPI[1] = window.screen.deviceYDPI;
            }
            else {
                var tmpNode = document.createElement("DIV");
                tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
                document.body.appendChild(tmpNode);
                arrDPI[0] = parseInt(tmpNode.offsetWidth);
                arrDPI[1] = parseInt(tmpNode.offsetHeight);
                tmpNode.parentNode.removeChild(tmpNode);
            }
            return arrDPI;
        },
        login: function (submitType, cfg) {
            yes.top().loginForm(submitType, cfg);
        },
        ismobile: function () {
            return !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
        },
        initSelect: function (obj, config) { //初值化Select控件config:{url:'获取路径',arrayn:'加载数据的key',value:'值字段名称',text:'显示字段名称'}
            obj.find('option[default]').siblings().remove();
            yesajax.get({
                url: config.url,
                success: function (j) {
                    if (j[config.arrayn] && j[config.arrayn].length > 0) {
                        obj.append(o(j[config.arrayn], config.value, config.text));
                    }
                }
            });
            function o(j, value, text) { //取顶级
                var op = "";
                $.each(j, function (k, v) {
                    op += '<option value="' + v[value] + '">' + v[text] + '</option>';
                    v[config.arrayn] && v[config.arrayn].length > 0 && (op += _o(v[config.arrayn], '&nbsp;&nbsp;&nbsp;', config.value, config.text)); //取子集
                });
                return op;
            }

            function _o(j, _op, value, text) { //二级与二级之后
                var op = '';
                $.each(j, function (k, v) {
                    op += '<option value="' + v[value] + '">' + _op + v[text] + '</option>';
                    v[config.arrayn] && v[config.arrayn].length > 0 && (op += _o(v[config.arrayn], '&nbsp;&nbsp;&nbsp;' + _op, config.value, config.text));
                });
                return op;
            }
        },
        showOpinion: function (useObj, useType) {//常用意见
            var obj = this;
            var comCfg = {
                obj: $('.ofIdea'),
                content: $('.ofIdea .ofcontent'),
                addFile: $('.ofIdea input[name="addFile"]'),
                addBtn: $('.ofIdea .addOneFile'),
                closeObj: $('.ofIdea .clsdiv .colsebtn')
            };
            obj.init = function () {
                comCfg.content.html('');
                yesajax.get({
                    url: yes_config_flow_comment_usedWord_list,
                    data: 'type=' + useType,
                    success: function (tdata) {
                        if (tdata.rs && tdata.AppDatas && tdata.AppDatas.listData) {
                            $.each(tdata.AppDatas.listData, function (i, v) {
                                var listrs = $('<li class="ofli"><span class="lival">' + v['memo'] + '</span><span rel="' + v['unid'] + '" class="liclose" style="float:right;">×</span></li>');
                                if (i != 0) {
                                    listrs.css('border-top', '1px solid #ddd');
                                }
                                comCfg.content.append(listrs);
                                listrs.find('.lival').unbind('click');
                                listrs.find('.liclose').unbind('click');
                                listrs.find('.lival').bind('click', obj.userOne);
                                listrs.find('.liclose').bind('click', obj.removeOne);
                            });
                        }
                    }
                });

                useObj.bind({
                    focus: function () {
                        var me = $(this);
                        $(document).bind({
                            click: function (e) {
                                var cliel = $(e.target);
                                if (cliel && cliel.parents('.ofIdea')[0] != comCfg.obj[0] && cliel[0] != me[0]) {
                                    comCfg.obj.hide();
                                }
                            }
                        });
                        comCfg.obj.show();
                    }
                });
                comCfg.closeObj.bind('click', function () {
                    comCfg.obj.hide();
                });
                comCfg.addBtn.bind('click', function () {
                    obj.addOne();
                });
                comCfg.addFile.bind('keyup', function (v) {
                    if (v.keyCode == 13)
                        comCfg.addBtn.trigger('click');
                });
            };
            obj.removeOne = function () {
                var me = this;
                yesajax.post({
                    url: yes_config_flow_comment_usedWord_remove.format('menu.nsf'),
                    data: {unids: $(me).attr("rel")},
                    owndeal: true,
                    callback: function (data) {
                        $(me).parent("li").remove();
                    }
                });
            };
            obj.userOne = function () {
                var me = $(this);
                useObj.val(me.html());
                useObj.trigger('blur');
                comCfg.obj.hide();
            };
            obj.addOne = function () {
                var memo = comCfg.addFile.val();
                if (memo.length > 50) {
                    yesbox.addMsg(yes_global_flow_comment_usedword);
                    comCfg.addFile.focus();
                    return;
                }
                if ($.trim(memo) == "") {
                    yesbox.addMsg(yes_global_flow_comment_usedword_empty);
                    comCfg.addFile.focus();
                    return;
                }
                yesajax.post({
                    url: yes_config_flow_comment_usedWord_add,
                    data: "form=popinion&memo=" + encodeURIComponent(memo) + "&type=" + useType + '&yesap_db=menu.nsf',
                    callback: function (data) {
                        if (data.AppDatas) {
                            for (var docId in data.AppDatas) {
                                var listrs = $('<li class="ofli"><span class="lival">' + memo + '</span><span rel="' + docId + '" class="liclose" style="float:right;">×</span></li>');
                                if (comCfg.content.find('.ofli').length > 0) {
                                    listrs.css('border-top', '1px solid #ddd');
                                }
                                comCfg.content.append(listrs);
                                listrs.find('.lival').unbind('click');
                                listrs.find('.liclose').unbind('click');
                                listrs.find('.lival').bind('click', obj.userOne);
                                listrs.find('.liclose').bind('click', obj.removeOne);
                            }
                        }
                    }
                });
                useObj.val(memo);
                useObj.trigger('blur');
                comCfg.addFile.val('');
            };
            obj.init();
        }
        /*,
         scrollIframeForIOS:function(iframe, iframeWrapper){
         if(!navigator.userAgent.match(/iPad|iPhone/i)) return false;
         var touchY = 0,touchX = 0;

         iframe = typeof(iframe)=="string" ? document.getElementById(iframe) : iframe;

         iframe.onload = function(){
         var ifrWin = iframe.contentWindow, ifrDoc = ifrWin.document;
         // iframe的上一级节点
         iframeWrapper = iframeWrapper||ifrWin.frameElement.parentNode;
         // 记录手指按下的位置
         ifrDoc.body.addEventListener("touchstart", function( event ){
         touchX = event.targetTouches[0].pageX;
         touchY = event.targetTouches[0].pageY;
         });
         ifrDoc.body.addEventListener("touchmove", function( event ){
         e.preventDefault(); // 阻止整个页面拖动
         var moveX = (touchX - event.targetTouches[0].pageX),
         moveY = (touchY - event.targetTouches[0].pageY);

         iframeWrapper.scrollLeft += moveX;
         iframeWrapper.scrollTop  += moveY;
         });
         }
         return true;
         }*/
    };
    var yesmenu = {
        setMax: function () {

        },
        setMin: function () {

        },
        open: function (id) {
            yes.top().openMenu(id);
        },
        openTab: function (menu) {
            yes.top().openTab(menu);
        },
        tree: function (id) {
            var pTop = yes.top().$("#mid" + id);
            if (pTop && pTop.length > 0) {
                pTop.click();
            } else {
                yes.top().$('[menuid="mid' + id + '"]').click();
            }
        }
    };
    var yesbox = {
        index: 1500,
        newIndex: function () {
            this.index += 2;
            return this.index;
        },
        loading: function () {
            var top = yes.top();
            if (top && top.$) {
                yesbox.index = top.yesbox.newIndex();
                top.$("body").append(yestpl.loading.format(yesbox.index, yesbox.index + 1));
            }
            return yesbox.index;
        },
        closeLoading: function (index) {
            var top = yes.top();
            if (top && top.$) {
                top.$(".loading" + index).remove();
            }
        },
        errMsg: function (msg) {
            yes.msg(yes_global_tip_title_errorMsg, msg, false);
        },
        addMsg: function (msg) {
            yes.msg(yes_global_tip_title_notice, msg, true);
        },
        showListSelect: function (title, data, opts) {
            $.YESSelect(title, data, opts);
        },
        selectPerson: function (title, initData, unitId, callback) {
            var parms = {
                dialog: {
                    hideTitle: false
                },
                data: {
                    title: title,
                    hideScorll: true,
                    formUrl: yes.completePath("resource/controls/personnel/personal.html"),
                    data: initData,
                    parm: {
                        unit: unitId,
                        callback: function (data, bcfg) {
                            bcfg.close();
                            callback ? callback(data) : '';
                        }
                    }
                }
            };
            yes.openDialog(parms.data.title, parms.data.formUrl, parms);
        },
        selectPersonNew: function (title, selObj, callback) {
            var parms = {
                dialog: {
                    hideTitle: false,
                    isnp: true,
                    height: 580,
                    width: 950
                },
                data: {
                    title: title,
                    hideScorll: true,
                    formUrl: yes.completePath("resource/controls/personnelNew/person.html"),
                    height: 530,
                    parm: selObj,
                    callback: callback
                }
            };
            yes.openDialog(parms.data.title, parms.data.formUrl, parms);
        },
        selectClass: function (title, selObj, callback) {
            var width = 400;
            var html = 'classifyRadioSel.html';
            if (selObj.isSels) {
                width = 800;
                html = 'classifysel.html';
            }
            var parms = {
                dialog: {
                    hideTitle: false,
                    height: 570,
                    width: width
                },
                data: {
                    title: title,
                    hideScorll: true,
                    formUrl: yes.completePath("resource/controls/classifyselNew/" + html),
                    parm: $.extend({
                        callback: function (data, bcfg) {
                            bcfg.close();
                            callback ? callback(data) : '';
                        }
                    }, selObj)
                }
            };
            yes.openDialog(parms.data.title, parms.data.formUrl, parms);
        },
        selectDept: function (title, selObj, callback) {
            var width = 400;
            var html = 'deptradio.html';
            if (selObj.isSels) {
                width = 800;
                html = 'dept.html';
            }
            var parms = {
                dialog: {
                    hideTitle: false,
                    height: 550,
                    width: width
                },
                data: {
                    title: title,
                    hideScorll: true,
                    height: 520,
                    formUrl: yes.completePath("resource/controls/deptM/" + html),
                    parm: selObj,
                    callback: callback
                }
            };
            yes.openDialog(parms.data.title, parms.data.formUrl, parms);
        },
        box: function (opts) {
            var cfg = {
                title: '',
                closebtn: false,
                content: '',
                close: function () {
                    $(".select" + this.zindex).remove();
                },
                cmds: [{
                    "close": true,
                    "value": yes_global_tip_btn_cancel,
                    "callback": function (cfg) {
                    }
                }, {
                    "name": "sure",
                    "close": true,
                    "ico": "btn-primary",
                    "value": yes_global_tip_btn_sure,
                    "callback": function (cfg) {
                    }
                }]
            };
            if (opts) {
                $.extend(cfg, opts);
            }
            var zindex = cfg.zindex;
            var btnstemp = "";
            var btntemp = '<a data-handler="{0}" class="btn {2}" href="javascript:;">{1}</a>';
            if (cfg.cmds.length > 0) {
                $.each(cfg.cmds, function (index, bt) {
                    bt.name = bt.name ? bt.name : bt.value;
                    btnstemp += btntemp.format(bt.name, bt.value, bt.ico);
                });
            }

            $("body").append(yestpl.box.format(zindex, cfg.title, cfg.content, btnstemp));
            if (cfg.closebtn) {
                $(".select" + zindex + " .close").bind("click", function () {
                    cfg.close();
                });
            } else {
                $(".select" + zindex + " .close").hide();
            }
            if (cfg.cmds.length > 0) {
                $.each(cfg.cmds, function (index, bt) {
                    $(".select" + zindex + " a[data-handler='" + bt.name + "']").bind("click", function () {
                        if (bt.callback) {
                            cfg.iform = $(".select" + zindex + " form");
                            cfg.data = cfg.iform.serialize();
                            bt.callback(cfg);
                        }
                        if (bt.close) {
                            cfg.close();
                        }
                    });
                });
            }
        },
        select: function (title, data, opts) {
            yes.top().boxselect(title, data, opts);
        }
    };

    function resizewin() {
        var wh = $(window).height();
        $('#navlist').height(wh - 115);
        $('#navlist .tab-pane').height(wh - 115);
        if ($(".open_panel:last .widget-header").is(":visible")) {
            $(".open_panel:last .widget-body").height($(".open_panel:last").height() - $(".open_panel:last .widget-header").height() - 10);
        } else {
            $(".open_panel:last .widget-body").height($(".open_panel:last").height());
        }
        /*$('#iframeHome').on('load',function(){
         var frame = $(this)[0];
         var doc = frame.contentWindow.document || frame.contentDocument;
         $(this).parent('.tab-pane').height($(doc.body).height());
         });*/
    }

    var yesajax = {
        get: function (cfg) {
            var baseCfg = {
                type: "GET",
                dataType: yes_config_dataType,
                async: true,
                cache: false,
                timeout: 60000,
                beforeSend: function () {
                    if (!cfg.noloading)
                        this.zindex = yesbox.loading();
                },
                complete: function () {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                },
                success: function (data) {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                    if (data.code || data.se) {
                        if (data.code == "logout" || data.se) {
                            //yesbox.errMsg(yes_global_login_err);
                            yes.login("get", cfg);
                            return;
                        }
                    }
                    if (cfg.owndeal) {
                        if (cfg.callback) {
                            cfg.callback(data);
                        }
                    } else {
                        if (data.rs || (data.ye && data.ye.suss)) {
                            if (cfg.callback) {
                                cfg.callback(data.AppDatas || data.ye);
                            }
                        } else {
                            yesbox.addMsg(data.msg || data.ye.msg);
                        }
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                    if (XMLHttpRequest && XMLHttpRequest.responseText && isNoLogin(XMLHttpRequest.responseText)) {
                        yes.top().location.href = yes_config_domain_root;
                    }
                    if (cfg.err) {
                        cfg.err();
                    } else {
                        yesbox.errMsg(yes_global_ajax_err);
                    }
                }
            };
            if (cfg) {
                $.extend(baseCfg, cfg);
            }
            $.ajax(baseCfg);
        },
        post: function (cfg) {
            var baseCfg = {
                type: "POST",
                dataType: yes_config_dataType,
                async: true,
                cache: false,
                timeout: 60000,
                beforeSend: function () {
                    if (!cfg.noloading)
                        this.zindex = yesbox.loading();
                },
                complete: function () {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                },
                success: function (data) {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                    if (data.code || data.se) {
                        if (data.code == "logout" || data.se) {
                            yes.login("post", cfg);
                            return;
                        }
                    }
                    if (data.rs || (data.ye && data.ye.suss) || cfg.owndeal) {
                        if (cfg.callback) {
                            cfg.callback(data);
                        }
                    } else {
                        if (data.msg || (data.ye && data.ye.msg)) {
                            yesbox.addMsg(data.msg || data.ye.msg);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (!cfg.noloading)
                        yesbox.closeLoading(this.zindex);
                    if (XMLHttpRequest && XMLHttpRequest.responseText && isNoLogin(XMLHttpRequest.responseText)) {
                        yes.top().location.href = yes_config_domain_root;
                    }
                    if (cfg.err) {
                        cfg.err();
                    } else {
                        yesbox.errMsg(yes_global_ajax_err);
                    }
                }
            };
            //$.post(cfg.url, cfg.data, cfg.callback, "json")
            if (cfg) {
                $.extend(baseCfg, cfg);
            }
            $.ajax(baseCfg);
        }
    };

    function isNoLogin(response) {
        if (response.indexOf('name="username"') > -1 && response.indexOf('name="password"') > -1) {
            return true;
        } else {
            return false;
        }
    }

    $(function () {
        $(".page-content,.page-body")
            .delegate(
            ".widget-toolbar > [data-yesmode],.page-header > [data-yesmode],.btn-group > [data-yesmode],.nav-search > [data-yesmode]",
            "click", function (k) {
                k.preventDefault();
                var j = $(this);
                var l = j.data("yesmode");
                var a = j.closest(".widget-box"), flag = true;
                var bfn = j.attr('bfn'), afn = j.attr('afn'), url = j
                    .attr('url'), b = true;
                if (a.hasClass("ui-sortable-helper")) {
                    return
                }
                bfn = bfn ? yes.gpv(bfn) : false;
                afn = afn ? yes.gpv(afn) : false;
                var parm = {
                    data: false
                };
                b = bfn ? bfn(parm) : b;
                if (!b) {
                    return;
                }
                switch (l) {
                    case "flownew" :
                        yesflow.add(parm.cfg);
                        break;
                    case "new" :
                        yesdoc.add(parm.cfg);
                        break;
                    case "edit" :
                        yes.openDialog(j.attr('title'), url, parm);
                        break;
                    case "redit" :
                        var dialog = $('.open_panel');
                        dialog = dialog.length > 0
                            ? dialog
                            : window.parent.$('.open_panel');
                        var l = dialog.last();
                        l.find('.yes_title').text(j.attr('title'));
                        //window.location = YESBASEPATH + url;
                        window.location = url;
                        break;
                    case "savenew" :
                        flag = false;
                        break;
                    case "save" :
                        var form = j.parents('form');
                        if (form.length > 0) {
                            $('.page-content').sl();
                            /*url = url.indexOf('http://') < 0
                             ? (YESBASEPATH + url)
                             : url;*/
                            form.ajaxSubmit({
                                url: url,
                                type: 'post',
                                success: function (a, b, c) {
                                    var lg = a.lg;
                                    if (lg.success) {
                                        yes.msg('提示', lg.msg);
                                        form
                                            .find('.error,.tooltip-error')
                                            .removeClass('error tooltip-error');
                                        if (flag) {
                                            yes.closeDialog();
                                        } else {
                                            form.resetForm();
                                        }
                                    } else {
                                        if (lg.errfield) {
                                            var f = form
                                                .find('[name='
                                                + lg.errfield
                                                + ']');
                                            if (f.length > 0) {
                                                f
                                                    .parents('.control-group')
                                                    .addClass('error');
                                                f
                                                    .attr('title',
                                                    lg.msg)
                                                    .css('tooltip-error');
                                                f[0].focus();
                                            }
                                        }
                                        yes.msg('出错', lg.msg, false);
                                    }
                                    afn ? afn(form, lg) : false;
                                    $('.page-content').cl();
                                }
                            });
                            return;
                        }
                        yes.msg('出错', '没找到所需要的Form!!', false);
                        break;
                    case "prev" :
                        if (j.hasClass('prevdisable')) {
                            return;
                        }
                        var d = a.data();
                        if (d.url && d.pdata) {
                            d.pdata.limit = 3;
                            $.post(d.url, d.pdata, function (data) {
                                console.log(data);
                            }, "json");
                        }
                        break;
                    case "next" :
                        if (j.hasClass('prevdisable')) {
                            return;
                        }
                        break;
                    case "hide" :
                        if (a.hasClass('open_panel')) {
                            yes.closeDialog();
                        } else {
                            a.parent().hide("slow");
                        }
                        break;
                    case "reload" :
                        a.sl();
                        var iframe = a.find('iframe');
                        iframe[0].contentWindow.location.reload();
                        a.cl();
                        break;
                    case "chide" :
                        yes.closeDialog();
                        break;
                }
            });
    });
    var yesdoc = {
        add: function (cfg) {
            yesdoc.selRole(cfg);
        },
        //选择身份
        selRole: function (cfg) {
            yesajax.get({
                url: yes_config_flow_get_role,
                callback: function (data) {
                    if (data.listData && data.listData.length > 0) {
                        if (data.listData.length == 1) {
                            cfg.role = data.listData[0];
                            yesdoc.showAdd(cfg);
                        } else {
                            var roles = [];
                            for (var i = 0; i < data.listData.length; i++) {
                                var roletemp = data.listData[i];
                                var it = {};
                                it.key = i;
                                it.val = roletemp.pp_uname + "  -  " + roletemp.pp_pname;
                                roles.push(it);
                            }
                            yesbox.select(yes_global_flow_role_select, roles,
                                {
                                    cmds: [{
                                        "close": true,
                                        "name": "sure",
                                        "value": yes_global_tip_btn_sure,
                                        "callback": function (selData) {
                                            cfg.role = data.listData[selData.selected];
                                            yesdoc.showAdd(cfg);
                                        }
                                    }, {
                                        "close": true,
                                        "value": yes_global_tip_btn_cancel
                                    }]
                                });
                        }
                    } else {
                        yesbox.addMsg(yes_global_flow_role);
                    }
                }
            });
        },
        showAdd: function (cfg) {
            var formitems = {};
            formitems.form = cfg.form;
            if (cfg.role) {
                formitems.yes_author = encodeURIComponent(cfg.role.pp_cname);
                formitems.yes_unit_id = encodeURIComponent(cfg.role.pp_uid);
                formitems.yes_unit = encodeURIComponent(cfg.role.pp_uname);
                formitems.yes_position_id = encodeURIComponent(cfg.role.pp_pid);
                formitems.yes_position = encodeURIComponent(cfg.role.pp_pname);
            }
            var cfg2 = {
                title: cfg.title,
                formUrl: cfg.formUrl,
                flowCfg: cfg,
                formItems: formitems,
                topcmds: [
                    {
                        "close": false,
                        "index": 10,
                        "name": "yesSaveBtn",
                        "value": yes_global_tip_btn_save,
                        "callback": function (cb) {
                            if (cb.submitCheck && !cb.submitCheck()) {
                                return;
                            }
                            var iform = cb.iform;
                            yesajax.post({
                                url: cfg.isBase ? yes_config_basedoc_save : yes_config_doc_save,
                                data: iform.serialize() + "&yesap_db=" + encodeURIComponent(cfg.dbName),
                                callback: function (data) {
                                    if (data.rs) {
                                        yesbox.addMsg(yes_global_tip_btn_submit_success);
                                        if (cfg.callback) {
                                            cfg.callback();
                                        }
                                        if (data.AppDatas) {
                                            data = data.AppDatas;
                                            for (var docId in data) {
                                                var doc = data[docId];
                                                var items = yes.getDocItems(doc);
                                                cfg.formItems = items;
                                                var key = iform.find("input[name='UniversalID']");
                                                if (key.length > 0) {
                                                    key.val(docId);
                                                } else {
                                                    iform.append('<input type="hidden" name="UniversalID" value="' + docId + '" />');
                                                }
                                            }
                                        }
                                        if (cb.saveOK) {
                                            cb.saveOK();
                                        }
                                    } else {
                                        yesbox.showError(data.msg);
                                        iform.find("input[name='" + data.fld + "']").focus();
                                        iform.find("input[name='" + data.fld + "']").select();
                                    }
                                }
                            });
                        }
                    }, {
                        "close": false,
                        "index": 20,
                        "name": "yesSaveQuitBtn",
                        "value": yes_global_tip_btn_savequit,
                        "callback": function (cb) {
                            if (cb.submitCheck && !cb.submitCheck()) {
                                return;
                            }
                            var iform = cb.iform;
                            yesajax.post({
                                url: cfg.isBase ? yes_config_basedoc_save : yes_config_doc_save,
                                data: iform.serialize() + "&yesap_db=" + encodeURIComponent(cfg.dbName),
                                callback: function (data) {
                                    if (data.rs) {
                                        yesbox.addMsg(yes_global_tip_btn_submit_success);
                                        if (cfg.callback) {
                                            cfg.callback();
                                        }
                                        if (data.AppDatas) {
                                            data = data.AppDatas;
                                            for (var docId in data) {
                                                var doc = data[docId];
                                                var items = yes.getDocItems(doc);
                                                cfg.formItems = items;
                                                var key = iform.find("input[name='UniversalID']");
                                                if (key.length > 0) {
                                                    key.val(docId);
                                                } else {
                                                    iform.append('<input type="hidden" name="UniversalID" value="' + docId + '" />');
                                                }
                                            }
                                        }
                                        if (cb.saveOK) {
                                            cb.saveOK();
                                        }
                                        yes.closeDialog();
                                    } else {
                                        yesbox.showError(data.msg);
                                        iform.find("input[name='" + data.fld + "']").focus();
                                        iform.find("input[name='" + data.fld + "']").select();
                                    }
                                }
                            });

                        }
                    }]
            };
            yes.openDialog(cfg2.title, cfg2.formUrl, {data: cfg2});
        },
        read: function (cfg) {
            yesajax.get({
                url: cfg.isBase ? yes_config_basedoc_get.format(cfg.dbName, cfg.unid) : yes_config_doc_get.format(cfg.dbName, cfg.unid),
                callback: function (data) {
                    for (var docId in data) {
                        var doc = data[docId];
                        var cfg2 = {
                            title: cfg.title,
                            flowCfg: cfg,
                            formUrl: cfg.formUrl + "Read.html",
                            formItems: yes.getDocItems(doc),
                            topcmds: [{
                                "close": true,
                                "name": "yesEditBtn",
                                "index": 10,
                                "ckShow": cfg.isBase ? yes_config_doc_editAbleBase.format(cfg.dbName, cfg.unid) : yes_config_doc_editAble.format(cfg.dbName, cfg.unid),
                                "value": yes_global_tip_btn_edit,
                                "callback": function (cb) {
                                    yesdoc.edit(cfg);
                                }
                            }]
                        };
                        yes.openDialog(cfg2.title, cfg2.formUrl, {data: cfg2});
                    }
                }
            });
        },
        edit: function (cfg) {
            yesajax.get({
                url: cfg.isBase ? yes_config_doc_editAbleBase.format(cfg.dbName, cfg.unid) : yes_config_doc_editAble.format(cfg.dbName, cfg.unid),
                owndeal: true,
                callback: function (data) {
                    if (data.rs) {
                        yesajax.get({
                            url: cfg.isBase ? yes_config_basedoc_get.format(cfg.dbName, cfg.unid) : yes_config_doc_get.format(cfg.dbName, cfg.unid),
                            callback: function (data) {
                                for (var docId in data) {
                                    var doc = data[docId];
                                    var items = yes.getDocItems(doc);
                                    if (cfg.editFileds) {
                                        items.yes_temp_edit_fields = cfg.editFileds;
                                    } else {
                                        items.yes_temp_edit_fields = "___ALL";
                                    }
                                    var cfg2 = {
                                        title: cfg.title,
                                        flowCfg: cfg,
                                        formUrl: cfg.formUrl + "Edit.html",
                                        formItems: items,
                                        topcmds: [
                                            {
                                                "close": false,
                                                "name": "yesSaveBtn",
                                                "index": 10,
                                                "value": yes_global_tip_btn_save,
                                                "callback": function (cb) {
                                                    if (cb.submitCheck && !cb.submitCheck()) {
                                                        return;
                                                    }
                                                    var iform = cb.iform;
                                                    yesajax.post({
                                                        url: cfg.isBase ? yes_config_basedoc_save : yes_config_doc_save,
                                                        data: iform.serialize() + "&yesap_db=" + encodeURIComponent(cfg.dbName),
                                                        callback: function (data) {
                                                            if (data.rs) {
                                                                yesbox.addMsg(yes_global_tip_btn_submit_success);
                                                                if (cfg.callback) {
                                                                    cfg.callback();
                                                                }
                                                                if (data.AppDatas) {
                                                                    data = data.AppDatas;
                                                                    for (var docId in data) {
                                                                        var doc = data[docId];
                                                                        var items = yes.getDocItems(doc);
                                                                        cfg.formItems = items;
                                                                        var key = iform.find("input[name='UniversalID']");
                                                                        if (key.length > 0) {
                                                                            key.val(docId);
                                                                        } else {
                                                                            iform.append('<input type="hidden" name="UniversalID" value="' + docId + '" />');
                                                                        }
                                                                        if (cb.saveOK) {
                                                                            cb.saveOK();
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                yesbox.showError(data.msg);
                                                                iform.find("input[name='" + data.fld + "']").focus();
                                                                iform.find("input[name='" + data.fld + "']").select();
                                                            }
                                                        }
                                                    });
                                                }
                                            }, {
                                                "close": false,
                                                "name": "yesSaveQuitBtn",
                                                "index": 20,
                                                "value": yes_global_tip_btn_savequit,
                                                "callback": function (cb) {
                                                    if (cb.submitCheck && !cb.submitCheck()) {
                                                        return;
                                                    }
                                                    var iform = cb.iform;
                                                    yesajax.post({
                                                        url: cfg.isBase ? yes_config_basedoc_save : yes_config_doc_save,
                                                        data: iform.serialize() + "&yesap_db=" + encodeURIComponent(cfg.dbName),
                                                        callback: function (data) {
                                                            if (data.rs) {
                                                                yesbox.addMsg(yes_global_tip_btn_submit_success);
                                                                if (cfg.callback) {
                                                                    cfg.callback();
                                                                }
                                                                if (data.AppDatas) {
                                                                    data = data.AppDatas;
                                                                    for (var docId in data) {
                                                                        var doc = data[docId];
                                                                        var items = yes.getDocItems(doc);
                                                                        cfg.formItems = items;
                                                                        var key = iform.find("input[name='UniversalID']");
                                                                        if (key.length > 0) {
                                                                            key.val(docId);
                                                                        } else {
                                                                            iform.append('<input type="hidden" name="UniversalID" value="' + docId + '" />');
                                                                        }
                                                                    }
                                                                }
                                                                if (cb.saveOK) {
                                                                    cb.saveOK();
                                                                }
                                                                yes.closeDialog();
                                                            } else {
                                                                yesbox.showError(data.msg);
                                                                iform.find("input[name='" + data.fld + "']").focus();
                                                                iform.find("input[name='" + data.fld + "']").select();
                                                            }
                                                        }
                                                    });
                                                }
                                            }]
                                    };
                                    yes.openDialog(cfg2.title, cfg2.formUrl, {data: cfg2});
                                }
                            }
                        });
                    } else {
                        yesdoc.read(cfg);
                    }
                }
            });
        }
    }
})(jQuery);