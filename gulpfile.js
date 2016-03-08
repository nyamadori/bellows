const g = require("gulp");
const $ = require("gulp-load-plugins")();
const connect = require("gulp-connect");
const espower = require("gulp-espower");

const port = 3000;

filename = "bellows";
file = `${filename}.js`;

// local server
g.task("connect", ()=>{
    connect.server({
        port: port,
        livereload: true
    });

    const options = {
        url: `http://localhost:${port}`,
        app: "Google Chrome"
    };

    g.src("./index.html")
    .pipe($.open("", options));
});


g.task('lint', ()=>{
    g.src([file])
    .pipe($.eslint())
    .pipe($.eslint.format());
});


g.task('jscs', ()=>{
    g.src(file)
    .pipe($.jscs());
});


g.task("power-assert", ()=>{
    g.src("./test/*.js")
    .pipe(espower())
    .pipe(g.dest("./test/powered-test/"));
});

g.task("karma", ["power-assert"], ()=>{
    g.src([
        `./node_modules/power-assert/build/power-assert.js`,
        `./node_modules/jquery/dist/jquery.min.js`,
        `./${file}`,
        `./test/powered-test/*.js`
    ])
    .pipe($.karma({
        configFile: './karma.conf.js'
    }));
});


g.task("default", ['connect'], ()=>{
    g.watch("**/*.js", ["lint"]);
});


// build
g.task('build', ()=>{
    g.src(file)
    .pipe($.sourcemaps.init())
    .pipe($.rename({
        basename: `${filename}.min`,
        extname: `.js`
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(g.dest('./'));
});


// style check
g.task('check', ()=>{
    g.start(['lint', 'jscs']);
});
