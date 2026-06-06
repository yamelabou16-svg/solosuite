// --- GESTIÓN DE PESTAÑAS (TABS) ---
function switchTab(tabId) {
  // Desactivar todas las pestañas y ocultar todas las herramientas
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.tool-card');
  
  tabs.forEach(tab => tab.classList.remove('active'));
  cards.forEach(card => card.classList.remove('active'));
  
  // Activar la pestaña y mostrar la herramienta seleccionada
  const activeTab = document.getElementById(`btn-tab-${tabId}`);
  const activeCard = document.getElementById(`${tabId}-tool`);
  
  if (activeTab) activeTab.classList.add('active');
  if (activeCard) activeCard.classList.add('active');
}

// --- HERRAMIENTA 1: CALCULADORA DE TARIFAS ---
function calculateRates() {
  // Capturar valores
  const personalExpenses = parseFloat(document.getElementById('calc-personal-expenses').value) || 0;
  const businessExpenses = parseFloat(document.getElementById('calc-business-expenses').value) || 0;
  const annualSavings = parseFloat(document.getElementById('calc-annual-savings').value) || 0;
  const weeklyHours = parseFloat(document.getElementById('calc-weekly-hours').value) || 0;
  const vacationWeeks = parseFloat(document.getElementById('calc-vacation-weeks').value) || 0;

  // Cálculos financieros
  const monthlyExpenses = personalExpenses + businessExpenses;
  const annualExpenses = monthlyExpenses * 12;
  
  // Asumir un 20% aproximado de impuestos para freelancers (multiplicamos las necesidades netas por 1.25 para estimar el bruto)
  const netNeeded = annualExpenses + annualSavings;
  const grossNeeded = netNeeded / 0.8; 

  // Cálculo de horas laborables reales al año
  const weeksWorked = Math.max(0, 52 - vacationWeeks);
  const totalBillableHours = weeksWorked * weeklyHours;

  // Tarifa por hora
  let hourlyRate = 0;
  if (totalBillableHours > 0) {
    hourlyRate = grossNeeded / totalBillableHours;
  }

  // Formatear resultados en dólares
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  // Actualizar UI
  document.getElementById('result-hourly').textContent = formatter.format(hourlyRate);
  document.getElementById('result-monthly-needed').textContent = formatter.format(grossNeeded / 12);
  document.getElementById('result-annual-needed').textContent = formatter.format(grossNeeded);
}

// --- HERRAMIENTA 2: CREADOR DE PROPUESTAS ---
function generateProposal() {
  const clientName = document.getElementById('prop-client-name').value.trim() || '[Cliente]';
  const projectName = document.getElementById('prop-project-name').value.trim() || '[Proyecto]';
  const price = parseFloat(document.getElementById('prop-price').value) || 0;
  const timeline = document.getElementById('prop-timeline').value.trim() || '[Plazo]';
  const servicesText = document.getElementById('prop-services').value.trim();

  // Formatear lista de servicios
  const servicesList = servicesText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `  - ${line}`)
    .join('\n');

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const halfPrice = formatter.format(price / 2);
  const totalPrice = formatter.format(price);

  const proposalTemplate = `==================================================
PROPUESTA COMERCIAL DE SERVICIOS
==================================================

PREPARADO PARA: ${clientName}
PROYECTO: ${projectName}
FECHA: ${new Date().toLocaleDateString('es-ES')}

--------------------------------------------------
1. DESCRIPCIÓN Y OBJETIVOS
--------------------------------------------------
El objetivo de este proyecto es proveer un servicio profesional de alta calidad orientado a resolver las necesidades digitales y operativas de ${clientName}, impulsando el crecimiento comercial del negocio en los plazos establecidos.

--------------------------------------------------
2. ALCANCE DE LOS SERVICIOS (ENTREGABLES)
--------------------------------------------------
Se realizarán y entregarán los siguientes servicios:
${servicesList || '  - Descripción de servicios generales por definir.'}

--------------------------------------------------
3. TIEMPOS Y ENTREGAS
--------------------------------------------------
El plazo estimado para completar los servicios descritos es de: ${timeline}.
El desarrollo comenzará inmediatamente después de la firma del contrato y el abono del depósito inicial.

--------------------------------------------------
4. PRESUPUESTO Y CONDICIONES DE PAGO
--------------------------------------------------
La tarifa total de inversión para este proyecto es de: ${totalPrice}

Términos de pago:
- Pago Inicial (50%): ${halfPrice} al inicio del proyecto.
- Pago Final (50%): ${halfPrice} tras la entrega y aprobación final.

--------------------------------------------------
5. ¿CÓMO EMPEZAMOS?
--------------------------------------------------
Para aceptar esta propuesta, por favor responde a este mensaje indicando tu conformidad. Posteriormente, se enviará el contrato legal definitivo para su firma digital.

==================================================
Gracias por la oportunidad de trabajar juntos.
==================================================`;

  document.getElementById('proposal-preview').textContent = proposalTemplate;
}

// --- HERRAMIENTA 3: EMAILS DE VENTA ---
function generateEmails() {
  const niche = document.getElementById('mail-niche').value.trim() || '[Tu Especialidad]';
  const problem = document.getElementById('mail-problem').value.trim() || '[Problema del Cliente]';
  const benefit = document.getElementById('mail-benefit').value.trim() || '[Beneficio que Ofreces]';

  const emailTemplate = `ASUNTO: Idea rápida para mejorar la conversión en su web / negocio

Hola [Nombre del Contacto],

Estuve revisando el sitio web de [Nombre de su Empresa] y noté un detalle importante: actualmente tienen un/a ${problem}. Esto suele causar que muchos clientes potenciales se vayan sin comprar o contactar.

Me especializo en ayudar a negocios similares a solucionar esto mediante ${niche}. De hecho, he trabajado con empresas similares logrando ${benefit}.

¿Tendría 5 minutos para una breve llamada o chat de WhatsApp esta semana y ver si esto tiene sentido para ustedes?

Un saludo cordial,

[Tu Nombre]
[Tu Teléfono / Enlace de Calendario]

--------------------------------------------------
EMAIL DE SEGUIMIENTO (Enviar 3 días después si no responden):
--------------------------------------------------
ASUNTO: RE: Idea rápida para mejorar la conversión en su web / negocio

Hola [Nombre del Contacto],

Solo quería asegurarme de que mi correo anterior no se perdió en tu bandeja de entrada. Sé que estás muy ocupado/a gestionando [Nombre de su Empresa].

¿Sigue siendo una prioridad para ustedes resolver el problema de ${problem} en este trimestre?

Si es así, encantado de agendar una llamada rápida de 5 minutos. Si no, ¡no te preocupes y disculpa las molestias!

Un saludo,

[Tu Nombre]`;

  document.getElementById('emails-preview').textContent = emailTemplate;
}

// --- COPIAR AL PORTAPAPELES ---
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    // Buscar el botón correspondiente
    const btn = document.querySelector(`button[onclick="copyToClipboard('${elementId}')"]`);
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = `<i data-lucide="check"></i> ¡Copiado!`;
    lucide.createIcons(); // Recargar iconos
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      lucide.createIcons();
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar: ', err);
  });
}

// --- EJECUTAR CÁLCULOS INICIALES AL CARGAR ---
window.onload = function() {
  calculateRates();
  generateProposal();
  generateEmails();
};
