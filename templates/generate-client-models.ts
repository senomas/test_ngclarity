import * as loader from "./load"
import * as gen from "./generate-models"

export function generate() {
  console.log("Generate client models")

  let models = loader.load()

  let schemas: any = {};
  let result = `/** AUTO-GENERATE FILES */\n\n`

  result += `import { GenericListComponent } from "../generic-list/generic-list.component"\n`
  result += `import { GenericEditComponent } from "../generic-edit/generic-edit.component"\n\n`

  result += gen.renderModel(models, schemas)
  models.forEach(m => {
    if (m.$view) {
      result += '\n'
      result += generateView(m, schemas)
    }
  })

  result += `export const MODELS_ROUTES = [`
  let lf = true;
  models.forEach(m => {
    if (m.$view) {
      if (lf) {
        lf = false;
        result += '\n'
      } else result += ',\n'
      result += generateRoutes(m, schemas)
    }
  })
  if (!lf) result += '\n';
  result += `]`;

  loader.write(`client/src/app/models/models.type.ts`, result);
  console.log("\n")
}

export function generateView(m: any, schemas: any) {
  let id = m.$id;
  let name = id.charAt(0).toUpperCase() + id.slice(1)
  if (m.$view.list) {
    let list = m.$view.list;
    m.$view.list = [];
    list.forEach(li => {
      let s = schemas[li]
      if (typeof s === "string") {
        s = { type: s }
      }
      m.$view.list.push({ id: li, $model: s })
    });
  }
  if (m.$view.edit) {
    let edit = m.$view.edit;
    m.$view.edit = [];
    edit.forEach(ei => {
      let s = schemas[ei]
      if (typeof s === "string") {
        s = { type: s }
      }
      m.$view.edit.push({ id: ei, $model: s })
    });
  }
  return `export const ${name}View = ${JSON.stringify({ id: id, list: m.$view.list, edit: m.$view.edit }, undefined, 2)}\n`;
}

function generateRoutes(m: any, schemas: any): string {
  let id = m.$id;
  let name = id.charAt(0).toUpperCase() + id.slice(1)
  let result = "";
  if (m.$view) {
    let name = id.charAt(0).toUpperCase() + id.slice(1);

    if (m.$view.list) {
      result = `  { path: "${id}", component: GenericListComponent, data: { ui: ${name}View } }`;
    }
    if (m.$view.edit) {
      if (result.length > 0) result += ",\n";
      result += `  { path: "${id}/:id", component: GenericEditComponent, data: { ui: ${name}View } },\n`;
      result += `  { path: "${id}-new", component: GenericEditComponent, data: { ui: ${name}View } }`;
    }
  }
  return result;
}
