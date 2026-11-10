// Gera o index.html a partir do rascunho do editor de design:  node montar.mjs CAMINHO/Main.dc.html
import { readFileSync, writeFileSync } from 'node:fs';

const fonte = readFileSync(process.argv[2], 'utf8');
const pega = (re) => {
  const m = re.exec(fonte);
  if (!m) throw new Error('não achei no rascunho: ' + re);
  return m[1].trim();
};
const titulo = pega(/<title>(.*?)<\/title>/);
const cabeca = pega(/<helmet>([\s\S]*?)<\/helmet>/);
const corpo = pega(/<\/helmet>([\s\S]*?)<\/x-dc>/).replace(/\/_blob\/[0-9a-f]+/g, 'marca_prefeitura.png');
const logica = pega(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);

writeFileSync(new URL('index.html', import.meta.url), `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${titulo}</title>
${cabeca}
</head>
<body>
<div id="raiz"></div>
<noscript>Esta página precisa de JavaScript.</noscript>
<template id="molde">
${corpo}
</template>
<script src="motor.js"></script>
<script>
${logica}
iniciar(Component);
</script>
</body>
</html>
`);
