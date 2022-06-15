const gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	cleancss = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
	gulp.watch('dist/**/*.+(html|css|js)').on('change', browserSync.reload);
});

gulp.task('sass', function() {
	return gulp.src('app/sass/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('app/css'));
});

gulp.task('cleancss', function() {
	return gulp.src('app/css/libs/*.css')
	.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss({ compatibility: 'ie8' }))
		.pipe(gulp.dest('app/css'));
});

gulp.task('style', function() {
	return gulp.src('app/css/*.css')
	.pipe(concat('style.css'))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('uglify', function() {
	return gulp.src('app/js/libs/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('concat', function() {
	return gulp.src('app/js/*.js')
	.pipe(concat('script.js'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/*.*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
});

gulp.task('basic', gulp.series('sass', 'cleancss', 'style', 'uglify', 'concat', 'imagemin')); 

gulp.task('default', gulp.parallel('browser-sync', function() {
	gulp.watch('app/sass/*.sass', gulp.parallel('sass'));
	gulp.watch('app/css/libs/*.css', gulp.parallel('cleancss'));
	gulp.watch('app/css/*.css', gulp.parallel('style'));
	gulp.watch('app/js/libs/*.js', gulp.parallel('uglify'));
	gulp.watch('app/js/*.js', gulp.parallel('concat'));
	gulp.watch('app/img/*.*', gulp.parallel('imagemin'));
}));
