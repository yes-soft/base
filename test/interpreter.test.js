var should = require('chai').should();

var interpreter = require('./interpreter');
var smsConfig = require('./sms.js');


describe("配置解释", function () {


    it("应该要能取到标题,节点在未进行配置的时候", function (done) {
        var json = interpreter.explain(smsConfig, 'app');
        json.should.have.property('title').equal('短信平台');
        done();
    });


    //it("应该要能取到标题,节点在未进行配置的时候", function (done) {
    //    var json = interpreter.explain(smsConfig, 'app');
    //    json.should.have.property('title');
    //    done();
    //});

});