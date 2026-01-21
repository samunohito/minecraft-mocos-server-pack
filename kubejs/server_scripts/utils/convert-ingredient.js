// priority: 100

/**
 * @param {Internal.InputFluid_|InputItem_|Internal.OutputFluid_|OutputItem_} input
 * @returns
 */
function convertIngredientObj(input) {
  // FluidStackJS (Fluid.water(1000)など) の場合
  if ('fluid' in input && 'amount' in input) {
    let result = {
      amount: input.amount
    };

    if (typeof input.fluid === 'string') {
      result.fluid = input.fluid;
    } else {
      // FluidStackJSオブジェクトが渡されていると仮定
      result.fluid = input.id.toString();
    }

    return [result];
  }

  // ItemStackJS (Item.of('name', count)など) の場合
  if ('item' in input && 'count' in input) {
    let result = {
      count: input.count
    }

    if (typeof input.item === 'string') {
      result.item = input.item;
    } else {
      // ItemStackJSオブジェクトが渡されていると仮定
      result.item = input.id.toString();
    }

    return [result];
  }

  // 文字列 ('minecraft:dirt' など) の場合
  if (typeof input === 'string') {
    // 先頭が # ならタグ、それ以外ならアイテムとみなす簡易判定
    if (input.startsWith('#')) return [{ tag: input.substring(1) }];
    return [{ item: input }];
  }

  // 配列の場合は再帰
  if (Array.isArray(input)) {
    return input.map(i => convertIngredientObj(i));
  }

  return input;
};
