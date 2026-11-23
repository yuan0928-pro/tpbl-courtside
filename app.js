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
  $('playerCount').textContent=data.players.length;
  $('gameCount').textContent=data.games.length;
  $('dataStatus').textContent=data.players.length||data.games.length?'已建檔':'待匯入';
  $('teamTiles').innerHTML=TEAMS.map(t=>`<div class="team-tile"><img class="team-logo-mini" src="${t.logo}" alt="${esc(t.name)}隊徽" loading="lazy"><b>${esc(t.name)}</b><span>${esc(t.en)}</span><small>${esc(t.city)}</small></div>`).join('');
  $('teamsGrid').innerHTML=TEAMS.map(t=>`<article class="team-card"><img class="team-logo" src="${t.logo}" alt="${esc(t.name)}隊徽" loading="lazy"><div><h3>${esc(t.name)}</h3><p>${esc(t.en)}</p><small>${esc(t.city)}</small></div></article>`).join('');
  const recent=[...data.games].filter(g=>(g.status||'FINAL')==='FINAL').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  $('recentGames').innerHTML=recent.length?recent.map(g=>`<div class="recent-item"><div class="date">${esc(g.date)} · ${sourceLabel(g)}</div>${gameRow(g)}</div>`).join(''):'<p class="empty">目前尚無已核對的賽事資料。可從「數據管理」新增。</p>';
  const q=$('playerSearch').value.trim().toLowerCase(),teamFilter=$('playerTeamFilter').value,sort=$('statSelect').value;
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
$('gameDate').value=new Date().toISOString().slice(0,10);
$('playerUpdated').value=new Date().toISOString().slice(0,10);
render();