import * as Mocha from "mocha";
import { join } from "path";

function runTest(
  url: string,
  tests: {
    name: string;
    tests: { type: string; query: string; expect: any }[];
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
