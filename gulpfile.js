var gulp = require('gulp'),
    fs = require("fs"),
    del = require('del'),
    concat = require('gulp-concat'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var inject = require('gulp-inject');
var annotate = require('gulp-ng-annotate');
var es = require('event-stream');
var path = require('path');

var dist = "./dist/";
var distBase = dist + "base/";
var scripts = "scripts";

gulp.task('clean', function (cb) {
    return del([
        dist
    ], cb);
});

gulp.task('copy-vendor', function () {
    return gulp.src('./src/base/vendor/**/*')
        .pipe(gulp.dest(distBase + "vendor"));
});

gulp.task('require-js', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/vendor/require.js']
    )
        .pipe(concat('require.js'))
        .pipe(gulp.dest(distBase + scripts));
});

gulp.task('jquery', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/vendor/jquery.min.js']
    )
        .pipe(concat('jquery.min.js'))
        .pipe(gulp.dest(distBase + scripts));
});

gulp.task('scripts', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/yes.bundle.js',
            './components/yes-utils/dist/yes.utils.js',
            './components/yes-bundle/dist/vendor/bootstrap/js/bootstrap.js',
            './components/yes-bundle/dist/vendor/ui-bootstrap-tpls.js',
            './components/yes-bundle/dist/vendor/toaster/angular-toastr.tpls.js',
            './components/yes-bundle/dist/vendor/angular-ui-grid/ui-grid.js',
            './components/yes-bundle/dist/vendor/tv4.js',
            './components/yes-bundle/dist/vendor/ObjectPath.js',
            './components/yes-bundle/dist/vendor/ng-dialog/ngDialog.js',
            './components/yes-bundle/dist/vendor/angular-file-upload.min.js',
            './components/yes-bundle/dist/vendor/select2/select2.js',
            './components/yes-bundle/dist/vendor/select2/select2_locale_zh-CN.js',
            './src/base/vendor/angular-schema-form/schema-form.js',
            './src/base/vendor/select2/select.js',
            './src/base/vendor/extra/angular-translate-loader-partial.js',
            './components/yes-ui/dist/yes.ui.js'
        ]
    )
        .pipe(concat('yes.app.js'))
        .pipe(gulp.dest(distBase + scripts))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase + scripts));
});


gulp.task('raw-files', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/yes.bundle.js',
            './components/yes-utils/dist/yes.utils.js',
            './components/yes-bundle/dist/vendor/bootstrap/js/bootstrap.js',
            './components/yes-bundle/dist/vendor/ui-bootstrap-tpls.js',
            './components/yes-bundle/dist/vendor/toaster/angular-toastr.tpls.js',
            './components/yes-bundle/dist/vendor/angular-ui-grid/ui-grid.js',
            './components/yes-bundle/dist/vendor/tv4.js',
            './components/yes-bundle/dist/vendor/ObjectPath.js',
            './components/yes-bundle/dist/vendor/ng-dialog/ngDialog.js',
            './components/yes-bundle/dist/vendor/angular-file-upload.min.js',
            './components/yes-bundle/dist/vendor/select2/select2.js',
            './components/yes-bundle/dist/vendor/select2/select2_locale_zh-CN.js',
            './src/base/vendor/angular-schema-form/schema-form.js',
            './src/base/vendor/select2/select.js',
            './components/angular-translate-loader-partial/angular-translate-loader-partial.js',
            './components/yes-ui/dist/yes.ui.js'
        ]
    )
        //.pipe(concat('yes.app.js'))
        //.pipe(gulp.dest(distBase + scripts))
        //.pipe(uglify())
        //.pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase + scripts));
});


gulp.task('css', function () {
    return gulp.src([
        'src/base/css/style.css'
    ]).pipe(concat('main.css'))
        .pipe(gulp.dest(distBase + 'css'));
});

gulp.task('css-vendor', function () {
    return gulp.src([
        'components/yes-bundle/dist/vendor/angular-ui-grid/ui-grid.min.css',
        'components/yes-bundle/dist/vendor/toaster/angular-toastr.css',
        'components/yes-bundle/dist/vendor/ng-dialog/ngDialog.css',
        'components/yes-bundle/dist/vendor/ng-dialog/ngDialog-theme-default.css',
        'components/yes-bundle/dist/vendor/ng-dialog/ngDialog-theme-plain.css',
        'components/yes-bundle/dist/vendor/select2/select2.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(distBase + 'css'));
});

gulp.task('copy-plugins', function () {
    return gulp.src('./src/plugins/**/*')
        .pipe(gulp.dest(dist + "plugins"));
});

gulp.task('copy-fonts', function () {
    return gulp.src([
        'components/yes-bundle/dist/vendor/angular-ui-grid/**/*.ttf',
        'components/yes-bundle/dist/vendor/angular-ui-grid/**/*.svg',
        'components/yes-bundle/dist/vendor/angular-ui-grid/**/*.woff',
        'components/yes-bundle/dist/vendor/angular-ui-grid/**/*.eot'
    ])
        .pipe(gulp.dest(distBase + "css"));
});

gulp.task('copy-data', function () {
    return gulp.src('./src/data/**/*')
        .pipe(gulp.dest(dist + "data"));
});

gulp.task('default', ['scripts', 'css', 'css-vendor', 'copy-fonts',
        'copy-vendor', 'copy-plugins', 'copy-data', 'require-js', 'jquery'],
    function () {

        var target = gulp.src('./src/dist.html').pipe(rename('index.html'));

        var js = gulp.src([
            'base/scripts/yes.app.min.js'
        ], {read: false, cwd: dist});

        var css = gulp.src([
            'base/css/vendor.css',
            'base/css/main.css'
        ], {read: false, cwd: dist});

        target
            .pipe(inject(css, {addRootSlash: false}))
            .pipe(inject(js, {addRootSlash: false}))
            .pipe(gulp.dest(dist));
    });