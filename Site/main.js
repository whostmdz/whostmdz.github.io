function randint(max){return Math.floor(Math.random()*max)}
function clamp(v,min,max){return Math.min(Math.max(min,v),max)}

/* Random fact refresher */
let index_old=-1;
function refreshlink(){
    const data = [
      ["Le premier bug informatique était un papillon retrouvé coincé dans un calculateur en 1947.", "https://fr.wikipedia.org/wiki/Grace_Hopper#Origine_du_terme_bug"],
      ["La première souris d’ordinateur a été inventée en 1964 par Douglas Engelbart, en bois.", "https://fr.wikipedia.org/wiki/Souris_d%27ordinateur"],
      ["Le langage Python a été créé par Guido van Rossum en 1989 et nommé d'après Monty Python.", "https://fr.wikipedia.org/wiki/Python_(langage)"],
      ["Le système d’exploitation Linux a été créé en 1991 par Linus Torvalds, un étudiant finlandais.", "https://fr.wikipedia.org/wiki/Linux"],
      ["Le terme ‘cloud computing’ est popularisé dans les années 2000 avec le développement des serveurs distants.", "https://fr.wikipedia.org/wiki/Informatique_en_nuage"],
      ["Le CAPTCHA (test de Turing) a été inventé pour différencier humains et robots sur internet.", "https://fr.wikipedia.org/wiki/CAPTCHA"],
      ["Le protocole HTTP/3 est basé sur QUIC, un protocole réseau développé par Google pour accélérer internet.", "https://fr.wikipedia.org/wiki/HTTP/3"],
      ["L'algorithme RSA, fondé sur la difficulté de la factorisation, sécurise la majorité des communications chiffrées.", "https://fr.wikipedia.org/wiki/Algorithme_RSA"],
      ["La programmation orientée objet a été popularisée par Smalltalk, développé dans les années 1970.", "https://fr.wikipedia.org/wiki/Programmation_orient%C3%A9e_objet"],
      ["Le Lorem Ipsum utilisé en graphisme vient d’un texte classique latin de Cicéron.", "https://fr.wikipedia.org/wiki/Lorem_ipsum"]
    ];

    const link=document.querySelector("#randlink");
    let index=randint(data.length);
    while(index_old===index){index=randint(data.length)}
    index_old=index;
    const c=data[index];
    link.innerHTML=c[0];
    link.href=c[1];
}

/* Scramble typing title */
function typing(){
    const phrases=["Thomas Diemoz","Étudiant","Dev Python","En train de dormir","Linux enjoyer","Open to stage"];
    const main=document.querySelector("#changing-title");
    const letters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let text=main.textContent;
    setInterval(()=>{
        let iterations=0;
        const interval=setInterval(()=>{
            main.textContent=text.split("").map((ch,i)=>
                i<iterations? text[i] : letters[(Math.random()*letters.length)|0]
            ).join("");
            if(iterations>=text.length) clearInterval(interval);
            iterations+=1/3;
        },40);
        let old=text;
        while(old===text){
            text=phrases[(Math.random()*phrases.length)|0];
        }
        document.title=text+" — Portfolio";
    },5000);
}

/* Pointer-following blob */
function follow(e){
    const blob=document.getElementById("blob");
    blob.style.transform=`translate(${e.clientX-50}px, ${e.clientY-50}px)`;
}

/* Slowly rotate --theme-color hue */
function colors(){
    setInterval(()=>{
        const style=document.documentElement.style;
        const c=getComputedStyle(document.body).getPropertyValue("--theme-color");
        let [h,s,l]=c.substring(4,c.length-1).split(", ");
        [h,s,l]=[(parseInt(h)+1)%360,parseInt(s),l];
        let hsl=`hsl(${h}, ${s}%, ${l})`;
        style.setProperty("--theme-color", hsl);
    },100);
}

/* Theme toggle */
function toggle_theme(){
    const style=document.documentElement.style;
    const theme=getComputedStyle(document.body).getPropertyValue("--theme").trim();
    localStorage.setItem("theme", theme == 0 ? "light" : "dark");
    window.location.reload();
}

/* Wire events and init */
document.addEventListener("mousemove", follow);
document.addEventListener("DOMContentLoaded",()=>{
    const refresh=document.querySelector("#refreshlink");
    refresh.addEventListener("click", e=>{
        e.preventDefault();
        refreshlink();
    });
    const theme=document.querySelector("#theme-toggle");
    theme.addEventListener("click", toggle_theme);

    typing();
    refreshlink();
    colors();
});

