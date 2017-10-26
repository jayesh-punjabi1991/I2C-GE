/**
 * @description Gruntfile that contains tasks to build, test and deploy a project.
 *
 * Configure all your tasks in the /tasks folder.
 *
 * For more help, see: http://gruntjs.com/getting-started
 */
module.exports = function(grunt) {
    'use strict';

    function loadConfig(path) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option) {
           key = option.replace(/\.js$/, '');
            object[key] = require(path + option);
        });

        return object;
    }
    var p = grunt.file.readJSON('package.json');
    // Initial config
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        cachebreaker: {
          dev: {
              options: {
                  match: [
                      'bootstrapper.js',
                      'main.css'
                  ],
                  position: 'filename',
                  replacement: function (){
                    var p = grunt.file.readJSON('package.json');
                    return p.version
                  },
              },
              files: {
                  src: ['dist/www/index.html']
              }
          },
          routedev: {
              options: {
                  match: [
                    'admin.html','uploadInvoice.html','changeRequest.html','change-request-details.html','disputes.html','disputeDetails.html','dashboards.html','home.html','invoice.html','orders.html','order-details.html','quotes.html','quote-details.html','quote-details.html','quote-details-ar.html','payments.html','payment-details.html','invoiceP.html','audit-trail.html','order-details-version.html'
                  ],
                  position: 'filename',
                  replacement: function (){
                    var p = grunt.file.readJSON('package.json');
                    return p.version
                  },
              },
              files: {
                  src: ['dist/www/modules/bootstrapper.'+p.version+'.js']
              }
          },
          cssbust: {
              options: {
                  match: [
                    '.css'
                  ],
                  position: 'filename',
                  replacement: function (){
                    var p = grunt.file.readJSON('package.json');
                    return p.version
                  },
              },
              files: {
                  src: ['dist/www/modules/**/*.html']
              }
          }
      },
      filerev: {
        options: {
             encoding: 'utf8',
             algorithm: 'md5',
             length: 8
         },
         source: {
             files: [{
                 src: [
                     'dist/www/modules/bootstrapper.js',
                     'dist/www/css/main.css',
                     'dist/www/modules/**/*.html',
                     'dist/www/css/*.css'
                 ]
             }]
         }
      },
      useminPrepare: {
        html: 'dist/www/index.html',
        options: {
          root: "./",
          dest: 'dist/www/'
        }
      },
      usemin: {
        css: ['dist/www/css/{,*/}*.css'],
        js: ['dist/www/modules/{,*/}*.js'],
        options: {
          assetsDirs: ['dist/www', 'dist/www/css', 'dist/www/modules'],
        }
      }
    };

    // Load tasks from tasks folder
    grunt.loadTasks('tasks');

    grunt.util._.extend(config, loadConfig('./tasks/options/'));

    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);
};
