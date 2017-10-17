const gulp = require("gulp");
const spawn = require("child_process").spawn;
const ts = require("gulp-typescript");
const runSequence = require("run-sequence");
const del = require("del");
const tsProject = ts.createProject("tsconfig.json");

var node;

gulp.task("server", () => {
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

gulp.task("default", () => {
  runSequence(["scripts", "assets"], "server");

  gulp.watch(
    ["src/*.ts", "src/**/*.ts", "src/*.json", "src/**/*.json"],
    function() {
      runSequence(["scripts", "assets"], "server");
    }
  );
});

gulp.task("build", () => {
  runSequence("clean", ["scripts", "assets"]);
});

gulp.task("clean", () => {
  return del("dist/**", { force: true });
});

gulp.task("scripts", () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task("assets", () => {
  return gulp.src(["src/*.json", "src/**/*.json"]).pipe(gulp.dest("dist"));
});

// clean up if an error goes unhandled.
process.on("exit", () => {
  if (node) node.kill();
});
