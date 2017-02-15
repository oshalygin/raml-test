import Mocha from 'mocha';
import async from 'async';
import path from 'path';
import _ from 'underscore'; //eslint-disable-line id-length

import generateHooks from './generateHooks';

class TestRunner {
  constructor(options, ramlFile) {
    this.server = options.server;
    delete options.server;
    this.options = options;
    this.mocha = new Mocha(options);
    this.ramlFile = ramlFile;

    this.addTestToMocha = this.addTestToMocha.bind(this);
  }
  addTestToMocha(test, hooks) {
    var mocha, options, suite, title;
    mocha = this.mocha;
    options = this.options;
    suite = Mocha.Suite.create(mocha.suite, test.name);
    if (!test.response.status) {
      suite.addTest(new Mocha.Test('Skip as no response code defined'));
      return;
    }
    if (!hooks.hasName(test.name) && options['hooks-only']) {
      suite.addTest(new Mocha.Test('Skip as no hooks defined'));
      return;
    }
    if (hooks.skipped(test.name)) {
      suite.addTest(new Mocha.Test('Skipped in hooks'));
      return;
    }
    if (hooks) {
      suite.beforeAll(_.bind(function (done) {
        return this.hooks.runBefore(this.test, done);
      }, {
          hooks: hooks,
          test: test
        }));
      suite.afterAll(_.bind(function (done) {
        return this.hooks.runAfter(this.test, done);
      }, {
          hooks: hooks,
          test: test
        }));
    }
    title = test.response.schema ? 'Validate response code and body' : 'Validate response code only';
    return suite.addTest(new Mocha.Test(title, _.bind(function (done) {
      return this.test.run(done);
    }, {
        test: test
      })));
  }
  run(tests, hooks, done) {
    var addTestToMocha, mocha, names, options, ramlFile, server;
    server = this.server;
    options = this.options;
    addTestToMocha = this.addTestToMocha;
    mocha = this.mocha;
    ramlFile = path.basename(this.ramlFile);
    names = [];
    return async.waterfall([
      function (callback) {
        return async.each(tests, function (test, cb) {
          if (options.names || options['generate-hooks']) {
            names.push(test.name);
            return cb();
          }
          if (!server) {
            return callback(new Error('no API endpoint specified'));
          }
          test.request.server = server;
          _.extend(test.request.headers, options.header);
          addTestToMocha(test, hooks);
          return cb();
        }, callback);
      }, function (callback) {
        var i, len, name, templateFile;
        if (options['generate-hooks']) {
          templateFile = options.template ? options.template : path.join('templates', 'hookfile.js');
          return generateHooks(names, ramlFile, templateFile, done);
        } else if (options.names) {
          for (i = 0, len = names.length; i < len; i++) {
            name = names[i];
            console.log(name);
          }
          return done(null, 0);
        } else {
          return callback();
        }
      }, function (callback) {
        mocha.suite.beforeAll(_.bind(function (done) {
          return this.hooks.runBeforeAll(done);
        }, {
            hooks: hooks
          }));
        mocha.suite.afterAll(_.bind(function (done) {
          return this.hooks.runAfterAll(done);
        }, {
            hooks: hooks
          }));
        return mocha.run(function (failures) {
          return callback(null, failures);
        });
      }
    ], done);
  }

}
