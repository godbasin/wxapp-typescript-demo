var gulp = require("gulp");
var path = require("path");
var rename = require("gulp-rename");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var changed = require("gulp-changed");
var autoprefixer = require("autoprefixer");
var clear = require("gulp-clean");
var del = require("del");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");
var jsonTransform = require("gulp-json-transform");
var projectConfig = require("./package.json");

const through = require("through2");
const dependency = require("dependency-tree");
const webpack = require("webpack");
const readPkg = require("read-pkg-up");
const matches = require("match-requires");

function handlerRelivePaht(relative) {
  if (path.sep === "\\") {
    relative = relative.split(path.sep).join("/");
  }
  return /^\./.test(relative) ? relative : `./${relative}`;
}

//项目路径
var option = {
  base: "src",
  allowEmpty: true
};
// 此处为输出目录
var builtPath = "dist";

var dist = __dirname + "/" + builtPath;
var copyPath = ["src/**/!(_)*.*", "!src/**/*.less", "!src/**/*.ts"];
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

// 增加dependencies
var dependencies = projectConfig && projectConfig.dependencies; // dependencies配置
var nodeModulesCopyPath = [];
for (let d in dependencies) {
  nodeModulesCopyPath.push("node_modules/" + d + "/**/*");
}
//项目路径
var copyNodeModuleOption = {
  base: ".",
  allowEmpty: true
};

// //复制依赖的node_modules文件
// gulp.task("copyNodeModules", () => {
//   return gulp
//     .src(nodeModulesCopyPath, copyNodeModuleOption)
//     .pipe(gulp.dest(dist));
// });
// //复制依赖的node_modules文件(只改动有变动的文件）
// gulp.task("copyNodeModulesChange", () => {
//   return gulp
//     .src(nodeModulesCopyPath, copyNodeModuleOption)
//     .pipe(changed(dist))
//     .pipe(gulp.dest(dist));
// });
// // 根据denpende生成package.json
// gulp.task("generatePackageJson", () => {
//   return gulp
//     .src("./package.json")
//     .pipe(
//       jsonTransform(function(data, file) {
//         return {
//           dependencies: dependencies
//         };
//       })
//     )
//     .pipe(gulp.dest("dist"));
// });

gulp.task("npm", () => {
  return gulp
    .src(`${builtPath}/**/*.js`)
    .pipe(
      npm({
        dest: builtPath
      })
    )
    .pipe(gulp.dest(builtPath));
});

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
    .pipe(gulp.dest(builtPath));
});

//监听
gulp.task("watch", () => {
  gulp.watch(tsPath, gulp.series("tsCompile", "npm"));
  var watcher = gulp.watch(copyPath, gulp.series("copyChange"));
  // gulp.watch(nodeModulesCopyPath, gulp.series("copyNodeModulesChange"));
  gulp.watch(watchLessPath, gulp.series("less")); //Change
  watcher.on("unlink", function(filepath) {
    var filePathFromSrc = path.relative(path.resolve("src"), filepath);
    // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
    var destFilePath = path.resolve(builtPath, filePathFromSrc);
    // console.log({filepath, filePathFromSrc, destFilePath})
    del.sync(destFilePath);
  });
});

//开发并监听
gulp.task(
  "default",
  gulp.series(
    // sync
    gulp.parallel(
      "copy",
      // "copyNodeModules",
      // "generatePackageJson",
      "less",
      "tsCompile"
    ),
    "npm",
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
      // "copyNodeModules",
      // "generatePackageJson",
      "less",
      "tsCompile"
    ),
    "npm"
  )
);

function npm(options) {
  const npmCache = {};
  const { dest = "dist" } = options;
  return through.obj((file, encoding, callback) => {
    // console.log(file);
    if (file.isNull()) {
      return callback(null, file);
    }
    const cwd = file.cwd;
    const filePath = file.path;
    // console.log(filePath);
    const srcReg = new RegExp(`(\\${path.sep})src(?=\\${path.sep})`, "i");
    const fileDistPath = path.dirname(filePath.replace(srcReg, `$1${dest}`));
    let codeStr = file.contents.toString();
    const tree = dependency({
      filename: filePath,
      directory: cwd,
      detective: {
        es6: {
          mixedImports: true
        }
      },
      filter: path => {
        return /node_modules/i.test(path);
      }
    });

    const dependencyTree = tree[filePath];
    if (/[^\w_.-]async(?![\w_.-])/.test(codeStr)) {
      const regeneratorPath = path.join(
        cwd,
        "node_modules",
        "regenerator-runtime/runtime-module.js"
      );
      dependencyTree[regeneratorPath] = {};
      codeStr = `import regeneratorRuntime from 'regenerator-runtime'\n${codeStr}`;
    }

    Object.keys(dependencyTree).forEach(entry => {
      const dirname = path.dirname(entry);
      const { pkg } = readPkg.sync({
        cwd: dirname
      });
      let moduleName = pkg.name;
      const outputFileName = path.basename(entry);
      const distPath = path.join(cwd, dest, "npm", moduleName);
      const outputFilePath = path.join(distPath, outputFileName);
      const importReg = new RegExp(
        `import\\s*(\\{?\s*[\\w_-]+\\s*\\}?)\\s*from\\s*['"]${moduleName}(?:[\\w_\\/-]+)*['"]`,
        "i"
      );
      codeStr = codeStr.replace(
        importReg,
        `import $1 from '${handlerRelivePaht(
          path.relative(fileDistPath, outputFilePath)
        )}'`
      );

      const match = matches(codeStr);

      match.forEach(function(m) {
        if (m.name.indexOf("../") === -1 && m.name.indexOf("./") === -1) {
          // 判断m.variable，是否存在
          let templ;
          if (m.variable) {
            templ = `var ${m.variable} = require('${handlerRelivePaht(
              path.relative(fileDistPath, outputFilePath)
            )}')`;
          } else {
            templ = `require('${handlerRelivePaht(
              path.relative(fileDistPath, outputFilePath)
            )}')`;
          }
          codeStr = codeStr.replace(m.string, templ);
        }
      });

      if (!npmCache[entry]) {
        webpack(
          {
            mode: "production",
            entry,
            output: {
              filename: outputFileName,
              path: distPath,
              libraryTarget: "commonjs2"
            }
          },
          error => {
            if (error) {
              console.error(error);
            }
          }
        );
        npmCache[entry] = outputFilePath;
      }
    });
    file.contents = Buffer.from(codeStr);

    return callback(null, file);
  });
}
