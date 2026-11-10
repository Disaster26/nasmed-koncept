(function(){
  'use strict';
  var d=document;
  // menu mobilne
  var bt=d.querySelector('.burger'),nav=d.getElementById('nav');
  if(bt&&nav){
    bt.addEventListener('click',function(){
      var o=nav.classList.toggle('open');
      bt.setAttribute('aria-expanded',o?'true':'false');
      d.body.classList.toggle('nav-open',o);
    });
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){bt.click();bt.focus();}});
  }
  d.querySelectorAll('.ddb').forEach(function(b){
    b.addEventListener('click',function(){
      var li=b.parentNode,o=li.classList.toggle('open');
      b.setAttribute('aria-expanded',o?'true':'false');
    });
  });
  // otwarte podmenu z bieżącą stroną w menu mobilnym
  d.querySelectorAll('.dd').forEach(function(li){
    if(li.querySelector('ul a.on')||li.querySelector(':scope>a.on')){
      if(window.matchMedia('(max-width:1180px)').matches){li.classList.add('open');var b=li.querySelector('.ddb');if(b)b.setAttribute('aria-expanded','true');}
    }
  });

  // dolny pasek po przewinięciu za przyciski
  var mob=d.getElementById('mob');
  if(mob){
    var anchor=d.querySelector('.hero-cta')||d.querySelector('.ph')||d.querySelector('.hd');
    if('IntersectionObserver' in window&&anchor){
      new IntersectionObserver(function(en){en.forEach(function(x){mob.classList.toggle('widac',!x.isIntersecting&&x.boundingClientRect.top<0);});},{threshold:0}).observe(anchor);
    }
  }

  // karuzele: palec, mysz, strzałki
  d.querySelectorAll('[data-car]').forEach(function(c){
    var t=c.querySelector('.car-t'),p=c.querySelector('.car-p'),n=c.querySelector('.car-x'),cnt=c.querySelector('.car-c');
    var items=t.children;
    function step(){var f=items[0];if(!f)return t.clientWidth;var g=parseFloat(getComputedStyle(t).columnGap)||0;return f.getBoundingClientRect().width+g;}
    function upd(){
      var max=t.scrollWidth-t.clientWidth-2;
      if(p)p.disabled=t.scrollLeft<=2;
      if(n)n.disabled=t.scrollLeft>=max;
      var per=Math.max(1,Math.round(t.clientWidth/step()));
      var i=Math.min(items.length,Math.round(t.scrollLeft/step())+per);
      if(cnt)cnt.textContent=i+' / '+items.length;
      c.querySelector('.car-n').style.visibility=(max<=2)?'hidden':'visible';
    }
    if(p)p.addEventListener('click',function(){t.scrollBy({left:-step()*Math.max(1,Math.floor(t.clientWidth/step())),behavior:'smooth'});});
    if(n)n.addEventListener('click',function(){t.scrollBy({left:step()*Math.max(1,Math.floor(t.clientWidth/step())),behavior:'smooth'});});
    t.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true});
    window.addEventListener('resize',upd);
    upd();
    // przeciąganie myszą
    var down=false,sx=0,sl=0,moved=false;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=t.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;t.classList.add('drag');}t.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;setTimeout(function(){t.classList.remove('drag');},0);
      if(moved){var s=step();t.scrollTo({left:Math.round(t.scrollLeft/s)*s,behavior:'smooth'});}});
    t.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
    t.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  // filtr długich cenników
  d.querySelectorAll('.tbl[data-filter]').forEach(function(w){
    var box=d.createElement('div');box.className='tbl-filter';
    var inp=d.createElement('input');inp.type='search';inp.placeholder='Szukaj w cenniku, np. TSH';inp.setAttribute('aria-label','Szukaj w cenniku');
    box.appendChild(inp);w.parentNode.insertBefore(box,w);
    var rows=w.querySelectorAll('tbody tr');
    inp.addEventListener('input',function(){
      var q=inp.value.trim().toLowerCase();
      rows.forEach(function(r){r.style.display=(!q||r.textContent.toLowerCase().indexOf(q)>-1)?'':'none';});
    });
  });

  // lightbox
  var lb=d.getElementById('lb');
  var links=[].slice.call(d.querySelectorAll('a[data-lb]'));
  if(lb&&links.length){
    var im=lb.querySelector('img'),cur=0,group=[];
    function show(i){cur=(i+group.length)%group.length;im.src=group[cur].getAttribute('href');var a=group[cur].querySelector('img');im.alt=a?a.alt:'';}
    links.forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var par=a.closest('.gal,.car-t,.prose')||d.body;
        group=[].slice.call(par.querySelectorAll('a[data-lb]'));
        show(group.indexOf(a));lb.hidden=false;lb.querySelector('.lb-x').focus();
      });
    });
    lb.querySelector('.lb-x').addEventListener('click',function(){lb.hidden=true;});
    lb.querySelector('.lb-p').addEventListener('click',function(){show(cur-1);});
    lb.querySelector('.lb-n').addEventListener('click',function(){show(cur+1);});
    lb.addEventListener('click',function(e){if(e.target===lb)lb.hidden=true;});
    d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')lb.hidden=true;if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);});
    var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));});
  }

  // formularz pokazowy
  d.querySelectorAll('.form').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();var ok=f.querySelector('.form-ok');if(ok)ok.hidden=false;});
  });

  // cookies
  var ck=d.getElementById('ck'),K='nasmed_ck';
  function get(){try{return localStorage.getItem(K);}catch(e){return null;}}
  function set(v){try{localStorage.setItem(K,v);}catch(e){}}
  if(ck){
    if(!get())ck.hidden=false;
    ck.querySelectorAll('[data-ck]').forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-ck'));ck.hidden=true;});});
    d.querySelectorAll('.ck-open').forEach(function(b){b.addEventListener('click',function(){ck.hidden=false;});});
  }
})();
