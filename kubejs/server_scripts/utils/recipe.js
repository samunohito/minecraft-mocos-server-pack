// priority: 100

/**
 * @param {Internal.RecipesEventJS} event
 * @param {Object} props
 * @param {(Internal.InputFluid_|InputItem_)|(Internal.InputFluid_|InputItem_)[]} props.input
 * @param {(Internal.OutputFluid_|OutputItem_)|(Internal.OutputFluid_|OutputItem_)[]} props.output
 * @param {number | undefined} props.processingTime
 * @param {("none"|"heated"|"superheated") | undefined} props.heatRequirement
 */
function fermenting(event, props) {
  let jsonInput = convertIngredientObj(props.input);
  let jsonOutput = convertIngredientObj(props.output);

  event.custom({
    type: 'createdieselgenerators:basin_fermenting',
    ingredients: jsonInput,
    results: jsonOutput,
    processingTime: (props.processingTime ?? 200),
    heatRequirement: (props.heatRequirement ?? "none")
  })

  event.custom({
    type: 'createdieselgenerators:bulk_fermenting',
    ingredients: jsonInput,
    results: jsonOutput,
    processingTime: (props.processingTime ?? 200) * 0.5,
    heatRequirement: (props.heatRequirement ?? "none")
  })
}
