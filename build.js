const fs = require("fs");
const path = require("path");

const root = __dirname;
const outputs = [path.join(root, "dist"), path.join(root, "public")];
const files = ["index.html", "styles.css", "app.js"];

for (const output of outputs) {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });

  for (const file of files) {
    fs.copyFileSync(path.join(root, file), path.join(output, file));
  }
}

console.log("Built OPSNIGHT static bundle in dist/ and public/");
