const TEAMS = [
  {name:'臺北台新戰神',logo:'https://assets.tpbl.basketball/frontend/_nuxt/mars.BbDWfkG6.webp',en:'Taipei Taishin Mars',city:'臺北市'},
  {name:'新北中信特攻',logo:'https://assets.tpbl.basketball/frontend/_nuxt/dea.BEfNfG39.webp',en:'New Taipei CTBC DEA',city:'新北市'},
  {name:'新北國王',logo:'https://assets.tpbl.basketball/frontend/_nuxt/kings.DsunMN-K.webp',en:'New Taipei Kings',city:'新北市'},
  {name:'桃園台啤永豐雲豹',logo:'https://assets.tpbl.basketball/frontend/_nuxt/leopards.BGzlSG8M.webp',en:'Taoyuan Taiwan Beer Leopards',city:'桃園市'},
  {name:'新竹御嵿攻城獅',logo:'https://assets.tpbl.basketball/frontend/_nuxt/lioneers.DTfkuEJZ.webp',en:'Hsinchu Toplus Lioneers',city:'新竹縣'},
  {name:'福爾摩沙夢想家',logo:'https://assets.tpbl.basketball/frontend/_nuxt/dreamers.8uP5AliT.webp',en:'Formosa Dreamers',city:'臺中市'},
  {name:'高雄全家海神',logo:'https://assets.tpbl.basketball/frontend/_nuxt/aquas.CB-Rq9NB.webp',en:'Kaohsiung Aquas',city:'高雄市'}
];
const STORE='tpbl-courtside-v2';
let data=loadData();
let rosterData={teams:[],players:[]};
async function loadRoster(){
  try{
    const res=await fetch('data/rosters.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    rosterData=await res.json();
    render();
    $('playerCount').textContent=rosterData.players.length;
    $('dataStatus').textContent='名單已載入';
  }catch(err){
    $('rosterStatus').textContent='名單載入失敗，請確認 data/rosters.json 已上傳';
    $('rosterTable').innerHTML='<tr><td colspan="6" class="empty-cell">無法讀取球員名單檔案。</td></tr>';
  }
}
function renderRoster(){
  const q=$('playerSearch').value.trim().toLowerCase(),tf=$('playerTeamFilter').value;
  const list=(rosterData.players||[]).filter(p=>(String(p.name||'')+' '+String(p.team_name||'')).toLowerCase().includes(q)&&(!tf||p.team_name===tf));
  $('rosterTable').innerHTML=list.length?list.map(p=>`<tr><td>${esc(p.jersey_number??'—')}</td><td><button class="name-link" type="button" data-player-id="${esc(p.player_id)}"><b>${esc(p.name)}</b></button></td><td>${esc(p.team_name||'—')}</td><td>${esc(p.position||'—')}</td><td>${p.height_cm?esc(p.height_cm)+' cm':'—'}</td><td>${p.weight_kg?esc(p.weight_kg)+' kg':'—'}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-cell">找不到符合條件的球員。</td></tr>';
  $('rosterStatus').textContent=`顯示 ${list.length} / ${(rosterData.players||[]).length} 位球員`;
}
function openDetail(viewType,id){
  const root=$('detailContent'); let html='';
  if(viewType==='team'){
    const team=(rosterData.teams||[]).find(t=>String(t.team_id)===String(id)); if(!team)return;
    const roster=(rosterData.players||[]).filter(p=>String(p.team_id)===String(id));
    html=`<section class="team-profile-hero"><div class="team-profile-brand"><img src="${esc(team.logo_url||'')}" alt="${esc(team.name)}隊徽" onerror="this.style.display='none'"><div><span class="eyebrow">TEAM PROFILE · 2026–27</span><h1>${esc(team.name)}</h1><p>${esc(team.en_name||'TPBL TEAM')}</p></div></div><div class="profile-count"><strong>${roster.length}</strong><span>REGISTERED PLAYERS</span></div></section>
    <div class="profile-stat-grid"><article><span>球員人數</span><b>${roster.length}</b></article><article><span>資料賽季</span><b>2026–27</b></article><article><span>名單狀態</span><b>${team.roster_status==='complete'?'已整理':'待補充'}</b></article></div>
    <div class="panel table-panel"><div class="panel-title"><h3>球隊球員名單</h3><span class="muted small">點擊球員姓名查看個人頁面</span></div><div class="table-wrap"><table><thead><tr><th>背號</th><th>球員</th><th>位置</th><th>身高</th><th>體重</th></tr></thead><tbody>${roster.map(p=>`<tr><td>${esc(p.jersey_number??'—')}</td><td><button class="name-link" type="button" data-player-id="${esc(p.player_id)}"><b>${esc(p.name)}</b></button></td><td>${esc(p.position||'—')}</td><td>${p.height_cm?esc(p.height_cm)+' cm':'—'}</td><td>${p.weight_kg?esc(p.weight_kg)+' kg':'—'}</td></tr>`).join('')}</tbody></table></div></div>`;
  } else {
    const p=(rosterData.players||[]).find(x=>String(x.player_id)===String(id)); if(!p)return;
    const team=(rosterData.teams||[]).find(t=>String(t.team_id)===String(p.team_id));
    const img=p.image_url || (p.image_urls&& (p.image_urls.player||p.image_urls.avatar||p.image_urls.profile)) || '';
    html=`<section class="player-profile-hero"><div class="player-visual">${img?`<img src="${esc(img)}" alt="${esc(p.name)}" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="player-placeholder" hidden>${esc(p.name.slice(0,1))}</div>`:`<div class="player-placeholder">${esc((p.name||'球').slice(0,1))}</div>`}<span class="jersey-watermark">${esc(p.jersey_number??'—')}</span></div><div class="player-identity"><span class="eyebrow">PLAYER PROFILE · 2026–27</span><div class="player-team-line">${team&&team.logo_url?`<img src="${esc(team.logo_url)}" alt="" onerror="this.style.display='none'">`:''}<span>${esc(p.team_name||'TPBL')}</span></div><h1>${esc(p.name)}</h1><div class="player-position">${esc(p.position||'POSITION TBC')}</div><p class="profile-disclaimer">球員註冊基本資料｜場均統計待官方數據核實後更新</p></div></section>
    <div class="profile-stat-grid player-bio-grid"><article><span>背號</span><b>#${esc(p.jersey_number??'—')}</b></article><article><span>位置</span><b>${esc(p.position||'—')}</b></article><article><span>身高</span><b>${p.height_cm?esc(p.height_cm)+' cm':'—'}</b></article><article><span>體重</span><b>${p.weight_kg?esc(p.weight_kg)+' kg':'—'}</b></article><article><span>生日</span><b>${esc(p.birthday||'未提供')}</b></article></div>
    <div class="content-grid profile-lower"><article class="panel"><div class="panel-title"><h3>球員基本資料</h3><span class="tag">ROSTER INFO</span></div><dl class="bio-list"><div><dt>所屬球隊</dt><dd>${esc(p.team_name||'—')}</dd></div><div><dt>球員位置</dt><dd>${esc(p.position||'—')}</dd></div><div><dt>註冊背號</dt><dd>${esc(p.jersey_number??'—')}</dd></div><div><dt>出生日期</dt><dd>${esc(p.birthday||'尚未取得')}</dd></div></dl>${team?`<button class="primary" type="button" data-team-id="${esc(team.team_id)}">查看 ${esc(team.name)} 球隊頁面</button>`:''}</article><article class="panel"><div class="panel-title"><h3>賽季數據</h3><span class="tag">2026–27</span></div><div class="stats-pending"><strong>—</strong><b>等待官方統計資料</b><p>目前已建立球員註冊名單，尚未取得可核實的本季場均數據，因此不顯示推測數值。</p></div></article></div>`;
  }
  root.innerHTML=html; $('detailTab').hidden=false; go('detail'); $('detailTab').hidden=false;
  $('detailBack').onclick=()=>go(viewType==='team'?'teams':'players');
}

function loadData(){
  try{
    const saved=localStorage.getItem(STORE);
    if(saved){const x=JSON.parse(saved);if(Array.isArray(x.players)&&Array.isArray(x.games))return x;}
  }catch(e){}
  // v2 intentionally starts clean: old v1 contained fictional demo scores and players.
  return {players:[],games:[]};
}
function save(){localStorage.setItem(STORE,JSON.stringify(data));}
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(view){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.goto)));
document.addEventListener('click',e=>{const player=e.target.closest('[data-player-id]');if(player){openDetail('player',player.dataset.playerId);return;}const team=e.target.closest('[data-team-id]');if(team&&team.dataset.teamId){openDetail('team',team.dataset.teamId);}});
const teamNames=TEAMS.map(t=>t.name);
function teamStats(){
  return TEAMS.map(team=>{
    let w=0,l=0;
    data.games.forEach(g=>{
      if((g.status||'FINAL')!=='FINAL') return;
      if(g.home===team.name){g.hs>g.as?w++:l++;}
      if(g.away===team.name){g.as>g.hs?w++:l++;}
    });
    const gp=w+l;return {...team,w,l,gp,pct:gp?w/gp:0};
  }).sort((a,b)=>b.pct-a.pct||b.w-a.w||a.name.localeCompare(b.name,'zh-Hant'));
}
function sourceLabel(item){return item.sourceType==='official'?'官方資料':item.sourceType==='thirdparty'?'第三方參考':'人工補充';}
function gameRow(g){
  const status=g.status||'FINAL';
  const score=status==='UPCOMING'?'VS':`${Number(g.hs)} : ${Number(g.as)}`;
  const label=status==='UPCOMING'?'未來賽程':'已完成';
  return `<div class="game-row"><div class="game-teams">${esc(g.home)}<br>${esc(g.away)}</div><div class="score">${score}</div><div class="game-status">${label}</div></div>`;
}
function render(){
  $('teamCount').textContent=TEAMS.length;
  $('playerCount').textContent=rosterData.players.length||data.players.length;
  $('gameCount').textContent=data.games.length;
  $('dataStatus').textContent=data.players.length||data.games.length?'已建檔':'待匯入';
  $('teamTiles').innerHTML=TEAMS.map(t=>`<button class="team-tile team-tile-button" type="button" data-team-id="${(rosterData.teams||[]).find(x=>x.name===t.name)?.team_id??''}"><img class="team-logo-mini" src="${(rosterData.teams||[]).find(x=>x.name===t.name)?.logo_url||t.logo}" alt="${esc(t.name)}隊徽" loading="lazy"><b>${esc(t.name)}</b><span>${esc(t.en)}</span><small>${esc(t.city)}</small></button>`).join('');
  $('teamsGrid').innerHTML=TEAMS.map(t=>{const rt=(rosterData.teams||[]).find(x=>x.name===t.name);return `<button class="team-card team-card-button" type="button" data-team-id="${rt?.team_id??''}"><img class="team-logo" src="${rt?.logo_url||t.logo}" alt="${esc(t.name)}隊徽" loading="lazy"><div><h3>${esc(t.name)}</h3><p>${esc(t.en)}</p><small>${rt?.included_player_count??0} 位球員 · ${esc(t.city)}</small></div><span class="team-card-arrow">→</span></button>`}).join('');
  const recent=[...data.games].filter(g=>(g.status||'FINAL')==='FINAL').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  $('recentGames').innerHTML=recent.length?recent.map(g=>`<div class="recent-item"><div class="date">${esc(g.date)} · ${sourceLabel(g)}</div>${gameRow(g)}</div>`).join(''):'<p class="empty">目前尚無已核對的賽事資料。可從「數據管理」新增。</p>';
  const q=$('playerSearch').value.trim().toLowerCase(),teamFilter=$('playerTeamFilter').value,sort=$('statSelect').value;
  if(rosterData.players.length)renderRoster();
  const players=data.players.filter(p=>(p.name+' '+p.team).toLowerCase().includes(q)&&(!teamFilter||p.team===teamFilter))
    .sort((a,b)=>(Number(b[sort])||0)-(Number(a[sort])||0));
  $('playersTable').innerHTML=players.length?players.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.team)}</td><td>${fmt(p.pts)}</td><td>${fmt(p.reb)}</td><td>${fmt(p.ast)}</td><td>${fmt(p.stl)}</td><td>${fmt(p.blk)}</td><td>${fmt(p.fg)}%</td><td>${fmt(p.tp)}%</td><td>${fmt(p.ft)}%</td><td><span class="source-pill ${p.sourceType==='official'?'official':'manual'}">${sourceLabel(p)}</span></td><td>${esc(p.updated||'—')}</td></tr>`).join(''):'<tr><td colspan="12" class="empty-cell">尚無球員資料。請由官方數據頁查核後新增。</td></tr>';
  const standings=teamStats(),leader=standings[0]?.pct||0;
  $('teamsTable').innerHTML=standings.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.name)}</td><td>${t.gp}</td><td>${t.w}</td><td>${t.l}</td><td>${t.gp?(t.pct*100).toFixed(1)+'%':'—'}</td><td>${t.gp&&i>0?(leader-t.pct).toFixed(3):'—'}</td></tr>`).join('');
  const gameCards=list=>list.map(g=>`<article class="game-card"><div class="date">${esc(g.date)} · ${sourceLabel(g)}</div>${gameRow(g)}<p class="game-source">來源：${esc(g.source||'未填寫')}</p></article>`).join('')||'<div class="panel empty">目前沒有已核對的資料。</div>';
  const sortedGames=[...data.games].sort((a,b)=>a.date.localeCompare(b.date));
  $('upcomingGames').innerHTML=gameCards(sortedGames.filter(g=>g.status==='UPCOMING'));
  $('completedGames').innerHTML=gameCards(sortedGames.filter(g=>(g.status||'FINAL')==='FINAL').reverse());
  const leaderDefs=[['得分 PPG','pts'],['籃板 RPG','reb'],['助攻 APG','ast'],['抄截 SPG','stl'],['阻攻 BPG','blk']];
  $('leaderGrid').innerHTML=leaderDefs.map(([label,key])=>{
    const p=[...data.players].sort((a,b)=>(Number(b[key])||0)-(Number(a[key])||0))[0];
    return `<article class="leader-card"><span>${label}</span><b>${p?esc(p.name):'待建立資料'}</b><strong>${p?fmt(p[key]):'—'}</strong><small>${p?esc(p.team):'目前沒有可核實的登錄數據'}</small></article>`;
  }).join('');
}
function fmt(n){return Number.isFinite(Number(n))?Number(n).toFixed(1).replace(/\.0$/,''):'—';}
function fillTeams(){
  ['homeTeam','awayTeam','playerTeam'].forEach(id=>$(id).innerHTML=TEAMS.map(t=>`<option value="${esc(t.name)}">${esc(t.name)}</option>`).join(''));
  $('playerTeamFilter').innerHTML='<option value="">全部球隊</option>'+TEAMS.map(t=>`<option value="${esc(t.name)}">${esc(t.name)}</option>`).join('');
  $('awayTeam').selectedIndex=1;
}
$('addGameForm').addEventListener('submit',e=>{
  e.preventDefault();
  const status=$('gameStatus').value;
  const g={date:$('gameDate').value,home:$('homeTeam').value,away:$('awayTeam').value,hs:$('homeScore').value===''?null:Number($('homeScore').value),as:$('awayScore').value===''?null:Number($('awayScore').value),sourceType:$('gameSourceType').value,source:$('gameSource').value.trim(),status};
  if(g.home===g.away){$('gameMessage').textContent='主隊與客隊不能相同。';return;}
  if(status==='FINAL'&&(g.hs===null||g.as===null)){$('gameMessage').textContent='已完成賽事請填寫雙方比分。';return;}
  if(status==='UPCOMING'&&g.date<new Date().toISOString().slice(0,10)){$('gameMessage').textContent='未來賽程日期不能早於今天。';return;}
  if(!g.source){$('gameMessage').textContent='請填寫資料來源網址或說明。';return;}
  data.games.push(g);save();render();$('gameMessage').textContent=status==='UPCOMING'?'未來賽程已儲存；不會計入球隊戰績。':'比賽紀錄已儲存；排名依本站已登錄完賽賽果計算。';e.target.reset();$('gameDate').value=new Date().toISOString().slice(0,10);
});
$('addPlayerForm').addEventListener('submit',e=>{
  e.preventDefault();const val=id=>Number($(id).value)||0;
  const p={name:$('playerName').value.trim(),team:$('playerTeam').value,pts:val('pPts'),reb:val('pReb'),ast:val('pAst'),stl:val('pStl'),blk:val('pBlk'),fg:val('pFg'),tp:val('pTp'),ft:val('pFt'),sourceType:$('playerSourceType').value,source:$('playerSource').value.trim(),updated:$('playerUpdated').value};
  if(!p.source||!p.updated){$('playerMessage').textContent='請補上來源與資料日期。';return;}
  data.players.push(p);save();render();$('playerMessage').textContent='球員資料已新增，並保留來源標記。';e.target.reset();$('playerUpdated').value=new Date().toISOString().slice(0,10);
});
['playerSearch','playerTeamFilter','statSelect'].forEach(id=>$(id).addEventListener(id==='playerSearch'?'input':'change',render));
$('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify({season:'2026-27',teams:TEAMS,players:data.players,games:data.games},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tpbl-courtside-backup.json';a.click();URL.revokeObjectURL(a.href);
});
$('importFile').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{const obj=JSON.parse(await file.text());if(!Array.isArray(obj.players)||!Array.isArray(obj.games))throw Error('格式錯誤');
    data={players:obj.players,games:obj.games};save();render();alert('備份匯入成功！');
  }catch(err){alert('檔案格式不正確，請選擇本網站匯出的 JSON 備份。');}
  e.target.value='';
});
$('clearBtn').addEventListener('click',()=>{
  if(confirm('確定要清空目前瀏覽器中的球員與比賽資料嗎？建議先匯出備份。')){data={players:[],games:[]};save();render();}
});
fillTeams();
loadRoster();
$('gameDate').value=new Date().toISOString().slice(0,10);
$('playerUpdated').value=new Date().toISOString().slice(0,10);
render();