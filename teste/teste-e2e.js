addEventListener('load', async () => {
  const corpo = () => document.getElementById('raiz').textContent;
  const digita = (id, v) => { const c = document.getElementById(id); c.value = v; c.dispatchEvent(new Event('input', { bubbles: true })); };
  const marca = (re) => [...document.querySelectorAll('label')].find((l) => re.test(l.textContent) && l.querySelector('input[type=radio],input[type=checkbox]')).querySelector('input').click();
  const r = [];
  try {
    r.push('faixa de rascunho ' + (corpo().includes('Rascunho para conferência') ? 'APARECE (errado)' : 'some: OK'));
    digita('nome', 'Construtora Exemplo Ltda'); digita('doc', '12.345.678/0001-90'); digita('endereco', 'Rua 1, Goiânia');
    digita('representante', 'Fulano de Tal'); digita('docRep', '123.456.789-09'); digita('email', 'fulano@exemplo.com');
    digita('telefone', '62 99999-0000'); digita('empreendimento', 'Novos Ares Luar');
    marca(/\(GAP\)/); marca(/aberto/i); marca(/Li a declaração acima/);
    const total = document.querySelectorAll('input[type=file]').length;
    for (let i = 0; i < total; i++) {
      const campo = document.querySelectorAll('input[type=file]')[i];
      const ext = campo.accept.split(',')[0].slice(1);
      const dt = new DataTransfer();
      dt.items.add(new File([ext === 'dwg' ? 'AC1032 desenho ' + i : '%PDF-1.7 documento ' + i], 'arquivo ' + i + '.' + ext));
      if (campo.multiple) dt.items.add(new File([ext === 'dwg' ? 'AC1032 segundo' : '%PDF-1.7 segundo'], 'segundo ' + i + '.' + ext));
      campo.files = dt.files;
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    }
    r.push(total + ' campos de arquivo');
    const errado = new DataTransfer(); errado.items.add(new File(['x'], 'virus.exe'));
    const primeiro = document.querySelectorAll('input[type=file]')[0];
    primeiro.files = errado.files; primeiro.dispatchEvent(new Event('input', { bubbles: true }));
    r.push('formato errado ' + (corpo().includes('Arquivo recusado') ? 'recusado: OK' : 'ACEITO (errado)'));
    const botao = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Enviar pedido'));
    r.push('botão ' + (botao.disabled ? 'BLOQUEADO: ' + corpo().split('Pendências para o envio:')[1]?.slice(0, 200) : 'liberado: OK'));
    botao.click();
    for (let i = 0; i < 100 && !/Pedido recebido|O pedido não foi enviado/.test(corpo()); i++) await new Promise((ok) => setTimeout(ok, 100));
    r.push(/Pedido recebido/.test(corpo()) ? 'RECEBIDO: ' + corpo().split('Protocolo deste envio:')[1].slice(0, 40)
      : 'NÃO ENVIOU: ' + (corpo().split('O pedido não foi enviado.')[1] ?? corpo().slice(-300)).slice(0, 300));
  } catch (e) { r.push('ERRO DO TESTE: ' + e.message); }
  document.title = 'E2E ' + r.join(' | ');
});
