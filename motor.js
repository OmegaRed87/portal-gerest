// Motor mínimo da página: desenha o molde (<template id="molde">) com os valores de Component.renderVals()
// e redesenha a cada setState. Entende só o que o rascunho usa: {{ caminho.com.pontos }}, <sc-if value>,
// <sc-for list as>, onClick, onChange, value, checked, disabled e multiple.
class DCLogic {
  constructor(props) { this.props = props; }
  setState(parte) { this.state = { ...this.state, ...parte }; desenhar(); }
}

let logica, molde, raiz;
const valor = (escopo, caminho) => caminho.split('.').reduce((o, k) => o?.[k], escopo);
const texto = (escopo, s) => s.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, c) => valor(escopo, c) ?? '');
const soCaminho = (s) => /^\{\{\s*([\w.$]+)\s*\}\}$/.exec((s ?? '').trim())?.[1];

function montar(no, escopo, destino) {
  if (no.nodeType === 3) return destino.append(texto(escopo, no.data));
  if (no.nodeType !== 1) return;
  const filhos = (e, alvo) => no.childNodes.forEach((f) => montar(f, e, alvo));
  if (no.localName === 'sc-if') {
    if (valor(escopo, soCaminho(no.getAttribute('value')))) filhos(escopo, destino);
    return;
  }
  if (no.localName === 'sc-for') {
    for (const item of valor(escopo, soCaminho(no.getAttribute('list'))) ?? []) {
      filhos({ ...escopo, [no.getAttribute('as')]: item }, destino);
    }
    return;
  }
  const el = no.cloneNode(false);                      // mantém o espaço de nomes (SVG)
  for (const { name, value } of [...no.attributes]) {
    const c = soCaminho(value);
    if (name.startsWith('hint-')) el.removeAttribute(name);
    else if (c && (name === 'onclick' || name === 'onchange')) {
      el.removeAttribute(name);
      el[name === 'onclick' ? 'onclick' : 'oninput'] = valor(escopo, c);   // onChange vale a cada tecla
    } else if (c && name === 'checked') { el.removeAttribute(name); el._marcado = el.checked = !!valor(escopo, c); }
    else if (c && (name === 'disabled' || name === 'multiple')) { el.removeAttribute(name); if (valor(escopo, c)) el.setAttribute(name, ''); }
    else if (c && name === 'value') { el.removeAttribute(name); el._valor = String(valor(escopo, c) ?? ''); }
    else if (value.includes('{{')) el.setAttribute(name, texto(escopo, value));
  }
  filhos(escopo, el);
  if ('_valor' in el) el.value = el._valor;            // depois dos filhos: o <select> precisa das opções
  destino.append(el);
}

// Iguala a tela ao desenho novo sem trocar os elementos, para o campo em uso não perder o foco.
// shortcut: compara por posição, campo sem ligação com o estado (validade, telefone) pode esvaziar
// quando a lista acima dele muda; ligar esses campos ao estado quando a página passar a enviar de verdade.
function igualar(velho, novo) {
  const a = [...velho.childNodes], b = [...novo.childNodes];
  b.forEach((n, i) => {
    const o = a[i];
    if (!o) return velho.append(n);
    if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) return o.replaceWith(n);
    if (n.nodeType !== 1) { if (o.data !== n.data) o.data = n.data; return; }
    for (const { name } of [...o.attributes]) if (!n.hasAttribute(name)) o.removeAttribute(name);
    for (const { name, value } of [...n.attributes]) if (o.getAttribute(name) !== value) o.setAttribute(name, value);
    o.onclick = n.onclick;
    o.oninput = n.oninput;
    igualar(o, n);
    if ('_marcado' in n && o.checked !== n._marcado) o.checked = n._marcado;
    if ('_valor' in n && o.value !== n._valor) o.value = n._valor;
  });
  a.slice(b.length).forEach((o) => o.remove());
}

function desenhar() {
  const novo = document.createElement('div');
  const valores = logica.renderVals();
  molde.childNodes.forEach((n) => montar(n, valores, novo));
  igualar(raiz, novo);
}

function iniciar(Componente) {
  molde = document.getElementById('molde').content;
  raiz = document.getElementById('raiz');
  logica = new Componente({});
  desenhar();
}
