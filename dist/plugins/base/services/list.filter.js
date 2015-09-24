define([], function () {

    //if (key == "json") {
    //    col.displayName = "预约的手机号码";
    //    col.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"phoneNumbers" }}</div>';
    //    columnDefs.push(col);
    //
    //    var col2 = {name: key + "2", displayName: name};
    //    col2.displayName = "预约的短信内容";
    //    col2.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"message" }}</div>';
    //    columnDefs.push(col2);
    //} else {
    //    columnDefs.push(col);
    //}
    
    return {
        'beforeSave': function () {

        }
    };
});