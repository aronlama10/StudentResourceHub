import fs from "fs";
import https from "https";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "src", "assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const photos = [
  {
    url: "https://images.unsplash.com/photo-1681681082165-ff333bbc037a?q=80&w=1200&auto=format&fit=crop",
    name: "hero-students.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1683543124644-7f0095d28c3c?q=80&w=600&auto=format&fit=crop",
    name: "notepad.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop",
    name: "writing.jpg",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return download(res.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

(async () => {
  for (const p of photos) {
    const dest = path.join(assetsDir, p.name);
    process.stdout.write(`Downloading ${p.name}... `);
    try {
      await download(p.url, dest);
      console.log("done");
    } catch (e) {
      console.error("failed", e.message);
    }
  }
})();
