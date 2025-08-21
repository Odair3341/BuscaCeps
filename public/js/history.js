(function(){
const KEY = 'buscasCep_v1';
function onlyDigits(s){ return String(s||'').replace(/\D/g,''); }
function fmtCep(v){ v = onlyDigits(v); return v.length===8 ? v.slice(0,5)+'-'+v.slice(5) : v; }
function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch(e){return[]} }
function save(list){ try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){} }
function add(cep){
  if(!cep) return;
  const valor = onlyDigits(cep);
  if(!valor) return;
  const list = load();
  const idx = list.findIndex(x => x.tipo==='cep' && x.valor===valor);
  if(idx!==-1) list.splice(idx,1);
  list.unshift({ tipo:'cep', valor: valor, display: fmtCep(valor), data: Date.now() });
  if(list.length>50) list.length = 50;
  save(list);
  render();
}
function ensureContainer(){
  let c = document.querySelector('#historyContainer');
  if(c) return c;
  const header = Array.from(document.querySelectorAll('h1,h2,strong')).find(h => /Hist[oó]rico/i.test(h.textContent||''));
  c = document.createElement('div'); c.id = 'historyContainer'; c.className = 'history-container'; c.style.padding = '12px';
  if(header && header.parentNode) header.parentNode.insertBefore(c, header.nextSibling);
  else document.body.appendChild(c);
  return c;
}
function render(){
  const c = ensureContainer();
  const list = load();
  if(!list.length){ c.innerHTML = '<div class=\"empty\">Nenhuma busca recente</div>'; return; }
  c.innerHTML = '';
  list.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'history-item';
    div.style.padding = '8px';
    div.style.border = '1px solid #e6e6e6';
    div.style.marginBottom = '8px';
    div.style.cursor = 'pointer';
    div.dataset.valor = item.valor;
    div.innerHTML = <div style=\"font-weight:700\"></div><div style=\"color:#666;font-size:12px\"></div>;
    div.addEventListener('click', ()=> {
      const inp = document.querySelector('input[placeholder*=\"CEP\"], input[name=\"cep\"], #inputCep, #cep');
      if(inp){ inp.value = item.valor; }
      const btn = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).find(b => /buscar|pesquisar/i.test((b.textContent||b.value||'').toLowerCase()));
      if(btn) btn.click();
    });
    c.appendChild(div);
  });
}
function wireTriggers(){
  const inputs = ['input[placeholder*=\"CEP\"]','input[name=\"cep\"]','#inputCep','#cep'];
  const inp = inputs.map(s=>document.querySelector(s)).find(Boolean);
  const btns = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]'));
  const buscarBtn = btns.find(b => /buscar|pesquisar/i.test((b.textContent||b.value||'').toLowerCase()));
  if(buscarBtn){
    buscarBtn.addEventListener('click', ()=> {
      const v = inp ? inp.value : document.querySelector('input[type=\"text\"], input[type=\"search\"]')?.value;
      add(v);
    });
  }
  if(inp){
    inp.addEventListener('keydown', e => { if(e.key === 'Enter'){ add(inp.value); } });
  }
}
window.onCepSearchCompleted = function(cep){ add(cep); };
document.addEventListener('DOMContentLoaded', ()=>{ render(); setTimeout(wireTriggers,200); });
})();
