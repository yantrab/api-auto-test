import * as Mocha from "mocha";
import { join } from "path";
import { Test } from "./test";

function runTest(
  url: string,
  tests: {
    name: string;
    tests: Test[];
  }[],
  sent?: (errors: string[]) => void
) {
  return new Promise((reslove, reject) => {
    // tslint:disable-next-line: no-string-literal
    global["specs"] = { url, tests, sent };
    const mocha: Mocha = new Mocha({ reporterOptions: url });
    mocha.addFile(join(__dirname, "./test"));
    mocha.run(failures => {
      reslove(failures);
    });
  });
}

export { runTest };
