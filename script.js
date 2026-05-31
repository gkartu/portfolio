const heroBlop = document.querySelector(".hero-img");
const bubble = document.getElementById("dialogue");
const bubbleText = document.getElementById("dialogue-text");

const dialogueLines = [
  "Salut voyageur...",
  "Bienvenue dans mon portfolio.",
  "Ici tout est animé, interactif et vivant.",
  "Moi aussi je suis vivant.",
  "j'ai une âme.",
];

let typing = false;

function typeText(text, callback){

  bubbleText.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {

    bubbleText.innerHTML += text[i];
    i++;

    if(i >= text.length){
      clearInterval(interval);
      callback();
    }

  }, 40);
}

function showDialogue(){

  if(typing) return;
  typing = true;

  bubble.classList.add("show");

  let index = 0;

  function nextLine(){

    if(index >= dialogueLines.length){
      
      // pause finale 4 sec
      setTimeout(() => {

        bubble.classList.remove("show");

        setTimeout(() => {
          typing = false;
          bubbleText.innerHTML = "";
        }, 300);

      }, 4000);

      return;
    }

    typeText(dialogueLines[index], () => {

      setTimeout(() => {
        index++;
        nextLine();
      }, 800);

    });
  }

  nextLine();
}

heroBlop.addEventListener("click", showDialogue);

/* =========================================================
   PIXEL CURSOR
========================================================= */

const cursor = document.querySelector(".pixel-cursor");

let cursorMouseX = window.innerWidth / 2;
let cursorMouseY = window.innerHeight / 2;

let cursorCurrentX = cursorMouseX;
let cursorCurrentY = cursorMouseY;

let cursorVelocityX = 0;
let cursorVelocityY = 0;

window.addEventListener("mousemove", (e) => {

  cursorMouseX = e.clientX;
  cursorMouseY = e.clientY;

  cursorVelocityX = cursorMouseX - cursorCurrentX;
  cursorVelocityY = cursorMouseY - cursorCurrentY;

  createTrail(
    cursorMouseX,
    cursorMouseY,
    cursorVelocityX,
    cursorVelocityY
  );
});

function animateCursor(){

  cursorCurrentX += (cursorMouseX - cursorCurrentX) * 0.22;
  cursorCurrentY += (cursorMouseY - cursorCurrentY) * 0.22;

  const speed = Math.sqrt(
    cursorVelocityX * cursorVelocityX +
    cursorVelocityY * cursorVelocityY
  );

  const stretch = Math.min(speed * 0.15, 18);

  cursor.style.transform = `
    translate(${cursorCurrentX}px, ${cursorCurrentY}px)
    rotate(${Math.atan2(cursorVelocityY, cursorVelocityX)}rad)
    scaleX(${1 + stretch * 0.04})
    scaleY(${1 - stretch * 0.02})
  `;

  cursorVelocityX *= 0.82;
  cursorVelocityY *= 0.82;

  requestAnimationFrame(animateCursor);
}

animateCursor();

function createTrail(x, y, vx, vy){

  const trail = document.createElement("div");
  trail.className = "pixel-trail";

  document.body.appendChild(trail);

  const speed = Math.sqrt(vx * vx + vy * vy);

  trail.style.left = x + "px";
  trail.style.top = y + "px";

  trail.style.width = `${6 + speed * 0.08}px`;
  trail.style.height = `${6 + speed * 0.08}px`;

  trail.style.opacity = Math.min(speed * 0.03, 0.9);

  gsap.to(trail, {
    opacity: 0,
    scale: 0.2,
    duration: 0.35,
    ease: "power2.out",
    onComplete: () => trail.remove()
  });
}

window.addEventListener("mousedown", (e) => {

  cursor.style.width = "14px";
  cursor.style.height = "14px";

  const click = document.createElement("div");
  click.className = "pixel-click";

  click.style.left = e.clientX + "px";
  click.style.top = e.clientY + "px";

  document.body.appendChild(click);

  setTimeout(() => {
    click.remove();
  }, 400);
});

window.addEventListener("mouseup", () => {
  cursor.style.width = "8px";
  cursor.style.height = "8px";
});

/* =========================================================
   GSAP
========================================================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   PENCIL 3D
========================================================= */

const canvas = document.querySelector("#pencil3d");

const sceneP = new THREE.Scene();

const cameraP = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
cameraP.position.z = 3;

const rendererP = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

rendererP.setSize(180, 180);
rendererP.setPixelRatio(window.devicePixelRatio);

sceneP.add(new THREE.AmbientLight(0xffffff, 0.7));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(3, 3, 3);
sceneP.add(dirLight);

const pencil = new THREE.Group();
sceneP.add(pencil);

const whiteMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.4,
  metalness: 0.1
});

const blackMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.6,
  metalness: 0.0
});

const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 1.6, 32),
  whiteMat
);

const tip = new THREE.Mesh(
  new THREE.ConeGeometry(0.07, 0.25, 32),
  blackMat
);

tip.position.y = 0.9;
body.add(tip);

const eraser = new THREE.Mesh(
  new THREE.CylinderGeometry(0.055, 0.055, 0.25, 32),
  blackMat
);

eraser.position.y = -0.9;
body.add(eraser);

pencil.add(body);

pencil.rotation.z = -0.5;
pencil.rotation.x = 0.6;

/* mouse pencil */

let pencilMouseX = 0;
let pencilMouseY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

let targetRotX = 0;
let targetRotY = 0;

let rotX = pencil.rotation.x;
let rotY = pencil.rotation.y;

const pencilCanvas = document.querySelector("#pencil3d");

pencilCanvas.style.cursor = "grab";

pencilCanvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  pencilCanvas.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  pencilCanvas.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  targetRotY += dx * 0.005;
  targetRotX += dy * 0.005;

  startX = e.clientX;
  startY = e.clientY;
});

function animatePencil() {

  requestAnimationFrame(animatePencil);

  const t = performance.now() * 0.001;
   
    // inertie (smooth follow)
  rotX += (targetRotX - rotX) * 0.08;
  rotY += (targetRotY - rotY) * 0.08;

  pencil.rotation.x = rotX;
  pencil.rotation.y = rotY;
 

  pencil.rotation.z = -0.5 + Math.sin(t * 2) * 0.05;

  

  rendererP.render(sceneP, cameraP);
}

animatePencil();

/* =========================================================
   HERO
========================================================= */

const hero = document.querySelector(".hero-hover");

hero.addEventListener("mousemove", (e) => {

  const rect = hero.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  hero.style.setProperty("--x", `${x}%`);
  hero.style.setProperty("--y", `${y}%`);
});

hero.addEventListener("mouseleave", () => {

  hero.style.setProperty("--x", "50%");
  hero.style.setProperty("--y", "50%");
});

/* =========================================================
   SPLIT TEXT
========================================================= */

function splitToSpans(selector) {

  document.querySelectorAll(selector).forEach(el => {

    const text = el.innerText;

    el.innerHTML = "";

    text.split("").forEach(char => {

      const span = document.createElement("span");

      span.className = "wave-char";

      if (char === " ") {
        span.innerHTML = "&nbsp;";
        span.style.width = "0.35em";
      } else {
        span.innerText = char;
      }

      el.appendChild(span);
    });
  });
}

splitToSpans(".wave-text");

/* =========================================================
   TEXT WAVE
========================================================= */

const cards = document.querySelector(".text-card");

cards.addEventListener("mousemove", (e) => {

  const chars = cards.querySelectorAll(".wave-char");

  const rect = cards.getBoundingClientRect();

  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  chars.forEach((char) => {

    const box = char.getBoundingClientRect();

    const cx = box.left - rect.left + box.width / 2;
    const cy = box.top - rect.top + box.height / 2;

    const dx = cx - mx;
    const dy = cy - my;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const radius = 50;

    if (dist < radius) {

      const force = (1 - dist / radius);

      const offsetX = dx * force * 0.4;
      const offsetY = dy * force * 0.4;

      char.style.transform =
        `translate(${offsetX}px, ${offsetY}px)`;

    } else {

      char.style.transform =
        `translate(0px,0px)`;
    }
  });
});

cards.addEventListener("mouseleave", () => {

  cards.querySelectorAll(".wave-char").forEach(c => {
    c.style.transform = `translate(0px,0px)`;
  });
});

/* =========================================================
   ABOUT CARDS
========================================================= */

/* =========================================================
   ADVANCED ABOUT SECTION
========================================================= */

const aboutSection =
  document.querySelector("#about");

const aboutCards =
  document.querySelectorAll(".card");

const imageCard =
  document.querySelector(".img-card");

const textCard =
  document.querySelector(".text-card");

/* INTRO SCROLL */

gsap.fromTo(

  aboutSection.querySelector("h2"),

  {
    y: 120,
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.8
  },

  {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,

    duration: 1.4,

    ease: "power4.out",

    scrollTrigger: {
      trigger: aboutSection,
      start: "top 75%"
    }
  }
);

/* =========================================================
   CARDS CINEMATIC (REPLAY ON SCROLL)
========================================================= */

aboutCards.forEach((card, index) => {

  gsap.fromTo(card,

    {
      y: 220,
      rotateX: 70,
      rotateY: index % 2 ? -15 : 15,
      scale: 0.7,
      opacity: 0,
      filter: "blur(10px)"
    },

    {
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",

      duration: 1.5,
      ease: "expo.out",

      scrollTrigger: {
        trigger: card,
        start: "top 85%",

        // ⭐ IMPORTANT : permet de rejouer à chaque passage
        toggleActions: "play reverse play reverse",
      }
    }
  );
});

/* IMAGE CARD INTERACTIVE */

imageCard.addEventListener("mousemove", (e) => {

  const rect = imageCard.getBoundingClientRect();

  const x =
    (e.clientX - rect.left) / rect.width - 0.5;

  const y =
    (e.clientY - rect.top) / rect.height - 0.5;

  gsap.to(imageCard, {

    rotateY: x * 25,
    rotateX: -y * 25,

    scale: 1.04,

    duration: 0.5,

    ease: "power3.out"
  });

  gsap.to(imageCard.querySelector("img"), {

    scale: 1.12,

    x: x * 20,
    y: y * 20,

    duration: 0.6,

    ease: "power3.out"
  });
});

/* RESET IMAGE CARD */

imageCard.addEventListener("mouseleave", () => {

  gsap.to(imageCard, {

    rotateX: 0,
    rotateY: 0,

    scale: 1,

    duration: 1,

    ease: "elastic.out(1,0.5)"
  });

  gsap.to(imageCard.querySelector("img"), {

    scale: 1,
    x: 0,
    y: 0,

    duration: 1,

    ease: "power3.out"
  });
});

/* TEXT CARD MAGNETIC */

textCard.addEventListener("mousemove", (e) => {

  const rect = textCard.getBoundingClientRect();

  const x =
    (e.clientX - rect.left) / rect.width - 0.5;

  const y =
    (e.clientY - rect.top) / rect.height - 0.5;

  gsap.to(textCard, {

    x: x * 15,
    y: y * 15,

    rotateY: x * 8,
    rotateX: -y * 8,

    duration: 0.5,

    ease: "power3.out"
  });
});

/* RESET TEXT */

textCard.addEventListener("mouseleave", () => {

  gsap.to(textCard, {

    x: 0,
    y: 0,

    rotateX: 0,
    rotateY: 0,

    duration: 1,

    ease: "elastic.out(1,0.5)"
  });
});

/* PARALLAX */

gsap.to(".img-card img", {

  yPercent: -12,

  ease: "none",

  scrollTrigger: {
    trigger: "#about",
    scrub: true
  }
});
/* =========================================================
   HERO IMAGE INTERACTIVE FULLSCREEN
========================================================= */

const heroImg = document.querySelector(".hero-img");
const heroWrap = document.querySelector(".hero-img-wrap");
const homeSection = document.querySelector("#home");

/* =========================================================
   IMAGES
========================================================= */

const heroFrames = {

  center: "image/haut.png",

  top: "image/haut.png",
  topRight: "image/haut droite.png",
  right: "image/droite.png",
  bottomRight: "image/bas droite.png",
  bottom: "image/bas.png",
  bottomLeft: "image/bas gauche.png",
  left: "image/gauche.png",
  topLeft: "image/haut gauche.png",

  gif: "image/blop.gif"
};

/* image par défaut */
heroImg.src = heroFrames.center;



/* =========================================================
   STATES
========================================================= */
/* mode gif lock */
let gifLocked = false;

let heroMouseX = 0;
let heroMouseY = 0;

let heroCurrentX = 0;
let heroCurrentY = 0;

/* =========================================================
   FULL HOME MOUSE TRACKING
========================================================= */

homeSection.addEventListener("mousemove", (e) => {

  const rect = heroWrap.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;

/* =========================================================
   IMAGE DIRECTION
========================================================= */

  if (!gifLocked) {

    const angle =
      Math.atan2(dy, dx) * 180 / Math.PI;

    let direction = "center";

    if (angle >= -22.5 && angle < 22.5) {
      direction = "right";
    }

    else if (angle >= 22.5 && angle < 67.5) {
      direction = "bottomRight";
    }

    else if (angle >= 67.5 && angle < 112.5) {
      direction = "bottom";
    }

    else if (angle >= 112.5 && angle < 157.5) {
      direction = "bottomLeft";
    }

    else if (angle >= 157.5 || angle < -157.5) {
      direction = "left";
    }

    else if (angle >= -157.5 && angle < -112.5) {
      direction = "topLeft";
    }

    else if (angle >= -112.5 && angle < -67.5) {
      direction = "top";
    }

    else if (angle >= -67.5 && angle < -22.5) {
      direction = "topRight";
    }

    heroImg.src = heroFrames[direction];
  }

/* =========================================================
   3D FOLLOW EFFECT
========================================================= */

  heroMouseX =
    (e.clientX / window.innerWidth) - 0.5;

  heroMouseY =
    (e.clientY / window.innerHeight) - 0.5;
});

/* =========================================================
   SMOOTH FOLLOW
========================================================= */

function animateHero3D(){

  heroCurrentX +=
    (heroMouseX - heroCurrentX) * 0.08;

  heroCurrentY +=
    (heroMouseY - heroCurrentY) * 0.08;

  const rotateY = heroCurrentX * 30;
  const rotateX = -heroCurrentY * 30;

  const moveX = heroCurrentX * 40;
  const moveY = heroCurrentY * 25;

  heroImg.style.transform = `
    translate3d(${moveX}px, ${moveY}px, 0)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.03)
  `;

  requestAnimationFrame(animateHero3D);
}

animateHero3D();

/* =========================================================
   GIF HOVER
========================================================= */

heroWrap.addEventListener("mouseenter", () => {

  if (gifLocked) return;

  heroImg.src = heroFrames.gif;

  gsap.to(heroImg, {
    scale: 1.08,
    duration: 0.25
  });
});

/* =========================================================
   RESET
========================================================= */

heroWrap.addEventListener("mouseleave", () => {

  if (gifLocked) return;

  heroImg.src = heroFrames.center;

  gsap.to(heroImg, {
    scale: 1,
    duration: 0.3
  });
});

/* =========================================================
   CLICK = GIF LOCK
========================================================= */

heroWrap.addEventListener("click", () => {

  gifLocked = !gifLocked;

  if (gifLocked) {

    heroImg.src = heroFrames.gif;

    gsap.to(heroImg, {
      scale: 1.12,
      duration: 0.25
    });

  } else {

    heroImg.src = heroFrames.center;

    gsap.to(heroImg, {
      scale: 1,
      duration: 0.25
    });
  }
});

/* =========================================================
   NAV GLITCH
========================================================= */

const letters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";

function glitchText(element, originalText) {

  let iterations = 0;

  const interval = setInterval(() => {

    element.innerText = originalText
      .split("")
      .map((letter, index) => {

        if (index < iterations) {
          return originalText[index];
        }

        return letters[
          Math.floor(Math.random() * letters.length)
        ];
      })
      .join("");

    iterations += 0.5;

    if (iterations >= originalText.length) {

      clearInterval(interval);

      element.innerText = originalText;
    }

  }, 40);
}

document.querySelectorAll("nav a").forEach((link) => {

  const original = link.innerText;

  link.addEventListener("mouseenter", () => {
    glitchText(link, original);
  });

  link.addEventListener("mouseleave", () => {
    link.innerText = original;
  });
});

/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

  const loader = document.querySelector(".loader");

  if (!loader) return;

  gsap.to(loader, {
    opacity: 0,
    duration: 1,
    onComplete: () => loader.remove()
  });
});

/* =========================================================
   LENIS
========================================================= */

if (typeof Lenis !== "undefined") {

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  function raf(time) {

    lenis.raf(time);

    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* =========================================================
   HERO TEXT
========================================================= */

new SplitType(".hero", { types: "chars" });

gsap.to(".char", {

  y: 0,
  opacity: 1,
  filter: "blur(0px)",

  stagger: 0.03,

  duration: 1,

  ease: "power4.out"
});

/* =========================================================
   SECTIONS
========================================================= */

gsap.utils.toArray("section").forEach((sec) => {

  gsap.from(sec, {

    scrollTrigger: {
      trigger: sec,
      start: "top 80%"
    },

    y: 80,
    opacity: 0,
    duration: 1
  });
});

/* =========================================================
   FORM
========================================================= */

document
  .getElementById("form")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Message envoyé");
});

/* =========================================================
   WEBGL BACKGROUND
========================================================= */

const scene = new THREE.Scene();

const camera =
  new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true
});

renderer.setSize(innerWidth, innerHeight);

camera.position.z = 5;

const geometry = new THREE.BufferGeometry();

const count = 1500;

const positions =
  new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {

  positions[i] =
    (Math.random() - 0.5) * 10;
}

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff
});

const particles =
  new THREE.Points(geometry, material);

scene.add(particles);

function animate() {

  requestAnimationFrame(animate);

  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {

  camera.aspect =
    innerWidth / innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
});
/* =========================================================
   REAL TEXT BREAK EFFECT
========================================================= */

const heroText = document.querySelector(".hero-hover");

/* split lettres */
const originalText = heroText.innerText;

heroText.innerHTML = "";

originalText.split("").forEach(letter => {

  const span = document.createElement("span");

  span.className = "hero-letter";

  span.innerHTML = letter === " "
    ? "&nbsp;"
    : letter;

  heroText.appendChild(span);
});

const lettersEls =
  document.querySelectorAll(".hero-letter");

/* hover mouse */
heroText.addEventListener("mousemove", (e) => {

  const rect = heroText.getBoundingClientRect();

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  lettersEls.forEach(letter => {

    const box = letter.getBoundingClientRect();

    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;

    const dx = cx - mouseX;
    const dy = cy - mouseY;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const radius = 120;

    if(dist < radius){

      const force = (1 - dist / radius);

      const moveX = dx * force * 0.35;
      const moveY = dy * force * 0.35;

      const randomX =
        (Math.random() - 0.5) * 12;

      const randomY =
        (Math.random() - 0.5) * 12;

      gsap.to(letter, {

        x: moveX + randomX,
        y: moveY + randomY,

        duration: 0.25,

        ease: "power2.out"
      });

    } else {

      gsap.to(letter, {

        x: 0,
        y: 0,

        duration: 0.6,

        ease: "elastic.out(1,0.4)"
      });
    }
  });
});

/* reset */
heroText.addEventListener("mouseleave", () => {

  lettersEls.forEach(letter => {

    gsap.to(letter, {

      x: 0,
      y: 0,

      duration: 1,

      ease: "elastic.out(1,0.4)"
    });
  });
});

/* =========================================================
   CLICK PIXELS
========================================================= */

heroText.addEventListener("click", (e) => {

  const rect = heroText.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for(let i = 0; i < 40; i++){

    const pixel = document.createElement("div");

    pixel.className = "click-pixel";

    heroText.appendChild(pixel);

    pixel.style.left = x + "px";
    pixel.style.top = y + "px";

    const angle = Math.random() * Math.PI * 2;

    const distance = 40 + Math.random() * 120;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    gsap.fromTo(pixel,

      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1
      },

      {
        x: dx,
        y: dy,

        opacity: 0,

        scale: 0,

        duration: 0.8,

        ease: "power3.out",

        onComplete: () => pixel.remove()
      }
    );
  }
});

/* =========================================================
   CURSOR PIXEL TRAIL
========================================================= */

heroText.addEventListener("mousemove", (e) => {

  const rect = heroText.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const pixel = document.createElement("div");

  pixel.className = "cursor-pixel";

  heroText.appendChild(pixel);

  pixel.style.left = x + "px";
  pixel.style.top = y + "px";

  gsap.fromTo(pixel,

    {
      opacity: 0.8,
      scale: 1
    },

    {
      opacity: 0,
      scale: 0,

      y: y + (Math.random() * 20 - 10),

      duration: 0.6,

      ease: "power2.out",

      onComplete: () => pixel.remove()
    }
  );
});

const titles = [
  "À propos",
  "Creative Developer",
  "WebGL / Animation",
  "UI / Motion Designer"
];

const el = document.getElementById("about-title");

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

// ⚠️ NOM DIFFÉRENT (important)
const typeCursor = document.createElement("span");
typeCursor.textContent = "|";
typeCursor.className = "type-cursor";

const style = document.createElement("style");
style.innerHTML = `
.type-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 0.7s infinite;
  color: white;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
`;
document.head.appendChild(style);

function typeLoop() {

  const current = titles[titleIndex];

  if (!isDeleting) charIndex++;
  else charIndex--;

  const text = current.substring(0, charIndex);

  el.innerHTML = text;
  el.appendChild(typeCursor);

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    speed = 1200;
    isDeleting = true;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
  }

  setTimeout(typeLoop, speed);
}

typeLoop();


/* =========================================================
   Project cards
========================================================= */


const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, i) => {

  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play reverse play reverse"
    },

    y: 0,
    opacity: 1,
    scale: 1,
    duration: 1,
    delay: i * 0.05,
    ease: "power4.out"
  });
});

const grid = document.querySelector(".projects-grid");

grid.addEventListener("mousemove", (e) => {

  const cards = document.querySelectorAll(".project-card");

  cards.forEach(card => {

    const rect = card.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const radius = 180;

    if(dist < radius){

      const force = (1 - dist / radius);

      gsap.to(card, {
        x: -dx * force * 0.2,
        y: -dy * force * 0.2,
        scale: 1 + force * 0.08,
        duration: 0.4,
        ease: "power3.out"
      });

    } else {

      gsap.to(card, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1,0.4)"
      });
    }
  });
});

grid.addEventListener("mouseleave", () => {

  document.querySelectorAll(".project-card").forEach(card => {

    gsap.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1,0.4)"
    });

  });
});

const ml4 = {
  opacityIn: [0, 1],
  scaleIn: [0.2, 1],
  scaleOut: 3,
  durationIn: 800,
  durationOut: 600,
  delay: 1200
};

anime.timeline({ loop: true })

.add({
  targets: '.ml4 .letters-1',
  opacity: ml4.opacityIn,
  scale: ml4.scaleIn,
  duration: ml4.durationIn
})
.add({
  targets: '.ml4 .letters-1',
  opacity: 0,
  scale: ml4.scaleOut,
  duration: ml4.durationOut,
  easing: "easeInExpo",
  delay: ml4.delay
})

.add({
  targets: '.ml4 .letters-2',
  opacity: ml4.opacityIn,
  scale: ml4.scaleIn,
  duration: ml4.durationIn
})
.add({
  targets: '.ml4 .letters-2',
  opacity: 0,
  scale: ml4.scaleOut,
  duration: ml4.durationOut,
  easing: "easeInExpo",
  delay: ml4.delay
})

.add({
  targets: '.ml4 .letters-3',
  opacity: ml4.opacityIn,
  scale: ml4.scaleIn,
  duration: ml4.durationIn
})
.add({
  targets: '.ml4 .letters-3',
  opacity: 0,
  scale: ml4.scaleOut,
  duration: ml4.durationOut,
  easing: "easeInExpo",
  delay: ml4.delay
});

gsap.utils.toArray(".project-card").forEach((card, i) => {

  gsap.fromTo(card,
    {
      y: 120,
      rotateX: 70,
      opacity: 0,
      filter: "blur(10px)"
    },
    {
      y: 0,
      rotateX: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      delay: i * 0.05,
      ease: "expo.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%"
      }
    }
  );

});

const scriptIconsStyle = document.createElement('style');

scriptIconsStyle.innerText = `
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

.contactIcons {
  font-family: Raleway, sans-serif;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.contactIcons ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
}

.contactIcons li {
  opacity: 0;
  transform: translateY(40px);
}

.contactIcons-item {
  display: grid;
  grid-template-columns: 24px auto;
  align-items: center;
  gap: 0.5em;

  text-decoration: none;
  color: #fff;

  background-color: #333;
  padding: 0.6em 1em;
  border-radius: 12px;

  box-shadow: 1px 2px 8px #0007;

  transition: transform 0.3s ease, opacity 0.3s ease;
}

.contactIcons-item:hover {
  transform: scale(1.05);
}
`;

document.head.appendChild(scriptIconsStyle);

const tickerEl = document.getElementById("topTicker");

const tickerTexts = [
  "Creative Developer • WebGL • GSAP • Three.js • UI Motion • ",
  "UI Experiments • Pixel Cursor System • Awwwards Style • ",
  "Available for Freelance • Motion Design • Interactive Web • "
];

// on crée une ligne infinie
const loopText = tickerTexts.join("");

// on duplique pour éviter les trous
tickerEl.innerHTML = `
  <div class="ticker-track">
    <span>${loopText}</span>
    <span>${loopText}</span>
  </div>
`;

const lenis = new Lenis({
  smooth: true
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

document.querySelectorAll(".project-card").forEach(card => {

  const btnFront = card.querySelector(".flip-btn:not(.back)");
  const btnBack = card.querySelector(".flip-btn.back");

  function toggleFlip(e) {
    e.stopPropagation();
    card.classList.toggle("flipped");
  }

  btnFront.addEventListener("click", toggleFlip);
  btnBack.addEventListener("click", toggleFlip);

});


//zoom
gsap.registerPlugin(ScrollTrigger);

const video = document.querySelector(".video-wrapper video");

gsap.timeline({
  scrollTrigger: {
    trigger: ".video-section",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true
  }
})

.to(video, {
  scale: 1,        // grandit jusqu’à plein écran
  ease: "none"
}, 0)

.to(video, {
  objectFit: "cover", // transition contain → cover
  ease: "none"
}, 0.2);

/* ==========================================
   L4R PROJECT CARDS
========================================== */

const l4rProjectCards =
document.querySelectorAll(".l4r-project-card");

l4rProjectCards.forEach((card,index)=>{

  gsap.fromTo(card,

    {
      y:180,
      rotateX:70,
      scale:0.8,
      opacity:0,
      filter:"blur(15px)"
    },

    {
      y:0,
      rotateX:0,
      scale:1,
      opacity:1,
      filter:"blur(0px)",

      duration:1.5,
      delay:index*0.08,
      ease:"expo.out",

      scrollTrigger:{
        trigger:card,
        start:"top 85%"
      }
    }

  );

});


const l4rMagneticCards =
document.querySelectorAll(".l4r-project-card");

l4rMagneticCards.forEach(card=>{

  card.addEventListener("mousemove",(event)=>{

    const l4rRect =
      card.getBoundingClientRect();

    const l4rMouseX =
      event.clientX - l4rRect.left;

    const l4rMouseY =
      event.clientY - l4rRect.top;

    const l4rCenterX =
      l4rRect.width / 2;

    const l4rCenterY =
      l4rRect.height / 2;

    gsap.to(card,{

      rotationY:
        (l4rMouseX - l4rCenterX) * 0.04,

      rotationX:
        (l4rCenterY - l4rMouseY) * 0.04,

      x:
        (l4rMouseX - l4rCenterX) * 0.08,

      y:
        (l4rMouseY - l4rCenterY) * 0.08,

      duration:0.4,
      ease:"power3.out"

    });

  });

  card.addEventListener("mouseleave",()=>{

    gsap.to(card,{

      rotationX:0,
      rotationY:0,
      x:0,
      y:0,

      duration:1,
      ease:"elastic.out(1,0.4)"

    });

  });

});

