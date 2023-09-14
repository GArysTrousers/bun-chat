import { readdirSync } from "fs";

let templates = new Map<string, string>();

export async function loadTemplates(dir:string) {
  for (const filename of readdirSync(dir)) {
    let file = Bun.file(`${dir}/${filename}`)
    templates.set(filename.replace('.html', ''), await file.text())
  }
} 

export function html(page: string) {
  return new Response(page, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export async function json(data:any) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'text/json' }
  })
}

export async function asset(filename: string) {
  let file = Bun.file(filename)
  return new Response(await file.arrayBuffer(), {
    headers: { 'Content-Type': getContentType(filename) }
  })
}

export function template(name: string, data: { [key: string]: string } = {}) {
  let text = templates.get(name)
  if (text === undefined) throw new Error(`No Template: ${name}`)
  for (const key in data) {
    text = text.replaceAll(`{{${key}}}`, data[key]);
  }
  return text;
}

export async function page(filename: string) {
  let file = Bun.file(filename)
  return await file.text()
}

function getContentType(filename:string):string {
  let type = filename.match(/.+\.(.+)$/i)
  if (!type) return 'idk';
  let filetype = type[1].toLowerCase()
  if (filetype == 'png') return 'image/png'
  if (filetype == 'ico') return 'image/ico'
  return 'idk';
}