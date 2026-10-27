const html = String.raw`<!doctype html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f8f6"><meta name="description" content="Ubah tabel RAB atau BoQ dari PDF menjadi Excel yang bisa diedit. Kurangi input manual uraian pekerjaan, volume, satuan, dan harga satuan dengan RabConverter."><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://rabconverter-preview.rabconverter-id.workers.dev/"><meta property="og:locale" content="id_ID"><meta property="og:type" content="website"><meta property="og:site_name" content="RabConverter"><meta property="og:title" content="RAB PDF ke Excel Online — RabConverter"><meta property="og:description" content="Ubah tabel RAB atau BoQ dari PDF menjadi Excel yang bisa diedit. Kurangi pekerjaan salin-tempel secara manual."><meta property="og:url" content="https://rabconverter-preview.rabconverter-id.workers.dev/"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="RAB PDF ke Excel Online — RabConverter"><meta name="twitter:description" content="Ubah tabel RAB atau BoQ dari PDF menjadi Excel yang bisa diedit."><meta name="application-name" content="RabConverter"><link rel="sitemap" type="application/xml" href="/sitemap.xml"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"RabConverter","url":"https://rabconverter-preview.rabconverter-id.workers.dev/","inLanguage":"id"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"RAB PDF ke Excel Online — RabConverter","description":"Ubah tabel RAB atau BoQ dari PDF menjadi Excel yang bisa diedit. Kurangi input manual uraian pekerjaan, volume, satuan, dan harga satuan.","url":"https://rabconverter-preview.rabconverter-id.workers.dev/","inLanguage":"id","isPartOf":{"@type":"WebSite","name":"RabConverter","url":"https://rabconverter-preview.rabconverter-id.workers.dev/"}}</script><title>RAB PDF ke Excel Online — RabConverter</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{font-family:"Plus Jakarta Sans",sans-serif;color:#1c2823;background:#f7f8f6;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;--dark:#0e4d37;--green:#247454}
*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;min-width:320px;min-height:100vh}.shell{min-height:100vh;display:flex;flex-direction:column;background:radial-gradient(ellipse at 52% 38%,rgba(222,239,226,.56),transparent 42%),#f7f8f6}
.top{width:min(1160px,calc(100% - 64px));min-height:76px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dfe6e0}
.brand{display:flex;align-items:center;gap:10px;color:#1c2823;text-decoration:none}.mark{position:relative;display:grid;place-items:center;width:34px;height:34px;background:var(--dark);border-radius:10px;color:#fff;font:800 20px "Plus Jakarta Sans",sans-serif;letter-spacing:0}.mark-letter{display:block;line-height:1;transform:translate(-1px,-1px)}.mark-dot{position:absolute;right:6px;bottom:5px;color:#a9d8a9;font:800 12px/1 "Plus Jakarta Sans",sans-serif}.brand b{font:800 16px "Plus Jakarta Sans",sans-serif;letter-spacing:-.5px}
.price{border:1px solid #dfe7e0;border-radius:99px;padding:8px 12px;background:#ffffffb3;color:var(--dark);font-size:12px;font-weight:700}.dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#50a878;margin-right:6px}.muted{color:#8a948e;font-weight:500}
main{width:min(780px,100%);margin:0 auto;padding:42px 24px 28px;display:flex;flex-direction:column;align-items:center;flex:1}.hero{width:min(100%,440px);text-align:center;margin-bottom:21px}.eyebrow{display:inline-flex;align-items:center;gap:8px;color:#547363;font-size:10px;font-weight:800;letter-spacing:1.7px;margin-bottom:13px}.line{width:22px;height:1px;background:#8aae98}
h1{font:800 clamp(34px,3.6vw,48px)/1.1 "Plus Jakarta Sans",sans-serif;letter-spacing:-2.5px;margin:0;color:#1c2823}h1 span{color:var(--green)}.desc{max-width:440px;margin:11px auto 0;color:#707c74;line-height:1.6;font-size:14px}
.card{width:min(100%,610px);min-height:340px;flex:0 0 auto;align-self:center;background:rgba(255,255,255,.88);border:1px solid #e0e7e1;border-radius:20px;box-shadow:0 18px 46px rgba(43,68,50,.055);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 28px;transition:border-color .18s,box-shadow .18s,background .18s}
#empty{width:100%;max-width:440px;display:flex;flex-direction:column;align-items:center}#empty h2,#empty .hint{width:100%;text-align:center}#empty #choose{width:100%}
.card.drag{border-color:#3a9567;box-shadow:0 0 0 4px rgba(58,149,103,.10),0 18px 46px rgba(43,68,50,.07);background:#fbfffb}
.illus{height:91px;width:166px;display:grid;place-items:center;position:relative;margin-bottom:5px}.orbit{position:absolute;border:1px solid #e5eee6;border-radius:50%;transform:rotate(-16deg);width:142px;height:53px}.orbit.two{width:159px;height:69px;transform:rotate(18deg);border-color:#edf2ee}
.fileicon{position:relative;z-index:1;width:53px;height:59px;display:grid;place-items:center;background:#e9f3eb;border-radius:12px;box-shadow:0 7px 14px rgba(40,91,61,.09);transform:rotate(-3deg)}.fileicon svg{width:29px;height:33px;color:#2f7050}
.tag{position:absolute;z-index:2;border-radius:7px;background:#fff;padding:5px 7px;font-weight:800;font-size:8px;letter-spacing:.7px;box-shadow:0 3px 9px rgba(31,64,42,.09)}.pdf{top:10px;left:19px;color:#b55b4f}.xlsx{bottom:9px;right:15px;color:#2b7d52}
h2{width:min(100%,440px);text-align:center;font:800 17px "Plus Jakarta Sans",sans-serif;letter-spacing:-.35px;margin:10px 0 5px}.hint{color:#849087;margin:0 0 19px;font-size:13px}
button{font:700 13px "Plus Jakarta Sans",sans-serif;cursor:pointer}.primary{display:inline-flex;align-items:center;justify-content:center;gap:22px;border:0;border-radius:9px;padding:12px 17px 12px 20px;min-width:174px;color:#fff;background:var(--dark);box-shadow:0 4px 8px rgba(14,77,55,.12);transition:background .18s,transform .18s}.primary:hover:not(:disabled){background:#176746;transform:translateY(-1px)}.primary:disabled{background:#90a497;box-shadow:none;cursor:not-allowed}
#choose{width:min(100%,440px)}.limit{color:#9aa49d;font-size:10px;margin:11px 0 0}.hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.file-state{display:flex;flex-direction:column;align-items:stretch;width:100%;max-width:440px;min-width:0;gap:15px}.file-row{display:grid;grid-template-columns:48px minmax(0,1fr) 36px;gap:12px;align-items:center;padding:13px;border:1px solid #e3e9e4;border-radius:12px;background:#fff}
.file-state .fileicon{width:46px;height:50px;transform:none;box-shadow:none}.file-state .fileicon svg{width:27px;height:30px}.meta{display:flex;flex-direction:column;gap:4px;min-width:0}.kicker{font-size:9px;letter-spacing:1.25px;font-weight:800;color:#42815d}.filename{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;color:#29362e}.size{font-size:11px;color:#909a93}
.remove{border:1px solid #e6ebe6;background:#f6f8f6;color:#67756b;border-radius:8px;width:34px;height:34px;font-size:19px;line-height:1}.state-note{display:flex;gap:8px;align-items:flex-start;font-size:11px;line-height:1.5;color:#777356;background:#fbfaf3;border:1px solid #e9e7d8;border-radius:9px;padding:10px 12px}.state-note .dot{flex-shrink:0;margin:4px 0 0;background:#d4ac48}.state-note.is-success{background:#f2f8f3;border-color:#cfe3d4;color:#285a3c}.state-note.is-success .dot{background:#4a9564}.state-actions{display:flex;flex-direction:column;align-items:center;gap:0}.state-actions .primary{width:100%}.state-actions .limit{text-align:center}
.secondary{display:flex;align-items:center;justify-content:center;width:100%;min-height:42px;margin-top:10px;padding:11px 14px;border:1px solid #cbdccf;border-radius:9px;color:#195b3d;background:#f7fbf7;font-size:12px;font-weight:750;transition:background .18s,border-color .18s}.secondary:hover:not(:disabled){background:#eaf4ed;border-color:#9fc3aa}.secondary:disabled{cursor:not-allowed;color:#87978b;background:#f1f4f1}
.export-button{display:flex;align-items:center;justify-content:center;width:100%;min-height:46px;margin-top:10px;padding:13px 16px;border:0;border-radius:9px;color:#fff;background:#247454;font-size:13px;font-weight:800;box-shadow:0 5px 12px rgba(36,116,84,.14);transition:background .18s,transform .18s}.export-button:hover:not(:disabled){background:#176746;transform:translateY(-1px)}.export-button:disabled{cursor:progress;background:#8da799;box-shadow:none}
.err{color:#a63d35;font-size:12px;text-align:center;margin:12px 0 0}.reassure{display:flex;align-items:center;gap:15px;color:#77827a;margin-top:17px;font-size:11px}.item{display:flex;align-items:center;gap:7px;white-space:nowrap}.check{display:grid;place-items:center;border:1px solid #c8ddce;color:#40845e;border-radius:50%;width:14px;height:14px;font-size:9px}.separator{width:3px;height:3px;border-radius:50%;background:#c8d1ca}
footer{border-top:1px solid rgba(215,224,217,.72);display:flex;justify-content:space-between;align-items:center;gap:16px;width:min(1160px,calc(100% - 64px));min-height:60px;margin:auto auto 0;color:#9aa39c;font-size:10px}.footnote{color:#a9b0aa}
@media(min-height:850px){main{padding-top:66px}.card{min-height:330px}}
@media(max-width:600px){.top{width:calc(100% - 36px);min-height:68px}.brand b{font-size:15px}.mark{width:32px;height:32px}.price{padding:8px 10px;font-size:10px}main{padding:34px 18px 24px}.hero{margin-bottom:18px}h1{font-size:clamp(33px,8.8vw,42px);letter-spacing:-1.7px}.eyebrow{font-size:8px;letter-spacing:1.35px}.desc{font-size:13px;line-height:1.6;margin-top:10px}.card{min-height:280px;padding:18px 16px;border-radius:17px}.reassure{flex-wrap:wrap;justify-content:center;gap:10px;font-size:10px}.separator{display:none}footer{width:calc(100% - 36px);min-height:56px;font-size:9px}.footnote{max-width:155px;text-align:right}.file-row{grid-template-columns:44px minmax(0,1fr) 34px;padding:11px;gap:10px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{transition-duration:.01ms!important}}

.preview-status{width:min(100%,610px);margin:13px auto 0;text-align:center;color:#777356;font-size:11px;line-height:1.55}
.seo-content{width:min(100%,740px);margin-top:42px;display:grid;gap:14px;color:#344239;text-align:left}
.content-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:9px 18px;padding:0 0 17px;border-bottom:1px solid #dfe6e0}
.content-nav a{color:#0e4d37;font-size:12px;font-weight:600;text-decoration-thickness:1px;text-underline-offset:3px}
.content-block{padding:24px 26px;border:1px solid #dfe6e0;border-radius:15px;background:rgba(255,255,255,.78);box-shadow:0 9px 28px rgba(43,68,50,.025);scroll-margin-top:20px}
.content-eyebrow{margin:0 0 9px;color:#547363;font-size:9px;font-weight:800;letter-spacing:1.4px}
.seo-content .content-block h2{width:auto;text-align:left;font:800 clamp(20px,2.4vw,26px)/1.25 "Plus Jakarta Sans",sans-serif;letter-spacing:-.8px;margin:0 0 12px;color:#1c2823}
.seo-content .content-block h3{margin:19px 0 7px;font:750 14px/1.45 "Plus Jakarta Sans",sans-serif;color:#1c2823}
.seo-content .content-block p:not(.content-eyebrow){margin:0 0 12px;color:#69776e;font-size:13px;line-height:1.8}
.seo-content .content-block p:last-child{margin-bottom:0}
.content-list{display:grid;gap:8px;margin:13px 0 0;padding-left:21px;color:#69776e;font-size:13px;line-height:1.75}
.content-list strong{color:#344239}
.faq-block details{border-top:1px solid #dfe6e0;padding:13px 0}
.faq-block details:last-child{padding-bottom:0}
.faq-block summary{cursor:pointer;color:#29362e;font-size:13px;line-height:1.55;font-weight:700}
.faq-block details p{padding-top:9px}
@media(max-width:600px){.seo-content{margin-top:34px;gap:11px}.content-nav{gap:9px 13px}.content-nav a{font-size:11px}.content-block{padding:19px 17px;border-radius:13px}.seo-content .content-block h2{font-size:20px;letter-spacing:-.5px}.seo-content .content-block p:not(.content-eyebrow),.content-list{font-size:12px}}
</style></head>
<body><div class="shell">
<header class="top"><a class="brand" href="/" aria-label="RabConverter"><span class="mark" aria-hidden="true"><span class="mark-letter">R</span><span class="mark-dot">.</span></span><b>rabconverter</b></a><span class="price"><span class="dot"></span>Rp2.500 <span class="muted">/ halaman</span></span></header>
<main>
<div class="hero"><div class="eyebrow"><span class="line"></span>PDF RAB MENJADI EXCEL</div><h1>RAB PDF ke Excel.<br><span>Tanpa Ketik Ulang.</span></h1><p class="desc">Ubah tabel RAB atau BoQ PDF menjadi Excel yang bisa diedit.</p></div>
<section class="card" id="card" aria-label="Area upload PDF RAB">
<div id="empty"><div class="illus"><div class="orbit"></div><div class="orbit two"></div><div class="fileicon"><svg viewBox="0 0 32 36" aria-hidden="true"><path d="M5 1.5h14l8 8V32a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 3 32V4a2.5 2.5 0 0 1 2-2.5Z" fill="#fff" stroke="currentColor" stroke-width="1.5"/><path d="M19 1.5v8h8" fill="#eef5f0" stroke="currentColor" stroke-width="1.5"/><path d="M8 19h13M8 23.5h13M8 28h9" stroke="#638574" stroke-width="1.7" stroke-linecap="round"/></svg></div><div class="tag pdf">PDF</div><div class="tag xlsx">XLSX ↗</div></div><h2>Mulai dari PDF RAB atau BoQ kamu</h2><p class="hint">Tarik file ke sini, atau pilih PDF RAB/BoQ dari perangkat.</p><button class="primary" id="choose">Pilih PDF RAB <span>→</span></button><p class="limit">PDF saja · Maks. 30 MiB</p></div>
<div id="chosen" class="file-state" hidden><div class="file-row"><div class="fileicon"><svg viewBox="0 0 32 36" aria-hidden="true"><path d="M5 1.5h14l8 8V32a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 3 32V4a2.5 2.5 0 0 1 2-2.5Z" fill="#fff" stroke="currentColor" stroke-width="1.5"/><path d="M19 1.5v8h8" fill="#eef5f0" stroke="currentColor" stroke-width="1.5"/><path d="M8 19h13M8 23.5h13M8 28h9" stroke="#638574" stroke-width="1.7" stroke-linecap="round"/></svg></div><div class="meta"><span class="kicker">PDF DIPILIH</span><strong class="filename" id="filename"></strong><span class="size" id="filesize"></span></div><button class="remove" id="remove" aria-label="Ganti atau hapus file terpilih">×</button></div><div class="state-note" id="preflight-note"><span class="dot"></span>Pemeriksaan struktur saja; belum membaca tabel RAB atau menjalankan OCR.</div><div class="state-actions"><button class="primary" id="preflight" type="button">Periksa PDF <span>→</span></button><button class="secondary" id="local-ocr" type="button" hidden>OCR Lokal</button><button class="export-button" id="convert-xlsx" type="button" hidden>Konversi &amp; Unduh Excel</button><p class="limit" id="preflight-help">File dikirim untuk diperiksa, lalu langsung dibuang.</p><p class="limit" id="ocr-progress" role="status" hidden></p></div></div>
<input class="hidden" id="file" type="file" accept="application/pdf,.pdf" aria-label="Pilih dokumen PDF RAB"><p class="err" id="err" role="alert" hidden></p>
</section>
<div class="reassure"><div class="item"><span style="color:#38815b;font-size:17px">↗</span>Excel bisa diedit</div><span class="separator"></span><div class="item"><span class="check">✓</span>Kurangi input manual</div><span class="separator"></span><div class="item"><span class="check">✓</span>Periksa hasil sebelum dipakai</div></div>
</main><footer><span>© 2026 RabConverter</span><span class="footnote">Dibuat untuk pekerjaan RAB yang lebih praktis.</span></footer></div>
<script>
const input=document.getElementById('file'),card=document.getElementById('card'),empty=document.getElementById('empty'),chosen=document.getElementById('chosen'),err=document.getElementById('err'),preflight=document.getElementById('preflight'),localOcr=document.getElementById('local-ocr'),convertXlsx=document.getElementById('convert-xlsx'),ocrProgress=document.getElementById('ocr-progress'),note=document.getElementById('preflight-note'),help=document.getElementById('preflight-help');
const PREFLIGHT_URL='https://zkcziucjogprfzhjuaex.supabase.co/functions/v1/preflight-rab';
const MAX_BYTES=30*1024*1024;
let selectedFile=null,pickerOpen=false,requestId=0,activeController=null,busy=false,ocrBusy=false,ocrAbortController=null,ocrNotice='',conversionBusy=false,conversionController=null,conversionNotice='',XLSX=null;
let pageReports=[],lastPreflightResult=null,nextStartPage=1;
input.addEventListener('cancel',()=>{pickerOpen=false});
function showError(message){err.textContent=message;err.hidden=false}
function updateNote(message,success=false){
  if(!note)return;
  note.classList.toggle('is-success',success);
  const dot=note.querySelector('.dot');
  note.textContent='';
  if(dot)note.append(dot);
  note.append(document.createTextNode(message));
}
function setPreflightLabel(label){
  if(preflight.firstChild)preflight.firstChild.textContent=label+' ';
}
function resetFile(){
  requestId+=1;
  activeController?.abort();
  activeController=null;
  ocrAbortController?.abort();
  ocrAbortController=null;
  conversionController?.abort();
  conversionController=null;
  busy=false;
  ocrBusy=false;
  conversionBusy=false;
  conversionNotice='';
  convertXlsx.hidden=true;
  convertXlsx.disabled=false;
  convertXlsx.textContent='Konversi & Unduh Excel';
  selectedFile=null;
  pageReports=[];
  ocrNotice='';
  localOcr.hidden=true;
  ocrProgress.hidden=true;
  ocrProgress.textContent='';
  lastPreflightResult=null;
  nextStartPage=1;
  chosen.hidden=true;
  empty.hidden=false;
  err.hidden=true;
  preflight.disabled=false;
  setPreflightLabel('Periksa PDF');
  updateNote('Pemeriksaan struktur dan teks PDF berjalan bertahap. OCR belum dijalankan.');
  help.textContent='File hanya dipakai sementara dan tidak disimpan permanen.';
}
async function showFile(file){
  if(!file)return;
  const validationId=++requestId;
  activeController?.abort();
  activeController=null;
  busy=false;
  err.hidden=true;
  note.classList.remove('is-success');
  note.textContent='Pemeriksaan struktur saja; belum membaca tabel RAB atau menjalankan OCR.';
  preflight.disabled=false;
  preflight.querySelector('span').textContent='→';
  if(file.size===0){resetFile();showError('File kosong. Coba pilih PDF lain.');return}
  if(file.size>MAX_BYTES){resetFile();showError('Ukuran file maksimum adalah 30 MiB.');return}
  try{
    const bytes=new Uint8Array(await file.slice(0,1024).arrayBuffer());
    if(validationId!==requestId)return;
    if(!new TextDecoder('latin1').decode(bytes).includes('%PDF-')){
      resetFile();showError('File tidak memiliki header PDF yang valid. Pilih PDF asli.');return;
    }
  }catch{
    if(validationId!==requestId)return;
    resetFile();showError('File tidak dapat dibaca oleh browser. Coba pilih ulang.');return;
  }
  if(validationId!==requestId)return;
  selectedFile=file;
  document.getElementById('filename').textContent=file.name;
  document.getElementById('filesize').textContent=(file.size<1048576?Math.max(1,Math.round(file.size/1024))+' KB':(file.size/1048576).toFixed(1)+' MiB')+' · PDF';
  empty.hidden=true;chosen.hidden=false;
}
async function showFile(file){
  if(!file)return;
  const validationId=++requestId;
  activeController?.abort();
  activeController=null;
  ocrAbortController?.abort();
  ocrAbortController=null;
  busy=false;
  ocrBusy=false;
  selectedFile=null;
  pageReports=[];
  ocrNotice='';
  localOcr.hidden=true;
  ocrProgress.hidden=true;
  ocrProgress.textContent='';
  lastPreflightResult=null;
  nextStartPage=1;
  err.hidden=true;
  updateNote('Pemeriksaan struktur dan teks PDF berjalan bertahap. OCR belum dijalankan.');
  preflight.disabled=false;
  setPreflightLabel('Periksa PDF');
  if(file.size===0){resetFile();showError('File kosong. Coba pilih PDF lain.');return}
  if(file.size>MAX_BYTES){resetFile();showError('Ukuran file maksimum adalah 30 MiB.');return}
  try{
    const bytes=new Uint8Array(await file.slice(0,1024).arrayBuffer());
    if(validationId!==requestId)return;
    if(!new TextDecoder('latin1').decode(bytes).includes('%PDF-')){
      resetFile();showError('File tidak memiliki header PDF yang valid. Pilih PDF asli.');return;
    }
  }catch{
    if(validationId!==requestId)return;
    resetFile();showError('File tidak dapat dibaca oleh browser. Coba pilih ulang.');return;
  }
  if(validationId!==requestId)return;
  selectedFile=file;
  document.getElementById('filename').textContent=file.name;
  document.getElementById('filesize').textContent=(file.size<1048576?Math.max(1,Math.round(file.size/1024))+' KB':(file.size/1048576).toFixed(1)+' MiB')+' · PDF';
  empty.hidden=true;chosen.hidden=false;
}
const SIGNAL_SCORES={rab_title:3,item_description:2,quantity_or_unit:2,price_or_amount:2,construction_terms:1,totals:1,repeated_item_rows:2};
function summarizePageReports(pages,complete){
  const signals=[...new Set(pages.flatMap(page=>page.classification?.signals||[]))];
  const score=signals.reduce((sum,key)=>sum+(SIGNAL_SCORES[key]||0),0);
  const pagesNeedingOcr=pages.filter(page=>page.ocrAttempted!==true&&(page.textFound===false||page.textChars===0)).map(page=>page.pageNumber);
  const pagesUnreadableAfterOcr=pages.filter(page=>page.ocrAttempted===true&&(page.textFound===false||page.textChars===0)).map(page=>page.pageNumber);
  const truncatedPages=pages.filter(page=>page.truncated).map(page=>page.pageNumber);
  const description=signals.includes('item_description'),quantity=signals.includes('quantity_or_unit'),price=signals.includes('price_or_amount'),totals=signals.includes('totals');
  const structural=signals.includes('repeated_item_rows')||(description&&quantity&&price)||(description&&price&&totals);
  let status,reasons;
  if(score>=6&&signals.length>=2&&structural){status='LIKELY_RAB';reasons=['rab_signals_and_cost_structure_detected']}
  else if(score>=3){status='NEEDS_CONFIRMATION';reasons=[structural?'classification_score_needs_confirmation':'cost_structure_not_strong_enough_for_auto_accept']}
  else if(pagesNeedingOcr.length>0&&complete){status='NEEDS_OCR';reasons=['one_or_more_pages_have_no_extractable_text']}
  else if(pagesUnreadableAfterOcr.length>0&&complete){status='UNREADABLE_PDF';reasons=['one_or_more_pages_have_no_text_after_local_ocr']}
  else if(!complete){status='NEEDS_MORE_PAGES';reasons=['insufficient_evidence_in_pages_reviewed_so_far']}
  else{status='NOT_RAB';reasons=['insufficient_rab_boq_evidence']}
  return {status,score,signals,reasons,complete,pagesReviewed:pages.length,pagesNeedingOcr,pagesUnreadableAfterOcr,truncatedPages,structuralCostEvidence:structural};
}
function classificationLabel(summary){
  if(summary.status==='LIKELY_RAB')return summary.complete?'Kemungkinan besar RAB/BoQ':'Sementara terlihat seperti RAB/BoQ';
  if(summary.status==='NEEDS_CONFIRMATION')return 'Belum pasti RAB/BoQ — perlu konfirmasi';
  if(summary.status==='NOT_RAB')return 'Tidak ditemukan cukup ciri RAB/BoQ';
  if(summary.status==='NEEDS_OCR')return 'Ada halaman yang memerlukan OCR';
  if(summary.status==='UNREADABLE_PDF')return 'OCR lokal belum berhasil membaca beberapa halaman';
  return 'Bukti belum cukup — periksa halaman berikutnya';
}
function renderSummary(totalPages){
  const complete=Boolean(lastPreflightResult&&lastPreflightResult.nextStartPage===null&&pageReports.length===totalPages);
  const summary=summarizePageReports(pageReports,complete);
  updateNote(classificationLabel(summary),summary.status==='LIKELY_RAB');
  let details=pageReports.length+' dari '+totalPages+' halaman diperiksa';
  details+=complete?' · pemeriksaan seluruh halaman selesai':' · pemeriksaan bertahap';
  if(summary.pagesNeedingOcr.length)details+=' · '+summary.pagesNeedingOcr.length+' halaman tanpa teks siap untuk OCR lokal';
  if(summary.pagesUnreadableAfterOcr.length)details+=' · OCR tidak menemukan teks pada '+summary.pagesUnreadableAfterOcr.length+' halaman';
  if(summary.truncatedPages.length)details+=' · teks dibatasi pada '+summary.truncatedPages.length+' halaman';
  if(ocrNotice)details+=' · '+ocrNotice;
  help.textContent=details+'. OCR memproses scan di perangkat; PDF/teks OCR tidak dikirim ke layanan OCR.';
  if(conversionNotice)details+=' · '+conversionNotice;
  help.textContent=details+'. OCR memproses scan di perangkat; PDF/teks OCR tidak dikirim ke layanan OCR.';
  localOcr.hidden=summary.pagesNeedingOcr.length===0||ocrBusy||conversionBusy;
  if(!localOcr.hidden)localOcr.textContent='OCR Lokal · Halaman '+summary.pagesNeedingOcr.slice(0,5).join(', ');
  const hasCompleteReview=Boolean(lastPreflightResult&&lastPreflightResult.nextStartPage===null&&pageReports.length===totalPages);
  convertXlsx.hidden=!hasCompleteReview;
  convertXlsx.disabled=conversionBusy||ocrBusy||busy||totalPages>50;
  convertXlsx.textContent=conversionBusy?'Menyusun Excel…':totalPages>50?'Konversi beta: maks. 50 halaman':'Konversi & Unduh Excel';
}
function classifyLocalText(extractedText,ocrAttempted){
  const text=String(extractedText||'').trim();
  if(!text)return {status:ocrAttempted?'UNREADABLE_PDF':'NEEDS_OCR',score:0,signals:[],reasons:[ocrAttempted?'text_unreadable_after_ocr':'no_text_layer_ocr_needed']};
  const definitions=[
    ['rab_title',3,/\b(?:RAB|RENCANA\s+ANGGARAN\s+BIAYA|BOQ|BILL\s+OF\s+QUANTITIES|DAFTAR\s+KUANTITAS(?:\s+DAN\s+HARGA)?|RENCANA\s+BIAYA)\b/i],
    ['item_description',2,/\b(?:uraian(?:\s+pekerjaan)?|pekerjaan|description|deskripsi(?:\s+pekerjaan)?|item\s+pekerjaan)\b/i],
    ['quantity_or_unit',2,/\b(?:volume|kuantitas|qty|quantity|satuan|unit|uom)\b/i],
    ['price_or_amount',2,/\b(?:harga\s+satuan|unit\s+price|jumlah\s+harga|amount|total\s+(?:biaya|harga)|biaya\s+total|nilai\s+biaya|anggaran)\b/i],
    ['construction_terms',1,/\b(?:material|upah|beton|pondasi|fondasi|ahsp|hspk|pasir|semen|pekerjaan\s+tanah|konstruksi)\b/i],
    ['totals',1,/\b(?:subtotal|sub\s+total|grand\s+total|jumlah\s+akhir|rekapitulasi|pajak|ppn)\b/i]
  ];
  const signals=[];let score=0;
  for(const definition of definitions){if(definition[2].test(text)){signals.push(definition[0]);score+=definition[1]}}
  const lines=text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);let qualifying=0;
  for(const line of lines){const hasWords=/[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(line);const numbers=line.match(/(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)/g)||[];if(hasWords&&numbers.length>=2)qualifying++;if(qualifying>=2)break}
  if(qualifying>=2){signals.push('repeated_item_rows');score+=2}
  const description=signals.includes('item_description'),quantity=signals.includes('quantity_or_unit'),price=signals.includes('price_or_amount'),totals=signals.includes('totals');
  const structural=signals.includes('repeated_item_rows')||(description&&quantity&&price)||(description&&price&&totals);
  if(score>=6&&signals.length>=2&&structural)return {status:'LIKELY_RAB',score,signals,reasons:['rab_signals_and_cost_structure_detected']};
  if(score>=3)return {status:'NEEDS_CONFIRMATION',score,signals,reasons:[structural?'classification_score_needs_confirmation':'cost_structure_not_strong_enough_for_auto_accept']};
  return {status:'NOT_RAB',score,signals,reasons:['insufficient_rab_boq_evidence']};
}

function cellsFromPositioned(items){
  const positioned=[];
  for(const item of items||[]){
    const text=typeof item.str==='string'?item.str.replace(/\u0000/g,'').trim():'';
    const transform=Array.isArray(item.transform)?item.transform:[];
    if(!text||transform.length<6)continue;
    const x0=Number(transform[4]),baseline=Number(transform[5]),height=Math.abs(Number(item.height)||Number(transform[3])||9),width=Math.abs(Number(item.width)||Math.max(1,text.length*height*.45));
    if(!Number.isFinite(x0)||!Number.isFinite(baseline))continue;
    positioned.push({text,x0,y:baseline,x1:x0+width,height});
  }
  positioned.sort((a,b)=>b.y-a.y||a.x0-b.x0);
  const lines=[];
  for(const item of positioned){
    const current=lines[lines.length-1],tolerance=Math.max(2.5,Math.min(7,item.height*.45));
    if(!current||Math.abs(current.y-item.y)>tolerance)lines.push({y:item.y,height:item.height,items:[item]});
    else{const count=current.items.length;current.y=(current.y*count+item.y)/(count+1);current.height=(current.height*count+item.height)/(count+1);current.items.push(item)}
  }
  return lines.map(line=>{
    line.items.sort((a,b)=>a.x0-b.x0);const cells=[];let cell='',lastRight=0;
    for(const item of line.items){
      if(cell&&item.x0-lastRight>Math.max(8,line.height*1.3)){cells.push(cell.trim());cell=''}
      cell+=(cell?' ':'')+item.text;lastRight=Math.max(lastRight,item.x1);
    }
    if(cell.trim())cells.push(cell.trim());
    return cells.flatMap(value=>{const split=value.split(/\s{2,}/).map(part=>part.trim()).filter(Boolean);return split.length>1?split:[value]}).filter(Boolean);
  }).filter(row=>row.length);
}
function cellsFromOcrWords(words,fallbackText){
  const positioned=(words||[]).filter(word=>word&&typeof word.text==='string'&&word.text.trim()&&word.bbox).map(word=>({text:word.text.trim(),x0:Number(word.bbox.x0),y0:Number(word.bbox.y0),x1:Number(word.bbox.x1),y1:Number(word.bbox.y1)})).filter(word=>Number.isFinite(word.x0)&&Number.isFinite(word.y0)&&word.x1>=word.x0);
  if(!positioned.length)return String(fallbackText||'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map(line=>[line]);
  positioned.sort((a,b)=>(a.y0+a.y1)/2-(b.y0+b.y1)/2||a.x0-b.x0);const lines=[];
  for(const word of positioned){const center=(word.y0+word.y1)/2,height=Math.max(1,word.y1-word.y0),current=lines[lines.length-1];if(!current||Math.abs(center-current.center)>Math.max(5,Math.min(16,height*.55)))lines.push({center,height,words:[word]});else{const count=current.words.length;current.center=(current.center*count+center)/(count+1);current.height=(current.height*count+height)/(count+1);current.words.push(word)}}
  return lines.map(line=>{line.words.sort((a,b)=>a.x0-b.x0);const cells=[];let cell='',lastRight=0;for(const word of line.words){if(cell&&word.x0-lastRight>Math.max(6,line.height*.3)){cells.push(cell.trim());cell=''}cell+=(cell?' ':'')+word.text;lastRight=Math.max(lastRight,word.x1)}if(cell.trim())cells.push(cell.trim());return cells}).filter(row=>row.length);
}
function parseNumber(value){
  let text=String(value||'').trim().replace(/^(?:rp|idr)\s*/i,'').replace(/\s/g,'');const negative=text.startsWith('(')&&text.endsWith(')');text=text.replace(/[()]/g,'');if(!/^[+-]?\d+(?:[.,]\d+)*$/.test(text))return null;
  const dots=(text.match(/\./g)||[]).length,commas=(text.match(/,/g)||[]).length;
  if(dots&&commas){if(text.lastIndexOf(',')>text.lastIndexOf('.'))text=text.replace(/\./g,'').replace(',','.');else text=text.replace(/,/g,'')}
  else if(commas){const parts=text.split(',');text=parts.length>2||parts[parts.length-1].length===3?parts.join(''):parts.slice(0,-1).join('')+'.'+parts[parts.length-1]}
  else if(dots){const parts=text.split('.');if(parts.length>2||parts[parts.length-1].length===3)text=parts.join('')}
  const result=Number(text);return Number.isFinite(result)?(negative?-result:result):null;
}
function norm(value){return String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function headerMap(cells){
  const map={};cells.forEach((cell,index)=>{const v=norm(cell);if(/^(no|nomor|no urut|item)$/.test(v))map.no=index;else if(/uraian|deskripsi|description|jenis pekerjaan|nama pekerjaan/.test(v))map.desc=index;else if(/^(volume|qty|quantity|kuantitas)$/.test(v))map.volume=index;else if(/^(satuan|unit|uom)$/.test(v))map.unit=index;else if(/harga satuan|unit price|tarif satuan/.test(v))map.price=index;else if(/jumlah harga|total harga|amount|total biaya|jumlah biaya/.test(v))map.amount=index});
  return new Set(Object.entries(map).filter(([key])=>key!=='no').map(([,index])=>index)).size>=2?map:null;
}

function inferRABRow(cells,itemIndex){
  const raw=String((cells||[]).join(' ')).replace(/\|/g,' ').replace(/\s+/g,' ').trim();
  if(!raw||!/[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(raw))return null;
  const tokens=raw.split(/\s+/),numeric=[];
  tokens.forEach((token,index)=>{const clean=token.replace(/^[()[\]{}]+|[()[\]{}.,;:]+$/g,'');const value=parseNumber(clean);if(value!==null)numeric.push({index,value,raw:clean})});
  if(numeric.length<2)return null;
  const leadingSerial=numeric.length>=3&&numeric[0].index===0&&/^\d{1,4}$/.test(numeric[0].raw)&&tokens.slice(1,numeric[1].index).some(token=>/[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(token));
  const values=leadingSerial?numeric.slice(1):numeric;
  if(values.length<2)return null;
  const volumeToken=values[0],priceToken=values.length>=3?values[1]:null,amountToken=values.length>=3?values[2]:values[1];
  const descriptionStart=leadingSerial?1:0,description=tokens.slice(descriptionStart,volumeToken.index).join(' ').trim();
  const unitEnd=priceToken?priceToken.index:amountToken.index;
  const unit=tokens.slice(volumeToken.index+1,unitEnd).join(' ').replace(/[|,;]+$/g,'').trim();
  if(!description)return null;
  return [leadingSerial?numeric[0].value:itemIndex,description,volumeToken.value,unit,priceToken?priceToken.value:'',amountToken.value];
}
function lastNumberInLine(cells){
  const raw=String((cells||[]).join(' ')).replace(/\|/g,' ').replace(/\s+/g,' ').trim();
  const tokens=raw.split(/\s+/);
  for(let index=tokens.length-1;index>=0;index--){const clean=tokens[index].replace(/^[()[\]{}]+|[()[\]{}.,;:]+$/g,'');const value=parseNumber(clean);if(value!==null)return value}
  return '';
}

function downloadWorkbook(sourceRows,totalPages,scannedPages,fileName){
  const structured=[],source=[['Halaman','Baris','Teks sumber']],headers=['No','Uraian Pekerjaan','Volume','Satuan','Harga Satuan (Rp)','Jumlah Harga (Rp)'];let mapping=null,itemNo=0;
  const rawRows=sourceRows.sort((a,b)=>a.pageNumber-b.pageNumber||a.lineNumber-b.lineNumber);
  for(const row of rawRows){
    source.push([row.pageNumber,row.lineNumber,row.cells.join(' | ')]);
    const found=headerMap(row.cells);if(found){mapping=found;continue}
    const text=norm(row.cells.join(' '));
    if(/^(grand total|terbilang|dibuat oleh|disetujui oleh|tanggal|halaman)\b/.test(text))continue;
    if(/^(subtotal|sub total|jumlah akhir|ppn|pajak|pembulatan|total biaya|total harga)\b/.test(text)){const amount=lastNumberInLine(row.cells);structured.push(['',row.cells.find(value=>/[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(value))||text,'','','',amount]);continue}
    if(!/[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(row.cells.join(' ')))continue;
    let inferred=inferRABRow(row.cells,itemNo+1),mapped=null;
    if(mapping&&mapping.desc!==undefined&&mapping.desc<row.cells.length){
      const no=mapping.no===undefined?'':row.cells[mapping.no]||'';
      const desc=row.cells[mapping.desc]||'';
      const volume=row.cells[mapping.volume]||'';
      const unit=row.cells[mapping.unit]||'';
      const price=row.cells[mapping.price]||'';
      const amount=row.cells[mapping.amount]||'';
      if(desc&&(volume||price||amount))mapped=[parseNumber(no)??no,desc,parseNumber(volume)??volume,unit,parseNumber(price)??price,parseNumber(amount)??amount];
    }
    const selected=mapped||inferred;
    if(!selected)continue;
    const [no,desc,volume,unit,price,amount]=selected;
    const numberVolume=parseNumber(String(volume)),numberPrice=parseNumber(String(price)),numberAmount=parseNumber(String(amount));
    itemNo++;structured.push([parseNumber(String(no)) ?? (no || itemNo),desc,numberVolume ?? volume,unit,numberPrice ?? price,numberAmount ?? amount]);
  }
  const rab=[headers,...structured];
  const formulas=[];
  structured.forEach((row,index)=>{const v=parseNumber(row[2]),p=parseNumber(row[4]);if((row[5]===''||row[5]===null)&&v!==null&&p!==null){const xrow=index+2;rab[xrow-1][5]=null;formulas.push({cell:'F'+xrow,formula:'C'+xrow+'*E'+xrow,value:v*p})}});
  if(structured.length){const totalRow=rab.length+1;rab.push(['','TOTAL HASIL KONVERSI','','','',null]);formulas.push({cell:'F'+totalRow,formula:'SUM(F2:F'+(structured.length+1)+')',value:structured.reduce((sum,row)=>sum+(parseNumber(row[5])||0),0)})}
  const info=[['RabConverter — Ringkasan Konversi'],['Nama file',fileName],['Halaman diproses',totalPages],['Halaman yang memerlukan OCR',scannedPages],['Baris tabel terdeteksi',structured.length],['Catatan','Periksa ulang angka, satuan, volume, harga, dan total terhadap PDF asli. Ini hasil rekonstruksi otomatis.']];
  const workbook=XLSX.utils.book_new(),wsRab=XLSX.utils.aoa_to_sheet(rab),wsSource=XLSX.utils.aoa_to_sheet(source),wsInfo=XLSX.utils.aoa_to_sheet(info);
  for(const item of formulas)wsRab[item.cell]={t:'n',f:item.formula,v:item.value};
  wsRab['!cols']=[{wch:7},{wch:48},{wch:13},{wch:12},{wch:20},{wch:22}];wsSource['!cols']=[{wch:10},{wch:10},{wch:110}];wsInfo['!cols']=[{wch:30},{wch:110}];
  XLSX.utils.book_append_sheet(workbook,wsRab,'Tabel RAB');XLSX.utils.book_append_sheet(workbook,wsSource,'Teks Sumber');XLSX.utils.book_append_sheet(workbook,wsInfo,'Ringkasan');
  const output=XLSX.write(workbook,{bookType:'xlsx',type:'array'}),blob=new Blob([output],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  const base=fileName.replace(/\.pdf$/i,'').replace(/[^a-z0-9._ -]+/gi,'').trim()||'rab-converted';a.href=url;a.download=base+'.xlsx';a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  return {structuredCount:structured.length,sourceCount:sourceRows.length};
}
async function convertAndDownloadExcel(){
  if(!selectedFile||busy||ocrBusy||conversionBusy||!lastPreflightResult||lastPreflightResult.nextStartPage!==null||pageReports.length!==lastPreflightResult.pageCount)return;
  if(lastPreflightResult.pageCount>50){showError('Konversi beta dibatasi maksimal 50 halaman per file.');return}
  conversionBusy=true;conversionNotice='';conversionController=new AbortController();const id=++requestId,signal=conversionController.signal;
  const setProgress=(value)=>{ocrProgress.hidden=false;ocrProgress.textContent=value};
  preflight.disabled=true;localOcr.disabled=true;convertXlsx.disabled=true;convertXlsx.textContent='Menyusun Excel…';err.hidden=true;
  try{
    setProgress('Menyiapkan pembuat file Excel…');
    const xlsxImport=await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
    XLSX=xlsxImport.default||xlsxImport;
    setProgress('Membuka PDF dan mengekstrak susunan tabel…');
    const pdfjs=await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.worker.mjs';
    const task=pdfjs.getDocument({data:new Uint8Array(await selectedFile.arrayBuffer()),useWorkerFetch:false});const pdf=await task.promise;
    if(pdf.numPages>50)throw new Error('Konversi beta dibatasi maksimal 50 halaman per file.');
    const sourceRows=[],scanPages=[];let ocrWorker=null,workerTerminated=false;
    const terminateWorker=async()=>{if(ocrWorker&&!workerTerminated){workerTerminated=true;await ocrWorker.terminate()}};
    try{
      for(let n=1;n<=pdf.numPages;n++){
        if(signal.aborted)throw new DOMException('Konversi dibatalkan.','AbortError');
        setProgress('Mengekstrak susunan teks halaman '+n+' dari '+pdf.numPages+'…');
        const pg=await pdf.getPage(n);
        try{
          const content=await pg.getTextContent(),items=content.items||[],hasText=items.some(item=>typeof item.str==='string'&&item.str.trim());
          let rows=[];
          if(hasText){const viewport=pg.getViewport({scale:1});rows=cellsFromPositioned(items.map(item=>({...item,transform:[...item.transform.slice(0,4),item.transform[4],viewport.height-item.transform[5]]})))}
          if(hasText)rows.forEach((cells,i)=>sourceRows.push({pageNumber:n,lineNumber:i+1,cells}));
          else{
            scanPages.push(n);const cached=pageReports.find(page=>page.pageNumber===n&&page.ocrAttempted&&Array.isArray(page.rows));
            if(cached)cached.rows.forEach((cells,i)=>sourceRows.push({pageNumber:n,lineNumber:i+1,cells}));
          }
        }finally{pg.cleanup()}
      }
      const missing=scanPages.filter(n=>!pageReports.some(page=>page.pageNumber===n&&page.ocrAttempted&&Array.isArray(page.rows)));
      if(missing.length){
        setProgress('Menyiapkan mesin OCR untuk '+missing.length+' halaman scan…');
        const tess=await import('https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/+esm');
        ocrWorker=await tess.createWorker('ind+eng',1,{workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js',logger:event=>{if(id===requestId&&!signal.aborted&&String(event.status||'').toLowerCase().includes('recogniz'))setProgress('OCR otomatis '+Math.round((event.progress||0)*100)+'%')}});if(signal.aborted)throw new DOMException('Konversi dibatalkan.','AbortError');
        for(const n of missing){
          setProgress('Membaca scan halaman '+n+' dengan OCR lokal…');const pg=await pdf.getPage(n),canvas=document.createElement('canvas');
          try{
            const base=pg.getViewport({scale:1}),scale=Math.min(2,Math.sqrt(4000000/(base.width*base.height)),3000/Math.max(base.width,base.height));if(!Number.isFinite(scale)||scale<.35)throw new Error('Ukuran halaman terlalu besar untuk OCR yang aman.');
            const viewport=pg.getViewport({scale});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw new Error('Browser tidak dapat menyiapkan OCR.');
            ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);await pg.render({canvas,canvasContext:ctx,viewport,background:'#ffffff'}).promise;
            const recognized=await ocrWorker.recognize(canvas),rawText=String(recognized.data.text||'').trim(),text=rawText.slice(0,20000),rows=cellsFromOcrWords(recognized.data.words||[],text);
            rows.forEach((cells,i)=>sourceRows.push({pageNumber:n,lineNumber:i+1,cells}));
            pageReports=pageReports.map(report=>report.pageNumber===n?{...report,textChars:text.length,textFound:text.length>0,ocrAttempted:true,rows,text,classification:classifyLocalText(text,true)}:report);
          }finally{pg.cleanup();canvas.width=0;canvas.height=0}
        }
      }
      if(signal.aborted)throw new DOMException('Konversi dibatalkan.','AbortError');
      setProgress('Menyusun workbook Excel dengan tabel dan teks sumber…');
      const result=await downloadWorkbook(sourceRows,pdf.numPages,scanPages.length,selectedFile.name);
      conversionNotice='File Excel berhasil diunduh. '+pdf.numPages+' halaman diproses; '+scanPages.length+' halaman scan; '+result.structuredCount+' baris tabel; '+result.sourceCount+' baris sumber ditemukan. Periksa sheet Teks Sumber dan cocokkan angka dengan PDF asli.';
      renderSummary(pdf.numPages);setProgress('Konversi selesai. File Excel sudah diunduh; tetap periksa angka dan tabel hasilnya.');
    }finally{await terminateWorker().catch(()=>undefined);await task.destroy().catch(()=>undefined)}
  }catch(error){if(id===requestId&&!signal.aborted)showError(error&&error.message?'Konversi gagal: '+error.message:'Konversi gagal. Coba PDF lain.')}
  finally{if(id===requestId){conversionBusy=false;conversionController=null;preflight.disabled=false;localOcr.disabled=false;const complete=Boolean(lastPreflightResult&&lastPreflightResult.nextStartPage===null&&pageReports.length===lastPreflightResult.pageCount);convertXlsx.hidden=!complete;convertXlsx.disabled=!complete||lastPreflightResult.pageCount>50;convertXlsx.textContent=lastPreflightResult&&lastPreflightResult.pageCount>50?'Konversi beta: maks. 50 halaman':'Konversi & Unduh Excel';}}
}
async function runPreflight(){
  if(!selectedFile||busy||ocrBusy)return;
  const restarting=lastPreflightResult&&lastPreflightResult.nextStartPage===null;
  const startPage=restarting?1:nextStartPage;
  if(restarting){pageReports=[];lastPreflightResult=null;nextStartPage=1;ocrNotice='';localOcr.hidden=true}
  busy=true;
  const id=++requestId;
  const controller=new AbortController();
  activeController=controller;
  preflight.disabled=true;
  setPreflightLabel('Membaca teks…');
  updateNote('Mengekstrak teks PDF secara bertahap. OCR dan render gambar tidak dijalankan.');
  help.textContent='Maksimal 5 halaman per permintaan. PDF tidak disimpan permanen.';
  err.hidden=true;
  try{
    const response=await fetch(PREFLIGHT_URL,{
      method:'POST',
      headers:{'Content-Type':'application/pdf','x-preflight-start-page':String(startPage)},
      body:selectedFile,
      signal:controller.signal
    });
    const payload=await response.json().catch(()=>null);
    if(id!==requestId)return;
    if(!response.ok||!payload||payload.ok!==true||typeof payload.pageCount!=='number'||!Array.isArray(payload.pageResults)||!(payload.nextStartPage===null||typeof payload.nextStartPage==='number')){
      showError(payload?.message||'Pemeriksaan PDF gagal. Coba lagi nanti.');
      return;
    }
    const reports=new Map(pageReports.map(page=>[page.pageNumber,page]));
    for(const page of payload.pageResults)reports.set(page.pageNumber,page);
    pageReports=[...reports.values()].sort((a,b)=>a.pageNumber-b.pageNumber);
    lastPreflightResult=payload;
    nextStartPage=payload.nextStartPage??1;
    const complete=payload.nextStartPage===null&&pageReports.length===payload.pageCount;
    renderSummary(payload.pageCount);
    setPreflightLabel(payload.nextStartPage===null?'Ulangi Pemeriksaan':'Periksa Halaman Berikutnya');
  }catch(error){
    if(id!==requestId||(error&&error.name==='AbortError'))return;
    showError('Tidak dapat menghubungi pemeriksaan server. Periksa koneksi lalu coba lagi.');
  }finally{
    if(id===requestId){
      busy=false;
      activeController=null;
      preflight.disabled=false;
      if(!lastPreflightResult)setPreflightLabel('Periksa PDF');
      else if(lastPreflightResult.nextStartPage===null)setPreflightLabel('Ulangi Pemeriksaan');
      else setPreflightLabel('Periksa Halaman Berikutnya');
      if(lastPreflightResult)renderSummary(lastPreflightResult.pageCount);
    }
  }
}
async function runLocalOcr(){
  if(!selectedFile||busy||ocrBusy)return;
  const summary=summarizePageReports(pageReports,Boolean(lastPreflightResult&&lastPreflightResult.nextStartPage===null&&pageReports.length===lastPreflightResult.pageCount));
  const targets=summary.pagesNeedingOcr.slice(0,5);
  if(!targets.length)return;
  ocrBusy=true;
  const id=++requestId;
  const controller=new AbortController();
  ocrAbortController=controller;
  let ocrWorker=null,workerTerminated=false,pdfTask=null;
  const terminateWorker=async()=>{if(ocrWorker&&!workerTerminated){workerTerminated=true;await ocrWorker.terminate()}};
  const abortWorker=()=>{void terminateWorker().catch(()=>undefined)};
  controller.signal.addEventListener('abort',abortWorker,{once:true});
  const throwIfAborted=()=>{if(controller.signal.aborted)throw new DOMException('OCR dibatalkan.','AbortError')};
  const setProgress=(text)=>{ocrProgress.hidden=false;ocrProgress.textContent=text};
  preflight.disabled=true;localOcr.disabled=true;
  setProgress('Membuka PDF dan menyiapkan OCR lokal…');
  err.hidden=true;
  try{
    const pdfjs=await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.worker.mjs';
    throwIfAborted();
    pdfTask=pdfjs.getDocument({data:new Uint8Array(await selectedFile.arrayBuffer()),isEvalSupported:false,useWorkerFetch:false});
    const pdf=await pdfTask.promise;
    if(pdf.numPages<1||pdf.numPages>200||targets.some(page=>page>pdf.numPages))throw new Error('Jumlah halaman PDF tidak sesuai batas pemeriksaan.');
    setProgress('Mengunduh mesin OCR dan model bahasa Indonesia + Inggris…');
    const tess=await import('https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/+esm');
    ocrWorker=await tess.createWorker('ind+eng',1,{workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js',logger:(event)=>{
      if(id!==requestId||controller.signal.aborted)return;
      const current=event.progress&&event.progress<1?' '+Math.round(event.progress*100)+'%':'';
      const status=String(event.status||'');
      if(status.toLowerCase().includes('recogniz'))setProgress('Mengenali teks halaman scan…'+current);
      else if(status.toLowerCase().includes('loading'))setProgress('Menyiapkan model OCR lokal…'+current);
    }});
    throwIfAborted();
    const recognizedReports=[];
    for(let index=0;index<targets.length;index++){
      throwIfAborted();
      const pageNumber=targets[index];
      setProgress('Merender halaman '+pageNumber+' ('+(index+1)+'/'+targets.length+')…');
      const page=await pdf.getPage(pageNumber);
      const canvas=document.createElement('canvas');
      try{
        const base=page.getViewport({scale:1});
        const scale=Math.min(2,Math.sqrt(4000000/(base.width*base.height)),3000/Math.max(base.width,base.height));
        if(!Number.isFinite(scale)||scale<0.35)throw new Error('Ukuran halaman terlalu besar untuk OCR lokal yang aman.');
        const viewport=page.getViewport({scale});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
        const context=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
        if(!context)throw new Error('Browser tidak dapat menyiapkan kanvas OCR.');
        context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
        await page.render({canvasContext:context,viewport,background:'#ffffff'}).promise;
        throwIfAborted();
        setProgress('Mengenali teks halaman '+pageNumber+'…');
        const recognized=await ocrWorker.recognize(canvas);
        throwIfAborted();
        const rawText=String(recognized.data.text||'').trim();const text=rawText.slice(0,20000),rows=cellsFromOcrWords(recognized.data.words||[],text);
        recognizedReports.push({pageNumber,textChars:text.length,textFound:text.length>0,truncated:rawText.length>20000,ocrAttempted:true,classification:classifyLocalText(text,true),text,rows});
      }finally{page.cleanup();canvas.width=0;canvas.height=0}
    }
    if(id!==requestId||controller.signal.aborted)return;
    const resultByPage=new Map(recognizedReports.map(page=>[page.pageNumber,page]));
    pageReports=pageReports.map(page=>resultByPage.has(page.pageNumber)?{...page,...resultByPage.get(page.pageNumber)}:page);
    ocrNotice='OCR lokal selesai untuk halaman '+recognizedReports.map(page=>page.pageNumber).join(', ')+'. Teks tidak dikirim ke server.';
    renderSummary(lastPreflightResult.pageCount);
    setProgress('OCR lokal selesai. Periksa kembali hasil klasifikasi; teks OCR belum menjadi tabel Excel.');
  }catch(error){
    if(id===requestId&&!controller.signal.aborted)showError(error&&error.message?'OCR lokal gagal: '+error.message:'OCR lokal gagal. Periksa koneksi lalu coba lagi.');
  }finally{
    controller.signal.removeEventListener('abort',abortWorker);
    await terminateWorker().catch(()=>undefined);
    if(pdfTask)await pdfTask.destroy().catch(()=>undefined);
    if(id===requestId){ocrBusy=false;ocrAbortController=null;preflight.disabled=false;localOcr.disabled=false;
      const summary=summarizePageReports(pageReports,Boolean(lastPreflightResult&&lastPreflightResult.nextStartPage===null&&pageReports.length===lastPreflightResult.pageCount));
      localOcr.hidden=summary.pagesNeedingOcr.length===0;
      if(!localOcr.hidden)localOcr.textContent='OCR Lokal · Halaman '+summary.pagesNeedingOcr.slice(0,5).join(', ');
      ocrProgress.hidden=false;
      if(lastPreflightResult)renderSummary(lastPreflightResult.pageCount);
    }
  }
}
document.getElementById('choose').addEventListener('click',()=>{if(!pickerOpen){pickerOpen=true;input.click()}});
input.addEventListener('change',event=>{pickerOpen=false;showFile(event.target.files[0]);input.value=''});
document.getElementById('remove').addEventListener('click',resetFile);
preflight.addEventListener('click',runPreflight);
localOcr.addEventListener('click',runLocalOcr);
convertXlsx.addEventListener('click',convertAndDownloadExcel);
card.addEventListener('dragover',event=>{event.preventDefault();card.classList.add('drag')});
card.addEventListener('dragleave',()=>card.classList.remove('drag'));
card.addEventListener('drop',event=>{event.preventDefault();card.classList.remove('drag');showFile(event.dataTransfer.files[0])});
</script></body></html>`;
const SEO_ORIGIN = "https://rabconverter-preview.rabconverter-id.workers.dev";
const robotsTxt = atob("VXNlci1hZ2VudDogKgpBbGxvdzogLwoKU2l0ZW1hcDogaHR0cHM6Ly9yYWJjb252ZXJ0ZXItcHJldmlldy5yYWJjb252ZXJ0ZXItaWQud29ya2Vycy5kZXYvc2l0ZW1hcC54bWwK");
const sitemapXml = atob("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHVybHNldCB4bWxucz0iaHR0cDovL3d3dy5zaXRlbWFwcy5vcmcvc2NoZW1hcy9zaXRlbWFwLzAuOSI+CiAgPHVybD4KICAgIDxsb2M+aHR0cHM6Ly9yYWJjb252ZXJ0ZXItcHJldmlldy5yYWJjb252ZXJ0ZXItaWQud29ya2Vycy5kZXYvPC9sb2M+CiAgICA8bGFzdG1vZD4yMDI2LTEwLTI2PC9sYXN0bW9kPgogIDwvdXJsPgo8L3VybHNldD4K");
addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const url = new URL(event.request.url);
    if (url.pathname === "/robots.txt") return new Response(robotsTxt, { status: 200, headers: { "content-type": "text/plain; charset=UTF-8", "cache-control": "public, max-age=3600" } });
    if (url.pathname === "/sitemap.xml") return new Response(sitemapXml, { status: 200, headers: { "content-type": "application/xml; charset=UTF-8", "cache-control": "public, max-age=3600" } });
    return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "no-store" } });
  })());
});