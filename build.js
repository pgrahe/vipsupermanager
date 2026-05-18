const fs = require("fs");
const path = require("path");

const root = __dirname;
const outputs = [path.join(root, "dist"), path.join(root, "public")];
const files = ["index.html", "styles.css", "dashboard.js", "sw.js", "manifest.webmanifest"];
const directories = ["icons", "supabase"];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

for (const output of outputs) {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });

  for (const file of files) {
    fs.copyFileSync(path.join(root, file), path.join(output, file));
  }

  directories.forEach((directory) => {
    copyDir(path.join(root, directory), path.join(output, directory));
  });
}

console.log("Built OPSNIGHT static bundle in dist/ and public/");
