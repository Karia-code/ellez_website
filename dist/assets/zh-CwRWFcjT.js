import"./style-_FeZC0s8.js";/* empty css                 */import{q as r,c as d,d as i,o as l,l as u,g as p}from"./firebase-DWVmYYlG.js";function m(a){try{if(!a)return"";const n=typeof a.toDate=="function"?a.toDate():new Date(a),e=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0");return`${e}.${t}.${c}`}catch{return""}}function h(a){const n=document.querySelector(".update-list");if(n){if(n.innerHTML="",!a.length){const t=(document.documentElement.lang||"").toLowerCase().includes("zh"),c=t?"暫無更新":"No updates yet",s=t?"我們會在這裡分享產品消息與想法，敬請期待。":"We’ll share product news and thoughts here. Check back soon.";n.innerHTML=`
      <div class="update-item">
        <span class="update-date">—</span>
        <h3>${c}</h3>
        <p>${s}</p>
      </div>`;return}a.forEach(e=>{const t=document.createElement("div");t.className="update-item";const c=e.dateStr||m(e.createdAt),s=e.excerpt&&String(e.excerpt).trim()||(e.content?String(e.content).replace(/\s+/g," ").trim().slice(0,200):"");t.innerHTML=`
      <span class="update-date">${c||""}</span>
      <h3>${e.title||"Untitled"}</h3>
      ${s?`<p>${s}</p>`:""}
    `,n.appendChild(t)})}}async function o(){try{const a=r(d(i,"updates"),l("createdAt","desc"),u(3)),e=(await p(a)).docs.map(t=>({id:t.id,...t.data()}));h(e)}catch(a){console.error("Failed to load updates:",a);const n=document.querySelector(".update-list");if(n){const t=(document.documentElement.lang||"").toLowerCase().includes("zh"),c=t?"目前無法載入更新":"Updates unavailable",s=t?"我們暫時無法取得最新更新，請稍後再試。":"We couldn’t fetch updates right now. Please try again later.";n.innerHTML=`
        <div class="update-item">
          <span class="update-date">—</span>
          <h3>${c}</h3>
          <p>${s}</p>
        </div>`}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o):o();
