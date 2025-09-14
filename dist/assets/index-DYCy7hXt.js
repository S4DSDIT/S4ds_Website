import{Client as y,Databases as p,Query as l}from"https://cdn.jsdelivr.net/npm/appwrite@11.0.0/dist/esm/index.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const g=new y;g.setEndpoint("https://cloud.appwrite.io/v1").setProject("YOUR_PROJECT_ID");const d=new p(g),h="6543b355227d86f78082",E="events",L="gallery",b="team",x="sponsors";class w{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.particles=[],this.animationId=null,this.boundResize=this.resizeCanvas.bind(this),this.grid=[],this.cellSize=120,this.resizeCanvas(),this.animate(),window.addEventListener("resize",this.boundResize)}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,this.gridWidth=Math.ceil(this.canvas.width/this.cellSize),this.gridHeight=Math.ceil(this.canvas.height/this.cellSize),this.createParticles()}createParticles(){const e=["{}","[]","()","Σ","λ","π","μ","AI","ML","DS","Py","01","=>","</>","db","SQL","tf","pt","viz","API","git","data"],t=Math.floor(this.canvas.width*this.canvas.height/25e3);this.particles=[];for(let n=0;n<t;n++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,size:Math.random()*1.5+.5,text:e[Math.floor(Math.random()*e.length)],speedX:(Math.random()-.5)*.5,speedY:(Math.random()-.5)*.5,opacity:Math.random()*.5+.2,pulse:Math.random()*Math.PI*2})}updateAndGridParticles(){this.grid=Array.from({length:this.gridHeight},()=>Array.from({length:this.gridWidth},()=>[])),this.particles.forEach(e=>{e.x+=e.speedX,e.y+=e.speedY,e.pulse+=.02,e.x>this.canvas.width&&(e.x=0),e.x<0&&(e.x=this.canvas.width),e.y>this.canvas.height&&(e.y=0),e.y<0&&(e.y=this.canvas.height),e.currentOpacity=e.opacity+Math.sin(e.pulse)*.2;const t=Math.floor(e.x/this.cellSize),n=Math.floor(e.y/this.cellSize);t>=0&&t<this.gridWidth&&n>=0&&n<this.gridHeight&&this.grid[n][t].push(e)})}drawParticles(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.shadowBlur=10,this.ctx.shadowColor="rgba(255, 102, 0, 0.5)",this.particles.forEach(e=>{this.ctx.font=`${e.size*12}px 'Orbitron', monospace`,this.ctx.fillStyle=`rgba(255, 102, 0, ${e.currentOpacity})`,this.ctx.fillText(e.text,e.x,e.y)}),this.ctx.shadowBlur=0,this.drawConnections()}drawConnections(){this.ctx.lineWidth=1;for(let e=0;e<this.gridHeight;e++)for(let t=0;t<this.gridWidth;t++){const n=this.grid[e][t];for(let i=0;i<n.length;i++){const r=n[i];for(let o=i+1;o<n.length;o++)this.tryConnect(r,n[o]);t+1<this.gridWidth&&this.grid[e][t+1].forEach(o=>this.tryConnect(r,o)),e+1<this.gridHeight&&t-1>=0&&this.grid[e+1][t-1].forEach(o=>this.tryConnect(r,o)),e+1<this.gridHeight&&this.grid[e+1][t].forEach(o=>this.tryConnect(r,o)),e+1<this.gridHeight&&t+1<this.gridWidth&&this.grid[e+1][t+1].forEach(o=>this.tryConnect(r,o))}}}tryConnect(e,t){const n=e.x-t.x,i=e.y-t.y,r=Math.sqrt(n*n+i*i);r<this.cellSize&&(this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(t.x,t.y),this.ctx.strokeStyle=`rgba(255, 102, 0, ${.15*(1-r/this.cellSize)})`,this.ctx.stroke())}animate(){this.updateAndGridParticles(),this.drawParticles(),this.animationId=requestAnimationFrame(()=>this.animate())}destroy(){this.animationId&&cancelAnimationFrame(this.animationId),window.removeEventListener("resize",this.boundResize)}}class T{constructor(){this.navbar=document.getElementById("navbar"),this.navToggle=document.getElementById("nav-toggle"),this.navMenu=document.getElementById("nav-menu"),this.initializeNavigation()}initializeNavigation(){window.addEventListener("scroll",()=>{this.navbar.classList.toggle("scrolled",window.scrollY>50)}),this.navToggle.addEventListener("click",()=>{this.navMenu.classList.toggle("active"),this.navToggle.classList.toggle("active")}),document.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",n=>{n.preventDefault(),this.navMenu.classList.remove("active"),this.navToggle.classList.remove("active");const i=n.target.getAttribute("href"),r=document.querySelector(i);r&&window.scrollTo({top:r.offsetTop-this.navbar.offsetHeight,behavior:"smooth"})})})}}class m{constructor(){this.observerOptions={threshold:.1,rootMargin:"0px 0px -50px 0px"},this.initializeObserver()}initializeObserver(){const e=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&i.target.classList.add("fade-in")})},this.observerOptions);document.querySelectorAll(".event-card, .team-member, .sponsor-card, .visual-card, .stat-item, .contact-item, .gallery-item").forEach((n,i)=>{n.classList.add("loading"),setTimeout(()=>{e.observe(n)},i*50)})}}class C{constructor(){this.form=document.getElementById("contact-form"),this.form&&this.initializeForm()}initializeForm(){this.form.addEventListener("submit",e=>{e.preventDefault(),this.handleSubmit()})}handleSubmit(){const e=new FormData(this.form),t=Object.fromEntries(e.entries());if(!this.validateForm(t))return;const n=this.form.querySelector(".submit-btn"),i=n.innerHTML;n.innerHTML="<span>Sending...</span>",n.disabled=!0,setTimeout(()=>{n.innerHTML="<span>Message Sent!</span>",this.form.reset(),setTimeout(()=>{n.innerHTML=i,n.disabled=!1},2e3)},1500)}validateForm(e){const t=["firstName","lastName","email","subject","message"];for(let i of t)if(!e[i]||e[i].trim()==="")return this.showError(`Please fill in the ${i.replace(/([A-Z])/g," $1").toLowerCase()} field.`),!1;return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)?!0:(this.showError("Please enter a valid email address."),!1)}showError(e){let t=this.form.querySelector(".error-message");t||(t=document.createElement("div"),t.className="error-message",t.style.cssText=`
                color: #ff4444;
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 0.9rem;
            `,this.form.insertBefore(t,this.form.firstChild)),t.textContent=e,setTimeout(()=>{t.parentNode&&t.remove()},5e3)}}class M{constructor(){this.joinBtn=document.getElementById("join-btn"),this.learnMoreBtn=document.getElementById("learn-more-btn"),this.joinBtn&&this.learnMoreBtn&&this.initializeButtons()}initializeButtons(){this.joinBtn.addEventListener("click",()=>{document.getElementById("contact").scrollIntoView({behavior:"smooth"})}),this.learnMoreBtn.addEventListener("click",()=>{document.getElementById("about").scrollIntoView({behavior:"smooth"})})}}class S{constructor(){this.initializeHoverEffects()}initializeHoverEffects(){document.querySelectorAll(".event-card, .team-member, .sponsor-card").forEach(i=>{i.addEventListener("mouseenter",()=>{i.style.transition="all 0.3s ease"}),i.addEventListener("mouseleave",()=>{i.style.transition="all 0.3s ease"})}),document.querySelectorAll(".cta-button, .event-btn, .submit-btn").forEach(i=>{i.addEventListener("click",r=>{const o=document.createElement("span"),a=i.getBoundingClientRect(),c=Math.max(a.width,a.height),f=r.clientX-a.left-c/2,v=r.clientY-a.top-c/2;o.style.cssText=`
                    position: absolute;
                    width: ${c}px;
                    height: ${c}px;
                    left: ${f}px;
                    top: ${v}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `,i.style.position="relative",i.appendChild(o),setTimeout(()=>{o.remove()},600)})});const n=document.createElement("style");n.textContent=`
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `,document.head.appendChild(n)}}class z{constructor(){this.initializeTyping()}initializeTyping(){const e=document.querySelector(".hero-tagline");if(!e)return;const t=e.textContent;setTimeout(()=>{this.typeWriter(e,t,80)},1e3)}typeWriter(e,t,n=100){let i=0;e.innerHTML="";function r(){i<t.length&&(e.innerHTML+=t.charAt(i),i++,setTimeout(r,n))}r()}}class I{constructor(){this.initializeCounters()}initializeCounters(){const e=document.querySelectorAll(".stat-number"),t=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(this.animateCounter(i.target),t.unobserve(i.target))})},{threshold:.5});e.forEach(n=>{t.observe(n)})}animateCounter(e){const t=parseInt(e.textContent.replace(/\D/g,"")),n=e.textContent.replace(/\d/g,"");let i=0;const r=t/50,o=setInterval(()=>{i+=r,i>=t?(e.textContent=t+n,clearInterval(o)):e.textContent=Math.floor(i)+n},40)}}class H{constructor(){this.initializeEventCards()}initializeEventCards(){document.querySelectorAll(".event-btn").forEach(t=>{t.addEventListener("click",n=>{const r=n.target.closest(".event-card").querySelector("h3").textContent;this.handleEventAction(t,r)})})}handleEventAction(e,t){const n=e.textContent;e.textContent="Processing...",e.disabled=!0,setTimeout(()=>{n.includes("Register")?(e.textContent="Registered!",e.style.background="#28a745",e.style.borderColor="#28a745"):e.textContent="Info Sent!",setTimeout(()=>{e.textContent=n,e.disabled=!1,e.style.background="",e.style.borderColor=""},2e3)},1e3)}}class A{constructor(){this.initializeTeamCards()}initializeTeamCards(){document.querySelectorAll(".team-member").forEach(t=>{t.addEventListener("mouseenter",()=>{t.classList.add("glow-animation")}),t.addEventListener("mouseleave",()=>{t.classList.remove("glow-animation")})})}}class O{constructor(){this.initializeScrollEffects()}initializeScrollEffects(){this.createScrollProgress()}createScrollProgress(){const e=document.createElement("div");e.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6600, #ff8533);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        `,document.body.appendChild(e),window.addEventListener("scroll",()=>{const t=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;e.style.width=t+"%"})}}class P{constructor(){this.initializeLoading()}initializeLoading(){const e=document.getElementById("preloader");window.addEventListener("load",()=>{e&&setTimeout(()=>{e.classList.add("hidden")},500);const t=document.querySelectorAll(".loading"),n=800;t.forEach((i,r)=>{setTimeout(()=>{i.classList.add("loaded")},n+r*100)})})}}class B{constructor(){this.initializeCursorEffects()}initializeCursorEffects(){const e=document.createElement("div");e.style.cssText=`
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 102, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `,document.body.appendChild(e);let t=0,n=0;document.addEventListener("mousemove",r=>{t=r.clientX,n=r.clientY,e.style.left=t-10+"px",e.style.top=n-10+"px"}),document.querySelectorAll("button, .nav-link, .social-link, .event-card, .team-member, .sponsor-card, .gallery-item").forEach(r=>{r.addEventListener("mouseenter",()=>{e.style.transform="scale(2)",e.style.background="rgba(255, 102, 0, 0.5)"}),r.addEventListener("mouseleave",()=>{e.style.transform="scale(1)",e.style.background="rgba(255, 102, 0, 0.3)"})})}}async function D(){const s=document.querySelector(".events-grid");if(s){s.innerHTML='<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading events...</div>';try{const t=(await d.listDocuments(h,E,[l.orderDesc("date")])).documents;if(t.length===0){s.innerHTML='<div style="color:#666;text-align:center;grid-column: 1 / -1;">No events found.</div>';return}s.innerHTML="",t.forEach(n=>{const i=new Date(n.date),r=i.toLocaleString("default",{month:"short"}).toUpperCase(),o=i.getDate(),a=`
                <div class="event-card loading">
                    <div class="event-date">
                        <span class="month">${r}</span>
                        <span class="day">${o}</span>
                    </div>
                    <div class="event-content">
                        <h3>${n.title}</h3>
                        <p>${n.description}</p>
                        <div class="event-tags">
                            <span class="tag">Event</span>
                        </div>
                        <button class="event-btn">Learn More</button>
                    </div>
                </div>
            `;s.insertAdjacentHTML("beforeend",a)}),new m,new H}catch(e){console.error("Error loading events:",e),s.innerHTML='<div class="error" style="grid-column: 1 / -1;">Error loading events. Please try again later.</div>'}}}async function $(){const s=document.querySelector(".gallery-grid");if(s){s.innerHTML='<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading gallery...</div>';try{const t=(await d.listDocuments(h,L,[l.orderDesc("$createdAt")])).documents;if(t.length===0){s.innerHTML='<div style="color:#666;text-align:center;grid-column: 1 / -1;">No images found.</div>';return}s.innerHTML="",t.forEach(n=>{const i=`
                <div class="gallery-item loading">
                    <img src="${n.imageUrl}" alt="${n.caption}">
                    <div class="gallery-item-overlay">
                        <h4>${n.caption}</h4>
                    </div>
                </div>
            `;s.insertAdjacentHTML("beforeend",i)}),new m}catch(e){console.error("Error loading gallery:",e),s.innerHTML='<div class="error" style="grid-column: 1 / -1;">Error loading gallery. Please try again later.</div>'}}}async function q(){const s=document.querySelector(".team-grid");if(s){s.innerHTML='<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading team...</div>';try{const t=(await d.listDocuments(h,b,[l.orderDesc("$createdAt")])).documents;if(t.length===0){s.innerHTML='<div style="color:#666;text-align:center;grid-column: 1 / -1;">No team members found.</div>';return}s.innerHTML="",t.forEach(n=>{const i=`
                <div class="team-member loading">
                    <div class="member-photo">
                        <img src="${n.imageUrl}" alt="${n.name}">
                        <div class="member-overlay">
                            <div class="social-links">
                                <a href="#" class="social-icon">💼</a>
                                <a href="#" class="social-icon">🐙</a>
                            </div>
                        </div>
                    </div>
                    <div class="member-info">
                        <h4>${n.name}</h4>
                        <p class="member-role">${n.role}</p>
                    </div>
                </div>
            `;s.insertAdjacentHTML("beforeend",i)}),new m,new A}catch(e){console.error("Error loading team:",e),s.innerHTML='<div class="error" style="grid-column: 1 / -1;">Error loading team. Please try again later.</div>'}}}async function k(){const s=document.querySelector(".sponsors-grid");if(s){s.innerHTML='<div style="color:#999;text-align:center;grid-column: 1 / -1;">Loading sponsors...</div>';try{const t=(await d.listDocuments(h,x,[l.orderDesc("$createdAt")])).documents;if(t.length===0){s.innerHTML='<div style="color:#666;text-align:center;grid-column: 1 / -1;">No sponsors found.</div>';return}s.innerHTML="",t.forEach(n=>{const i=`
                <div class="sponsor-card loading">
                    <img src="${n.imageUrl}" alt="${n.name}">
                    <h3>${n.name}</h3>
                </div>
            `;s.insertAdjacentHTML("beforeend",i)}),new m}catch(e){console.error("Error loading sponsors:",e),s.innerHTML='<div class="error" style="grid-column: 1 / -1;">Error loading sponsors. Please try again later.</div>'}}}document.addEventListener("DOMContentLoaded",async()=>{new T,new S,new P,new B,new O,new M,new z,new I,new C;const s=document.getElementById("particles-canvas");s&&new w(s),await D(),await q(),await k(),await $()});let u=!1;function N(){u||(requestAnimationFrame(()=>{u=!1}),u=!0)}window.addEventListener("scroll",N);document.addEventListener("keydown",s=>{if(s.key==="Escape"){const e=document.getElementById("nav-menu"),t=document.getElementById("nav-toggle");e.classList.contains("active")&&(e.classList.remove("active"),t.classList.remove("active"))}});document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(e=>{e.addEventListener("focus",()=>{e.style.outline="2px solid #ff6600",e.style.outlineOffset="2px"}),e.addEventListener("blur",()=>{e.style.outline="",e.style.outlineOffset=""})})});
