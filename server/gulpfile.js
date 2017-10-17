const gulp = require("gulp");
const spawn = require("child_process").spawn;
const ts = require("gulp-typescript");
const runSequence = require("run-sequence");
const del = require("del");
const tsProject = ts.createProject("tsconfig.json");

var node;

gulp.task("server", function() {
  if (node) {
    node.kill();
  }
  node = spawn("node", ["dist/index.js"], { stdio: "inherit" });
  node.on("close", function(code) {
    if (code === 8) {
      gulp.log("Error detected, waiting for changes...");
    }
  });
});

gulp.task("default", function() {
  runSequence(["scripts", "assets"], "server");

  gulp.watch(
    ["src/*.ts", "src/**/*.ts", "src/*.json", "src/**/*.json"],
    function() {
      runSequence(["scripts", "assets"], "server");
    }
  );
});

gulp.task("build", function() {
  runSequence("clean", ["scripts", "assets"]);
});

gulp.task("clean", function() {
  return del("dist/**", { force: true });
});

gulp.task("scripts", () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task("assets", function() {
  return gulp.src(["src/*.json", "src/**/*.json"]).pipe(gulp.dest("dist"));
});

// clean up if an error goes unhandled.
process.on("exit", function() {
  if (node) node.kill();
});
