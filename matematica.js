"use strict";

// ================= UTILITARIOS =================
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

function limpiarCampos(){
    document.querySelectorAll("input")
    .forEach(c => {
        if(!c.closest("#clientePanel")) c.value = "";
    });
}

function fmt(v){
  return "$" + Number(v).toLocaleString("es-EC", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function fmtP(v){
  return Number(v).toFixed(2) + "%";
}


// ================= INICIO DE LA APLICACIÓN =================
window.onload = function(){
    document.querySelectorAll(".content-section, .main-section")
    .forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".unit-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".result-box")
    .forEach(r => r.classList.remove("show"));

    pintarClientes();
    mostrarClienteActivo();
};


// ================= NAVEGACIÓN PRINCIPAL =================
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


// ================= UNIDADES (sección Materia) =================
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


// ================= EJERCICIOS =================
function convertirTasa(r, tipo){
    switch(tipo){
        case "mensual": return r / 12;
        case "trimestral": return r / 4;
        case "semestral": return r / 2;
        default: return r; // anual
    }
}

function mostrarEjercicio(id){
    // Reglas de acceso: Amortización Francesa (ejercicio6) y Alemana (ejercicio7)
    // requieren un cliente activo con capacidad de pago suficiente.
    if(id === "ejercicio6" || id === "ejercicio7"){
        if(!clienteActivo){
            alert("Debe seleccionar un cliente (pestaña 'Clientes') antes de acceder a Amortización Francesa o Alemana.");
            return;
        }
        const cap = capacidadPago(clienteActivo);
        if(cap <= 0){
            alert(
                `Acceso bloqueado.\n\n` +
                `Cliente: ${clienteActivo.nombre} ${clienteActivo.apellido}\n` +
                `Ingresos: ${fmt(clienteActivo.ingresos)}\n` +
                `Egresos: ${fmt(clienteActivo.egresos)}\n` +
                `Capacidad de pago (Ingresos - Egresos): ${fmt(cap)}\n\n` +
                `El cliente no cuenta con capacidad de pago suficiente para acceder a créditos de Amortización Francesa o Alemana.`
            );
            return;
        }
    }

    document.querySelectorAll(".calc-panel")
    .forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".topic-btn")
    .forEach(b => b.classList.remove("active"));
    limpiarCampos();
    const mapa = {
        clientes: "clientePanel",
        ejercicio1: "p1",
        ejercicio2: "p2",
        ejercicio3: "p3",
        ejercicio4: "p4",
        ejercicio5: "p5",
        ejercicio6: "p6",
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


// ---------- Valor Presente ----------
function calcVP(){
    let vf = recuperarFloat("vp_vf");
    let r  = recuperarFloat("vp_r") / 100;
    let n  = recuperarFloat("vp_n");
    let tipo = recuperaraTexto("vp_tipo");
    if(isNaN(vf) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let vp = vf / Math.pow(1 + i, n);
    let interes = vf - vp;
    let desc = (interes / vf) * 100;
    document.getElementById("r1").classList.add("show");
    mostrarTexto("r1_vp", fmt(vp));
    mostrarTexto("r1_interes", fmt(interes));
    mostrarTexto("r1_desc", fmtP(desc));
}

// ---------- Valor Futuro ----------
function calcVF(){
    let vp = recuperarFloat("vf_vp");
    let r  = recuperarFloat("vf_r") / 100;
    let n  = recuperarFloat("vf_n");
    let tipo = recuperaraTexto("vf_tipo");
    if(isNaN(vp) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let vf = vp * Math.pow(1 + i, n);
    let interes = vf - vp;
    let inc = (interes / vp) * 100;
    document.getElementById("r2").classList.add("show");
    mostrarTexto("r2_vf", fmt(vf));
    mostrarTexto("r2_interes", fmt(interes));
    mostrarTexto("r2_inc", fmtP(inc));
}

// ---------- Interés Simple ----------
function calcIS(){
    let C = recuperarFloat("is_c");
    let r = recuperarFloat("is_r") / 100;
    let n = recuperarFloat("is_n");
    let tipo = recuperaraTexto("is_tipo");
    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let I = C * i * n;
    let M = C + I;
    document.getElementById("r3").classList.add("show");
    mostrarTexto("r3_interes", fmt(I));
    mostrarTexto("r3_total", fmt(M));
    mostrarTexto("r3_desc", fmtP((I/C)*100));
}

// ---------- Interés Compuesto ----------
function calcIC(){
    let C = recuperarFloat("ic_c");
    let r = recuperarFloat("ic_r") / 100;
    let n = recuperarFloat("ic_n");
    let tipo = recuperaraTexto("ic_tipo");
    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let M = C * Math.pow(1 + i, n);
    let I = M - C;
    document.getElementById("r4").classList.add("show");
    mostrarTexto("r4_interes", fmt(I));
    mostrarTexto("r4_total", fmt(M));
    mostrarTexto("r4_desc", fmtP((I/C)*100));
}


// ---------- Cuotas y Pagos ----------
function calcCP(){
    let P = recuperarFloat("cp_p");
    let r = recuperarFloat("cp_r") / 100;
    let n = recuperarFloat("cp_n");
    let tipo = recuperaraTexto("cp_tipo");
    if(isNaN(P) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let cuota = P * (i / (1 - Math.pow(1+i, -n)));
    let total = cuota * n;
    let interes = total - P;
    document.getElementById("r5").classList.add("show");
    mostrarTexto("r5_cuota", fmt(cuota));
    mostrarTexto("r5_total", fmt(total));
    mostrarTexto("r5_interes", fmt(interes));
}

// ---------- Amortización Francesa ----------
function calcAF(){
    if(!clienteActivo){
        alert("Seleccione un cliente en la pestaña 'Clientes' antes de calcular.");
        return;
    }

    let C = recuperarFloat("af_p");
    let r = recuperarFloat("af_r") / 100;
    let n = recuperarFloat("af_n");
    let tipo = recuperaraTexto("af_tipo");

    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }

    let i = convertirTasa(r, tipo);
    let cuota = C * (i / (1 - Math.pow(1 + i, -n)));

    // Validación de capacidad de pago: la cuota no debe superar
    // el PORCENTAJE_CAPACIDAD_MAXIMA de (ingresos - egresos) del cliente.
    const capacidad = capacidadPago(clienteActivo);
    const limite = capacidad * PORCENTAJE_CAPACIDAD_MAXIMA;
    if(capacidad <= 0 || cuota > limite){
        document.getElementById("r6").classList.remove("show");
        document.getElementById("r6_tabla").innerHTML = "";
        alert(
            `Crédito no viable para este cliente.\n\n` +
            `Cuota calculada: ${fmt(cuota)}\n` +
            `Capacidad de pago del cliente: ${fmt(capacidad)}\n` +
            `Límite permitido (${PORCENTAJE_CAPACIDAD_MAXIMA*100}% de la capacidad): ${fmt(limite)}\n\n` +
            `${clienteActivo.nombre} ${clienteActivo.apellido} no cuenta con capacidad de pago suficiente para esta Amortización Francesa.`
        );
        return;
    }

    let saldo = C;
    let total = cuota * n;
    let interesTotal = total - C;

    document.getElementById("r6").classList.add("show");
    mostrarTexto("r6_cuota", fmt(cuota));
    mostrarTexto("r6_total", fmt(total));
    mostrarTexto("r6_interes", fmt(interesTotal));

    let sumaInteres = 0;
    let sumaCapital = 0;
    let sumaCuota = 0;

    let tabla = `
    <table>
        <tr>
            <th>Periodo</th>
            <th>Saldo Inicial</th>
            <th>Interés</th>
            <th>Capital</th>
            <th>Cuota</th>
            <th>Saldo Final</th>
        </tr>
    `;

    for(let k = 1; k <= n; k++){
        let interes = saldo * i;
        let amort = cuota - interes;
        let saldoFinal = saldo - amort;

        sumaInteres += interes;
        sumaCapital += amort;
        sumaCuota += cuota;

        tabla += `
        <tr>
            <td>${k}</td>
            <td>${fmt(saldo)}</td>
            <td>${fmt(interes)}</td>
            <td>${fmt(amort)}</td>
            <td>${fmt(cuota)}</td>
            <td>${fmt(saldoFinal)}</td>
        </tr>
        `;

        saldo = saldoFinal;
    }

    tabla += `
    <tr style="font-weight:bold; background:#dff6dd; color:#0f172a;">
        <td colspan="2">TOTAL</td>
        <td>${fmt(sumaInteres)}</td>
        <td>${fmt(sumaCapital)}</td>
        <td>${fmt(sumaCuota)}</td>
        <td>-</td>
    </tr>
    `;

    tabla += `</table>`;

    document.getElementById("r6_tabla").innerHTML = tabla;
}

// ---------- Amortización Alemana ----------
function calcAA(){
    if(!clienteActivo){
        alert("Seleccione un cliente en la pestaña 'Clientes' antes de calcular.");
        return;
    }

    let C = recuperarFloat("aa_c");
    let r = recuperarFloat("aa_r") / 100;
    let n = recuperarInt("aa_n");
    let tipo = recuperaraTexto("aa_tipo");
    if(isNaN(C) || isNaN(r) || isNaN(n)){
        alert("Ingrese datos válidos");
        return;
    }
    let i = convertirTasa(r, tipo);
    let amort = C / n;

    // La cuota más alta en amortización alemana es siempre la del período 1
    let cuota1 = amort + (C * i);

    // Validación de capacidad de pago
    const capacidad = capacidadPago(clienteActivo);
    const limite = capacidad * PORCENTAJE_CAPACIDAD_MAXIMA;
    if(capacidad <= 0 || cuota1 > limite){
        document.getElementById("r7").classList.remove("show");
        document.getElementById("r7_tabla").innerHTML = "";
        alert(
            `Crédito no viable para este cliente.\n\n` +
            `Cuota del período 1: ${fmt(cuota1)}\n` +
            `Capacidad de pago del cliente: ${fmt(capacidad)}\n` +
            `Límite permitido (${PORCENTAJE_CAPACIDAD_MAXIMA*100}% de la capacidad): ${fmt(limite)}\n\n` +
            `${clienteActivo.nombre} ${clienteActivo.apellido} no cuenta con capacidad de pago suficiente para esta Amortización Alemana.`
        );
        return;
    }

    let saldo = C;
    let total = 0;
    let interesTotal = 0;
    let tabla = `
    <table>
        <tr>
            <th>Periodo</th>
            <th>Saldo Inicial</th>
            <th>Interés</th>
            <th>Capital</th>
            <th>Cuota</th>
            <th>Saldo Final</th>
        </tr>
    `;
    for(let k = 1; k <= n; k++){
        let interes = saldo * i;
        let cuota = amort + interes;
        let saldoFinal = saldo - amort;
        total += cuota;
        interesTotal += interes;
        tabla += `
        <tr>
            <td>${k}</td>
            <td>${fmt(saldo)}</td>
            <td>${fmt(interes)}</td>
            <td>${fmt(amort)}</td>
            <td>${fmt(cuota)}</td>
            <td>${fmt(saldoFinal)}</td>
        </tr>
        `;
        saldo = saldoFinal;
    }
    tabla += "</table>";
    document.getElementById("r7").classList.add("show");
    mostrarTexto("r7_cuota", fmt(cuota1));
    mostrarTexto("r7_total", fmt(total));
    mostrarTexto("r7_interes", fmt(interesTotal));
    document.getElementById("r7_tabla").innerHTML = tabla;
}

// ================= CUESTIONARIO =================
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


// ================= GESTIÓN DE CLIENTES =================
let clientes = JSON.parse(localStorage.getItem("clientesMF")) || [];

// Cliente actualmente seleccionado para operar créditos (objeto o null)
let clienteActivo = null;

// Regla de negocio: la cuota de un crédito de Amortización Francesa/Alemana
// no puede superar este porcentaje de la capacidad de pago del cliente.
// Cambia este valor si necesitas otro criterio (ej. 0.3 para 30%).
const PORCENTAJE_CAPACIDAD_MAXIMA = 0.4;

// Capacidad de pago = Ingresos - Egresos mensuales del cliente.
function capacidadPago(cliente){
    return cliente.ingresos - cliente.egresos;
}

function guardarCliente(){
    const cedula   = recuperaraTexto("cedula").trim();
    const nombre   = recuperaraTexto("nombre").trim();
    const apellido = recuperaraTexto("apellido").trim();
    const ingresos = recuperarFloat("ingresos");
    const egresos  = recuperarFloat("egresos");
    const telefono = recuperaraTexto("telefono").trim();
    const correo   = recuperaraTexto("correo").trim();

    if(!cedula || !nombre || !apellido || isNaN(ingresos) || isNaN(egresos)){
        alert("Complete al menos cédula, nombre, apellido, ingresos y egresos.");
        return;
    }
    if(clientes.some(c => c.cedula === cedula)){
        alert("Ya existe un cliente registrado con esa cédula.");
        return;
    }

    clientes.push({ cedula, nombre, apellido, ingresos, egresos, telefono, correo });
    localStorage.setItem("clientesMF", JSON.stringify(clientes));

    pintarClientes();
    limpiarCliente();
}

function limpiarCliente(){
    ["cedula","nombre","apellido","ingresos","egresos","telefono","correo"]
    .forEach(id => document.getElementById(id).value = "");
}

function eliminarCliente(cedula){
    clientes = clientes.filter(c => c.cedula !== cedula);
    localStorage.setItem("clientesMF", JSON.stringify(clientes));
    if(clienteActivo && clienteActivo.cedula === cedula){
        clienteActivo = null;
        mostrarClienteActivo();
    }
    pintarClientes();
}

function seleccionarCliente(cedula){
    const c = clientes.find(cl => cl.cedula === cedula);
    if(!c){
        alert("Cliente no encontrado.");
        return;
    }
    clienteActivo = c;
    mostrarClienteActivo();
    pintarClientes();
}

function quitarClienteActivo(){
    clienteActivo = null;
    mostrarClienteActivo();
    pintarClientes();
}

function mostrarClienteActivo(){
    const box = document.getElementById("clienteActivoBox");
    if(!box) return;
    if(!clienteActivo){
        box.classList.remove("show");
        return;
    }
    const cap = capacidadPago(clienteActivo);
    box.classList.add("show");
    mostrarTexto("clienteActivoNombre",
        `${clienteActivo.nombre} ${clienteActivo.apellido} (CI: ${clienteActivo.cedula})`);
    mostrarTexto("clienteActivoCapacidad", fmt(cap));
    const capEl = document.getElementById("clienteActivoCapacidad");
    capEl.classList.toggle("green", cap > 0);
}

function pintarClientes(){
    const tbody = document.getElementById("tablaClientes");
    if(!tbody) return;
    tbody.innerHTML = "";
    clientes.forEach(c => {
        const cap = capacidadPago(c);
        const esActivo = clienteActivo && clienteActivo.cedula === c.cedula;
        tbody.innerHTML += `
        <tr${esActivo ? ' style="outline:2px solid #3b82f6;"' : ''}>
          <td>${c.cedula}</td>
          <td>${c.nombre}</td>
          <td>${c.apellido}</td>
          <td>${fmt(c.ingresos)}</td>
          <td>${fmt(c.egresos)}</td>
          <td>${fmt(cap)}</td>
          <td>${c.telefono}</td>
          <td>${c.correo}</td>
          <td>
            <button class="calc-btn" onclick="seleccionarCliente('${c.cedula}')">${esActivo ? "Seleccionado ✓" : "Seleccionar"}</button>
            <button class="calc-btn" onclick="eliminarCliente('${c.cedula}')">Eliminar</button>
          </td>
        </tr>`;
    });
}