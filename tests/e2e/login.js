'use strict';

describe('登陆测试', function () {

    beforeEach(function () {
        browser.get('http://localhost:3000/src/index.html');
    });

    it('应跳转到首页在输入用户名和密码登录之后', function () {

        var username = element(by.model('filter.username'));
        var password = element(by.model('filter.password'));
        username.sendKeys('admin');
        password.sendKeys('admin2');

        element(by.css('.btn.btn-sm')).click();

        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/dashboard');
        });

        // expect(3).toEqual(3);
    });

    it('应跳转到首页在输入用户名和密码登录之后', function () {

        // http://localhost:3000/src/#/base/accounts

        // expect(3).toEqual(3);
    });


});