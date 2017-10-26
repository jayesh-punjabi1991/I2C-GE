/**
 * Configure copying tasks into dist version
 */
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: [
                  'index.html',
                  'polymer-loader.vulcanized.html',
                  'images/*',
                  'modules/**/*',
                  'css/*',
                  'lib/**/*',
                  'bower_components/**/*'
                ],
                dest: 'dist/www/'
            }
        ]
    },
    nodedependencies:{
      files:[
        {
          nonull: true,
          expand:true,
          cwd:'public/nodemods/',
          src: [
            '**'
          ],
          dest: 'node_modules/'
        }
      ]
    },
    bowerdependencies:{
      files:[
        {
          nonull: true,
          expand:true,
          cwd:'public/bowercomp/',
          src: [
            '**'
          ],
          dest: 'public/bower_components'
        }
      ]
    },
    serve: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: ['polymer-loader.html'],
                rename: function (src, dest) {
                    return 'public/polymer-loader.vulcanized.html';
                }
            }
        ]
    }
};
