
try {
  require("./generate-models").generate()
  require("./generate-client-models").generate()
} catch (err) {
  console.error(err)
  process.exit(1)
}