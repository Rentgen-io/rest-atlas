/** Dependency-free validation shared by local contributors and any future CI workflow. */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function validateCatalogue(data, schema) {
  const errors = [];
  const fail = (path,message) => errors.push(`${path}: ${message}`);
  const typeOf = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  function check(value,rule,path) {
    if (rule.$ref) {
      const ref = rule.$ref.split('/').slice(1).reduce((node,key) => node?.[key],schema);
      if (!ref) { fail(path,`unresolved schema reference ${rule.$ref}`); return; }
      check(value,ref,path); return;
    }
    if (rule.type && ![].concat(rule.type).includes(typeOf(value))) { fail(path,`expected ${[].concat(rule.type).join(' or ')}, received ${typeOf(value)}`); return; }
    if (Object.hasOwn(rule,'const') && value !== rule.const) fail(path,`must be ${JSON.stringify(rule.const)}`);
    if (rule.enum && !rule.enum.includes(value)) fail(path,`must be one of: ${rule.enum.join(', ')}`);
    if (typeof value === 'string') {
      if (rule.minLength && value.trim().length < rule.minLength) fail(path,`must contain at least ${rule.minLength} characters`);
      if (rule.maxLength && value.length > rule.maxLength) fail(path,`must contain at most ${rule.maxLength} characters`);
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) fail(path,`does not match ${rule.pattern}`);
      if (rule.format === 'uri') {
        try {const url = new URL(value); if (!['https:','http:'].includes(url.protocol)||url.username||url.password) throw new Error();}
        catch {fail(path,'must be an absolute http(s) URL without embedded credentials');}
      }
      if (rule.format === 'date') {
        const date = new Date(value+'T00:00:00Z');
        if (Number.isNaN(date.valueOf())||date.toISOString().slice(0,10)!==value) fail(path,'must be a real date in YYYY-MM-DD format');
        else if (value > new Date().toISOString().slice(0,10)) fail(path,'verification date cannot be in the future');
      }
    }
    if (Array.isArray(value)) {
      if (rule.minItems && value.length < rule.minItems) fail(path,`needs at least ${rule.minItems} item(s)`);
      if (rule.maxItems && value.length > rule.maxItems) fail(path,`allows at most ${rule.maxItems} items`);
      if (rule.uniqueItems && new Set(value.map(item=>JSON.stringify(item))).size !== value.length) fail(path,'contains duplicate items');
      value.forEach((item,i)=>{if(rule.items)check(item,rule.items,`${path}[${i}]`);});
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const key of rule.required||[]) if (!Object.hasOwn(value,key)) fail(path,`missing required field "${key}"`);
      for (const [key,item] of Object.entries(value)) {
        if (rule.properties?.[key]) check(item,rule.properties[key],`${path}.${key}`);
        else if (rule.additionalProperties===false) fail(path,`unknown field "${key}"`);
      }
    }
  }
  check(data,schema,'catalogue');
  const categoryIds = new Set();
  for (const [i,category] of (Array.isArray(data?.categories)?data.categories:[]).entries()) {
    if (!category || typeof category !== 'object') continue;
    if (categoryIds.has(category.id)) fail(`categories[${i}].id`,`duplicate category ID "${category.id}"`);
    categoryIds.add(category.id);
  }
  const toolIds = new Set(), names = new Set();
  for (const [i,tool] of (Array.isArray(data?.tools)?data.tools:[]).entries()) {
    if (!tool || typeof tool !== 'object') continue;
    if (toolIds.has(tool.id)) fail(`tools[${i}].id`,`duplicate tool ID "${tool.id}"`);
    toolIds.add(tool.id);
    const name=typeof tool.name==='string'?tool.name.trim().toLowerCase():'';
    if (name && names.has(name)) fail(`tools[${i}].name`,`duplicate tool name "${tool.name}"`);
    names.add(name);
    for (const id of Array.isArray(tool.categories)?tool.categories:[]) if (!categoryIds.has(id)) fail(`tools[${i}].categories`,`unknown category "${id}"`);
    for (const field of ['execution','interfaces','testCreation']) if (Array.isArray(tool[field]) && tool[field].includes('unknown') && tool[field].length>1) fail(`tools[${i}].${field}`,'"unknown" cannot be combined with known values');
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const dataPath = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('./tools.json',import.meta.url));
    const [data,schema] = await Promise.all([readFile(dataPath,'utf8').then(JSON.parse),readFile(new URL('./tools.schema.json',import.meta.url),'utf8').then(JSON.parse)]);
    const errors=validateCatalogue(data,schema);
    if (errors.length) { console.error(`Catalogue validation failed:\n${errors.map(e=>'  • '+e).join('\n')}`); process.exitCode=1; }
    else console.log(`Valid catalogue: ${data.tools.length} tools across ${data.categories.length} categories.`);
  } catch (error) { console.error(`Cannot validate catalogue: ${error.message}`); process.exitCode=1; }
}
