/* ============================================
   GO!! ANIMACIÓN - Auditoría Gratuita
   Formulario de diagnóstico rápido
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const enviarBtn = document.getElementById('enviarAuditoria');
  if (!enviarBtn) return;

  enviarBtn.addEventListener('click', () => {
    // Validar campos obligatorios
    const nombre = document.getElementById('aud-nombre')?.value.trim();
    const email = document.getElementById('aud-email')?.value.trim();
    const hotel = document.getElementById('aud-hotel')?.value.trim();
    const tipo = document.getElementById('aud-tipo')?.value;
    const animacion = document.getElementById('aud-animacion')?.value;

    if (!nombre || !email || !hotel || !tipo || !animacion) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, introduce un email válido.');
      return;
    }

    // Recoger datos
    const datos = {
      nombre,
      email,
      hotel,
      ubicacion: document.getElementById('aud-ubicacion')?.value.trim() || '',
      telefono: document.getElementById('aud-telefono')?.value.trim() || '',
      tipo,
      animacion,
      problema: document.getElementById('aud-problema')?.value.trim() || '',
      fecha: new Date().toISOString(),
    };

    // Simular envío (en producción aquí iría un fetch a la API)
    console.log('Auditoría solicitada:', datos);

    // Mostrar resultado
    document.getElementById('auditoriaFormContent').style.display = 'none';
    document.getElementById('auditoriaResultado').style.display = 'block';

    // Scroll al resultado
    document.getElementById('auditoriaForm').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  });

});
