declare type Test = { name: string, tests: {desc:string, type: string, query: string, expect: any, propertyPath: string }[] }
import { expect } from 'chai'
const url: string = global['specs'].url
const tests: Test[] = global['specs'].tests
const request = require('supertest')(url);
for (const test of tests) {
    describe(test.name, () => {
        test.tests.forEach(test => {
            it(test.desc, (done) => {
                request.post('/graphql')
                    .send({
                        query: test.query
                    })
                    .expect(200)
                    .end((err, res) => {
                        let result = res.body;
                        if (test.propertyPath)
                            test.propertyPath.split('.').forEach(prop => result = result[prop]);

                        if (err) return done(err);
                        let exp = expect(result);
                        const ops = test.type.split('.')
                        ops.slice(0, -1).forEach(t => exp = exp[t])
                        exp[ops[ops.length - 1]](test.expect)
                        done();
                    })
            })
        });
    })
}



