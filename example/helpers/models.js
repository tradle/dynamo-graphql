const modelsArray = require('@tradle/models').models.concat(require('@tradle/custom-models'))
const { extend, shallowClone, normalizeModels } = require('../../utils')
const models = normalizeModels(modelsArray.reduce((map, model) => {
  map[model.id] = model
  return map
}, {}))

module.exports = models