"use strict";
//inicio de la aplicación
window.onload = function () {
  // ocultar secciones
  document.querySelectorAll(".content-section, .main-section")
    .forEach(s => s.style.display = "none");
  // ocultar unidades
  document.querySelectorAll(".unit-panel")
    .forEach(p => p.style.display = "none");
  // ocultar ejercicios
  document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
  // ocultar resultados
  document.querySelectorAll(".result-box")
    .forEach(r => r.style.display = "none");
};

// Funciones de formato
function fmt(v){
  return "$" + Number(v).toLocaleString("es-EC", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function fmtP(v){
  return Number(v).toFixed(2) + "%";
}


// Navegación Principal
function mostrarSeccion(id){
  document.querySelectorAll(".content-section, .main-section")
    .forEach(s => s.style.display = "none");
  const sec = document.getElementById(id) ||
              document.getElementById("sec-" + id);
  if (sec) sec.style.display = "block";
}


// Unidades
function mostrarUnidad(id){
    document.querySelectorAll(".unit-panel")
    .forEach(p => p.style.display = "none");
  const unidad = document.getElementById(id);
  if (unidad) unidad.style.display = "block";
}

// Ejercicios
function mostrarEjercicio(id) {
    document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
  const mapa = {
    ejercicio1: "p1",
    ejercicio3: "p3",
    ejercicio5: "p5",
    ejercicio7: "p7"
  };
  const real = mapa[id];
  if (real) document.getElementById(real).classList.add("active");
    document.querySelectorAll(".result-box").forEach(r => r.style.display = "none");

}

// Valor Presente---->

function calcVP() {
  const vf = parseFloat(document.getElementById("vp_vf").value);
  const r  = parseFloat(document.getElementById("vp_r").value) / 100;
  const n  = parseFloat(document.getElementById("vp_n").value);
  const tipo = document.getElementById("vp_tipo").value;
  if (isNaN(vf) || isNaN(r) || isNaN(n)) {
    alert("Complete los datos");
    return;
  }
  let i = r;
  if (tipo === "mensual") i = r / 12;
  if (tipo === "trimestral") i = r / 4;
  const vp = vf / Math.pow(1 + i, n);
  const interes = vf - vp;
  const desc = (interes / vf) * 100;
  document.getElementById("r1").style.display = "block";
  document.getElementById("r1_vp").textContent = fmt(vp);
  document.getElementById("r1_interes").textContent = fmt(interes);
  document.getElementById("r1_desc").textContent = fmtP(desc);
}

document.getElementById("r1").style.display = "block";

// Interés Simple

function calcIS() {
  const C = parseFloat(document.getElementById("is_c").value);
  const r = parseFloat(document.getElementById("is_r").value) / 100;
  const n = parseFloat(document.getElementById("is_n").value);
  if (isNaN(C) || isNaN(r) || isNaN(n)) {
    alert("Complete los datos");
    return;
  }
  const I = C * r * n;
  const M = C + I;
  document.getElementById("r3").style.display = "block";
  document.getElementById("r3_interes").textContent = fmt(I);
  document.getElementById("r3_total").textContent = fmt(M);
  document.getElementById("r3_desc").textContent = fmtP((I / C) * 100);
}


// Cuotas y Pagos

function calcCP() {
  const P = parseFloat(document.getElementById("cp_p").value);
  const r = parseFloat(document.getElementById("cp_r").value) / 100;
  const n = parseFloat(document.getElementById("cp_n").value);
  const tipo = document.getElementById("cp_tipo").value;
  if (isNaN(P) || isNaN(r) || isNaN(n)) {
    alert("Complete los datos");
    return;
  }
  let i = r;
  if (tipo === "mensual") i = r / 12;
  if (tipo === "trimestral") i = r / 4;
  const cuota = P * (i / (1 - Math.pow(1 + i, -n)));
  const total = cuota * n;
  const interes = total - P;
  document.getElementById("r5").style.display = "block";
  document.getElementById("r5_cuota").textContent = fmt(cuota);
  document.getElementById("r5_total").textContent = fmt(total);
  document.getElementById("r5_interes").textContent = fmt(interes);
}


// Amortización Alemana

function calcAA() {
  const C = parseFloat(document.getElementById("aa_c").value);
  const r = parseFloat(document.getElementById("aa_r").value) / 100;
  const n = parseInt(document.getElementById("aa_n").value);
  if (isNaN(C) || isNaN(r) || isNaN(n)) {
    alert("Complete los datos");
    return;
  }
  const amort = C / n;
  let saldo = C;
  let total = 0;
  let interesTotal = 0;
  let cuota1 = 0;
  for (let k = 1; k <= n; k++) {
    const interes = saldo * r;
    const cuota = amort + interes;
    if (k === 1) cuota1 = cuota;
    saldo -= amort;
    total += cuota;
    interesTotal += interes;
  }
  document.getElementById("r7").style.display = "block";
  document.getElementById("r7_cuota").textContent = fmt(cuota1);
  document.getElementById("r7_total").textContent = fmt(total);
  document.getElementById("r7_interes").textContent = fmt(interesTotal);
}


// Cuestionario
function calcularPuntaje() {
  const respuestas = {
    q1: "b",
    q2: "a",
    q3: "b",
    q4: "a",
    q5: "a"
  };
  let puntaje = 0;
  for (let i = 1; i <= 5; i++) {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if (sel && sel.value === respuestas["q" + i]) {
      puntaje++;
    }
  }
  const resultado = document.getElementById("resultado-quiz");
  const porcentaje = (puntaje / 5) * 100;
  resultado.innerHTML =
    `<h3>Resultado: ${puntaje}/5 (${porcentaje}%)</h3>`;
}


