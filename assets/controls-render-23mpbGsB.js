function e(e,t,n,r=()=>!1){if(!t)return;let i={up:`▲`,down:`▼`,left:`<span class="ctrl-arrow-left">▲</span>`,right:`<span class="ctrl-arrow-right">▲</span>`},a=e=>`<button class="ctrl-btn" data-dir="${e}">${i[e]}</button>`;switch(e){case`invt`:t.innerHTML=`<div class="ctrl-invt">
        <div class="ctrl-noop"></div>${a(`up`)}<div class="ctrl-noop"></div>
        ${a(`left`)}${a(`down`)}${a(`right`)}</div>`;break;case`linear`:t.innerHTML=`<div class="ctrl-linear">
        ${a(`left`)}${a(`down`)}<div class="ctrl-linear-gap"></div>${a(`up`)}${a(`right`)}</div>`;break;case`split`:t.innerHTML=`<div class="ctrl-split">
        <div class="ctrl-split-vert">${a(`up`)}${a(`down`)}</div>
        <div class="ctrl-split-horiz">${a(`left`)}${a(`right`)}</div>
      </div>`;break;case`split-lefty`:t.innerHTML=`<div class="ctrl-split">
        <div class="ctrl-split-horiz">${a(`left`)}${a(`right`)}</div>
        <div class="ctrl-split-vert">${a(`up`)}${a(`down`)}</div>
      </div>`;break;default:t.innerHTML=`<div class="ctrl-cross">
        <div class="ctrl-noop"></div>${a(`up`)}<div class="ctrl-noop"></div>
        ${a(`left`)}<div class="ctrl-hub"></div>${a(`right`)}
        <div class="ctrl-noop"></div>${a(`down`)}<div class="ctrl-noop"></div></div>`}t.querySelectorAll(`[data-dir]`).forEach(e=>{e.addEventListener(`pointerdown`,t=>{t.preventDefault(),r()||n(e.dataset.dir)})});let o=t;o._padDelegation&&t.removeEventListener(`pointerdown`,o._padDelegation),o._padDelegation=e=>{if(e.target.closest(`[data-dir]`))return;e.preventDefault();let i=[...t.querySelectorAll(`[data-dir]`)],a=1/0,o=null;for(let t of i){let n=t.getBoundingClientRect(),r=Math.hypot(n.left+n.width/2-e.clientX,n.top+n.height/2-e.clientY);r<a&&(a=r,o=t)}o&&a<65&&!r()&&(o.classList.add(`ctrl-btn--flash`),setTimeout(()=>o.classList.remove(`ctrl-btn--flash`),120),n(o.dataset.dir))},t.addEventListener(`pointerdown`,o._padDelegation)}export{e as t};