import {
  importDirectory,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
} from "@iconify/tools";

// const fs = require("node:fs");
// const tools = require('@iconify/tools');

import {
  writeFile
} from "node:fs";

(async () => {
  // Import icons
  const iconSet = await importDirectory(".", {
    prefix: "my",
  });

  // Validate, clean up, fix palette and optimise
  iconSet.forEach((name, type) => {
    if (type !== "icon") {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      cleanupSVG(svg);

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      parseColors(svg, {
        defaultColor: "currentColor",
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : "currentColor";
        },
      });

      // Optimise
      runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export
  var jso =iconSet.export()
  console.log(jso);
  
  // tools.ExportComponent(iconSet, 'my_icons', {
  //   sources: false,
  //   commonjs: false
  // })



  writeFile("./my_icons.json", JSON.stringify(jso, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

})();
