g = require "gulp"
$ = require( 'gulp-load-plugins' )()
connect = require 'gulp-connect'

espower = require("gulp-espower")

port = 3000

# local server
g.task "connect", ->
    connect.server
        port: port
        livereload: true

    options =
        url: "http://localhost:#{port}"
        app: "Google Chrome"

    g.src "./index.html"
    .pipe $.open "", options


g.task 'lint', ->
    g.src(['accordion.js', 'app.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())


g.task 'jscs', ->
    g.src('accordion.js')
    .pipe($.jscs())


g.task "power-assert", ()->
    g.src("./test/*.js")
    .pipe(espower())
    .pipe(g.dest("./test/powered-test/"))

g.task "karma", ["power-assert"], ()->
    g.src([
        "./node_modules/power-assert/build/power-assert.js"
        "./node_modules/jquery/dist/jquery.min.js"
        "./accordion.js"
        "./test/powered-test/*.js"
    ])
    .pipe $.karma
        configFile: './karma.conf.js'


g.task "default", ['connect'], ->
    g.watch "**/*.js", ["lint"]


# build
g.task 'build', ->
    g.src './accordion.js'
    .pipe $.sourcemaps.init()
    .pipe $.rename
        basename: "accordion.min"
        extname: ".js"
    .pipe $.uglify()
    .pipe $.sourcemaps.write('./')
    .pipe g.dest './'


# style check
g.task 'check', ->
    g.start ['lint', 'jscs']