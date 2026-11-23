const TEAM_NAMES=['新北國王','桃園雲豹','台北戰神','新竹攻城獅','高雄海神','福爾摩沙夢想家','新北中信特攻'];
const DEMO={
 players:[
  {name:'杰倫（示範）',team:'新北國王',pts:28,reb:6,ast:5,stl:1.4,blk:.5,fg:52,tp:38,ft:84},
  {name:'沃許本（示範）',team:'新北國王',pts:21,reb:12,ast:2,stl:1,blk:2.1,fg:61,tp:0,ft:72},
  {name:'書緯（示範）',team:'新北國王',pts:16,reb:4,ast:8,stl:1.8,blk:.2,fg:45,tp:39,ft:88},
  {name:'愷諺（示範）',team:'新北國王',pts:13,reb:3,ast:6,stl:2.5,blk:.1,fg:43,tp:35,ft:79},
  {name:'Player E（虛構）',team:'桃園雲豹',pts:24,reb:8,ast:4,stl:1.2,blk:.8,fg:48,tp:36,ft:81},
  {name:'Player F（虛構）',team:'台北戰神',pts:19,reb:5,ast:7,stl:1.5,blk:.4,fg:46,tp:37,ft:90}
 ],
 games:[
  {date:'2026-11-20',home:'新北國王',away:'桃園雲豹',hs:98,as:91},
  {date:'2026-11-19',home:'台北戰神',away:'新竹攻城獅',hs:85,as:89},
  {date:'2026-11-18',home:'高雄海神',away:'福爾摩沙夢想家',hs:92,as:88}
 ]
};
const STORE='tpbl-courtside-v1';
let data=loadData();
function loadData(){try{const saved=localStorage.getItem(STORE);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed.players)&&Array.isArray(parsed.games))return parsed;}}catch(e){}return structuredClone(DEMO);}
function save(){localStorage.setItem(STORE,JSON.stringify(data));}
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(view){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.goto)));
function teamStats(){return TEAM_NAMES.map(name=>{let w=0,l=0;data.games.forEach(g=>{if(g.home===name){g.hs>g.as?w++:l++;}if(g.away===name){g.as>g.hs?w++:l++;}});return{name,w,l,pct:w+l?w/(w+l):0};}).sort((a,b)=>b.pct-a.pct||b.w-a.w);}
function render(){
 $('teamCount').textContent=TEAM_NAMES.length;$('playerCount').textContent=data.players.length;$('gameCount').textContent=data.games.length;
 const leaders=[['得分王','pts','PPG'],['籃板王','reb','RPG'],['助攻王','ast','APG'],['抄截王','stl','SPG']];
 $('spotlight').innerHTML=leaders.map(([label,key,unit])=>{const p=[...data.players].sort((a,b)=>b[key]-a[key])[0];return `<div class="spot-item"><span>${label}</span><b>${p?esc(p.name):'尚無資料'}</b><strong>${p?p[key]+' '+unit:'—'}</strong></div>`}).join('');
 const recent=[...data.games].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
 $('recentGames').innerHTML=recent.length?recent.map(gameRow).join(''):'<p class="muted small">尚無比賽紀錄</p>';
 const query=$('playerSearch').value.trim().toLowerCase(),sort=$('statSelect').value;
 const list=data.players.filter(p=>(p.name+' '+p.team).toLowerCase().includes(query)).sort((a,b)=>(Number(b[sort])||0)-(Number(a[sort])||0));
 $('playersTable').innerHTML=list.length?list.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.team)}</td><td>${p.pts}</td><td>${p.reb}</td><td>${p.ast}</td><td>${p.stl}</td><td>${p.blk}</td><td>${p.fg}%</td><td>${p.tp}%</td><td>${p.ft}%</td></tr>`).join(''):'<tr><td colspan="10">找不到符合的球員</td></tr>';
 const standings=teamStats();const leader=standings[0]?.pct||0;
 $('teamsTable').innerHTML=standings.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.name)}</td><td>${t.w}</td><td>${t.l}</td><td>${(t.pct*100).toFixed(1)}%</td><td>${i===0?'—':(leader-t.pct).toFixed(3)}</td></tr>`).join('');
 $('gamesList').innerHTML=[...data.games].sort((a,b)=>b.date.localeCompare(a.date)).map(g=>`<article class="game-card"><div class="date">${esc(g.date)} · FINAL</div>${gameRow(g)}</article>`).join('')||'<div class="panel muted">尚無比賽紀錄，請到數據管理新增。</div>';
}
function gameRow(g){return `<div class="game-row"><div class="game-teams">${esc(g.home)}<br>${esc(g.away)}</div><div class="score">${g.hs} : ${g.as}</div></div>`;}
function fillTeams(){['homeTeam','awayTeam','playerTeam'].forEach(id=>$(id).innerHTML=TEAM_NAMES.map(t=>`<option>${esc(t)}</option>`).join(''));$('awayTeam').selectedIndex=1;}
$('addGameForm').addEventListener('submit',e=>{e.preventDefault();const g={date:$('gameDate').value,home:$('homeTeam').value,away:$('awayTeam').value,hs:Number($('homeScore').value),as:Number($('awayScore').value)};if(g.home===g.away){$('gameMessage').textContent='主隊與客隊不能相同。';return;}data.games.push(g);save();render();$('gameMessage').textContent='比賽紀錄已儲存至此瀏覽器。';e.target.reset();});
$('addPlayerForm').addEventListener('submit',e=>{e.preventDefault();const val=id=>Number($(id).value)||0;data.players.push({name:$('playerName').value.trim(),team:$('playerTeam').value,pts:val('pPts'),reb:val('pReb'),ast:val('pAst'),stl:val('pStl'),blk:val('pBlk'),fg:val('pFg'),tp:val('pTp'),ft:val('pFt')});save();render();$('playerMessage').textContent='球員資料已新增。';e.target.reset();});
$('playerSearch').addEventListener('input',render);$('statSelect').addEventListener('change',render);
$('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tpbl-courtside-backup.json';a.click();URL.revokeObjectURL(a.href);});
$('importFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(!Array.isArray(obj.players)||!Array.isArray(obj.games))throw Error();data=obj;save();render();alert('備份匯入成功！');}catch(err){alert('檔案格式不正確，請選擇本網站匯出的 JSON 備份。');}e.target.value='';});
$('resetBtn').addEventListener('click',()=>{if(confirm('確定要刪除目前瀏覽器中的資料並恢復示範資料嗎？建議先匯出備份。')){data=structuredClone(DEMO);save();render();}});
fillTeams();$('gameDate').value=new Date().toISOString().slice(0,10);render();
