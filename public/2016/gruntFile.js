module.exports = function(grunt) {
grunt.initConfig({
  htmlmin: {                                     // Task
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   // Dictionary of files
        'index.html': './index.source.html',     // 'destination': 'source'
      }
    },
  },
  watch: {
    html: {
      files: ['*.source.html', 'assets/css/styles.css'],
      tasks: ['htmlmin', 'cssmin']
    }
  },
  cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'assets/css',
      src: ['*.css', '!*.min.css'],
      dest: 'assets/css',
      ext: '.min.css'
    }]
  }
}
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-cssmin');

grunt.registerTask('default', ['htmlmin']);

};
