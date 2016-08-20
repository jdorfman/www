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
      files: ['*.source.html'],
      tasks: ['htmlmin']
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['htmlmin']);

};
