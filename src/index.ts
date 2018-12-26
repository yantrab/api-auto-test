
import * as Mocha from 'mocha'
import {join} from 'path'

function runTest(url: string, tests: { name: string, tests: { type: string, query: string, expect: any }[] }[]) {
    global['specs'] = { url, tests };
    var mocha = new Mocha();
    mocha.addFile(join(__dirname,'./test'))
    mocha.run(function (failures) {
        process.exitCode = failures ? 1 : 0;
    });
}


export {runTest}


