/**
 * One-off script: replace broken https://localhost API URLs with apiUrl()
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, "..", "src");

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (/\.(jsx|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function getImportPath(filePath) {
  let rel = path.relative(path.dirname(filePath), path.join(srcRoot, "utils/authStorage"));
  rel = rel.replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function addImport(content, filePath) {
  if (content.includes("authStorage")) return content;
  const importPath = getImportPath(filePath);
  const line = `import { apiUrl, getAuthHeaders, getUserId } from "${importPath}";\n`;
  const match = content.match(/^import .+;\n/gm);
  if (match?.length) {
    const last = match[match.length - 1];
    const idx = content.indexOf(last) + last.length;
    return content.slice(0, idx) + line + content.slice(idx);
  }
  return line + content;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("https://${import.meta.env.VITE_BACKEND}")) return false;

  content = content.replace(
    /`https:\/\/\$\{import\.meta\.env\.VITE_BACKEND\}([^`]*)`/g,
    (_, pathPart) => `apiUrl(\`${pathPart}\`)`
  );
  content = content.replace(
    /"https:\/\/\$\{import\.meta\.env\.VITE_BACKEND\}([^"]*)"/g,
    (_, pathPart) => `apiUrl("${pathPart}")`
  );

  content = addImport(content, filePath);
  fs.writeFileSync(filePath, content);
  return true;
}

const updated = walkDir(srcRoot).filter(processFile);
console.log(`Updated ${updated.length} files:`);
updated.forEach((f) => console.log(" -", path.relative(srcRoot, f)));
