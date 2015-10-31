module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg:    grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: false,
                stage: 0
            },
            dist:    {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist/'
                }]
            }
        },
        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['js']
            }
        },
        focus: {
            dev: {}
        },
        copy: {
            main: {
                expand:  true,
                cwd:     'dist/',
                src:     '**',
                dest:    '../scripts/'
            }
        }
    });

    grunt.registerTask('js', ['babel']);

    grunt.registerTask('default', ['js', 'copy']);
    grunt.registerTask('dev', ['default', 'focus:dev']);
};
