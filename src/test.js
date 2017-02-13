/* eslint-disable no-undefined */
/* eslint-disable max-len */
import async from 'async';
import { assert } from 'chai';
import tv4 from 'tv4';
import _ from 'underscore'; //eslint-disable-line


class Test {
  constructor(name, contentTest) {

    this.name = name || '';
    this.contentTest = contentTest;
    this.skip = false;
    this.request = {
      server: '',
      path: '',
      method: 'GET',
      params: {},
      query: {},
      headers: {},
      body: ''
    };

    this.response = {
      status: '',
      schema: null,
      headers: null,
      body: null
    };

    if (this.contentTest === null) {
      this.contentTest = function (response, body, done) {
        return done();
      };
    }

    this.assertResponse = this.assertResponse.bind(this);
  }
  url() {
    let path = this.request.server + this.request.path;
    const ref = this.request.params;
    ref.forEach(key => {
      const value = ref[key];
      path = path.replace('{" + key + "}', value);
    });

    return path;
  }

  run(callback) {
    const options = _.pick(this.request, 'headers', 'method');
    options.url = this.url();
    if (typeof this.request.body === 'string') {
      options.body = this.request.body;
    } else {
      options.body = JSON.stringify(this.request.body);
    }
    options.qs = this.request.query;
    return async.waterfall([
      function (cb) {
        return this.request(options, (error, response, body) => {
          return cb(null, error, response, body);
        });
      }, function (error, response, body, cb) {
        this.assertResponse(error, response, body);
        return this.contentTest(response, body, cb);
      }
    ], callback);
  }

  assertResponse(error, response, body) {
    let passedInBody = body;
    let ref;
    let ref1;
    
    assert.isNull(error);
    assert.isNotNull(response, 'Response');
    
    this.response.headers = response.headers;
    assert.equal(response.statusCode, this.response.status, `Got unexpected response code:\n${body}\nError`);
    
    response.status = response.statusCode;
    if (this.response.schema) {

      const schema = this.response.schema;
      const validateJson = _.partial(JSON.parse, passedInBody);
      if (passedInBody === '') {
        passedInBody = '[empty]';
      }

      assert.doesNotThrow(validateJson, JSON.SyntaxError, `Invalid JSON:\n${passedInBody}\nError`);
      const json = validateJson();
      const result = tv4.validateResult(json, schema);
      
      assert.lengthOf(result.missing, 0,
        `Missing/unresolved JSON schema $refs (${((ref = result.missing) !== null ? ref.join(', ') : undefined)}) in schema:\n${(JSON.stringify(schema, null, 4))}\nError`);
      
      assert.ok(result.valid,
        `Got unexpected response body: ${((ref1 = result.error) !== null ? ref1.message : undefined)}\n${(JSON.stringify(json, null, 4))}\nError`);
      this.response.body = json;
    }
  }

}

export default Test;
