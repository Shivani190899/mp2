import { copyFile, mkdir } from "node:fs/promises";

for (let id = 1; id <= 151; id++) {
  const directory = `dist/pokemon/${id}`;

  await mkdir(directory, { recursive: true });
  await copyFile("dist/index.html", `${directory}/index.html`);
}

await copyFile("dist/index.html", "dist/404.html");