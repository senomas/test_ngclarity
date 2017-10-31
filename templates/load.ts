import * as fs from "fs"
import * as yaml from "yamljs"

export function load(): any {
  let models: any[] = []
  let modelPath = `${__dirname}/../../src/models`
  fs.readdirSync(modelPath).forEach(fp => {
    if (fp.endsWith(".yaml")) {
      console.log(`Load "${modelPath}/${fp}"`)
      let model = yaml.load(`${modelPath}/${fp}`)
      model.$id = fp.slice(0, -5)
      model.$name = model.$id.charAt(0).toUpperCase() + model.$id.slice(1)
      models.push(model)
    }
  })
  return models
}

export function write(fn: string, result: string) {
  fs.writeFileSync(`${__dirname}/../../${fn}`, result)
}
