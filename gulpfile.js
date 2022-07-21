'use strict'

const gulp 			= require('gulp') //Gulp
const concat 		= require ('gulp-concat') //Concatena arquivos
const sourcemaps 	= require('gulp-sourcemaps') //Mapea codigo SASS para debug no console
const sass 			= require('gulp-sass') //SASS
const autoprefixer 	= require('autoprefixer') //Aplica prefixo de navegadores antigos
const postcss 		= require('gulp-postcss') //PostCSS
const cssnano 		= require('cssnano') //Minifica css
const mqpacker 		= require('css-mqpacker') //Unifica todas as @medias da mesma condição em apenas uma
const babel         = require('gulp-babel') //Transpila arquivos js para versões antigas do ES
const terser        = require('gulp-terser') //Minifica os arquivos js
const order         = require("gulp-order") //Ordena os arquivos concatenados
const image         = require('gulp-image'); //Otimiza as imagens
const webp          = require('gulp-webp'); //transforma imagens para o formato webp
const changed       = require('gulp-changed') //Verifica se houve alterações
const rename        = require('gulp-rename') // Renomeia arquivos
const browserSync   = require('browser-sync').create() //Synca os arquivos com o browser e faz o proxy reverso dos arquivos
const browserify    = require('browserify') //Converte commonJs para ES
const source        = require('vinyl-source-stream')
const buffer        = require('vinyl-buffer')
const babelify      = require('babelify') //Transpila arquivos js para versões antigas do ES
const glob          = require('glob') //Possibilita o uso da escrita do terminal no browserify
const replace       = require('gulp-replace') //Substitui textos de arquivos
const replaceName   = require('gulp-replace-name') //Substitui nome de arquivos
const clean         = require('gulp-clean') //Deleta diretorios ou arquivos
const git           = require('gulp-git'); //git


const config = {
    nickName: 'amc',
    accountName: 'adoromeucarro',
    repoUrl: 'https://github.com/rodrigotonifreitas/adoro_meu_carro_vtex',
    initCommit: 'Configuração inicial do projeto',
    https: true,
}

const paths = {
    dist: {
        dest: '/'
    },
    templates: {
        src: './src/templates/**/*.html',
        dest: './build/templates/',
        init: './src/templates_init/**/*.html',
        dest_init: './src/templates',
    },
    styles: {
        input: './src/styles/*.scss',
        dest: './build/arquivos/',
        src: './src/styles/**/*.scss'
    },
    scripts: {
        input: './src/scripts/*.js',
        dest: './build/arquivos/',
        src: './src/scripts/**/*.js'
    },
    images: {
        src: './src/images/**/*',
        dest: './build/arquivos/'
    }
}

gulp.task('clean-templateInit', () => {
    return gulp.src('./src/templates_init')
    .pipe(clean({force: true}))
});

gulp.task('templateInit', () => {
    return gulp.src(paths.templates.init)
    .pipe(replace('{{loja}}', config.nickName))
    .pipe(replaceName(/loja/g, config.nickName))
    .pipe(gulp.dest(paths.templates.dest_init))
})

gulp.task('repository-clean', function(){
    return gulp.src('./.git')
    .pipe(clean({force: true}))
})

gulp.task('repository-init', function(){
    return git.init(function (err) {
        if (err) throw err;
    });
})

gulp.task('repository-add', function(){
    return gulp.src('./')
    .pipe(git.add());
})

gulp.task('repository-commit', function(){
    return gulp.src('./')
    .pipe(git.commit(config.initCommit));
});

gulp.task('repository-addremote', function(){
    return git.addRemote('origin', config.repoUrl, function (err) {
      if (err) throw err;
    });
});

gulp.task('repository-push', function(){
    return new Promise(function(resolve, reject){
        git.push('origin', 'master', function (err) {
            if (err) throw err;
        });
        resolve();
    }) 
});

gulp.task('template', () => {
    return gulp.src(paths.templates.src)
    .pipe(gulp.dest(paths.templates.dest))
})

gulp.task('style', function () {
    let processors = [
        autoprefixer,
        cssnano,
        mqpacker
    ]
    return gulp.src(paths.styles.input)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename(`${config.nickName}-style.css`))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
});

gulp.task('style-dev', function () {
    let processors = [
        autoprefixer,
        mqpacker
    ]
    return gulp.src(paths.styles.input)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename(`${config.nickName}-style.css`))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
});

gulp.task('script', function () {
    let testFiles = glob.sync(paths.scripts.input)
    return browserify({
            entries: testFiles
        })
        .transform(babelify.configure({
            presets: ['@babel/env']
        }))
        .bundle()
        .pipe(source(`${config.nickName}-script.js`))
        .pipe(buffer())
        .pipe(terser({
            toplevel: true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
})

gulp.task('script-dev', function () {
    let testFiles = glob.sync(paths.scripts.input)
    return browserify({
            entries: testFiles
        })
        .transform(babelify.configure({
            presets: ['@babel/env']
        }))
        .bundle()
        .pipe(source(`${config.nickName}-script.js`))
        .pipe(buffer())
        .pipe(gulp.dest(paths.scripts.dest))
})

gulp.task('image-minify', function(){
    return gulp.src(paths.images.src)
    .pipe(changed(paths.images.src))
    .pipe(image())
    .pipe(gulp.dest(paths.images.dest))
});

gulp.task('transformto-webp', function(){
    return gulp.src(paths.images.src)
    .pipe(changed(paths.images.src))
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest))
});
    
gulp.task('browserSyncProxy', function () {
    return browserSync.init({
        open: false,
        watch: true,
        https: config.https || true,
        host: config.accountName + '.vtexlocal.com.br',
        startPath: '/admin/login/',
        proxy: 'https://' + config.accountName + '.vtexcommercestable.com.br',
        serveStatic: [{
            route: '/arquivos',
            dir: ['./build/arquivos']
        }]
    })
})

const watch = () => {
	gulp.watch(paths.styles.src, gulp.series('style')).on('change', browserSync.reload)
	gulp.watch(paths.scripts.src, gulp.series('script')).on('change', browserSync.reload)
	gulp.watch(paths.images.src, gulp.series('image-minify')).on('change', browserSync.reload)
}

const watchDev = () => {
	gulp.watch(paths.styles.src, gulp.series('style-dev')).on('change', browserSync.reload)
	gulp.watch(paths.scripts.src, gulp.series('script-dev')).on('change', browserSync.reload)
}

gulp.task('start', gulp.series('templateInit', 'clean-templateInit'/*, 'repository-clean', 'repository-init', 'repository-add', 'repository-commit', 'repository-addremote', 'repository-push'*/));
gulp.task('dev', gulp.parallel('template', 'style-dev', 'script-dev', 'image-minify', 'browserSyncProxy', watchDev));
gulp.task('build', gulp.parallel('template', 'style', 'script', 'image-minify', 'browserSyncProxy', watch))
