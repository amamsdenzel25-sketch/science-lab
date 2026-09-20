const $=id=>document.getElementById(id);
function showMessage(m){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3000)}
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.querySelectorAll(".lab-panel").forEach(x=>x.classList.add("hidden"));$(tab.dataset.lab+"Lab").classList.remove("hidden");if(tab.dataset.lab==="projectile")drawProjectile()}));
const pv=$("pVelocity"),pa=$("pAngle");
function drawProjectile(){const v=+pv.value,a=+pa.value*Math.PI/180,g=9.81,r=v*v*Math.sin(2*a)/g,h=v*v*Math.sin(a)**2/(2*g),t=2*v*Math.sin(a)/g;$("pVelocityValue").textContent=v;$("pAngleValue").textContent=Math.round(a*180/Math.PI);$("pRange").textContent=r.toFixed(1)+" m";$("pHeight").textContent=h.toFixed(1)+" m";$("pTime").textContent=t.toFixed(2)+" s";const c=$("projectileCanvas"),ctx=c.getContext("2d"),d=devicePixelRatio||1,w=c.clientWidth,H=c.clientHeight;c.width=w*d;c.height=H*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,H);ctx.strokeStyle="#087f8c";ctx.lineWidth=4;ctx.setLineDash([8,7]);ctx.beginPath();for(let i=0;i<=60;i++){const q=t*i/60,x=25+(w-50)*i/60,ym=v*Math.sin(a)*q-.5*g*q*q,y=H-30-(ym/Math.max(h,1))*(H-60);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.setLineDash([])}
[pv,pa].forEach(x=>x.addEventListener("input",drawProjectile));window.addEventListener("resize",drawProjectile);drawProjectile();
const force=$("force"),mass=$("mass");function updateNewton(){const f=+force.value,m=+mass.value;$("forceValue").textContent=f;$("massValue").textContent=m;$("acceleration").textContent=(f/m).toFixed(2)+" m/s²";$("forceBox").textContent=f+" N";$("forceBox").style.transform=`scale(${.75+f/180})`}[force,mass].forEach(x=>x.addEventListener("input",updateNewton));updateNewton();
const planet=$("planet"),gm=$("gMass");function updateGravity(){const m=+gm.value,g=+planet.value;$("gMassValue").textContent=m;$("weight").textContent=(m*g).toFixed(1)+" N"}[planet,gm].forEach(x=>x.addEventListener("input",updateGravity));updateGravity();
const em=$("eMass"),ev=$("eVelocity");function updateEnergy(){const m=+em.value,v=+ev.value,k=.5*m*v*v;$("eMassValue").textContent=m;$("eVelocityValue").textContent=v;$("kinetic").textContent=k.toFixed(0)+" J";$("energyBall").style.transform=`scale(${Math.min(1.8,.75+k/3000)})`}[em,ev].forEach(x=>x.addEventListener("input",updateEnergy));updateEnergy();
const am=$("aMass"),av=$("aVel"),bm=$("bMass"),bv=$("bVel");function updateCollision(){const m1=+am.value,v1=+av.value,m2=+bm.value,v2=+bv.value,u=(m1*v1+m2*v2)/(m1+m2);$("aMassValue").textContent=m1;$("aVelValue").textContent=v1;$("bMassValue").textContent=m2;$("bVelValue").textContent=v2;$("finalVelocity").textContent=u.toFixed(2)+" m/s";$("collisionLab .ball-a").style.transform=`translateX(${v1*3}px)`;$("collisionLab .ball-b").style.transform=`translateX(${v2*3}px)`}[am,av,bm,bv].forEach(x=>x.addEventListener("input",updateCollision));updateCollision();
$("ideaButton").addEventListener("click",()=>{const i=prompt("Write a scientific question or hypothesis:");if(i&&i.trim())showMessage("Idea saved for our future community: "+i.trim())});

// ===== Science Lab V3: experiments, quiz, and progress =====
const savedScore = Number(localStorage.getItem("scienceLabQuizScore") || 0);
const savedBadges = JSON.parse(localStorage.getItem("scienceLabBadges") || "[]");
$("quizScore").textContent = savedScore;
$("badgeCount").textContent = savedBadges.length;

function unlockBadge(id){
  if(!savedBadges.includes(id)){
    savedBadges.push(id);
    localStorage.setItem("scienceLabBadges", JSON.stringify(savedBadges));
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

const quizQuestions=[
  {q:"What is the SI unit of force?",a:["Joule","Newton","Watt","Pascal"],c:1},
  {q:"Which planet is closest to the Sun?",a:["Earth","Mars","Mercury","Jupiter"],c:2},
  {q:"What is the chemical symbol for oxygen?",a:["Ox","O","Og","C"],c:1},
  {q:"What happens to kinetic energy when speed increases?",a:["It decreases","It stays the same","It increases","It becomes zero"],c:2},
  {q:"Which particle has a negative electric charge?",a:["Proton","Neutron","Electron","Nucleus"],c:2}
];
let quizIndex=0, quizRoundScore=0, answered=false;
function renderQuiz(){
  const q=quizQuestions[quizIndex];
  $("quizProgress").textContent=`Question ${quizIndex+1} of ${quizQuestions.length}`;
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
  if(quizIndex<quizQuestions.length-1){
    $("nextQuestion").classList.remove("hidden");
  }else{
    localStorage.setItem("scienceLabQuizScore",String(Math.max(savedScore,quizRoundScore)));
    $("quizScore").textContent=Math.max(savedScore,quizRoundScore);
    $("restartQuiz").classList.remove("hidden");
    if(quizRoundScore===quizQuestions.length){
      unlockBadge("badgePerfect");
      $("quizFeedback").textContent="Perfect quiz! 🏆";
    }else{
      $("quizFeedback").textContent+=` Final score: ${quizRoundScore}/${quizQuestions.length}.`;
    }
  }
}
$("nextQuestion").addEventListener("click",()=>{quizIndex++;renderQuiz();});
$("restartQuiz").addEventListener("click",()=>{quizIndex=0;quizRoundScore=0;renderQuiz();});
renderQuiz();
