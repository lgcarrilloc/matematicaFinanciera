"use strict";

// utilitarios 
function recuperaraTexto(idComponente){
    return document.getElementById(idComponente).value;
}
function recuperarInt(idComponente){
    return parseInt(recuperaraTexto(idComponente));
}
function recuperarFloat(idComponente){
    return parseFloat(recuperaraTexto(idComponente));
}
function mostrarTexto(idComponente,mensaje){
    document.getElementById(idComponente).innerText = mensaje;
}
function mostrarTextoEnCaja(idComponente,mensaje){
    document.getElementById(idComponente).value = mensaje;
}
function mostrarImagen(idComponente,rutaImagen){
    document.getElementById(idComponente).src = rutaImagen;
}
function limpiarResultados(){
    document.querySelectorAll(".result-box")
    .forEach(r => r.classList.remove("show"));
}


//inicio de la aplicación
window.onload = function(){
    document.querySelectorAll(".content-section, .main-section")
    .forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".unit-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".result-box")
    .forEach(r => r.classList.remove("show"));
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
    .forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-btn")
    .forEach(b => b.classList.remove("active"));
    const sec = document.getElementById(id) ||
                document.getElementById("sec-" + id);
    if (sec) sec.classList.add("active");
    const botones = document.querySelectorAll(".nav-btn");
    const map = { materia:0, ejercicios:1, cuestionario:2, acerca:3 };
    if(map[id] !== undefined){
        botones[map[id]].classList.add("active");
    }

    limpiarResultados();
}


// Unidades
function mostrarUnidad(id){
    document.querySelectorAll(".unit-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".unit")
    .forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    const botones = document.querySelectorAll(".unit");
    const index = Array.from(botones).findIndex(b =>
        b.getAttribute("onclick").includes(id)
    );
    if(index !== -1){
        botones[index].classList.add("active");
    }
}


// Ejercicios
function mostrarEjercicio(id){
    document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".topic-btn")
    .forEach(b => b.classList.remove("active"));
    const mapa = {
        ejercicio1: "p1",
        ejercicio3: "p3",
        ejercicio5: "p5",
        ejercicio7: "p7"
    };
    const panel = mapa[id];
    if(panel){
        document.getElementById(panel).classList.add("active");
    }
    const botones = document.querySelectorAll(".topic-btn");
    const index = Array.from(botones).findIndex(b =>
        b.getAttribute("onclick").includes(id)
    );
    if(index !== -1){
        botones[index].classList.add("active");
    }
    limpiarResultados();
}


// Valor Presente

function calcVP(){
    let vf = recuperarFloat("vp_vf");
    let r  = recuperarFloat("vp_r") / 100;
    let n  = recuperarFloat("vp_n");
    let tipo = recuperaraTexto("vp_tipo");
    if(isNaN(vf) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = r;
    if(tipo === "mensual") i = r/12;
    if(tipo === "trimestral") i = r/4;
    let vp = vf / Math.pow(1 + i, n);
    let interes = vf - vp;
    let desc = (interes / vf) * 100;
    document.getElementById("r1").classList.add("show");
    mostrarTexto("r1_vp", fmt(vp));
    mostrarTexto("r1_interes", fmt(interes));
    mostrarTexto("r1_desc", fmtP(desc));
}

// Interés Simple
function calcIS(){
    let C = recuperarFloat("is_c");
    let r = recuperarFloat("is_r") / 100;
    let n = recuperarFloat("is_n");
    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let I = C * r * n;
    let M = C + I;
    document.getElementById("r3").classList.add("show");
    mostrarTexto("r3_interes", fmt(I));
    mostrarTexto("r3_total", fmt(M));
    mostrarTexto("r3_desc", fmtP((I/C)*100));
}

// Cuotas y Pagos
function calcCP(){
    let P = recuperarFloat("cp_p");
    let r = recuperarFloat("cp_r") / 100;
    let n = recuperarFloat("cp_n");
    let tipo = recuperaraTexto("cp_tipo");
    if(isNaN(P) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = r;
    if(tipo === "mensual") i = r/12;
    if(tipo === "trimestral") i = r/4;
    let cuota = P * (i / (1 - Math.pow(1+i, -n)));
    let total = cuota * n;
    let interes = total - P;
    document.getElementById("r5").classList.add("show");
    mostrarTexto("r5_cuota", fmt(cuota));
    mostrarTexto("r5_total", fmt(total));
    mostrarTexto("r5_interes", fmt(interes));
}


// Amortización Alemana
function calcAA(){
    let C = recuperarFloat("aa_c");
    let r = recuperarFloat("aa_r") / 100;
    let n = recuperarInt("aa_n");
    let tipo = recuperaraTexto("aa_tipo");
    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = r;
    if(tipo === "mensual") i = r/12;
    if(tipo === "trimestral") i = r/4;
    let amort = C / n;
    let saldo = C;
    let total = 0;
    let interesTotal = 0;
    let cuota1 = 0;
    for(let k=1; k<=n; k++){
        let interes = saldo * i;
        let cuota = amort + interes;
        if(k === 1) cuota1 = cuota;
        saldo -= amort;
        total += cuota;
        interesTotal += interes;
    }
    document.getElementById("r7").classList.add("show");
    mostrarTexto("r7_cuota", fmt(cuota1));
    mostrarTexto("r7_total", fmt(total));
    mostrarTexto("r7_interes", fmt(interesTotal));
}


// Cuestionario
function calcularPuntaje(){
    const respuestas = {
        q1: "b",
        q2: "a",
        q3: "b",
        q4: "a",
        q5: "a"
    };
    let puntaje = 0;
    for(let i=1; i<=5; i++){
        let sel = document.querySelector(`input[name="q${i}"]:checked`);
        if(sel && sel.value === respuestas["q"+i]){
            puntaje++;
        }
    }
    let porcentaje = (puntaje / 5) * 100;
    mostrarTexto("resultado-quiz",
        `Resultado: ${puntaje}/5 (${porcentaje}%)`
    );
}



