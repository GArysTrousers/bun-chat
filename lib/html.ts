import { readdirSync } from "fs";

let templateDir = './templates'
let templates = new Map<string, string>();

for (const filename of readdirSync(templateDir)) {
  let file = Bun.file(`${templateDir}/${filename}`)
  templates.set(filename.replace('.html', ''), await file.text())
}

export function html(page:string) {
  return new Response(page, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

export function template(name:string, data: { [key: string]: string } = {}) {
  let text = templates.get(name)
  if (text === undefined) throw new Error(`No Template: ${name}`)
  for (const key in data) {
    text = text.replaceAll(`{${key}}`, data[key]);
  }
  return text;
}