var gulp = require("gulp");
var gulpsync = require("gulp-sync")(gulp);
var path = require("path");
var rename = require("gulp-rename");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var changed = require("gulp-changed");
var autoprefixer = require("autoprefixer");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var clear = require("gulp-clean");
var textTransformation = require("gulp-text-simple");
var del = require("del");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");

//项目路径
var option = {
  base: "src",
  allowEmpty: true
};
var dist = __dirname + "/dist";
var copyPath = [
  "src/**/!(_)*.*",
  "!src/**/*.less",
  "!src/**/*.ts",
  "!src/img/**"
];
var imgPath = ["src/img/*.{png,jpg,gif}"];
var lessPath = ["src/**/*.less", "src/app.less"];
var watchLessPath = ["src/**/*.less", "src/css/**/*.less", "src/app.less"];
var tsPath = ["src/**/*.ts", "src/app.ts"];

//清空目录
gulp.task("clear", () => {
  return gulp.src(dist, { allowEmpty: true }).pipe(clear());
});

//复制不包含less和图片的文件
gulp.task("copy", () => {
  return gulp.src(copyPath, option).pipe(gulp.dest(dist));
});
//复制不包含less和图片的文件(只改动有变动的文件）
gulp.task("copyChange", () => {
  return gulp
    .src(copyPath, option)
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});

//图片压缩
gulp.task("img", () => {
  return gulp
    .src(imgPath, option)
    .pipe(
      imagemin({
        progressive: true,
        use: [pngquant()]
      })
    )
    .pipe(gulp.dest(dist));
});
//图片压缩(只改动有变动的文件）
gulp.task("imgChange", () => {
  return gulp
    .src(imgPath, option)
    .pipe(changed(dist))
    .pipe(
      imagemin({
        progressive: true,
        use: [
          pngquant({
            quality: "65-80",
            speed: 4
          })
        ]
      })
    )
    .pipe(gulp.dest(dist));
});

/* 转换px为rpx，
 * 1.匹配数字(含小数点)结合px的字符串，例如55px或者0.5px，
 * 2.不匹配空格，不匹配base64编码，如EAAAAQAQAABA4pxA或者5 px
 */
var transformPxToRpx = function(s) {
  return s.replace(/\b(\d+(\.\d+)?)px\b/g, function(word) {
    return word.replace(/px/g, "rpx");
  });
};
var myTransformation = textTransformation(transformPxToRpx);

//编译less
gulp.task("less", () => {
  return gulp
    .src(lessPath, option)
    .pipe(
      less().on("error", function(e) {
        console.error(e.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer]))
    .pipe(myTransformation())
    .pipe(
      rename(function(path) {
        path.extname = ".wxss";
      })
    )
    .pipe(gulp.dest(dist));
});
//编译less(只改动有变动的文件）
gulp.task("lessChange", () => {
  return gulp
    .src(lessPath, option)
    .pipe(changed(dist))
    .pipe(
      less().on("error", function(e) {
        console.error(e.message);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer]))
    .pipe(myTransformation())
    .pipe(
      rename(function(path) {
        path.extname = ".wxss";
      })
    )
    .pipe(gulp.dest(dist));
});

// 编译
gulp.task("tsCompile", function() {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"));
});

//监听
gulp.task("watch", () => {
  gulp.watch(tsPath, gulp.series("tsCompile"));
  var watcher = gulp.watch(copyPath, gulp.series("copyChange"));
  gulp.watch(watchLessPath, gulp.series("less")); //Change
  gulp.watch(imgPath, gulp.series("imgChange"));
  watcher.on("change", function(event) {
    if (event.type === "deleted") {
      var filepath = event.path;
      var filePathFromSrc = path.relative(path.resolve("src"), filepath);
      // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
      var destFilePath = path.resolve("dist", filePathFromSrc);
      // console.log({filepath, filePathFromSrc, destFilePath})
      del.sync(destFilePath);
    }
  });
});

//开发并监听
gulp.task(
  "default",
  gulp.series(
    // sync
    gulp.parallel("copy", "img", "less", "tsCompile"),
    "watch"
  )
);

//上线
gulp.task(
  "build",
  gulp.series(
    // sync
    "clear",
    gulp.parallel(
      // async
      "copy",
      "img",
      "less",
      "tsCompile"
    )
  )
);
