const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const newContent = content.replace(/\/admin/g, "/getmein");

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      replaceInFile(filePath);
    }
  });
}

console.log("🔄 Replacing /admin with /getmein in all source files...\n");
walkDir(path.join(__dirname, "..", "src"));
console.log("\n✅ Replacement complete!");
