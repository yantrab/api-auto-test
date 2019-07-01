export declare type Test = {
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

// tslint:disable-next-line: no-string-literal
const sent: (errors: string[]) => void = global["specs"].sent;

const request = require("supertest")(url);
const failures = [];
for (const test of tests) {
  describe(test.name, () => {
    afterEach(function(done) {
      const title = this.currentTest.title;
      if (this.currentTest.state === "failed") {
        failures.push(
          this.currentTest.title + ":" + this.currentTest.err.message
        );
      }
      done();
    });
    after(function(done) {
      if (sent) {
        sent(failures);
      }
      done();
    });
    test.tests.forEach(test => {
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
