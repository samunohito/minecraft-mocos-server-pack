import { existsSync, rmSync } from "fs"

const mods = [
  "oculus-mc1.20.1-1.8.0.jar",
  "entity_texture_features_1.20.1-forge-7.0.8.jar",
]

for (const path of mods.map(mod => `mods/${mod}`)) {
  if (existsSync(path)) {
    rmSync(path)
    console.log(`Removed ${path}`)
  }
}
