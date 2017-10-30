import * as loader from "./load"

export function generate() {
  console.log("Generate models")
  let models = loader.load()
  let result = `/** AUTO-GENERATE FILES */\n\n`
  result += renderModel(models)
  loader.write(`src/models/models.type.ts`, result)
  console.log("\n")
}

export function renderModel(models: any, schemas: any = {}) {
  let result = ""
  models.forEach((m, k) => {
    if (k > 0) result += '\n'
    result += `export interface ${m.$name} {\n`
    for (let mk in m) {
      if (!mk.startsWith("$") && m.hasOwnProperty(mk)) {
        let mp = m[mk];
        result += renderField(null, mk, mp, schemas) + "\n";
      }
    }
    result += `}\n`
  });
  return result;
}

export function renderField(parent: string, field: string, value: any, schemas: any, indent: string = "") {
  let pf = parent ? `${parent}.${field}` : field;
  schemas[pf] = value;
  if (typeof value === "string") {
    return `${indent}  ${field}?: ${value}`;
  } else if (Array.isArray(value)) {
    let res = `${indent}  ${field}?: `;
    if (typeof value[0] === "string") {
      res += `${value[0]}`;
    } else if (typeof value[0] === "object" && (value[0] as any).type) {
      if (Array.isArray((value[0] as any).type)) {
        res += `${(value[0] as any).type}[]`;
      } else {
        res += `${(value[0] as any).type}`;
      }
    } else {
      res += '{\n';
      for (let p in value[0]) {
        if (!p.startsWith("$") && value[0].hasOwnProperty(p)) {
          res += renderField(pf, p, value[0][p], schemas, `${indent}  `) + "\n";
        }
      }
      res += `${indent}  }`;
    }
    res += '[]';
    return res;
  } else if (typeof value === "object" && value.type) {
    if (Array.isArray(value.type)) {
      return `${indent}  ${field}?: ${value.type}[]`;
    }
    return `${indent}  ${field}?: ${value.type}`;
  } else {
    let res = `${indent}  ${field}?: {\n`;
    for (let p in value) {
      if (!p.startsWith("$") && value.hasOwnProperty(p)) {
        res += renderField(pf, p, value[p], schemas, `${indent}  `) + "\n";
      }
    }
    res += `${indent}  }`;
    return res;
  }
}
