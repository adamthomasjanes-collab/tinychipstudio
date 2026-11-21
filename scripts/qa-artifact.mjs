// Start from the tested full production artifact, keeping client runtimes intact.
// Only this separate output includes opt-in diagnostics; production stays untouched.
import { cp, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
if(process.env.CONTEXT==='production')throw Error('QA artifacts cannot be built in production context');
await readFile(new URL('../dist/index.html',import.meta.url));
await cp(new URL('../dist/',import.meta.url),new URL('../dist-qa/',import.meta.url),{recursive:true});
await build({root,mode:'qa',build:{outDir:'dist-qa',emptyOutDir:false}});
execFileSync(process.execPath,['scripts/prerender.mjs'],{cwd:root,env:{...process.env,STUDIO_DIST:'dist-qa'},stdio:'inherit'});
console.log('QA artifact ready in dist-qa. Deploy only as a draft. Add ?qa=1 to enable diagnostics.');
