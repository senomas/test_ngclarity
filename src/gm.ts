import * as fs from "fs";
import * as yaml from "yamljs";

(async function main() {
  try {
    let path = fs.realpathSync(`${__dirname}/../src/models`);
    let files: string[] = fs.readdirSync(path);
    files.forEach(f => {
      if (f.endsWith(".yaml")) {
        generateSchema(`${path}/${f}`).catch(err => {
          console.log(err);
          process.exit(1);
        })
      }
    })
  } catch (err) {
    console.error(err);
  }
})().catch(err => console.error(err));

async function generateSchema(path: string) {
  console.log(`Generate schema for ${path}`)
  let data = yaml.load(`${path}`);
  let result = `export interface ${data.id.charAt(0).toUpperCase()}${data.id.slice(1)} {\n`;
  for (let p in data.schema) {
    if (p === "_id") {
      // skip for interface
    } else if (data.schema.hasOwnProperty(p)) {
      result += generateSchemaProp('  ', p, data.schema[p]);
    }
  }
  result += '}';
  console.log(result);
}

function generateSchemaProp(indent: string, p: string, value: any): string {
  if (typeof value === "string") {
    return `${indent}${p}?:${value}\n`;
  } else if (value.type) {
    switch (value.type.toLowerCase()) {
      case "string":
        return `${indent}${p}?:string\n`;
      case "date":
        return `${indent}${p}?:Date\n`;
      default:
        throw `Unsupported '${value.type}'`;
    }
  } else if (value.schema) {
    let result = `${indent}${p}?: {\n`;
    for (let pp in value.schema) {
      if (value.schema.hasOwnProperty(pp)) {
        result += generateSchemaProp(`${indent}  `, pp, value.schema[pp]);
      }
    }
    result += `${indent}}\n`;
    return result;
  }
  throw `Invalid schema ${p} ${JSON.stringify(value, undefined, 2)}`;
}