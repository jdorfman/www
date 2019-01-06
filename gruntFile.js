module.exports = function(grunt) {
grunt.initConfig({
  htmlmin: {                                     // Task
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: false
      },
      files: {                                   // Dictionary of files
        'index.html': './index.source.html',     // 'destination': 'source'
      }
    },
  },
  watch: {
    html: {
      files: ['*.source.html', 'assets/css/styles-*.css', 'assets/js/main.js'],
      tasks: ['htmlmin', 'cssmin', 'uglify']
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
},
  uglify: {
    my_target: {
      options: {
        preserveComments: 'all'
      },
      files: {
        'assets/js/main.min.js': ['assets/js/main.js']
      }
    }
  },
  imageoptim: {
  myTask: {
    options: {
      jpegMini: false,
      imageAlpha: true,
      quitAfter: true
    },
    src: ['assets/images']
  }
}
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-imageoptim');

grunt.registerTask('default', ['htmlmin', 'cssmin', 'uglify']);

};
