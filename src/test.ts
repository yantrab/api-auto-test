declare type Test = {
  name: string;
  tests: {
    desc: string;
    type: string;
    query: string;
    expect: any;
    propertyPath: string;
    timeout: number;
  }[];
};
import { expect } from "chai";
// tslint:disable-next-line: no-string-literal
const url: string = global["specs"].url;
// tslint:disable-next-line: no-string-literal
const tests: Test[] = global["specs"].tests;
const request = require("supertest")(url);
console.log(tests);

for (const test of tests) {
  describe(test.name, () => {
    test.tests.forEach(test => {
      console.log(test.timeout);
      it(test.desc, done => {
        request
          .post("/graphql")
          .send({
            query: test.query
          })
          .expect(200)
          .end((err, res) => {
            let result = res.body;
            if (test.propertyPath) {
              test.propertyPath
                .split(".")
                .forEach(prop => (result = result[prop]));
            }

            if (err) {
              return done(err);
            }
            let exp = expect(result);
            const ops = test.type.split(".");
            ops.slice(0, -1).forEach(t => (exp = exp[t]));
            exp[ops[ops.length - 1]](test.expect);
            done();
          });
      }).timeout(test.timeout || 2000);
    });
  });
}
