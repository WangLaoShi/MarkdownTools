import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function crc(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let i = 0; i < 8; i += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc(body), 8 + data.length);
  return out;
}

function png(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const margin = size * 0.22;
      const inMark =
        x > margin &&
        x < size - margin &&
        y > margin &&
        y < size - margin &&
        (Math.abs(x - margin) < size * 0.12 ||
          Math.abs(x - (size - margin)) < size * 0.12 ||
          (y > size * 0.42 && y < size * 0.62 && x > margin && x < size - margin && Math.abs(x - size / 2) < size * 0.08));
      const pixel = inMark ? [250, 250, 250, 255] : [9, 9, 11, 255];
      const offset = row + 1 + x * 4;
      pixel.forEach((value, index) => {
        raw[offset + index] = value;
      });
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, png(size));
}
writeFileSync("public/icon-512-maskable.png", png(512));

const sheets = {
  "markdown-cheat-sheet.pdf": ["Markdown cheat sheet", "Headings: # to ######", "Bold **text**  Italic *text*", "Links [text](url)", "Fences ```lang", "Tables need a --- separator row", "Tasks - [ ] and - [x]", "Callouts > [!NOTE]", "Footnotes [^id]", "Math $E = mc^2$"],
  "github-markdown-cheat-sheet.pdf": ["GitHub Markdown", "Alerts > [!WARNING]", "Task lists", "Tables and footnotes", "Autolinks and issue references"],
  "jupyter-notebook-markdown-cheat-sheet.pdf": ["Jupyter Markdown", "Markdown cells render CommonMark", "MathJax: $y = mx + b$", "Images and HTML are allowed", "Tables use pipes"],
  "obsidian-markdown-cheat-sheet.pdf": ["Obsidian Markdown", "Wikilinks [[Note#Heading]]", "Embeds ![[file]]", "Callouts > [!tip] Title", "Tasks - [ ]"],
  "r-markdown-cheat-sheet.pdf": ["R Markdown", "Chunks start with ```{r}", "echo=FALSE hides code", "Inline values use `r `", "Prose around the chunks is Markdown"],
  "markdown-flavor-compatibility.pdf": ["Flavor compatibility", "GitHub: tables, tasks, alerts", "Obsidian: wikilinks and callouts", "Jupyter: math", "Discord: underline and spoilers", "Slack: mrkdwn, single-asterisk bold"],
};

mkdirSync("public/pdf", { recursive: true });
for (const [name, lines] of Object.entries(sheets)) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawText(lines[0], { x: 48, y: 780, size: 24, font: bold, color: rgb(0.07, 0.07, 0.09) });
  lines.slice(1).forEach((line, index) => {
    page.drawText(line, { x: 48, y: 730 - index * 28, size: 14, font, color: rgb(0.1, 0.1, 0.12) });
  });
  writeFileSync(`public/pdf/${name}`, await pdf.save());
}

console.log("assets written");
