import * as Mocha from "mocha";
import { join } from "path";
import { Test } from "./test";

function runTest(
  url: string,
  tests: {
    name: string;
    tests: Test[];
  }[]
) {
  return new Promise((reslove, reject) => {
    // tslint:disable-next-line: no-string-literal
    global["specs"] = { url, tests };
    const mocha: Mocha = new Mocha();
    mocha.addFile(join(__dirname, "./test"));
    mocha.run(failures => {
      reslove(failures);
    });
  });
}

export { runTest };
