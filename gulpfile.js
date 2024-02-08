const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');


// Đường dẫn chứa các file css và các file js đã được build bởi gulp
const path_css = 'assets/css';
const path_js = 'assets/js';

// sourcemaps
// Trong filde index.html chúng ta sẽ chỉ import mỗi assets/css/styles.css mà styles.css bao gồm code của nhiều file sau khi được build nó gộp vào
// 1 file duy nhất là styles.css nằm trong assets/css. Khi chúng ta inspect element nó sẽ cho chúng ta biết phần tử đó đang sử dụng css của file nào 
// (vd: index.css, test.css, demo.css thay vì chung chung là styles.css). Đó chính là công dụng lớn nhất của sourcemaps (style.css.map)

// gulp.task: Khai báo nhiệm vụ của task cho gulp
// gulp.series: Là một cách để chạy các nhiệm vụ (tasks) tuần tự

// Định nghĩa nhiệm vụ biên dịch SCSS và tạo CSS
gulp.task('styles', function () {
    return gulp
    // src (Đầu vào (input) là toàn bộ tất cả các file có đuôi scss nằm trong folder scss và toàn bộ tất cả các file css nằm trong folder css)
    .src(['src/scss/**/*.scss', 'src/css/**/*.css']) 
    // Khởi tạo ra 1 file map (Có cũng được không có cũng không sao)
    .pipe(sourcemaps.init())
    // Show ra lỗi nếu có trong quá trình build (Có cũng được không có cũng không sao)
    .pipe(sass().on('error', sass.logError))
    // Tên file CSS đầu ra sau khi được build
    .pipe(concat('styles.css'))  
    // Build ra 1 file map nằm trong folder maps (Có cũng được không có cũng không sao)    
    .pipe(sourcemaps.write('./maps'))
    // dest (Đầu ra (output)) Thư mục đầu ra cho file CSS
    .pipe(gulp.dest(path_css));         
});

// Định nghĩa nhiệm vụ biên dịch JAVASCRIPT và tạo JS
gulp.task('scripts', function () {
    return gulp
    // src (Đầu vào (input) là toàn bộ tất cả các file có đuôi js nằm trong folder js)
    .src('src/js/**/*.js')
    // Tên file JS đầu ra sau khi được build
    .pipe(concat('scripts.js')) 
     // dest (Đầu ra (output)) Thư mục đầu ra cho file JS
    .pipe(gulp.dest(path_js));     
});

// Chạy chế độ theo dõi SCSS và JAVASCRIPT
gulp.task('watch', function() {
    // Lắng nghe sự thay đổi của toàn bộ tất cả các file có đuôi scss nằm trong folder scss và toàn bộ tất cả các file css nằm trong folder css 
    // và thực thi chạy lệnh styles 
    gulp.watch(['src/scss/**/*.scss', 'src/css/**/*.css'], gulp.series('styles'));
    // Lắng nghe sự thay đổi của toàn bộ tất cả các file có đuôi js nằm trong folder js 
    // và thực thi chạy lệnh scripts 
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
});

// build ra các file .min.css và .min.js
gulp.task('min_css', function() {
    return gulp
    .src(path_css+'/styles.css', {allowEmpty: true})
    // gulp-clean-css được sử dụng để nén và làm gọn mã CSS. Nó giúp giảm kích thước của các file CSS, tối ưu hóa
    // và loại bỏ các phần không cần thiết, giúp tăng tốc tải trang web
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest(path_css));    
});

gulp.task('min_js', function() {
    return gulp
    .src(path_js+'/scripts.js', {allowEmpty: true})
    // gulp-uglify là được sử dụng để nén và làm gọn mã JS. Nó giúp giảm kích thước của các file JS, tối ưu hóa
    // và loại bỏ các phần không cần thiết, giúp tăng tốc tải trang web
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(path_js));    
});

// Xóa dữ liệu đã build 
gulp.task('clean_file', function() {
    return del([
        path_css + '/*.css', 
        path_css + '/maps/**', 
        path_js + '/*.js',
    ]);
});

gulp.task('clean_code', function (done) {
    return del([
        path_css + '/styles.min.css', 
        path_js + '/scripts.min.js',
    ]).then(() => {
        gulp.series('min_js', 'min_css')(done);
    })
});

// Nhiệm vụ mặc định: Chạy tất cả các nhiệm vụ (gulp.task) và lắng nghe, theo dõi sự thay đổi 
gulp.task('default', gulp.series('clean_file', 'styles', 'scripts', 'min_css', 'min_js', 'watch'))