(function ($) {
    var $navlist, $tabs, $listWrap;

    function resizeLayout() {
        var winHeight = $(window).height();
        var searchAreaHeight = $(".search-controls").height();
        var tabContentHeight = winHeight - 115;
        if (!$navlist)
            return;
        $navlist.height(tabContentHeight);
        $.each($tabs, function (i, ele) {
            $(ele).height(tabContentHeight);
        });

        var gridHeight = winHeight - searchAreaHeight - 124;
        var $grid = $listWrap.find('.ui-grid');
        $grid.height(gridHeight);

    }

    $(document).ready(function () {
        $(window).resize(function () {
            resizeLayout();
        });

        setTimeout(function () {
            $navlist = $('#navlist');
            $listWrap = $('.list-wrap');
            $tabs = $navlist.find('.tab-content');
            $(window).trigger('resize');
        }, 1000);

        setTimeout(function () {
            $(window).trigger('resize');
        }, 3000)
    });
})(jQuery);