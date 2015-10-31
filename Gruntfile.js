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
                    cwd: 'lfg',
                    src: ['**/*.js'],
                    dest: 'scripts/'
                }]
            }
        },
        watch: {
            js: {
                files: ['lfg/**/*.js'],
                tasks: ['js']
            }
        },
        focus: {
            dev: {}
        }
    });

    grunt.registerTask('js', ['babel']);

    grunt.registerTask('default', ['js']);
    grunt.registerTask('dev', ['default', 'focus:dev']);
};
