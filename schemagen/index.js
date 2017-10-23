"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("yamljs");
let base = `.`;
try {
    let path = fs.realpathSync(`${base}/src/models`);
    let files = fs.readdirSync(path);
    files.forEach((f) => {
        if (f.endsWith(".yaml")) {
            console.log(`Generate schema for ${path}/${f}`);
            let data = yaml.load(`${path}/${f}`);
            // console.log(JSON.stringify(data, undefined, 2));
            generateModel(f.slice(0, -5), data);
            generateSchema(f.slice(0, -5), data);
        }
    });
}
catch (err) {
    console.error(err);
}
function generateModel(id, data) {
    let name = id.charAt(0).toUpperCase() + id.slice(1);
    let result = `export interface ${name} {\n`;
    let schemas = {};
    for (let p in data.schema) {
        if (data.schema.hasOwnProperty(p)) {
            result += generateModelProp('  ', null, p, data.schema[p], schemas);
        }
    }
    if (data.view) {
        data.view.id = id;
        if (data.view.list) {
            data.view.list.forEach(vk => {
                vk.schema = schemas[vk.id];
            });
        }
        if (data.view.edit) {
            data.view.edit.forEach(vk => {
                vk.schema = schemas[vk.id];
            });
        }
        result += `}\n\nexport const ${name}View = ${JSON.stringify(data.view, undefined, 2)};\n`;
    }
    else {
        result += `}\n`;
    }
    if (!fs.existsSync(`${base}/src/.models`))
        fs.mkdirSync(`${base}/src/.models`);
    if (!fs.existsSync(`${base}/client/src/app/models`))
        fs.mkdirSync(`${base}/client/src/app/models`);
    fs.writeFileSync(`${base}/src/.models/${id}.model.ts`, result);
    fs.writeFileSync(`${base}/client/src/app/models/${id}.model.ts`, result);
}
function generateModelProp(indent, parent, p, value, schemas) {
    let fp;
    if (parent) {
        fp = `${parent}.${p}`;
    }
    else {
        fp = p;
    }
    schemas[`${fp}`] = value;
    if (typeof value === "string") {
        return `${indent}${p}?:${value}\n`;
    }
    else if (value.type) {
        switch (value.type.toLowerCase()) {
            case "string":
                return `${indent}${p}?:string\n`;
            case "date":
                return `${indent}${p}?:Date\n`;
            default:
                throw `Unsupported '${value.type}'`;
        }
    }
    else if (value.schema) {
        let result = `${indent}${p}?: {\n`;
        for (let pp in value.schema) {
            if (value.schema.hasOwnProperty(pp)) {
                result += generateModelProp(`${indent}  `, fp, pp, value.schema[pp], schemas);
            }
        }
        result += `${indent}}\n`;
        return result;
    }
    throw `Invalid schema ${p} ${JSON.stringify(value, undefined, 2)}`;
}
function generateSchema(id, data) {
    let name = id.charAt(0).toUpperCase() + id.slice(1);
    let result = `import { Document, Schema } from "mongoose";\nimport { ${name} } from "./${id}.model";\n\nexport interface ${name}Model extends ${name}, Document { }\n\n`;
    result += `export const ${name}Schema: Schema = new Schema({\n`;
    let nf = false;
    for (let p in data.schema) {
        if (data.schema.hasOwnProperty(p)) {
            if (nf) {
                result += ",\n";
            }
            else {
                nf = true;
            }
            result += generateSchemaProp('  ', p, data.schema[p]);
        }
    }
    result += `\n});`;
    fs.writeFileSync(`${base}/src/.models/${id}.ts`, result);
}
function generateSchemaProp(indent, p, value) {
    if (typeof value === "string") {
        return `${indent}${p}: ${value}`;
    }
    else if (value.type) {
        let vp = { type: value.type };
        if (value.index) {
            vp.index = value.index;
        }
        return `${indent}${p}: ${JSON.stringify(vp)}`;
    }
    else if (value.schema) {
        let result = `${indent}${p}: {\n`;
        let nf = false;
        for (let pp in value.schema) {
            if (value.schema.hasOwnProperty(pp)) {
                if (nf) {
                    result += ",\n";
                }
                else {
                    nf = true;
                }
                result += generateSchemaProp(`${indent}  `, pp, value.schema[pp]);
            }
        }
        result += `\n${indent}}`;
        return result;
    }
    throw `Invalid schema ${p} ${JSON.stringify(value, undefined, 2)}`;
}
