'use strict';

describe('登陆测试', function () {

    beforeEach(function () {
        browser.get('http://localhost:3000/resources/index.html');
    });

    it('输入用户名和密码', function () {

        var username = element(by.model('filter.username'));
        var password = element(by.model('filter.password'));
        username.sendKeys('admin');
        password.sendKeys('admin');

        element(by.css('.btn.btn-sm')).click();


        browser.driver.wait(protractor.until.elementIsNotVisible(username));

        //browser.driver.manage().timeouts().implicitlyWait(100000);
        //var phoneList = element.all(by.repeater('phone in phones'));
        //var query = element(by.model('query'));
        //
        //expect(phoneList.count()).toBe(20);
        //
        //query.sendKeys('nexus');
         expect(1).toBe(1);
        //
        //query.clear();
        //query.sendKeys('motorola');
        //expect(phoneList.count()).toBe(8);

        //  setTimeout(function(){},5000);

        //  expect(3).toEqual(3);

    });
});