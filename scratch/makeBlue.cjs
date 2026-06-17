const fs = require('fs');
const path = 'C:/Users/seifd/Downloads/standalone-games/public/images/mines/diamond.svg';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/rgb\((\d+),(\d+),(\d+)\)/g, (match, r, g, b) => {
    // Keep dark shading somewhat normal, just swap Green and Blue to shift hue
    return `rgb(${r},${b},${g})`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Colors swapped to blue!");
