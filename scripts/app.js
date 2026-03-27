var I=[],E=[],G=[];
var MN=['Январь','Февраль','Март','Апрель','Май','Июнь',
        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
var CC={'Продукты':'#e53e3e','Жильё':'#dd6b20','Транспорт':'#3182ce',
        'Здоровье':'#38a169','Образование':'#805ad5','Развлечения':'#d69e2e',
        'Одежда':'#d53f8c','Связь':'#00b5d8','Другое':'#718096'};

// Инициализация
var sel=document.getElementById('sm');
for(var j=0;j<MN.length;j++){
  var o=document.createElement('option');
  o.value=j; o.textContent=MN[j]; sel.appendChild(o);
}
var now=new Date();
sel.value=now.getMonth();
document.getElementById('iy').value=now.getFullYear();
sel.onchange=function(){ld();R()};
document.getElementById('iy').onchange=function(){ld();R()};
document.getElementById('a2').onkeydown=function(e){if(e.key==='Enter')aI()};
document.getElementById('b2').onkeydown=function(e){if(e.key==='Enter')aE()};
ld(); R(); iT();

// Ключ хранилища
function sk(){
  return 'b_'+document.getElementById('iy').value+'_'+document.getElementById('sm').value;
}

// Сохранение и загрузка
function sv(){
  try{localStorage.setItem(sk(),JSON.stringify({i:I,e:E,g:G}));}catch(x){}
}
function ld(){
  try{
    var r=localStorage.getItem(sk());
    if(r){var d=JSON.parse(r);I=d.i||[];E=d.e||[];G=d.g||[];}
    else{I=[];E=[];G=[];}
  }catch(x){I=[];E=[];G=[];}
}

// Форматирование
function fm(n){return Number(n).toLocaleString('ru-RU')+' ₽';}

// Уведомления
function ts(m,t){
  var b=document.getElementById('toasts');
  var el=document.createElement('div');
  el.className='toast '+(t||'nf');
  el.textContent=m;
  b.appendChild(el);
  setTimeout(function(){el.remove();},3000);
}

// Добавить доход
function aI(){
  var n=document.getElementById('a1'),a=document.getElementById('a2');
  var nm=n.value.trim(),am=parseFloat(a.value);
  if(!nm){ts('Введите название','er');return;}
  if(!am||am<=0){ts('Введите сумму','er');return;}
  I.push({id:Date.now(),n:nm,a:am});
  n.value='';a.value='';sv();R();ts('+'+fm(am),'ok');
}

// Добавить расход
function aE(){
  var n=document.getElementById('b1'),a=document.getElementById('b2'),c=document.getElementById('b3');
  var nm=n.value.trim(),am=parseFloat(a.value),ct=c.value;
  if(!nm){ts('Введите название','er');return;}
  if(!am||am<=0){ts('Введите сумму','er');return;}
  E.push({id:Date.now(),n:nm,a:am,c:ct});
  n.value='';a.value='';sv();R();ts('-'+fm(am),'er');
}

// Удаление
function dI(id){I=I.filter(function(x){return x.id!==id});sv();R();ts('Удалено','nf');}
function dE(id){E=E.filter(function(x){return x.id!==id});sv();R();ts('Удалено','nf');}

// Цели
function aG(){
  var n=document.getElementById('c1'),t=document.getElementById('c2');
  var nm=n.value.trim(),tg=parseFloat(t.value);
  if(!nm){ts('Введите цель','er');return;}
  if(!tg||tg<=0){ts('Введите сумму','er');return;}
  G.push({id:Date.now(),n:nm,t:tg,s:0});
  n.value='';t.value='';sv();R();ts('Цель добавлена','ok');
}
function aTG(id){
  var inp=document.getElementById('g_'+id);
  var v=parseFloat(inp.value);
  if(!v||v<=0){ts('Введите сумму','er');return;}
  for(var i=0;i<G.length;i++){
    if(G[i].id===id){G[i].s=Math.min(G[i].s+v,G[i].t);break;}
  }
  inp.value='';sv();R();ts('+'+fm(v),'ok');
}
function dG(id){G=G.filter(function(x){return x.id!==id});sv();R();ts('Удалено','nf');}

// Очистка и экспорт
function clearAll(){
  if(!confirm('Удалить все данные за этот месяц?'))return;
  I=[];E=[];G=[];sv();R();ts('Очищено','nf');
}
function exportD(){
  var d={month:MN[document.getElementById('sm').value],
         year:document.getElementById('iy').value,incomes:I,expenses:E,goals:G};
  document.getElementById('eo').textContent=JSON.stringify(d,null,2);
  document.getElementById('mbg').classList.add('on');
}
function cpEx(){
  navigator.clipboard.writeText(document.getElementById('eo').textContent)
    .then(function(){ts('Скопировано','ok')})
    .catch(function(){ts('Ошибка','er')});
}

// ===== ГЛАВНЫЙ РЕНДЕР =====
function R(){
  var tI=0,tE=0,tS=0;
  for(var i=0;i<I.length;i++) tI+=I[i].a;
  for(var i=0;i<E.length;i++) tE+=E[i].a;
  for(var i=0;i<G.length;i++) tS+=G[i].s;
  var bal=tI-tE;

  // Dashboard
  document.getElementById('vi').textContent=fm(tI);
  document.getElementById('ve').textContent=fm(tE);
  document.getElementById('vb').textContent=fm(bal);
  document.getElementById('vs').textContent=fm(tS);
  document.getElementById('ni').textContent=I.length+' ист.';
  document.getElementById('ne').textContent=E.length+' ст.';
  document.getElementById('pb').textContent=tI>0?Math.round(bal/tI*100)+'%':'—';
  document.getElementById('ns').textContent=G.length?G.length+' цел.':'Нет';
  document.getElementById('sti').textContent=fm(tI);
  document.getElementById('ste').textContent=fm(tE);
  document.getElementById('vb').style.color=bal>=0?'var(--blue)':'var(--red)';

  // Баланс-бар
  var sp=tI>0?Math.min(Math.round(tE/tI*100),100):0;
  var rm=100-sp;
  document.getElementById('bsp').style.width=sp+'%';
  document.getElementById('bsp').textContent=sp>10?sp+'%':'';
  document.getElementById('brm').style.width=rm+'%';
  document.getElementById('brm').textContent=rm>10?rm+'%':'';
  document.getElementById('lsp').textContent='Расходы: '+sp+'%';
  document.getElementById('lrm').textContent='Остаток: '+rm+'%';

  // Список доходов
  var il=document.getElementById('li');
  if(!I.length){
    il.innerHTML='<div class="emp">💵 Добавьте первый доход</div>';
  } else {
    var h='';
    for(var i=0;i<I.length;i++){
      var x=I[i];
      h+='<li class="ir gi"><div style="flex:1;min-width:0">';
      h+='<div class="nm">'+x.n+'</div></div>';
      h+='<div class="am">+'+fm(x.a)+'</div>';
      h+='<button class="del" onclick="dI('+x.id+')">✕</button></li>';
    }
    il.innerHTML=h;
  }

  // Список расходов
  var el=document.getElementById('le');
  if(!E.length){
    el.innerHTML='<div class="emp">🛒 Добавьте первый расход</div>';
  } else {
    var h='';
    for(var i=0;i<E.length;i++){
      var x=E[i];
      h+='<li class="ir ei"><div style="flex:1;min-width:0">';
      h+='<div class="nm">'+x.n+'</div>';
      h+='<div class="ct">'+x.c+'</div></div>';
      h+='<div class="am">-'+fm(x.a)+'</div>';
      h+='<button class="del" onclick="dE('+x.id+')">✕</button></li>';
    }
    el.innerHTML=h;
  }

  // Категории
  var cats={};
  for(var i=0;i<E.length;i++){
    var c=E[i].c;
    cats[c]=(cats[c]||0)+E[i].a;
  }

  // Прогресс-бары категорий
  var cb=document.getElementById('cbs');
  if(!tE){
    cb.innerHTML='<div class="emp">Нет данных</div>';
  } else {
    var h='';
    for(var k in cats){
      var p=Math.round(cats[k]/tE*100);
      var cl=CC[k]||'#718096';
      h+='<div class="cbar"><div class="hd2"><b>'+k+'</b>';
      h+='<span>'+fm(cats[k])+' ('+p+'%)</span></div>';
      h+='<div class="trk"><div class="fil" style="width:'+p+'%;background:'+cl+'"></div></div></div>';
    }
    cb.innerHTML=h;
  }

  // Круговая диаграмма
  var svg=document.getElementById('svg');
  var plg=document.getElementById('plg');
  if(!tE){
    svg.innerHTML='<text x="100" y="105" text-anchor="middle" fill="gray" font-size="14">Нет данных</text>';
    plg.innerHTML='';
  } else {
    var sh='',lh='',angle=0;
    var ks=Object.keys(cats);
    if(ks.length===1){
      var cl=CC[ks[0]]||'#718096';
      sh='<circle cx="100" cy="100" r="80" fill="'+cl+'"/>';
      lh='<span><i style="background:'+cl+'"></i>'+ks[0]+' 100%</span>';
    } else {
      for(var i=0;i<ks.length;i++){
        var k=ks[i],v=cats[k],pc=v/tE,ag=pc*360;
        var cl=CC[k]||'#718096';
        var r1=(angle-90)*Math.PI/180;
        var r2=(angle+ag-90)*Math.PI/180;
        var x1=100+80*Math.cos(r1),y1=100+80*Math.sin(r1);
        var x2=100+80*Math.cos(r2),y2=100+80*Math.sin(r2);
        var big=ag>180?1:0;
        sh+='<path d="M100,100 L'+x1+','+y1+' A80,80 0 '+big+',1 '+x2+','+y2+' Z" fill="'+cl+'"/>';
        lh+='<span><i style="background:'+cl+'"></i>'+k+' '+Math.round(pc*100)+'%</span>';
        angle+=ag;
      }
    }
    svg.innerHTML=sh;
    plg.innerHTML=lh;
  }

  // Цели
  var glEl=document.getElementById('gl');
  if(!G.length){
    glEl.innerHTML='<div class="emp">🎯 Добавьте цель</div>';
  } else {
    var h='';
    for(var i=0;i<G.length;i++){
      var g=G[i];
      var p=Math.min(Math.round(g.s/g.t*100),100);
      h+='<div class="gc"><div class="gh">';
      h+='<span class="gn">'+g.n+'</span>';
      h+='<span class="ga">'+fm(g.s)+' / '+fm(g.t)+'</span></div>';
      h+='<div class="gtk"><div class="gf" style="width:'+p+'%"></div></div>';
      h+='<div class="gp">'+p+'%'+(p>=100?' ✅':'')+'</div>';
      h+='<div class="gcs">';
      h+='<input type="number" id="g_'+g.id+'" placeholder="Внести ₽" min="0">';
      h+='<button class="btn gr sm" onclick="aTG('+g.id+')">＋</button>';
      h+='<button class="btn rd sm" onclick="dG('+g.id+')">🗑️</button>';
      h+='</div></div>';
    }
    glEl.innerHTML=h;
  }

  // Советы
  var tl=document.getElementById('tl');
  var th='';
  if(!tI&&!tE){
    th='<div class="tip"><span>👋</span><span>Добавьте доходы и расходы для аналитики</span></div>';
  } else {
    if(bal<0){
      th+='<div class="tip d"><span>🚨</span><span>Расходы превышают доходы на '+fm(Math.abs(bal))+'!</span></div>';
    } else if(sp>80){
      th+='<div class="tip w"><span>⚠️</span><span>Вы тратите '+sp+'% дохода. Рекомендуется до 80%.</span></div>';
    } else if(sp<=50){
      th+='<div class="tip g"><span>🌟</span><span>Отлично! Только '+sp+'% расходов.</span></div>';
    } else {
      th+='<div class="tip"><span>👍</span><span>Расходы '+sp+'% — неплохо.</span></div>';
    }
    if(bal>0){
      th+='<div class="tip g"><span>💰</span><span>Свободно '+fm(bal)+' — направьте в накопления!</span></div>';
    }
    if(G.length===0&&tI>0){
      th+='<div class="tip w"><span>🎯</span><span>Создайте цель — это мотивирует копить.</span></div>';
    }
  }
  tl.innerHTML=th;
}

// ===== ТЕМА =====
function iT(){
  var saved=null;
  try{saved=localStorage.getItem('budget_theme');}catch(x){}
  if(!saved&&window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){
    saved='dark';
  }
  apT(saved==='dark'?'dark':'light');
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey&&e.shiftKey&&e.code==='KeyD'){e.preventDefault();tgT();}
  });
}

function apT(t){
  if(t==='dark'){
    document.documentElement.setAttribute('data-theme','dark');
    document.getElementById('ti').textContent='🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('ti').textContent='☀️';
  }
  try{localStorage.setItem('budget_theme',t);}catch(x){}
}

function tgT(){
  var cur=document.documentElement.getAttribute('data-theme');
  apT(cur==='dark'?'light':'dark');
}
function goToApp(){
  var el=document.getElementById('app');
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
function scrollToTips(){
  var el=document.getElementById('tips');
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
