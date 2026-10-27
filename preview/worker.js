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
<div id="chosen" class="file-state" hidden><div class="file-row"><div class="fileicon"><svg viewBox="0 0 32 36" aria-hidden="true"><path d="M5 1.5h14l8 8V32a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 3 32V4a2.5 2.5 0 0 1 2-2.5Z" fill="#fff" stroke="currentColor" stroke-width="1.5"/><path d="M19 1.5v8h8" fill="#eef5f0" stroke="currentColor" stroke-width="1.5"/><path d="M8 19h13M8 23.5h13M8 28h9" stroke="#638574" stroke-width="1.7" stroke-linecap="round"/></svg></div><div class="meta"><span class="kicker">PDF DIPILIH</span><strong class="filename" id="filename"></strong><span class="size" id="filesize"></span></div><button class="remove" id="remove" aria-label="Ganti atau hapus file terpilih">×</button></div><div class="state-note" id="preflight-note"><span class="dot"></span>Pemeriksaan struktur saja; belum membaca tabel RAB atau menjalankan OCR.</div><div class="state-actions"><button class="primary" id="preflight" type="button">Periksa PDF <span>→</span></button><p class="limit" id="preflight-help">File dikirim untuk diperiksa, lalu langsung dibuang.</p></div></div>
<input class="hidden" id="file" type="file" accept="application/pdf,.pdf" aria-label="Pilih dokumen PDF RAB"><p class="err" id="err" role="alert" hidden></p>
</section>
<div class="reassure"><div class="item"><span style="color:#38815b;font-size:17px">↗</span>Excel bisa diedit</div><span class="separator"></span><div class="item"><span class="check">✓</span>Kurangi input manual</div><span class="separator"></span><div class="item"><span class="check">✓</span>Periksa hasil sebelum dipakai</div></div>
</main><footer><span>© 2026 RabConverter</span><span class="footnote">Dibuat untuk pekerjaan RAB yang lebih praktis.</span></footer></div>
<script>
const input=document.getElementById('file'),card=document.getElementById('card'),empty=document.getElementById('empty'),chosen=document.getElementById('chosen'),err=document.getElementById('err'),preflight=document.getElementById('preflight'),note=document.getElementById('preflight-note'),help=document.getElementById('preflight-help');
const PREFLIGHT_URL='https://zkcziucjogprfzhjuaex.supabase.co/functions/v1/preflight-rab';
const MAX_BYTES=30*1024*1024;
let selectedFile=null,pickerOpen=false,requestId=0,activeController=null,busy=false;
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
  busy=false;
  selectedFile=null;
  pageReports=[];
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
  busy=false;
  selectedFile=null;
  pageReports=[];
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
  const pagesNeedingOcr=pages.filter(page=>page.textFound===false||page.textChars===0).map(page=>page.pageNumber);
  const truncatedPages=pages.filter(page=>page.truncated).map(page=>page.pageNumber);
  const description=signals.includes('item_description'),quantity=signals.includes('quantity_or_unit'),price=signals.includes('price_or_amount'),totals=signals.includes('totals');
  const structural=signals.includes('repeated_item_rows')||(description&&quantity&&price)||(description&&price&&totals);
  let status,reasons;
  if(score>=6&&signals.length>=2&&structural){status='LIKELY_RAB';reasons=['rab_signals_and_cost_structure_detected']}
  else if(score>=3){status='NEEDS_CONFIRMATION';reasons=[structural?'classification_score_needs_confirmation':'cost_structure_not_strong_enough_for_auto_accept']}
  else if(pagesNeedingOcr.length>0&&complete){status='NEEDS_OCR';reasons=['one_or_more_pages_have_no_extractable_text']}
  else if(!complete){status='NEEDS_MORE_PAGES';reasons=['insufficient_evidence_in_pages_reviewed_so_far']}
  else{status='NOT_RAB';reasons=['insufficient_rab_boq_evidence']}
  return {status,score,signals,reasons,complete,pagesReviewed:pages.length,pagesNeedingOcr,truncatedPages,structuralCostEvidence:structural};
}
function classificationLabel(summary){
  if(summary.status==='LIKELY_RAB')return summary.complete?'Kemungkinan besar RAB/BoQ':'Sementara terlihat seperti RAB/BoQ';
  if(summary.status==='NEEDS_CONFIRMATION')return 'Belum pasti RAB/BoQ — perlu konfirmasi';
  if(summary.status==='NOT_RAB')return 'Tidak ditemukan cukup ciri RAB/BoQ';
  if(summary.status==='NEEDS_OCR')return 'Ada halaman yang memerlukan OCR';
  return 'Bukti belum cukup — periksa halaman berikutnya';
}
async function runPreflight(){
  if(!selectedFile||busy)return;
  const restarting=lastPreflightResult&&lastPreflightResult.nextStartPage===null;
  const startPage=restarting?1:nextStartPage;
  if(restarting){pageReports=[];lastPreflightResult=null;nextStartPage=1}
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
    const summary=summarizePageReports(pageReports,complete);
    updateNote(classificationLabel(summary),summary.status==='LIKELY_RAB');
    let details=pageReports.length+' dari '+payload.pageCount+' halaman diperiksa';
    details+=complete?' · pemeriksaan seluruh halaman selesai':' · pemeriksaan bertahap';
    if(summary.pagesNeedingOcr.length)details+=' · '+summary.pagesNeedingOcr.length+' halaman tidak memiliki teks; perlu OCR';
    if(summary.truncatedPages.length)details+=' · teks dibatasi pada '+summary.truncatedPages.length+' halaman';
    help.textContent=details+'. File tidak disimpan dan teks lengkap tidak dikirim ke browser.';
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
    }
  }
}
document.getElementById('choose').addEventListener('click',()=>{if(!pickerOpen){pickerOpen=true;input.click()}});
input.addEventListener('change',event=>{pickerOpen=false;showFile(event.target.files[0]);input.value=''});
document.getElementById('remove').addEventListener('click',resetFile);
preflight.addEventListener('click',runPreflight);
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