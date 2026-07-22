/* ============================================
   GO!! ANIMACIÓN - Simulador de Impacto
   Quiz interactivo + generación de resultados
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const simulador = document.getElementById('simulador');
  if (!simulador) return;

  const steps = simulador.querySelectorAll('.simulador-step');
  const progressBar = document.getElementById('progressBar');
  const stepNum = document.getElementById('stepNum');
  const totalSteps = 6; // Pasos totales (5 preguntas + email)
  let currentStep = 0;

  // === NAVEGACIÓN ENTRE PASOS ===
  function goToStep(stepIndex) {
    steps.forEach(step => step.classList.remove('active'));
    steps[stepIndex].classList.add('active');
    currentStep = stepIndex;

    // Actualizar barra de progreso (cap al 100%)
    const progress = Math.min((stepIndex / totalSteps) * 100, 100);
    progressBar.style.width = `${progress}%`;

    // Actualizar contador de paso
    if (stepNum) {
      const displayStep = Math.min(stepIndex + 1, totalSteps);
      stepNum.textContent = `${displayStep}`;
    }

    // Scroll al top del simulador
    simulador.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // === SELECCIÓN DE OPCIONES ===
  simulador.querySelectorAll('.simulador-option').forEach(option => {
    option.addEventListener('click', function () {
      const radio = this.querySelector('input[type="radio"]');
      if (!radio) return;

      // Deselect siblings
      const name = radio.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest('.simulador-option').classList.remove('selected');
      });

      // Select this
      radio.checked = true;
      this.classList.add('selected');

      // Enable next button
      const step = this.closest('.simulador-step');
      const nextBtn = step.querySelector('.next-step');
      if (nextBtn) nextBtn.disabled = false;
    });
  });

  // === BOTONES SIGUIENTE / ANTERIOR ===
  simulador.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    });
  });

  simulador.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    });
  });

  // === VALIDACIÓN EMAIL ===
  const emailInput = document.getElementById('sim-email');
  const nombreInput = document.getElementById('sim-nombre');
  const generarBtn = document.getElementById('generarInforme');

  function validateForm() {
    const email = emailInput?.value.trim();
    const nombre = nombreInput?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (generarBtn) {
      generarBtn.disabled = !(nombre && email && emailRegex.test(email));
    }
  }

  if (emailInput) emailInput.addEventListener('input', validateForm);
  if (nombreInput) nombreInput.addEventListener('input', validateForm);

  // === GENERAR INFORME ===
  if (generarBtn) {
    generarBtn.addEventListener('click', () => {
      // Recoger respuestas
      const respuestas = {
        tipo_hotel: document.querySelector('input[name="tipo_hotel"]:checked')?.value,
        habitaciones: document.querySelector('input[name="habitaciones"]:checked')?.value,
        situacion: document.querySelector('input[name="situacion"]:checked')?.value,
        objetivo: document.querySelector('input[name="objetivo"]:checked')?.value,
        temporada: document.querySelector('input[name="temporada"]:checked')?.value,
      };

      // Calcular métricas basadas en respuestas
      const metricas = calcularMetricas(respuestas);

      // Actualizar valores
      document.getElementById('metricResenas').textContent = metricas.resenas;
      document.getElementById('metricSatisfaccion').textContent = metricas.satisfaccion;
      document.getElementById('metricFidelizacion').textContent = metricas.fidelizacion;

      // Actualizar barras de progreso
      setTimeout(() => {
        document.getElementById('barResenas').style.width = metricas.resenas;
        document.getElementById('barSatisfaccion').style.width = metricas.satisfaccion;
        document.getElementById('barFidelizacion').style.width = metricas.fidelizacion;
      }, 100);

      // Generar recomendación
      const recomendacion = generarRecomendacion(respuestas);
      document.getElementById('recomendacionTitulo').textContent = recomendacion.titulo;
      document.getElementById('recomendacionTexto').textContent = recomendacion.texto;
      document.getElementById('recomendacionBtn').textContent = recomendacion.btnText;
      document.getElementById('recomendacionBtn').href = recomendacion.btnHref;

      // Mostrar resultado
      goToStep(steps.length - 1);
    });
  }

  // === CÁLCULO DE MÉTRICAS ===
  function calcularMetricas(respuestas) {
    let baseResenas = 25;
    let baseSatisfaccion = 20;
    let baseFidelizacion = 15;

    // Factor por tipo de hotel
    const factorTipo = {
      resort: 1.3,
      vacaciones: 1.2,
      ciudad: 0.9,
      rural: 1.0,
    };

    // Factor por tamaño
    const factorTamano = {
      pequeño: 0.9,
      mediano: 1.0,
      grande: 1.15,
      mega: 1.25,
    };

    // Factor por situación actual
    const factorSituacion = {
      ninguna: 1.4,  // Mayor impacto si no tienen nada
      basica: 1.2,
      externa: 1.1,
      profesional: 0.7,  // Menor margen de mejora
    };

    // Factor por objetivo
    const factorObjetivo = {
      reseñas: 1.2,
      fidelizar: 1.1,
      diferencia: 1.0,
      ocupacion: 1.15,
    };

    // Factor por temporada
    const factorTemporada = {
      todo_ano: 1.3,
      verano: 1.0,
      alta: 1.1,
      irregular: 0.9,
    };

    const ft = factorTipo[respuestas.tipo_hotel] || 1;
    const fa = factorTamano[respuestas.habitaciones] || 1;
    const fs = factorSituacion[respuestas.situacion] || 1;
    const fo = factorObjetivo[respuestas.objetivo] || 1;
    const fte = factorTemporada[respuestas.temporada] || 1;

    const resenas = Math.round(baseResenas * ft * fa * fs * fo * fte);
    const satisfaccion = Math.round(baseSatisfaccion * ft * fa * fs * fte);
    const fidelizacion = Math.round(baseFidelizacion * ft * fs * fte);

    return {
      resenas: `${Math.min(resenas, 60)}%`,
      satisfaccion: `${Math.min(satisfaccion, 50)}%`,
      fidelizacion: `${Math.min(fidelizacion, 40)}%`,
    };
  }

  // === RECOMENDACIÓN PERSONALIZADA ===
  function generarRecomendacion(respuestas) {
    // Lógica simple: basada en el tamaño del hotel y situación actual
    const tamano = respuestas.habitaciones || 'mediano';
    const situacion = respuestas.situacion || 'basica';
    const objetivo = respuestas.objetivo || 'reseñas';
    const tipo = respuestas.tipo_hotel || 'vacaciones';

    // Hoteles pequeños o con situación básica → Base
    if (tamano === 'pequeño' || situacion === 'ninguna') {
      return {
        titulo: 'Te recomendamos Go!! Base',
        texto: 'Perfecto para hoteles que quieren profesionalizar su animación sin complejidad. Incluye programación, equipo y biblioteca de actividades.',
        btnText: 'Solicitar Go!! Base',
        btnHref: 'contacto.html',
      };
    }

    // Hoteles medianos o con situación básica → Plus (recomendación por defecto)
    if (tamano === 'mediano' || situacion === 'basica' || situacion === 'externa') {
      return {
        titulo: 'Te recomendamos Go!! Plus',
        texto: 'La opción más equilibrada. Incluye conceptualización, formación, reportes y optimización continua de la experiencia.',
        btnText: 'Solicitar Go!! Plus',
        btnHref: 'contacto.html',
      };
    }

    // Hoteles grandes o con servicio profesional → Integra
    if (tamano === 'grande' || tamano === 'mega' || situacion === 'profesional') {
      return {
        titulo: 'Te recomendamos Go!! Integra',
        texto: 'La solución completa para hoteles que quieren externalizar toda la estrategia de ocio con dashboard, datos y acompañamiento continuo.',
        btnText: 'Solicitar Go!! Integra',
        btnHref: 'contacto.html',
      };
    }

    // Default
    return {
      titulo: 'Te recomendamos Go!! Plus',
      texto: 'Es la solución ideal para tu hotel. Incluye todo lo necesario para transformar tu experiencia de ocio.',
      btnText: 'Solicitar Go!! Plus',
      btnHref: 'contacto.html',
    };
  }

});