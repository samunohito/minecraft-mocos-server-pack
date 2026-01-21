// priority: 0

// Visit the wiki for more info - https://kubejs.com/

ServerEvents.recipes(event => {
  event.remove({
    output: [
      'mekanism:meka_tool',
      /^mekanism:mekasuit_.+$/,
      /^mekanism:module_.+$/,
      "mekanism:digital_miner",
      "mekanism:atomic_disassembler",
      "mekanism:teleportation_core",
      /^mekanism:.+_tier_installer$/,
      "mekanism:flamethrower",
      /^mekanism:hazmat_.+$/,
      "mekanism:pellet_antimatter",
      "mekanism:pellet_plutonium",
      "mekanism:pellet_polonium",
      "mekanism:geiger_counter",
      "mekanism:dosimeter",
      "mekanism:portable_qio_dashboard",
      "mekanism:qio_drive_base",
      "mekanism:qio_drive_hyper_dense",
      "mekanism:qio_drive_time_dilating",
      "mekanism:qio_drive_supermassive",
      "mekanism:superheating_element",
      "mekanism:pressure_disperser",
      "mekanism:boiler_casing",
      "mekanism:boiler_valve",
      "mekanism:radioactive_waste_barrel",
      "mekanism:modification_station",
      "mekanism:antiprotonic_nucleosynthesizer",
      "mekanism:sps_casing",
      "mekanism:sps_port",
      "mekanism:supercharged_coil",
      "mekanism:isotopic_centrifuge",
      "mekanism:qio_drive_array",
      "mekanism:qio_dashboard",
      "mekanism:qio_importer",
      "mekanism:qio_exporter",
      "mekanism:qio_redstone_adapter"
    ],
  });
  event.remove({
    input: [
      /^mekanism:module_.+$/,
      "mekanism:teleportation_core",
      /^mekanism:.+_tier_installer$/,
    ],
  });

  // 難易度を上げるため、上位工場のレシピを削除して再定義する

  let outputFactoryName, upgradeItem;
  for (const level of factoryLevels) {
    for (const type of factoryTypes) {
      outputFactoryName = resolveFactoryName(level, type);

      if (level !== 'tiny') {
        event.remove({ output: outputFactoryName });

        upgradeItem = resolveFactoryUpgradeItem(level, type);
        event.recipes.create.mechanical_crafting(
          outputFactoryName,
          [
            'ICACI',
            'I S I',
            'ICACI',
          ],
          {
            A: upgradeItem.alloy,
            C: upgradeItem.circuit,
            I: upgradeItem.ingot,
            S: upgradeItem.source
          }
        );
      }
    }
  }
})

const factoryLevels = ['tiny', 'basic', 'advanced', 'elite', 'ultimate'];
const factoryTypes = [
  'smelting', 'enriching', 'crushing', 'compressing',
  'combining', 'purifying', 'injecting', 'infusing', 'sawing'
];

function resolveFactoryName(level, type) {
  if (level === 'tiny') {
    switch (type) {
      case 'smelting':
        // 電動精錬機
        return "mekanism:energized_smelter";
      case 'enriching':
        // 濃縮室
        return "mekanism:enrichment_chamber";
      case 'crushing':
        // 粉砕機
        return "mekanism:crusher";
      case 'compressing':
        // オスミウム圧縮機
        return "mekanism:osmium_compressor";
      case 'combining':
        // 結合機
        return "mekanism:combiner";
      case 'purifying':
        // 浄化室
        return "mekanism:purification_chamber";
      case 'injecting':
        // 化学注入室
        return "mekanism:chemical_injection_chamber";
      case 'infusing':
        // 冶金吹込機
        return "mekanism:metallurgic_infuser";
      case 'sawing':
        // 精密製材機
        return "mekanism:precision_sawmill";
      default:
        throw new Error(`Unknown factory type: ${type}`);
    }
  } else {
    return `mekanism:${level}_${type}_factory`;
  }
}

function resolveFactoryUpgradeItem(level, type) {
  switch (level) {
    case 'basic':
      return {
        alloy: "minecraft:redstone_block",
        circuit: "mekanism:basic_control_circuit",
        ingot: "minecraft:iron_ingot",
        source: resolveFactoryName('tiny', type),
      };
    case 'advanced':
      return {
        alloy: "mekanism:alloy_infused",
        circuit: "mekanism:advanced_control_circuit",
        ingot: "mekanism:ingot_osmium",
        source: resolveFactoryName('basic', type),
      };
    case 'elite':
      return {
        alloy: "mekanism:alloy_reinforced",
        circuit: "mekanism:elite_control_circuit",
        ingot: "minecraft:gold_ingot",
        source: resolveFactoryName('advanced', type),
      };
    case 'ultimate':
      return {
        alloy: "mekanism:alloy_atomic",
        circuit: "mekanism:ultimate_control_circuit",
        ingot: "minecraft:diamond",
        source: resolveFactoryName('elite', type),
      };
    default:
      throw new Error(`Unknown factory level for upgrade item: ${level}`);
  }
}