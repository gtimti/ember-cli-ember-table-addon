/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-table',
  included: function(app) {
    this._super.included(app);

    app.import({
      development: app.bowerDirectory + '/jquery-mousewheel/jquery.mousewheel.js',
      production:  app.bowerDirectory + '/jquery-mousewheel/jquery.mousewheel.min.js'
    });

    app.import(app.bowerDirectory + '/antiscroll/antiscroll.js');
    app.import(app.bowerDirectory + '/antiscroll/antiscroll.css');
  }
};
