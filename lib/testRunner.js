/* eslint-disable indent */
/* eslint-disable no-shadow */
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

    const { mocha, options } = this;
    const suite = Mocha.Suite.create(mocha.suite, test.name);

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
          hooks,
          test
        }));
      suite.afterAll(_.bind(function (done) {
        return this.hooks.runAfter(this.test, done);
      }, {
          hooks,
          test
        }));
    }
    const title = test.response.schema
      ? 'Validate response code and body'
      : 'Validate response code only';

    return suite.addTest(new Mocha.Test(title, _.bind(function (done) { //eslint-disable-line consistent-return
      return this.test.run(done);
    }, {
        test
      })));
  }

  run(tests, hooks, done) {

    const { server, options, mocha, addTestToMocha } = this;
    const ramlFile = path.basename(this.ramlFile);
    const names = [];
    
    return async.waterfall([
      function (callback) {
        return async.each(tests, (test, cb) => {
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
      }, (callback) => {
        if (options['generate-hooks']) {
          const templateFile = options.template ? options.template : path.join('templates', 'hookfile.js');
          return generateHooks(names, ramlFile, templateFile, done);
        } else if (options.names) {
          for (let iterator = 0; iterator < names.length; iterator = iterator + 1) {
            const name = names[iterator];
            console.log(name); //eslint-disable-line no-console
          }
          return done(null, 0);
        }

        return callback();

      }, (callback) => {
        mocha.suite.beforeAll(_.bind(function (done) {
          return this.hooks.runBeforeAll(done);
        }, {
            hooks
          }));
        mocha.suite.afterAll(_.bind(function (done) {
          return this.hooks.runAfterAll(done);
        }, {
            hooks
          }));
        return mocha.run((failures) => {
          return callback(null, failures);
        });
      }
    ], done);
  }

}

export default TestRunner;
