import tv4 from 'tv4';
import glob from 'glob';
import fs from 'fs';
import Test from './test';

class TestFactory {
  constructor(schemaLocation) {
    const files = glob.sync(schemaLocation);
    console.log(`JSON ref schemas: ${files.join(', ')}`); //eslint-disable-line no-console

    tv4.banUnknown = true;
    files.forEach(file => tv4.addSchema(JSON.parse(fs.readFileSync(file, 'utf8'))));
  }

  create(name, contentTest) {
    return new Test(name, contentTest);
  }
}

export default TestFactory;
