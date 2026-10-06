const safeStorage={
  getItem(k){try{return window.safeStorage.getItem(k)}catch(e){return null}},
  setItem(k,v){try{window.safeStorage.setItem(k,v)}catch(e){}},
  removeItem(k){try{window.safeStorage.removeItem(k)}catch(e){}}
};
const $=id=>document.getElementById(id);
function showMessage(m){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3000)}
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.querySelectorAll(".lab-panel").forEach(x=>x.classList.add("hidden"));$(tab.dataset.lab+"Lab").classList.remove("hidden");if(tab.dataset.lab==="projectile")drawProjectile()}));
const pv=$("pVelocity"),pa=$("pAngle");
function drawProjectile(){const v=+pv.value,a=+pa.value*Math.PI/180,g=9.81,r=v*v*Math.sin(2*a)/g,h=v*v*Math.sin(a)**2/(2*g),t=2*v*Math.sin(a)/g;$("pVelocityValue").textContent=v;$("pAngleValue").textContent=Math.round(a*180/Math.PI);$("pRange").textContent=r.toFixed(1)+" m";$("pHeight").textContent=h.toFixed(1)+" m";$("pTime").textContent=t.toFixed(2)+" s";const c=$("projectileCanvas"),ctx=c.getContext("2d"),d=devicePixelRatio||1,w=c.clientWidth,H=c.clientHeight;c.width=w*d;c.height=H*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,H);ctx.strokeStyle="#087f8c";ctx.lineWidth=4;ctx.setLineDash([8,7]);ctx.beginPath();for(let i=0;i<=60;i++){const q=t*i/60,x=25+(w-50)*i/60,ym=v*Math.sin(a)*q-.5*g*q*q,y=H-30-(ym/Math.max(h,1))*(H-60);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.setLineDash([])}
[pv,pa].forEach(x=>x.addEventListener("input",drawProjectile));window.addEventListener("resize",drawProjectile);drawProjectile();
const force=$("force"),mass=$("mass");function updateNewton(){const f=+force.value,m=+mass.value;$("forceValue").textContent=f;$("massValue").textContent=m;$("acceleration").textContent=(f/m).toFixed(2)+" m/s²";$("forceBox").textContent=f+" N";$("forceBox").style.transform=`scale(${.75+f/180})`}[force,mass].forEach(x=>x.addEventListener("input",updateNewton));updateNewton();
const planet=$("planet"),gm=$("gMass");function updateGravity(){const m=+gm.value,g=+planet.value;$("gMassValue").textContent=m;$("weight").textContent=(m*g).toFixed(1)+" N"}[planet,gm].forEach(x=>x.addEventListener("input",updateGravity));updateGravity();
const em=$("eMass"),ev=$("eVelocity");function updateEnergy(){const m=+em.value,v=+ev.value,k=.5*m*v*v;$("eMassValue").textContent=m;$("eVelocityValue").textContent=v;$("kinetic").textContent=k.toFixed(0)+" J";$("energyBall").style.transform=`scale(${Math.min(1.8,.75+k/3000)})`}[em,ev].forEach(x=>x.addEventListener("input",updateEnergy));updateEnergy();
const am=$("aMass"),av=$("aVel"),bm=$("bMass"),bv=$("bVel");function updateCollision(){const m1=+am.value,v1=+av.value,m2=+bm.value,v2=+bv.value,u=(m1*v1+m2*v2)/(m1+m2);$("aMassValue").textContent=m1;$("aVelValue").textContent=v1;$("bMassValue").textContent=m2;$("bVelValue").textContent=v2;$("finalVelocity").textContent=u.toFixed(2)+" m/s";document.querySelector("#collisionLab .ball-a").style.transform=`translateX(${v1*3}px)`;document.querySelector("#collisionLab .ball-b").style.transform=`translateX(${v2*3}px)`}[am,av,bm,bv].forEach(x=>x.addEventListener("input",updateCollision));updateCollision();
$("ideaButton").addEventListener("click",()=>{const i=prompt("Write a scientific question or hypothesis:");if(i&&i.trim())showMessage("Idea saved for our future community: "+i.trim())});

// ===== Science Lab V3: experiments, quiz, and progress =====
const savedScore = Number(safeStorage.getItem("scienceLabQuizScore") || 0);
let savedBadges;
try{savedBadges=JSON.parse(safeStorage.getItem("scienceLabBadges") || "[]"); if(!Array.isArray(savedBadges)) savedBadges=[];}catch(e){savedBadges=[];}
$("quizScore").textContent = savedScore;
$("badgeCount").textContent = savedBadges.length;

const quizBank={
 mixed:{easy:[
  {q:"Which planet is closest to the Sun?",a:["Earth","Mars","Mercury","Jupiter"],c:2},
  {q:"What is the chemical symbol for oxygen?",a:["Ox","O","Og","C"],c:1},
  {q:"Which particle has a negative charge?",a:["Proton","Neutron","Electron","Nucleus"],c:2},
  {q:"What is 7 × 8?",a:["54","56","64","48"],c:1},
  {q:"What organ pumps blood around the body?",a:["Lung","Brain","Heart","Kidney"],c:2}],medium:[],hard:[]},
 chemistry:{easy:[
  {q:"What is the chemical symbol for oxygen?",a:["O","Ox","C","N"],c:0},
  {q:"What is H₂O commonly called?",a:["Salt","Water","Oxygen","Hydrogen"],c:1},
  {q:"Which particle has a negative charge?",a:["Proton","Neutron","Electron","Atom"],c:2},
  {q:"Which is a state of matter?",a:["Energy","Solid","Force","Gravity"],c:1},
  {q:"Which gas do humans breathe in for respiration?",a:["Oxygen","Helium","Neon","Hydrogen"],c:0}],medium:[
  {q:"What is the atomic number of carbon?",a:["4","6","8","12"],c:1},
  {q:"What does pH measure?",a:["Mass","Acidity or alkalinity","Speed","Temperature"],c:1},
  {q:"What is NaCl commonly known as?",a:["Sugar","Baking soda","Table salt","Water"],c:2},
  {q:"Which subatomic particle is found in the nucleus and has no charge?",a:["Electron","Proton","Neutron","Ion"],c:2},
  {q:"A substance made of two or more elements chemically joined is a…",a:["Mixture","Compound","Solution","Metal"],c:1}],hard:[]},
 astronomy:{easy:[
  {q:"Which planet is known for its rings?",a:["Mercury","Venus","Saturn","Mars"],c:2},
  {q:"What is the star at the center of our solar system?",a:["Polaris","The Sun","Sirius","Betelgeuse"],c:1},
  {q:"Which planet do we live on?",a:["Mars","Earth","Venus","Jupiter"],c:1},
  {q:"What do we orbit?",a:["The Sun","The Moon","Mars","Jupiter"],c:0},
  {q:"Which is Earth's natural satellite?",a:["The Sun","The Moon","Venus","Titan"],c:1}],medium:[
  {q:"Which planet is the largest in our solar system?",a:["Earth","Saturn","Jupiter","Neptune"],c:2},
  {q:"What galaxy contains our solar system?",a:["Andromeda","Milky Way","Whirlpool","Sombrero"],c:1},
  {q:"What force keeps planets in orbit around the Sun?",a:["Friction","Gravity","Magnetism","Electricity"],c:1},
  {q:"Which planet is known as the Red Planet?",a:["Mars","Mercury","Uranus","Neptune"],c:0},
  {q:"Which planet is farthest from the Sun among the eight planets?",a:["Saturn","Uranus","Neptune","Mars"],c:2}],hard:[]},
 mathematics:{easy:[
  {q:"What is 12 + 9?",a:["19","20","21","22"],c:2},
  {q:"What is 6 × 7?",a:["36","42","48","49"],c:1},
  {q:"What is half of 20?",a:["5","10","15","12"],c:1},
  {q:"How many sides does a triangle have?",a:["2","3","4","5"],c:1},
  {q:"What is 100 ÷ 10?",a:["5","10","20","100"],c:1}],medium:[
  {q:"Solve: x + 7 = 12",a:["3","5","7","19"],c:1},
  {q:"What is the area of a rectangle 5 m by 4 m?",a:["9 m²","18 m²","20 m²","25 m²"],c:2},
  {q:"What is 3²?",a:["6","8","9","12"],c:2},
  {q:"What is 25% of 80?",a:["10","20","25","40"],c:1},
  {q:"A right angle measures…",a:["45°","90°","180°","360°"],c:1}],hard:[]},
 biology:{easy:[
  {q:"What is the basic unit of life?",a:["Atom","Cell","Organ","Tissue"],c:1},
  {q:"Which organ pumps blood?",a:["Lung","Heart","Liver","Stomach"],c:1},
  {q:"Which part of a plant usually absorbs water from the soil?",a:["Flower","Roots","Fruit","Leaf"],c:1},
  {q:"Which organ is mainly used for breathing?",a:["Heart","Lung","Kidney","Brain"],c:1},
  {q:"Which molecule carries genetic information?",a:["DNA","Water","Glucose","Oxygen"],c:0}],medium:[
  {q:"Which cell structure contains most of the cell's genetic material?",a:["Cell wall","Nucleus","Ribosome","Vacuole"],c:1},
  {q:"What process do green plants use to make food using light?",a:["Respiration","Photosynthesis","Digestion","Fermentation"],c:1},
  {q:"Which blood cells help fight infections?",a:["Red blood cells","White blood cells","Platelets","Plasma"],c:1},
  {q:"Which system carries blood around the body?",a:["Digestive","Circulatory","Skeletal","Nervous"],c:1},
  {q:"What is the powerhouse of the cell commonly called?",a:["Nucleus","Mitochondrion","Cell wall","Chloroplast"],c:1}],hard:[]},
 physics:{easy:[
  {q:"What is the SI unit of force?",a:["Joule","Newton","Watt","Pascal"],c:1},
  {q:"What is the formula for Newton's second law?",a:["F = ma","E = mc²","v = d/t","P = IV"],c:0},
  {q:"What happens to kinetic energy when speed increases?",a:["It decreases","It stays the same","It increases","It becomes zero"],c:2},
  {q:"What force pulls objects toward Earth?",a:["Gravity","Friction","Magnetism","Tension"],c:0},
  {q:"What is measured in metres per second?",a:["Mass","Speed","Force","Energy"],c:1}],medium:[
  {q:"If force is 20 N and mass is 5 kg, acceleration is…",a:["2 m/s²","4 m/s²","10 m/s²","25 m/s²"],c:1},
  {q:"What is the kinetic-energy formula?",a:["mgh","½mv²","F/a","ma"],c:1},
  {q:"Which quantity has units of joules?",a:["Energy","Force","Mass","Acceleration"],c:0},
  {q:"If the mass doubles while force stays constant, acceleration…",a:["Doubles","Halves","Stays the same","Becomes zero"],c:1},
  {q:"What does momentum depend on?",a:["Mass and velocity","Temperature only","Force only","Volume only"],c:0}],hard:[]}
};
for(const key of Object.keys(quizBank)){
  if(!quizBank[key].medium.length) quizBank[key].medium=quizBank[key].easy;
  if(!quizBank[key].hard.length) quizBank[key].hard=quizBank[key].medium;
}

function unlockBadge(id){
  if(!savedBadges.includes(id)){
    savedBadges.push(id);
    safeStorage.setItem("scienceLabBadges", JSON.stringify(savedBadges));
  }
  const el=$(id);
  if(el) el.classList.remove("locked"), el.classList.add("unlocked");
  $("badgeCount").textContent=savedBadges.length;
}
["badgeFirst","badgePerfect","badgeExplorer"].forEach(id=>{
  if(savedBadges.includes(id)){ const el=$(id); if(el) el.classList.remove("locked"),el.classList.add("unlocked"); }
});

const solute=$("solute"), temp=$("temp");
function updateExperiments(){
  const s=+solute.value, t=+temp.value;
  $("soluteValue").textContent=s;
  $("soluteMeter").style.width=s+"%";
  $("soluteText").textContent=s<20?"Very dilute solution.":s<60?"Moderately concentrated solution.":"Highly concentrated solution.";
  $("tempValue").textContent=t;
  $("tempDisplay").textContent=t+"°C";
  $("tempText").textContent=t<0?"Below freezing for water.":t<15?"Cool conditions.":t<35?"Room-temperature conditions.":t<70?"Warm conditions.":"Hot conditions.";
  unlockBadge("badgeExplorer");
}
[solute,temp].forEach(x=>x.addEventListener("input",updateExperiments));
updateExperiments();

$("observationButton").addEventListener("click",()=>{
  const prompts=[
    "Prediction: If the solute amount increases while water stays the same, concentration should increase.",
    "Prediction: If temperature rises, particles in a substance generally move more energetically.",
    "Prediction: Changing one variable at a time makes cause-and-effect easier to observe."
  ];
  showMessage(prompts[Math.floor(Math.random()*prompts.length)]);
  unlockBadge("badgeExplorer");
});

for(const key of Object.keys(quizBank)){
  if(!quizBank[key].medium.length) quizBank[key].medium=quizBank[key].easy;
  if(!quizBank[key].hard.length) quizBank[key].hard=quizBank[key].medium;
}

/* ===== Unlimited Quiz Engine =====
   Questions are generated one at a time, so the quiz has no fixed ending.
   The built-in bank is still used, but numerical/science variants are generated
   dynamically to make longer runs less repetitive.
*/
let quizSubject="mixed", quizDifficulty="medium", quizQuestions=[], quizIndex=0, quizRoundScore=0, answered=false;
let quizSeen = new Set();

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick(arr){ return arr[randInt(0,arr.length-1)]; }
function makeQuestion(q, correct, distractors){
  const unique=[];
  for(const x of distractors){ if(x!==correct && !unique.includes(x)) unique.push(x); }
  return shuffledQuestion({q,a:[correct,...unique.slice(0,3)],c:0});
}

function shuffledQuestion(q){
  const pairs=q.a.map((answer,i)=>({answer,index:i}));
  for(let i=pairs.length-1;i>0;i--){const j=randInt(0,i);[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}
  return {q:q.q,a:pairs.map(x=>x.answer),c:pairs.findIndex(x=>x.index===q.c)};
}

function dynamicQuestion(subject,difficulty){
  const level=difficulty;
  if(subject==="mathematics"){
    const type=randInt(1, level==="easy"?4:level==="medium"?7:10);
    if(type===1){
      const a=randInt(5,50), b=randInt(2,30), ans=a+b;
      return {q:`What is ${a} + ${b}?`,a:[String(ans-2),String(ans),String(ans+2),String(ans+5)],c:1};
    }
    if(type===2){
      const a=randInt(20,80), b=randInt(2,19), ans=a-b;
      return {q:`What is ${a} − ${b}?`,a:[String(ans+1),String(ans),String(ans-2),String(ans+3)],c:1};
    }
    if(type===3){
      const a=randInt(3,15), b=randInt(2,12), ans=a*b;
      return {q:`What is ${a} × ${b}?`,a:[String(ans-b),String(ans+a),String(ans),String(ans+5)],c:2};
    }
    if(type===4){
      const b=randInt(2,12), ans=randInt(3,15), a=b*ans;
      return {q:`What is ${a} ÷ ${b}?`,a:[String(ans-1),String(ans),String(ans+2),String(ans+b)],c:1};
    }
    if(type===5){
      const x=randInt(2,15), k=randInt(2,10), ans=x+k;
      return {q:`Solve: x + ${k} = ${ans}`,a:[String(x-1),String(x),String(x+1),String(ans)],c:1};
    }
    if(type===6){
      const w=randInt(2,15), h=randInt(2,15), ans=w*h;
      return {q:`What is the area of a rectangle ${w} m by ${h} m?`,a:[`${w+h} m²`,`${ans} m²`,`${2*(w+h)} m²`,`${ans+w} m²`],c:1};
    }
    if(type===7){
      const n=randInt(2,12), ans=n*n;
      return {q:`What is ${n}²?`,a:[String(n*2),String(ans),String(ans+n),String(n*n*n)],c:1};
    }
    if(type===8){
      const p=pick([10,20,25,50]), whole=randInt(2,10)*100, ans=whole*p/100;
      return {q:`What is ${p}% of ${whole}?`,a:[String(ans/2),String(ans),String(ans+10),String(whole-p)],c:1};
    }
    if(type===9){
      let a=randInt(2,12), b=randInt(2,12), ans=a+b;
      while(a*b===ans){ b=randInt(2,12); ans=a+b; }
      return {q:`If a = ${a} and b = ${b}, what is a + b?`,a:[String(ans-1),String(ans),String(ans+1),String(a*b)],c:1};
    }
    const n=randInt(10,30), ans=360/n;
    return {q:`A regular polygon has ${n} equal angles. What is the sum of all its interior angles?`,a:[`${(n-2)*180}°`,`${n*180}°`,`${360/n}°`,`${n*90}°`],c:0};
  }

  if(subject==="physics"){
    const type=randInt(1,6);
    if(type===1){const m=randInt(2,12), a=randInt(2,8), f=m*a;return {q:`A ${m} kg object accelerates at ${a} m/s². What force acts on it?`,a:[`${f} N`,`${f+2} N`,`${m+a} N`,`${m*a*a} N`],c:0};}
    if(type===2){const d=randInt(20,120), t=randInt(2,12), v=d/t;return {q:`An object travels ${d} m in ${t} s. What is its average speed?`,a:[`${v} m/s`,`${d+t} m/s`,`${t/d} m/s`,`${v+2} m/s`],c:0};}
    if(type===3){const m=randInt(2,10), v=randInt(2,8), p=m*v;return {q:`What is the momentum of a ${m} kg object moving at ${v} m/s?`,a:[`${p} kg·m/s`,`${m+v} kg·m/s`,`${p+v} kg·m/s`,`${m*v*v} kg·m/s`],c:0};}
    if(type===4){const m=randInt(2,10), h=randInt(2,10), g=10, e=m*g*h;return {q:`Using g = 10 m/s², what gravitational potential energy does a ${m} kg object have at ${h} m?`,a:[`${e} J`,`${m*h} J`,`${e/2} J`,`${m+g+h} J`],c:0};}
    if(type===5){return pick([{q:"Which unit measures electric current?",a:["Ampere","Volt","Ohm","Joule"],c:0},{q:"Which force opposes motion between surfaces?",a:["Gravity","Friction","Magnetism","Buoyancy"],c:1},{q:"Which form of energy is stored in a stretched spring?",a:["Kinetic energy","Elastic potential energy","Thermal energy","Nuclear energy"],c:1}]);}
    return pick([{q:"What happens to an object's kinetic energy if its speed increases?",a:["It increases","It decreases","It stays zero","It becomes mass"],c:0},{q:"Which quantity is measured in watts?",a:["Power","Force","Mass","Distance"],c:0}]);
  }

  if(subject==="chemistry"){
    const type=randInt(1,5);
    if(type===1){const elements=[["Hydrogen","H"],["Carbon","C"],["Oxygen","O"],["Sodium","Na"],["Chlorine","Cl"],["Magnesium","Mg"],["Calcium","Ca"]];const e=pick(elements);return makeQuestion(`What is the chemical symbol for ${e[0]}?`,e[1],elements.map(x=>x[1]));}
    if(type===2){const pairs=[["water","H₂O"],["carbon dioxide","CO₂"],["oxygen","O₂"],["hydrogen","H₂"],["sodium chloride","NaCl"]];const e=pick(pairs);return makeQuestion(`Which formula represents ${e[0]}?`,e[1],pairs.map(x=>x[1]));}
    if(type===3){const p=randInt(1,14);let desc=p<7?"acidic":p===7?"neutral":"alkaline";return {q:`A solution has a pH of ${p}. How is it classified?`,a:[`${desc}`,desc==="acidic"?"neutral":"acidic",desc==="alkaline"?"neutral":"alkaline","metallic"],c:0};}
    if(type===4){return pick([{q:"Which state of matter has a fixed volume but no fixed shape?",a:["Solid","Liquid","Gas","Plasma"],c:1},{q:"Which change turns a liquid into a gas?",a:["Melting","Freezing","Evaporation","Condensation"],c:2},{q:"What is formed when elements chemically combine?",a:["A compound","A suspension","A physical mixture","An isotope only"],c:0}]);}
    return pick([{q:"Which particle has a positive electric charge?",a:["Electron","Proton","Neutron","Photon"],c:1},{q:"Which particle has no electric charge?",a:["Electron","Proton","Neutron","Ion"],c:2}]);
  }

  if(subject==="biology"){
    const type=randInt(1,6);
    if(type===1)return pick([{q:"Which organelle is mainly responsible for releasing usable energy from food in cells?",a:["Mitochondrion","Nucleus","Cell wall","Vacuole"],c:0},{q:"Which structure controls many activities of a cell?",a:["Nucleus","Cell wall","Cytoplasm","Vacuole"],c:0}]);
    if(type===2)return pick([{q:"Which gas is used by green plants during photosynthesis?",a:["Carbon dioxide","Oxygen","Nitrogen","Hydrogen"],c:0},{q:"Which gas is released as a product of photosynthesis?",a:["Oxygen","Carbon dioxide","Nitrogen","Helium"],c:0}]);
    if(type===3)return pick([{q:"Which blood component helps clot wounds?",a:["Platelets","Red blood cells","White blood cells","Plasma only"],c:0},{q:"Which blood cells carry most oxygen?",a:["Red blood cells","White blood cells","Platelets","Stem cells"],c:0}]);
    if(type===4)return pick([{q:"Which body system breaks food down into nutrients?",a:["Digestive system","Nervous system","Skeletal system","Respiratory system"],c:0},{q:"Which system is mainly responsible for exchanging oxygen and carbon dioxide?",a:["Respiratory system","Digestive system","Skeletal system","Endocrine system"],c:0}]);
    if(type===5)return pick([{q:"What is the process by which cells release energy from glucose?",a:["Cellular respiration","Photosynthesis","Transpiration","Pollination"],c:0},{q:"What is the movement of water through a plant and its loss from leaves called?",a:["Transpiration","Digestion","Respiration","Germination"],c:0}]);
    return pick([{q:"Which level of organisation is made of similar cells working together?",a:["Tissue","Organ","Organ system","Organism"],c:0},{q:"Which part of a flower produces pollen?",a:["Anther","Ovary","Stigma","Sepal"],c:0}]);
  }

  if(subject==="astronomy"){
    const planets=[
      ["Mercury","closest to the Sun","0"],["Venus","hottest planet in the solar system","0"],
      ["Earth","known for abundant liquid surface water","1"],["Mars","known for its reddish surface","2"],
      ["Jupiter","largest planet in the solar system","95"],["Saturn","famous for its prominent rings","146"],
      ["Uranus","an ice giant that rotates on its side","28"],["Neptune","the farthest of the eight planets from the Sun","16"]
    ];
    const p=pick(planets);
    const type=randInt(1,4);
    if(type===1)return makeQuestion(`Which planet is ${p[1]}?`,p[0],planets.map(x=>x[0]).concat(["The Moon"]));
    if(type===2)return makeQuestion(`Which planet has the description: "${p[1]}"?`,p[0],planets.map(x=>x[0]).concat(["The Sun"]));
    if(type===3)return pick([{q:"What is the name of the galaxy containing our solar system?",a:["Milky Way","Andromeda","Whirlpool","Sombrero"],c:0},{q:"What force keeps planets in orbit around the Sun?",a:["Gravity","Friction","Sound","Electricity"],c:0}]);
    return pick([{q:"What is Earth's natural satellite?",a:["The Moon","Mars","The Sun","Titan"],c:0},{q:"Which star is at the center of our solar system?",a:["The Sun","Polaris","Sirius","Betelgeuse"],c:0}]);
  }

  const subjects=["chemistry","astronomy","mathematics","biology","physics"];
  return dynamicQuestion(pick(subjects),difficulty);
}

function generateQuizQuestion(){
  let subject=quizSubject;
  if(subject==="mixed"){
    const subjects=["chemistry","astronomy","mathematics","biology","physics"];
    subject=pick(subjects);
  }
  let q;
  // Use dynamic questions often, and bank questions as a factual backbone.
  if(Math.random()<0.65){
    q=dynamicQuestion(subject,quizDifficulty);
  }else{
    const pool=quizBank[subject][quizDifficulty];
    q=shuffledQuestion(pick(pool));
  }
  // Avoid immediate repeats; after the available pool is exhausted, the set resets.
  let key=q.q+"|"+q.a.join("|");
  let tries=0;
  while(quizSeen.has(key) && tries<20){
    q=(Math.random()<0.7)?dynamicQuestion(subject,quizDifficulty):shuffledQuestion(pick(quizBank[subject][quizDifficulty]));
    key=q.q+"|"+q.a.join("|");
    tries++;
  }
  if(quizSeen.size>100){quizSeen.clear();}
  quizSeen.add(key);
  return q;
}

function selectQuiz(subject){
  quizSubject=subject;quizIndex=0;quizRoundScore=0;quizQuestions=[];quizSeen.clear();answered=false;renderQuiz();
}

function renderQuiz(){
  if(!quizQuestions[quizIndex]) quizQuestions[quizIndex]=generateQuizQuestion();
  const q=quizQuestions[quizIndex];
  $("quizProgress").textContent=`Question ${quizIndex+1} • Unlimited`;
  $("quizPoints").textContent=`${quizRoundScore} points`;
  $("quizQuestion").textContent=q.q;
  $("quizFeedback").textContent="";
  $("nextQuestion").classList.add("hidden");
  $("restartQuiz").classList.add("hidden");
  $("quizAnswers").innerHTML="";
  answered=false;
  q.a.forEach((answer,i)=>{
    const b=document.createElement("button");
    b.className="quiz-answer";
    b.type="button";
    b.textContent=answer;
    b.addEventListener("click",()=>answerQuiz(i,b));
    $("quizAnswers").appendChild(b);
  });
}

function answerQuiz(choice,button){
  if(answered)return;
  answered=true;
  const q=quizQuestions[quizIndex];
  document.querySelectorAll(".quiz-answer").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.c)b.classList.add("correct");
  });
  if(choice===q.c){
    quizRoundScore++;
    button.classList.add("correct");
    $("quizFeedback").textContent="Correct! 🔬";
    unlockBadge("badgeFirst");
  }else{
    button.classList.add("wrong");
    $("quizFeedback").textContent=`Not quite. The correct answer is ${q.a[q.c]}.`;
    unlockBadge("badgeFirst");
  }
  $("quizPoints").textContent=`${quizRoundScore} points`;
  // The quiz never ends. A fresh question is generated when Next is pressed.
  $("nextQuestion").classList.remove("hidden");
  if(quizRoundScore>0 && quizRoundScore%10===0){
    $("quizFeedback").textContent+=" 🔥 "+quizRoundScore+" correct answers!";
  }
  const best=Math.max(Number(safeStorage.getItem("scienceLabQuizScore")||0),quizRoundScore);
  safeStorage.setItem("scienceLabQuizScore",String(best));
  $("quizScore").textContent=best;
}

document.querySelectorAll(".quiz-subject").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".quiz-subject").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  selectQuiz(b.dataset.subject);
}));
$("quizDifficulty").addEventListener("change",e=>{quizDifficulty=e.target.value;selectQuiz(quizSubject);});
$("nextQuestion").addEventListener("click",()=>{quizIndex++;renderQuiz();});
$("restartQuiz").addEventListener("click",()=>{selectQuiz(quizSubject);});
renderQuiz();


// ===== Science Lab V5: working Astronomy Lab =====
const planets={
 mercury:{name:"Mercury",emoji:"☿️",type:"TERRESTRIAL PLANET",description:"The smallest planet and the closest planet to the Sun. Its surface experiences extreme temperature changes.",gravity:"3.70 m/s²",year:"88 days",moons:"0"},
 venus:{name:"Venus",emoji:"♀️",type:"TERRESTRIAL PLANET",description:"A rocky world with a thick atmosphere and the hottest surface of the eight planets.",gravity:"8.87 m/s²",year:"225 days",moons:"0"},
 earth:{name:"Earth",emoji:"🌍",type:"TERRESTRIAL PLANET",description:"Our home world, with liquid surface water and a nitrogen-rich atmosphere.",gravity:"9.81 m/s²",year:"365 days",moons:"1"},
 mars:{name:"Mars",emoji:"🔴",type:"TERRESTRIAL PLANET",description:"A cold, rocky planet with iron-rich surface material that gives it its reddish appearance.",gravity:"3.71 m/s²",year:"687 days",moons:"2"},
 jupiter:{name:"Jupiter",emoji:"🟠",type:"GAS GIANT",description:"The largest planet in the solar system, with powerful storms and a vast atmosphere.",gravity:"24.79 m/s²",year:"11.86 years",moons:"95+"},
 saturn:{name:"Saturn",emoji:"🪐",type:"GAS GIANT",description:"A gas giant famous for its bright ring system made of countless particles of ice and rock.",gravity:"10.44 m/s²",year:"29.45 years",moons:"140+"},
 uranus:{name:"Uranus",emoji:"🔵",type:"ICE GIANT",description:"An ice giant that rotates with an extreme tilt, giving it unusual seasonal patterns.",gravity:"8.69 m/s²",year:"84 years",moons:"27"},
 neptune:{name:"Neptune",emoji:"🔵",type:"ICE GIANT",description:"A distant ice giant with extremely fast winds and a deep blue appearance.",gravity:"11.15 m/s²",year:"164.8 years",moons:"14"}
};
function renderPlanet(key){const p=planets[key];if(!p)return;$('astroPlanet').textContent=p.emoji;$('astroType').textContent=p.type;$('astroName').textContent=p.name;$('astroDescription').textContent=p.description;$('astroGravity').textContent=p.gravity;$('astroYear').textContent=p.year;$('astroMoons').textContent=p.moons;document.querySelectorAll('.planet-picker button').forEach(b=>b.classList.toggle('active',b.dataset.planet===key));}
document.querySelectorAll('.planet-picker button').forEach(b=>b.addEventListener('click',()=>renderPlanet(b.dataset.planet)));renderPlanet('earth');

// ===== Science Lab: Hard Colour Challenge =====
const colourNames=[
 ['Red',[ [235,45,55],[220,55,65],[245,65,50] ]],
 ['Orange',[ [240,130,35],[235,105,30],[250,145,45] ]],
 ['Yellow',[ [245,205,45],[235,190,35],[250,220,60] ]],
 ['Lime',[ [125,205,55],[145,220,45],[105,190,50] ]],
 ['Green',[ [45,175,105],[40,155,95],[55,190,115] ]],
 ['Teal',[ [35,170,160],[45,185,170],[30,155,150] ]],
 ['Cyan',[ [45,195,205],[35,175,190],[65,210,215] ]],
 ['Blue',[ [55,110,225],[45,95,205],[70,125,240] ]],
 ['Indigo',[ [75,75,185],[65,65,165],[90,80,205] ]],
 ['Purple',[ [145,75,205],[125,70,190],[160,85,220] ]],
 ['Magenta',[ [205,55,175],[220,65,185],[190,50,160] ]],
 ['Pink',[ [225,85,160],[215,75,145],[240,100,175] ]]
];
let colourScore=Number(safeStorage.getItem('scienceLabColourScore')||0), colourStreak=Number(safeStorage.getItem('scienceLabColourStreak')||0), colourTarget='', colourTimer=null, colourTimeLeft=0;
function colourLevel(){
  if(colourStreak>=10)return {name:'MASTER',choices:8,time:7,hideRGB:true};
  if(colourStreak>=5)return {name:'EXPERT',choices:7,time:9,hideRGB:Math.random()<0.45};
  return {name:'HARD',choices:6,time:12,hideRGB:false};
}
function colourDistance(a,b){return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2);}
function makeColourRound(){
  clearInterval(colourTimer);
  const level=colourLevel();
  const target=colourNames[Math.floor(Math.random()*colourNames.length)];
  colourTarget=target[0];
  const rgb=target[1][Math.floor(Math.random()*target[1].length)];
  $('colourPreview').style.background=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  $('redValue').textContent=level.hideRGB?'?':rgb[0];
  $('greenValue').textContent=level.hideRGB?'?':rgb[1];
  $('blueValue').textContent=level.hideRGB?'?':rgb[2];
  const candidates=colourNames.filter(x=>x[0]!==colourTarget);
  // Harder rounds use colours whose RGB values are relatively close to the target.
  candidates.sort((a,b)=>{
    const ar=a[1][0], br=b[1][0];
    return colourDistance(rgb,ar)-colourDistance(rgb,br);
  });
  const close=candidates.slice(0,Math.min(candidates.length,level.choices-1));
  const choices=[target,...close].sort(()=>Math.random()-.5);
  const box=$('colourChoices');box.innerHTML='';
  choices.forEach(c=>{
    const b=document.createElement('button');b.className='colour-choice';
    const sample=c[1][0];b.style.background=`rgb(${sample[0]},${sample[1]},${sample[2]})`;
    b.textContent=c[0];b.addEventListener('click',()=>guessColour(b,c[0]));box.appendChild(b);
  });
  $('colourLevel').textContent=`${level.name} • ${level.time}s`;
  $('colourScore').textContent=`Score ${colourScore}`;$('colourStreak').textContent=`Streak ${colourStreak}`;
  colourTimeLeft=level.time;$('colourTimer').textContent=`Time ${colourTimeLeft}s`;
  colourTimer=setInterval(()=>{colourTimeLeft--;$('colourTimer').textContent=`Time ${colourTimeLeft}s`;if(colourTimeLeft<=0){clearInterval(colourTimer);guessColour(null,'__TIMEOUT__');}},1000);
}
function guessColour(button,name){
  clearInterval(colourTimer);
  document.querySelectorAll('.colour-choice').forEach(b=>b.disabled=true);
  if(name===colourTarget){
    colourScore+=10+colourStreak*3;colourStreak++;
    if(button)button.classList.add('correct');showMessage(`Correct! +${10+(colourStreak-1)*3} points`);
  }else{
    colourStreak=0;
    if(button)button.classList.add('wrong');
    document.querySelectorAll('.colour-choice').forEach(b=>{if(b.textContent===colourTarget)b.classList.add('correct')});
    showMessage(name==='__TIMEOUT__'?`Time's up! The answer was ${colourTarget}.`:`The answer was ${colourTarget}.`);
  }
  safeStorage.setItem('scienceLabColourScore',colourScore);safeStorage.setItem('scienceLabColourStreak',colourStreak);
  $('colourScore').textContent=`Score ${colourScore}`;$('colourStreak').textContent=`Streak ${colourStreak}`;unlockBadge('badgeExplorer');
}
$('newColourRound').addEventListener('click',makeColourRound);makeColourRound();

// ===== Science Lab V7: Chemistry Lab =====
const reactionData={
 water:{eq:'2H₂ + O₂ → 2H₂O',left:'Reactants: Hydrogen + Oxygen',right:'Product: Water'},
 co2:{eq:'C + O₂ → CO₂',left:'Reactants: Carbon + Oxygen',right:'Product: Carbon dioxide'},
 salt:{eq:'2Na + Cl₂ → 2NaCl',left:'Reactants: Sodium + Chlorine',right:'Product: Sodium chloride'}
};
const reactionSelect=$('reactionSelect');
function updateReaction(){const r=reactionData[reactionSelect.value];$('reactionEquation').textContent=r.eq;$('reactionLeft').textContent=r.left;$('reactionRight').textContent=r.right;$('reactionStatus').textContent='Ready to explore.';}
reactionSelect.addEventListener('change',updateReaction);$('runReaction').addEventListener('click',()=>{updateReaction();$('reactionStatus').textContent='Reaction simulated! Atoms are rearranged into the selected products. ⚗️';});updateReaction();

const elements=[
['H','Hydrogen',1,'The lightest element and the most abundant element in the universe.'],['He','Helium',2,'A very light noble gas used in balloons and cooling systems.'],['Li','Lithium',3,'A soft metal used in batteries.'],['Be','Beryllium',4,'A light, strong metal used in specialist aerospace materials.'],['B','Boron',5,'A metalloid used in glass and ceramics.'],['C','Carbon',6,'A key element in living things and many materials.'],['N','Nitrogen',7,'A major component of Earth’s atmosphere.'],['O','Oxygen',8,'A gas needed by humans and many animals for respiration.'],['F','Fluorine',9,'A very reactive halogen.'],['Ne','Neon',10,'A noble gas famous for glowing signs.'],['Na','Sodium',11,'A reactive metal found in common salt compounds.'],['Mg','Magnesium',12,'A light metal important in biology and industry.'],['Al','Aluminium',13,'A lightweight metal widely used in transport and construction.'],['Si','Silicon',14,'A metalloid central to computer chips and glass.'],['P','Phosphorus',15,'An element important in DNA, bones and energy transfer.'],['S','Sulfur',16,'A yellow nonmetal found in many compounds.'],['Cl','Chlorine',17,'A reactive halogen used in water treatment.'],['Ar','Argon',18,'An inert noble gas used in lighting and welding.'],['K','Potassium',19,'A reactive metal that is important for nerve and muscle function.'],['Ca','Calcium',20,'A metal important for bones and teeth.'],['Fe','Iron',26,'A strong metal used widely in construction and tools.'],['Cu','Copper',29,'A highly useful metal that conducts electricity well.'],['Zn','Zinc',30,'A metal often used to protect steel from corrosion.'],['Ag','Silver',47,'A shiny metal with excellent electrical conductivity.'],['Au','Gold',79,'A dense, corrosion-resistant metal valued for jewellery and electronics.'],['Hg','Mercury',80,'A metal that is liquid at room temperature.'],['Pb','Lead',82,'A dense metal that has many historic industrial uses.'],['U','Uranium',92,'A heavy radioactive element found naturally in Earth’s crust.']
];
const periodic=$('periodicTable');
elements.forEach((e,i)=>{const b=document.createElement('button');b.type='button';b.className='element-btn';b.innerHTML=e[0]+'<small>'+e[2]+'</small>';b.title=e[1];b.addEventListener('click',()=>selectElement(i,b));periodic.appendChild(b);});
function selectElement(i,b){const e=elements[i];document.querySelectorAll('.element-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('elementName').textContent=e[1];$('elementSymbol').textContent=e[0];$('elementNumber').textContent='Atomic number '+e[2];$('elementFact').textContent=e[3];}
selectElement(0,periodic.querySelector('.element-btn'));

const ss=$('solutionSolute'), sw=$('solutionWater');
function updateSolution(){const sol=+ss.value,water=+sw.value,total=sol+water,pct=total?sol/total*100:0;$('solutionSoluteValue').textContent=sol;$('solutionWaterValue').textContent=water;$('solutionPercent').textContent=pct.toFixed(1)+'%';$('solutionConcentration').textContent=pct.toFixed(1)+'%';$('solutionTotal').textContent=total+' g/mL*';$('solutionLiquid').style.height=Math.max(12,Math.min(92,pct+18))+'%';}
[ss,sw].forEach(x=>x.addEventListener('input',updateSolution));updateSolution();


// ===== Science Lab V11: Reliable Interactive Mathematics Lab =====
(function(){
  function el(id){return document.getElementById(id)}
  function showMath(key){
    document.querySelectorAll('.math-tab').forEach(b=>b.classList.toggle('active', b.dataset.math===key));
    document.querySelectorAll('.math-panel').forEach(p=>p.classList.add('hidden'));
    const panel=el(key+'Math');
    if(panel) panel.classList.remove('hidden');
  }
  document.addEventListener('click', function(e){
    const tab=e.target.closest('.math-tab');
    if(tab){e.preventDefault();showMath(tab.dataset.math);return;}
    const nav=e.target.closest('.math-next,.math-back');
    if(nav){e.preventDefault();showMath(nav.dataset.go);return;}
    if(e.target.closest('#calculateArithmetic')) arithmetic();
    if(e.target.closest('#calculateFraction')) fraction();
    if(e.target.closest('#calculateShape')) shape();
    if(e.target.closest('#solveAlgebra')) solveAlgebra();
    if(e.target.closest('#evaluateExpression')) evaluateExpression();
    if(e.target.closest('#mathComplete')){safeStorage.setItem('scienceLabMathComplete','1'); if(typeof unlockBadge==='function')unlockBadge('badgeExplorer'); if(typeof showMessage==='function')showMessage('Mathematics Lab complete! 🎉');}
  });
  function arithmetic(){
    const a=Number(el('arithA').value), b=Number(el('arithB').value), op=el('arithOp').value;
    let r;
    if(!Number.isFinite(a)||!Number.isFinite(b)){el('arithResult').textContent='Enter two numbers';return;}
    if(op==='+')r=a+b; else if(op==='-')r=a-b; else if(op==='*')r=a*b; else r=b===0?'Cannot divide by zero':a/b;
    el('arithResult').textContent=typeof r==='number'&&Number.isFinite(r)?String(Number(r.toFixed(8))):r;
  }
  function fraction(){const n=Number(el('fracNum').value),d=Number(el('fracDen').value);if(!Number.isFinite(n)||!Number.isFinite(d)){el('fracResult').textContent='Enter a numerator and denominator';return;}if(d===0){el('fracResult').textContent='Denominator cannot be 0';return;}const v=n/d;el('fracResult').textContent=`${Number(v.toFixed(8))} = ${Number((v*100).toFixed(4))}%`;}
  function angle(){const a=Number(el('angleInput').value);el('angleValue').textContent=a;let t;if(a===0)t='Zero angle';else if(a<90)t='Acute angle';else if(a===90)t='Right angle';else if(a<180)t='Obtuse angle';else if(a===180)t='Straight angle';else if(a<360)t='Reflex angle';else t='Full turn';el('angleResult').textContent=t;}
  function shapeFields(){const type=el('shapeType').value,box=el('shapeInputs');box.innerHTML='';const fields=type==='rectangle'?[['shapeW','Width'],['shapeH','Height']]:type==='square'?[['shapeS','Side']]:type==='triangle'?[['shapeA','Side A'],['shapeB','Side B'],['shapeC','Side C'],['shapeBase','Base'],['shapeHeight','Height']]:[['shapeR','Radius']];fields.forEach(([id,label])=>{const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.id=id;input.type='number';input.min='0';input.step='any';input.value=type==='triangle'?3:5;l.appendChild(input);box.appendChild(l);});}
  function shape(){const t=el('shapeType').value;let area=0,per=0;if(t==='rectangle'){const w=+el('shapeW').value,h=+el('shapeH').value;area=w*h;per=2*(w+h);}else if(t==='square'){const s=+el('shapeS').value;area=s*s;per=4*s;}else if(t==='triangle'){const a=+el('shapeA').value,b=+el('shapeB').value,c=+el('shapeC').value,base=+el('shapeBase').value,h=+el('shapeHeight').value;per=a+b+c;area=.5*base*h;}else{const r=+el('shapeR').value;area=Math.PI*r*r;per=2*Math.PI*r;}el('shapeResult').textContent=`Area: ${Number(area.toFixed(3))} • Perimeter/Circumference: ${Number(per.toFixed(3))}`;}
  function solveAlgebra(){const a=+el('algA').value,b=+el('algB').value,c=+el('algC').value;if(a===0){el('algResult').textContent=b===c?'Every value of x works':'No solution';return;}el('algResult').textContent=`x = ${Number(((c-b)/a).toFixed(8))}`;}
  function evaluateExpression(){const a=+el('exprA').value,b=+el('exprB').value,x=+el('exprX').value;el('exprResult').textContent=String(Number((a*x+b).toFixed(8)));}
  ['arithA','arithB','arithOp'].forEach(id=>el(id).addEventListener('input',arithmetic));
  ['fracNum','fracDen'].forEach(id=>el(id).addEventListener('input',fraction));
  el('angleInput').addEventListener('input',angle);
  el('shapeType').addEventListener('change',()=>{shapeFields();shape();});
  ['shapeInputs','algA','algB','algC','exprA','exprB','exprX'].forEach(id=>{const n=el(id);if(n)n.addEventListener('input',()=>{if(id==='shapeInputs')shape();else if(id.startsWith('alg'))solveAlgebra();else evaluateExpression();});});
  shapeFields(); angle(); arithmetic(); fraction(); shape(); solveAlgebra(); evaluateExpression();
})();
