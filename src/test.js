import { assert } from 'chai';

class Test {
  constructor(name, testContent) {
    this.name = name || '';

    this.request = {
      server: '',
      path: '',
      method: 'GET',
      params: {},
      query: {},
      headeres: {},
      body: ''
    };

    this.response = {
      status: '',
      schema: null,
      headers: null,
      body: null
    };

  }

  url() {
    let path = this.request.server + this.request.path;
    for (const [key, value] of this.request.params) {
      path = path.replace(`{${key}}`, value);
    }
    return path;
  }
}

export default Test;
