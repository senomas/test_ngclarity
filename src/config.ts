import * as fs from "fs";
import * as yaml from "yamljs";

export const Config = (): any => {
  let base = fs.realpathSync(".");
  let fc = `${base}/config.local.yaml`;
  if (fs.existsSync(fc)) {
    return yaml.load(fc);
  } else console.log(`No config ${fc}`);
  fc = `${base}/config.${require("os").userInfo().username}.yaml`;
  if (fs.existsSync(fc)) {
    return yaml.load(fc);
  } else console.log(`No config ${fc}`);
  fc = `${base}/config.yaml`;
  if (fs.existsSync(fc)) {
    return yaml.load(fc);
  } else console.log(`No config ${fc}`);
  return {};
} 