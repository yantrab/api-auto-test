declare type Test = { name: string, tests: { type: string, query: string, expect: any }[] }
import { expect } from 'chai'
const url: string = global['specs'].url
const tests: Test[] = global['specs'].tests
const request = require('supertest')(url);
for (const test of tests) {
    describe(test.name, () => {
        test.tests.forEach(test => {
            it('search ycg', (done) => {
                request.post('/graphql')
                    .send({
                        query: test.query
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        let exp = expect(res.body);
                        const ops = test.type.split('.')
                        ops.slice(0, -1).forEach(t => exp = exp[t])
                        exp[ops[ops.length - 1]](test.expect)
                        done();
                    })
            })
        });
    })
}



