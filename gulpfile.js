(() => {
  "use strict";

  // Packages for css
  const gulp = require("gulp"),
    builder = require("./builder"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss");

  // Packages for postcss
  const autoprefixer = require("autoprefixer"),
    csswring = require("csswring");

  const browserSync = require("browser-sync"),
    uglify = require("gulp-uglify"),
    webpack = require("webpack"),
    webpackStream = require("webpack-stream"),
    webpackConfig = require("./webpack.config.js"),
    webpackConfigBuild = require("./webpackBuild.config.js"),
    pug = require("gulp-pug"),
    del = require("del"),
    rename = require("gulp-rename"),
    svgSprite = require("gulp-svg-sprites"),
    spritesmith = require("gulp.spritesmith"),
    connect = require("gulp-connect-php");

  const path = {
    src: {
      sass: "app/src/sass",
      node: "node_modules",
      js: "app/src/js/**/*.js",
      pug: "app/src/pug",
      img: "app/src/img",
      spritesAss: "app/src/img/sprites-assets",
      sprites: "app/src/img/sprites",
      fonts: "app/src/fonts"
    },
    dest: {
      css: "app/css",
      js: "app/js",
      pug: "app",
      img: "app/img",
      fonts: "app/fonts"
    },
    build: "build"
  };

  const bootstrapAdd = () => {
    // only for import b4 components/ will be compability with custom grid?
    return gulp
      .src([path.src.sass + "/base/bootstrap.scss"])
      .pipe(concat("bootstrap.min.css"))
      .pipe(sass())
      .pipe(
        postcss([
          // autoprefixer({
          //     browsers: ['last 15 versions', '> 5%', 'ie 8', 'ie 7'],
          //     cascade: true }),
          csswring()
        ])
      )
      .pipe(gulp.dest(path.dest.css));
  };

  const bootstrap = () => {
    // по дефолту просто перетаскиваем уже скомпилированные стили
    return gulp
      .src(path.src.sass + "/compiled/base.min.css")
      .pipe(gulp.dest(path.dest.css));
  };

  const bootstrapRuby = () => {
    return gulp
      .src([path.src.sass + "/base/bootstrap-ruby.scss"])
      .pipe(concat("base.min.css"))
      .pipe(sass())
      .pipe(postcss([csswring()]))
      .pipe(gulp.dest(path.src.sass + "/compiled"));
  };

  const stylesLibsDev = (done) => {
    if (!builder.stylesLibs.length) {
      done();
    } else {
      return gulp
        .src(builder.stylesLibs)
        .pipe(sourcemaps.init())
        .pipe(concat("libs.min.css"))
        .pipe(
          postcss([
            autoprefixer({
              browsers: ["last 15 versions", "> 5%", "ie 8", "ie 7"],
              cascade: true
            }),
            csswring()
          ])
        )
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.dest.css));
    }
  };

  const stylesLibsBuild = (done) => {
    if (!builder.stylesLibs.length) {
      done();
    } else {
      return gulp
        .src(builder.stylesLibs)
        .pipe(concat("libs.min.css"))
        .pipe(
          postcss([
            autoprefixer({
              browsers: ["last 15 versions", "> 5%", "ie 8", "ie 7"],
              cascade: true
            }),
            csswring()
          ])
        )
        .pipe(gulp.dest(path.dest.css));
    }
  };

  const styles = [
    path.src.sass + "/abstracts/variables.sass",
    path.src.sass + "/abstracts/mixins.sass",
    path.src.sass + "/**/*.sass"
  ];

  const stylesDev = () => {
    return gulp
      .src(styles)
      .pipe(sourcemaps.init())
      .pipe(concat("main.min.sass"))
      .pipe(sass())
      .pipe(
        postcss([
          // lost(),
          autoprefixer({
            browsers: ["last 15 versions", "> 5%", "ie 8", "ie 7"],
            cascade: true
          }),
          csswring()
        ])
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(path.dest.css))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  const stylesBuild = () => {
    return gulp
      .src(styles)
      .pipe(concat("main.min.sass"))
      .pipe(sass())
      .pipe(
        postcss([
          // lost(),
          autoprefixer({
            browsers: ["last 15 versions", "> 5%", "ie 8", "ie 7"],
            cascade: true
          }),
          csswring()
        ])
      )
      .pipe(gulp.dest(path.dest.css))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  const fonts = () => {
    return gulp
      .src(path.src.fonts + "/**/*.*")
      .pipe(gulp.dest(path.dest.fonts));
  };

  /* Scripts */

  const scriptsLibs = (done) => {
    if (!builder.scriptsLibs.length) {
      done();
    } else {
      return gulp
        .src(builder.scriptsLibs)
        .pipe(concat("libs.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(path.dest.js));
    }
  };

  const scriptsDev = () => {
    return gulp
      .src(path.src.js)
      .pipe(webpackStream(webpackConfig), webpack)
      .pipe(gulp.dest(path.dest.js))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  const scriptsBuild = () => {
    return gulp
      .src(path.src.js)
      .pipe(webpackStream(webpackConfigBuild), webpack)
      .pipe(gulp.dest(path.dest.js))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  /* Pug */

  const pugUpd = () => {
    return gulp
      .src(path.src.pug + "/*.pug")
      .pipe(
        pug({
          pretty: "    "
        })
      )
      .pipe(gulp.dest(path.dest.pug))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  /* Sprites */

  const spriteSvgMake = () => {
    return gulp
      .src(path.src.spritesAss + "/svg/**/*.svg")
      .pipe(
        svgSprite({
          mode: "symbols",
          selector: "icon-%f"
        })
      )
      .pipe(gulp.dest(path.src.sprites));
  };

  const spriteSvgUpd = () => {
    return gulp
      .src(path.src.sprites + "/svg/symbols.svg")
      .pipe(rename("svg-sprite.svg"))
      .pipe(gulp.dest(path.dest.img));
  };

  const spriteImgUpd = () => {
    // it was sprite-img-make
    var spriteData = gulp.src(path.src.spritesAss + "/img/**/*.png").pipe(
      spritesmith({
        imgName: "img-sprite.png",
        cssName: "img-sprite.sass",
        algorithm: "binary-tree"
      })
    );
    // spriteData.img.pipe(gulp.dest('app/src/img/sprites/img'));
    spriteData.img.pipe(gulp.dest(path.dest.img));
    spriteData.css.pipe(gulp.dest(path.src.sprites + "/img"));
    return spriteData;
  };

  const justImg = () => {
    return gulp
      .src(path.src.img + "/*.*")
      .pipe(gulp.dest(path.dest.img))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
  };

  const spriteImgStyles = () => {
    return gulp
      .src(path.src.sprites + "/img/img-sprite.sass")
      .pipe(gulp.dest(path.src.sass + "/sprites"));
  };

  /* Watchers */

  const watch = () => {
    gulp.watch(path.src.sass + "/**/*.sass", stylesDev);
    gulp.watch(path.src.spritesAss + "/svg/**/*.svg", svgUpdSeries);
    gulp.watch(path.src.spritesAss + "/img/**/*.png", spriteImgUpd);
    gulp.watch(path.src.pug + "/**/*.pug", pugUpd);
    // gulp.watch('app/src/js/**/*.js', ['scripts'], browserSync.reload);
    gulp.watch(path.src.js, scriptsDev);
    gulp.watch(path.src.fonts, fonts);
    gulp.watch(path.src.img + "/*.*", justImg);
  };

  const watchPhp = () => {
    gulp.watch(path.src.sass + "/**/*.sass", stylesDev);
    gulp.watch(path.src.spritesAss + "/svg/**/*.svg", svgUpdSeries);
    gulp.watch(path.src.spritesAss + "/img/**/*.png", spriteImgUpd);
    gulp.watch(path.src.pug + "/**/*.pug", pugUpd);
    // gulp.watch('app/src/js/**/*.js', ['scripts'], browserSync.reload);
    gulp.watch(path.src.js, scriptsDev);
    gulp.watch(path.src.fonts, fonts);
    gulp.watch(path.src.img + "/*.*", justImg);

    gulp.watch("app/**/*.php", browserSync.reload);
  };

  /* Build */

  const clean = (done) => {
    done();
    return del.sync(path.build);
  };

  const build = (done) => {
    const buildCss = gulp
      .src(
        [
          path.dest.css + "/base.min.css",
          path.dest.css + "/libs.min.css",
          path.dest.css + "/main.min.css"
        ],
        { allowEmpty: true }
      )
      .pipe(gulp.dest(path.build + "/css"));

    const buildFonts = gulp
      .src("app/fonts/**/*")
      .pipe(gulp.dest(path.build + "/fonts"));

    const buildJs = gulp
      .src("app/js/**/*.js")
      .pipe(gulp.dest(path.build + "/js"));

    const buildHtml = gulp.src("app/*.html").pipe(gulp.dest(path.build));

    const buildAllImages = gulp
      .src("app/img/*.*")
      .pipe(gulp.dest(path.build + "/img"));

    done();
  };

  /* Utilities */

  const startBrowserSync = (done) => {
    browserSync({
      server: {
        baseDir: "app"
      },
      notify: false
    });
    done();
  };

  const phpServer = (done) => {
    connect.server(
      {
        base: "app"
      },
      function () {
        browserSync({
          proxy: "smev" // virtual server
        });
      }
    );
    done();
  };

  /**
   * Variables
   */
  const svgUpdSeries = gulp.series(spriteSvgMake, spriteSvgUpd);

  /**
   * Series
   */
  const watchSeries = gulp.series(
    startBrowserSync,
    bootstrap,
    fonts,
    justImg,
    stylesLibsDev,
    stylesDev,
    scriptsLibs,
    scriptsDev,
    svgUpdSeries,
    spriteImgUpd,
    pugUpd,
    watch
  );

  const buildSeries = gulp.series(
    clean,
    bootstrap,
    fonts,
    justImg,
    stylesLibsBuild,
    stylesBuild,
    scriptsLibs,
    scriptsBuild,
    svgUpdSeries,
    spriteImgUpd,
    pugUpd,
    build
  );

  const phpSeries = gulp.series(
    phpServer,
    bootstrap,
    fonts,
    justImg,
    stylesLibsDev,
    stylesDev,
    scriptsLibs,
    scriptsDev,
    svgUpdSeries,
    spriteImgUpd,
    pugUpd,
    watchPhp
  );

  /**
   * Exports
   */
  exports.default = watchSeries;
  exports.build = buildSeries;
  exports.php = phpSeries;
  exports.bsAdd = bootstrapAdd;
  exports.bsRuby = bootstrapRuby;
})();
