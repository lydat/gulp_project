'use strict';

var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),  //多浏览器多设备同步&自动刷新
    SSI         = require('browsersync-ssi'),
    fileinclude = require('gulp-file-include'),      //文件包含   
    plumber     = require('gulp-plumber'),           //错误处理插件plumber
    less        = require('gulp-less'),              //compass 用来编译less 
    cssmin      = require('gulp-clean-css'),         //压缩css文件    
    autoprefixer= require('gulp-autoprefixer'),      //css自动添加私有后缀
    clean       = require('gulp-clean'),             //clean 用来删除文件
    runSequence = require('gulp-run-sequence'),      //控制task中的串行和并行，先删除dist在创建
    spritesmith = require('gulp.spritesmith'),       //sprites精灵图制作
	zip         = require('gulp-zip');

//未使用插件   图片压缩和缓存（gulp-cache@0.4.5，gulp-imagemin@3.0.1，"imagemin-pngquant": "^5.0.0",）
//压缩js插件 gulp-minify@2.0.0  混淆js："gulp-uglify": "^2.0.0",  压缩文件"gulp-zip": "^3.2.0",  整合文件"gulp-concat": "^2.6.0",
//创建一个名为serve的任务，该任务的内容就是匿名函数中的内容。


gulp.task('serve', function() {
    //使用browserSync创建服务器，自动打开浏览器并打开./dist文件夹中的文件（默认为index.html）
    browserSync.init({
        server: {
            baseDir:["./dist"],
            middleware:SSI({
                baseDir:'./dist',
                ext:'.shtml',
                version:'2.10.0'
            })
        }
    });
    //监听各个目录的文件，如果有变动则执行相应的任务操作文件
    gulp.watch(["app/css/**/*.less","app/css/**/*.css"],['compass']);
    gulp.watch("app/js/**/*", ['js']);
    gulp.watch("app/**/*.html", ['html']);
    gulp.watch("app/img/*.{jpg,png,gif}", ['image']);
    gulp.watch("app/img/ico/*", ['sprite']);
    //如果有任何文件变动，自动刷新浏览器
    gulp.watch("dist/**/*.html").on("change",browserSync.reload);
});

//compass任务，将less编译为css
gulp.task('compass', function() {
  return gulp.src(['app/css/**/*.less','app/css/**/*.css'])
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cssmin({
        	compatibility: 'ie8',
        	format: 'keep-breaks',
        }))
        .on('error', function(error) {
          console.log(error);
          this.emit('end');
        })
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});


//图片任务，单纯的移动
gulp.task('image', function() {
   return gulp.src('app/img/*.{jpg,png,gif}')
   		.pipe(plumber())
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream())
});
//图片合成，sprites
gulp.task('sprite', function() {
   return gulp.src('app/img/ico/*.png')
   		.pipe(plumber())
   		.pipe(spritesmith({
		    imgName: 'img/sprite.png',
		    cssName: 'css/sprite.css',
		    padding:5,
            algorithm:'binary-tree',
            cssTemplate:"template.css"
		  }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
});

//js任务，将js压缩后放入dist。该任务要在clean-scripts任务完成后再执行
gulp.task('js', function(){
    return gulp.src('app/js/**/*')
        .pipe(plumber())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});



//html任务，目前什么都没做。只是单纯的把所有html从开发环境app复制到测试环境dist
gulp.task('html', function() {
    return gulp.src("app/*.html")
        .pipe(plumber())
        .pipe(fileinclude())
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

//publish任务，需要的时候手动执行，将dist中的文件打包压缩放到release中。
gulp.task('publish', function(){
    return gulp.src('dist/**/*')
        .pipe(plumber())
        .pipe(zip('publish.zip'))
        .pipe(gulp.dest('release'))
});

//clean任务：清空dist文件夹，下边重建dist的时候使用
gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

//redist任务：需要时手动执行，重建dist文件夹：首先清空，然后重新处理所有文件
gulp.task('redist',function(){
    runSequence('clean',['html','js','compass','image','sprite']);
});
//建立一个名为default的默认任务。当你在gitbash中执行gulp命令的时候，就会
gulp.task('default', function(){
    runSequence('redist','serve');            //先运行redist，启动服务器
});