// Packages for css
var gulp                = require('gulp'),
    concat              = require('gulp-concat'),
    sourcemaps          = require('gulp-sourcemaps'),
    sass                = require('gulp-sass'),
    postcss             = require('gulp-postcss');
// Packages for postcss
var autoprefixer        = require('autoprefixer'),
    // lost             = require('lost'),
    csswring            = require('csswring');

var browserSync         = require('browser-sync'),
    uglify              = require('gulp-uglify'),
    webpack             = require('webpack'),
    webpackStream       = require('webpack-stream'),
    webpackConfig       = require('./webpack.config.js'),
    webpackConfigBuild  = require('./webpackBuild.config.js'),
    pug                 = require('gulp-pug'),
    del                 = require('del'),
    rename              = require('gulp-rename'),
    svgSprite           = require('gulp-svg-sprites'),
    spritesmith         = require('gulp.spritesmith'),
    connect             = require('gulp-connect-php');


var path = {
    src: {
        sass:       'app/src/sass',
        node:       'node_modules',
        js:         'app/src/js/**/*.js',
        pug:        'app/src/pug',
        img:        'app/src/img',
        spritesAss: 'app/src/img/sprites-assets',
        sprites:    'app/src/img/sprites',
        fonts:      'app/src/fonts'
    },
    dest: {
        css:        'app/css',
        js:         'app/js',
        pug:        'app',
        img:        'app/img',
        fonts:      'app/fonts'
    },
    build:          'build'
};


/* CSS styles */

// gulp.task('normalize', function(){ // npm пакет больше не требуется, normalize заменен на bootstrap reboot
//     return gulp.src([
//         'node_modules/normalize.css/normalize.css',
//     ])
//     .pipe(postcss([
//         csswring()
//     ]))
//     .pipe(gulp.dest('app/css'))
// });


gulp.task('bootstrap-add', function() { // only for import b4 components/ will be compability with custom grid?
    return gulp.src([
        path.src.sass + '/base/bootstrap.scss',
    ])
    .pipe(concat('bootstrap.min.css'))
    .pipe(sass())
    .pipe(postcss([
        // autoprefixer({
        //     browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
        //     cascade: true }),
        csswring()
    ]))
    .pipe(gulp.dest(path.dest.css))
});


gulp.task('bootstrap', function() { // по дефолту просто перетаскиваем уже скомпилированные стили
    return gulp.src(path.src.sass + '/compiled/base.min.css')
    .pipe(gulp.dest(path.dest.css))
});


gulp.task('bootstrap-ruby', function() {
    return gulp.src([
        path.src.sass + '/base/bootstrap-ruby.scss',
    ])
    .pipe(concat('base.min.css'))
    .pipe(sass())
    .pipe(postcss([
        csswring()
    ]))
    .pipe(gulp.dest(path.src.sass + '/compiled'))
});

var stylesLibs = [
    // path.src.node + '/test/dist/test.css',
]
gulp.task('styles-libs-dev', function() {
    return gulp.src(stylesLibs)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.min.css'))
    .pipe(postcss([
      autoprefixer({
          browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
          cascade: true }),
      csswring()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css))
});
gulp.task('styles-libs-build', function() {
    return gulp.src(stylesLibs)
    .pipe(concat('libs.min.css'))
    .pipe(postcss([
      autoprefixer({
          browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
          cascade: true }),
      csswring()
    ]))
    .pipe(gulp.dest(path.dest.css))
});


// gulp.task('bootstrap-old', function() { // не работает, кастомные стили не перезаписываются
//     return gulp.src([
//         'app/src/sass/abstracts/b4-variables.scss',
//         'node_modules/bootstrap/scss/_functions.scss',
//         'node_modules/bootstrap/scss/_variables.scss',
//         'node_modules/bootstrap/scss/_mixins.scss',
//         'node_modules/bootstrap/scss/_reboot.scss',
//         'node_modules/bootstrap/scss/_grid.scss',
//         'node_modules/bootstrap/scss/_buttons.scss',
//         // 'node_modules/bootstrap/scss/_utilities.scss',
//     ])
//     .pipe(concat('bootstrap.css'))
//     .pipe(sass())
//     .pipe(gulp.dest('app/css/'))
// });

var styles = [
    path.src.sass + '/abstracts/variables.sass',
    path.src.sass + '/abstracts/mixins.sass',
    path.src.sass + '/**/*.sass'
]
gulp.task('styles-dev', function() {
    return gulp.src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.sass'))
    .pipe(sass())
    .pipe(postcss([
        // lost(),
        autoprefixer({
            browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
            cascade: true }),
        csswring()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css))
    .pipe(browserSync.reload({
        stream: true
    }));
});


gulp.task('styles-build', function() {
    return gulp.src(styles)
    .pipe(concat('main.min.sass'))
    .pipe(sass())
    .pipe(postcss([
        // lost(),
        autoprefixer({
            browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
            cascade: true }),
        csswring()
    ]))
    .pipe(gulp.dest(path.dest.css))
    .pipe(browserSync.reload({
        stream: true
    }));
});


gulp.task('fonts', function() {
    return gulp.src(path.src.fonts + '/**/*.*')
    .pipe(gulp.dest(path.dest.fonts))
});


/* Scripts */

gulp.task('scripts-libs', function () {
    return gulp.src([
        // path.src.node + '/es5-shim/es5-shim.min.js', // example for ie
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dest.js));
});


gulp.task('scripts-dev', function () {
    gulp.src(path.src.js)
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(path.dest.js))
    .pipe(browserSync.reload({
        stream: true
    }));
});
gulp.task('scripts-build', function () {
    gulp.src(path.src.js)
    .pipe(webpackStream(webpackConfigBuild), webpack)
    .pipe(gulp.dest(path.dest.js))
    .pipe(browserSync.reload({
        stream: true
    }));
});


/* Pug */

gulp.task('pug-upd', function() {
    gulp.src(path.src.pug + '/*.pug')
    .pipe(pug({
        pretty: '    '
    }))
    .pipe(gulp.dest(path.dest.pug))
    .pipe(browserSync.reload({
        stream: true
    }));
});


/* Sprites */

gulp.task('sprite-svg-make', function() {
    return gulp.src(path.src.spritesAss + '/svg/**/*.svg')
    .pipe(svgSprite({
        mode: 'symbols',
        selector: 'icon-%f'
    }))
    .pipe(gulp.dest(path.src.sprites))
});


gulp.task('sprite-svg-upd', ['sprite-svg-make'], function() {
    var svgSpriteCopy = gulp.src(path.src.sprites + '/svg/symbols.svg')
    .pipe(rename('svg-sprite.svg'))
    .pipe(gulp.dest(path.dest.img))
});


gulp.task('sprite-img-upd', function() { // it was sprite-img-make
    var spriteData = gulp.src(path.src.spritesAss + '/img/**/*.png').pipe(spritesmith({
        imgName: 'img-sprite.png',
        cssName: 'img-sprite.sass',
        algorithm: 'binary-tree'
    }));
    // spriteData.img.pipe(gulp.dest('app/src/img/sprites/img'));
    spriteData.img.pipe(gulp.dest(path.dest.img));
    spriteData.css.pipe(gulp.dest(path.src.sprites + '/img'));
    return spriteData
});


gulp.task('just-img', function() {
    gulp.src(path.src.img + '/*.*')
    .pipe(gulp.dest(path.dest.img))
    .pipe(browserSync.reload({
        stream: true
    }));
});


// // doesn't work
// gulp.task('sprite-img-upd', ['sprite-img-make'], function() {
//     var imgSpriteCopy = gulp.src('app/src/img/sprites/img/img-sprite.png')
//     .pipe(rename('jjj.png'))
//     .pipe(gulp.dest('app/img'))
// });


gulp.task('sprite-img-styles', function() {
    return gulp.src(path.src.sprites + '/img/img-sprite.sass')
    .pipe(gulp.dest(path.src.sass + '/sprites'))
});

/* Watchers */

gulp.task('watch', ['browser-sync', 'bootstrap', 'fonts', 'just-img', 'styles-libs-dev', 'styles-dev', 'scripts-libs', 'scripts-dev', 'sprite-svg-upd', 'sprite-img-upd', 'pug-upd'], function() {
    gulp.watch(path.src.sass + '/**/*.sass', ['styles-dev']);
    gulp.watch(path.src.spritesAss + '/svg/**/*.svg', ['sprite-svg-upd']);
    gulp.watch(path.src.spritesAss + '/img/**/*.png', ['sprite-img-upd']);
    gulp.watch(path.src.pug + '/**/*.pug', ['pug-upd']);
    // gulp.watch('app/src/js/**/*.js', ['scripts'], browserSync.reload);
    gulp.watch(path.src.js, ['scripts-dev']);
    gulp.watch(path.src.fonts, ['fonts']);
    gulp.watch(path.src.img + '/*.*', ['just-img']);
});

gulp.task('watch-php', ['php-server', 'bootstrap', 'fonts', 'just-img', 'styles-libs-dev', 'styles-dev', 'scripts-libs', 'scripts-dev', 'sprite-svg-upd', 'sprite-img-upd', 'pug-upd'], function() {
    gulp.watch(path.src.sass + '/**/*.sass', ['styles-dev']);
    gulp.watch(path.src.spritesAss + '/svg/**/*.svg', ['sprite-svg-upd']);
    gulp.watch(path.src.spritesAss + '/img/**/*.png', ['sprite-img-upd']);
    gulp.watch(path.src.pug + '/**/*.pug', ['pug-upd']);
    // gulp.watch('app/src/js/**/*.js', ['scripts'], browserSync.reload);
    gulp.watch(path.src.js, ['scripts-dev']);
    gulp.watch(path.src.fonts, ['fonts']);
    gulp.watch(path.src.img + '/*.*', ['just-img']);

    gulp.watch('app/**/*.php', browserSync.reload);
});


/* Build */

gulp.task('clean', function() {
    return del.sync(path.build);
});


gulp.task('build', ['clean', 'bootstrap', 'fonts', 'just-img', 'styles-libs-build', 'styles-build', 'scripts-libs', 'scripts-build', 'sprite-svg-upd', 'pug-upd'], function() {
    var buildCss = gulp.src([
        path.dest.css + '/base.min.css',
        path.dest.css + '/libs.min.css',
        path.dest.css + '/main.min.css',
    ])
    .pipe(gulp.dest(path.build + '/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest(path.build + '/fonts'));

    var buildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest(path.build + '/js'));

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest(path.build));

    var buildAllImages = gulp.src('app/img/*.*')
    .pipe(gulp.dest(path.build + '/img'));

});


/* Utilities */

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});


gulp.task('php-server', function() {
    connect.server({
        base: 'app'
    }, function() {
        browserSync({
            proxy: 'smev' // virtual server
        });
    });
});


gulp.task('default', ['watch']);

// // Old vriations concat sass + postcss
// gulp.task('styles0', ['sass'], function() {
//     return gulp.src('app/temp/main.css')
//         .pipe(sourcemaps.init())
//         // .pipe(sass())
//         .pipe(postcss([
//           lost(),
//           autoprefixer({
//               browsers: ['last 10 versions', '> 5%', 'ie 8', 'ie 7'],
//               cascade: true }),
//         //   csswring()
//         ]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('app/dest/'))
// });
//
// gulp.task('sass0', function() {
//     return gulp.src([
//         'app/sass/abstracts/variables.sass',
//         'app/sass/abstracts/mixins.sass',
//         'app/sass/**/*.sass',
//         // '!app/sass/libs.sass'
//     ])
//     .pipe(sourcemaps.init())
//     .pipe(concat('main.sass'))
//     .pipe(sass())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('app/temp/'))
// })
