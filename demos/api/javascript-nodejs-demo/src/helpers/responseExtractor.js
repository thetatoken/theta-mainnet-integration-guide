import { morphism } from 'morphism'

export function responseExtractor (response, schema) {
  if (response.error !== undefined) {
    throw response.error
  }
  return schema !== undefined ? morphism(schema, response.result) : response.result
}
