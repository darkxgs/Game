const fs = require('fs');
const originalPath = 'C:/Users/seifd/Downloads/stake-originals-clone-main/public/images/mines/diamond.svg';
const targetPath = 'C:/Users/seifd/Downloads/standalone-games/public/images/mines/diamond.svg';
let content = fs.readFileSync(originalPath, 'utf8');

content = content.replace(/rgb\((\d+),(\d+),(\d+)\)/g, (match, r, g, b) => {
    // Keep dark shading normal
    if (r === '5' && g === '29' && b === '39') return match; 
    
    // Map original intense green to bright blue, and slightly lower green for a light sky-blue hue
    let newG = Math.floor(parseInt(g) * 0.8);
    let newB = parseInt(g);
    
    return `rgb(${r},${newG},${newB})`;
});

fs.writeFileSync(targetPath, content, 'utf8');
console.log("Colors swapped to light blue!");
