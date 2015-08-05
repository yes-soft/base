var gulp = require('gulp'),
    fs = require("fs"),
    del = require('del'),
    concat = require('gulp-concat'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify');
var path = require('path');
var buildDist = "./sms-web-client/static/vendor/app/";

gulp.task('concat-css',function(){
    gulp.src([

    ]).pipe();

});

gulp.task('clean',function(cb){
    del([
        buildDist
        // we don't want to clean this file though so we negate the pattern
        //'!dist/mobile/deploy.json'
    ], cb);
});

gulp.task('concat', function () {
    gulp.src([
        './bower_components/angular/angular.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        './bower_components/angular-cookie/angular-cookie.js',
        './bower_components/angular-resource/angular-resource.js',
        './bower_components/angular-sanitize/angular-sanitize.js',
        './bower_components/angular-touch/angular-touch.js',
        './bower_components/angular-translate/angular-translate.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/angular-ui-utils/ui-utils.js',
        './bower_components/angular-ui-grid/ui-grid.js',
        //'./bower_components/angular-schema-form/dist/bootstrap-decorator.js',
        //'./bower_components/angular-schema-form/dist/schema-form.js',
        './bower_components/ngstorage/ngStorage.js',
        './bower_components/oclazyload/dist/oclazyload.js',
        './bower_components/moment/min/moment-with-locales.js',
        './bower_components/angular-moment/angular-moment.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildDist))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(buildDist));
});

gulp.task('default', ['clean','concat']);