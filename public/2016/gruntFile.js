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
  }
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.registerTask('default', ['htmlmin']);

};
