const wap = require('webapi-parser').WebApiParser

const ramlStr = `
  #%RAML 0.8
  title: Magic API
  version: v3
  baseUri: https://magic.api.com
  /items:
    get:
      description: Get a list of magic items
      queryParameters:
        page:
          type: integer
        per_page:
          type: integer
`

async function main () {
  const model = await wap.raml08.parseString(ramlStr)
  const resolved = await wap.raml08.resolve(model)
  const report = await wap.raml08.validate(model)
  console.log('Validation errors:\n', report.results)

  // Modify content
  const perPage = resolved.encodes.endPoints[0].operations[0].request.queryParameters[1]
  perPage.schema.withMaximum(100)

  const generated = await wap.raml08.generateString(model)
  console.log('Generated:\n', generated)
}

main()