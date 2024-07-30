// This file is part of Moodle - https://moodle.org
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

"use strict";

module.exports = function (grunt) {

  // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
  require("grunt-load-gruntfile")(grunt);
  grunt.loadGruntfile("../../Gruntfile.js");

  // Load all grunt tasks.
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.initConfig({
    watch: {
      // If any .scss file changes in directory "scss" then run the "sass" task.
      files: "scss/*.scss",
      tasks: ["sass"]
    },
    sass: {
      // Production config is also available.
      development: {
        options: {
          // Saas output style.
          style: "expanded",
          // Specifies directories to scan for @import directives when parsing.
          // Default value is the directory of the source, which is probably what you want.
          loadPath: ["myOtherImports/"]
        },
        files: {
          "styles.css": "scss/styles.scss"
        }
      },
      prod:{
        options: {
          // Saas output style.
          style: "compressed",
          // Specifies directories to scan for @import directives when parsing.
          // Default value is the directory of the source, which is probably what you want.
          loadPath: ["myOtherImports/"]
        },
        files: {
          "styles-prod.css": "scss/styles.scss"
        }
      }
    }
  });
  // The default task (running "grunt" in console).
  grunt.registerTask("default", ["sass:development"]);
  // The production task (running "grunt prod" in console).
  grunt.registerTask("prod", ["sass:prod"]);
};

