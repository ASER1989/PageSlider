module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //uglify压缩
        uglify: {
            options: {
                stripBanners: true,
                banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: [
                    {
                        expand: true,
                        //相对路径
                        cwd: 'js/',
                        src: '**.js',
                        dest: 'bulid/js/',
                        //filter:function(filepath){
                        //    return (grunt.file.isDir(filepath) && filepath.indexOf("node_modules")>=0);
                        //    //return (grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
                        //}
                        // rename: function (dest, src) {
                        //     var folder = src.substring(0, src.lastIndexOf('/'));
                        //     var filename = src.substring(src.lastIndexOf('/'), src.length);
                        //     //  var filename=src;
                        //     filename = filename.substring(0, filename.lastIndexOf('.'));
                        //     var fileresult=dest + folder + filename + '.min.js';
                        //     grunt.log.writeln("现处理文件："+src+"  处理后文件："+fileresult);
                        //     return fileresult;
                        //     //return  filename + '.min.js';
                        // }
                    }
                ]
            }
        },

        cssmin: { //css文件压缩
            target: {
                files: [{
                    expand: true,
                    cwd: "css/",
                    src: ['*.css', '**.css'],
                    dest: 'bulid/css/',
                    //ext:'.min.css'
                }]
            }
        },


        imagemin: {
            /* 压缩图片大小 */
            dist: {
                options: {
                    optimizationLevel: 1 //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'res/',
                    src: ['**/*.{png,jpg,jpeg,gif}'], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
                    dest: 'bulid/res/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['**.html'],
                        dest: 'bulid/'
                    }
                ]
            }
        }
        //watch监听
        //watch: {
        //    build: {
        //        files: ['**.js', '**.css'],
        //        tasks: ['uglify', 'cssmin'],
        //        options: {spawn: false}
        //    }
        //},

        //合并js
        // concat: {
        //   options: {
        //     separator: ';',
        //   },
        //   dist: {
        //     src: ['lib/jQuery/jquery-1.11.3.min.js', 'lib/angular/angular.js'],
        //     dest: 'lib/main.js',
        //   },
        // },


    });
    //加载插件
    //npm install grunt-contrib-uglify --save-dev
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //npm install grunt-contrib-cssmin
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    //执行任务
    grunt.registerTask('default', ['uglify', 'cssmin', 'imagemin','htmlmin']);

};
