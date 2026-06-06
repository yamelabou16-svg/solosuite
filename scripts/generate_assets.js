const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Inicializar la API de Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('\x1b[31mError: GEMINI_API_KEY no está configurada en el archivo .env\x1b[0m');
  console.log('Por favor, edita tu archivo .env y añade tu API key de Google AI Studio.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Obtener el tema del asset desde los argumentos de la línea de comandos
const topic = process.argv[2] || 'Contrato de Desarrollo de Software Freelance';
console.log(`\n\x1b[36m[AssetForge] Iniciando generación de contenido para:\x1b[0m "${topic}"`);

async function generateAsset() {
  try {
    // Usar gemini-2.5-flash para generación rápida y económica de texto
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `
      Eres un experto redactor legal y de negocios para profesionales independientes (freelancers) y creadores de contenido.
      Tu tarea es escribir plantillas profesionales, contratos de servicios de alta calidad o guías de negocio exhaustivas.
      
      Reglas de formato:
      1. Debes escribir TODO en español.
      2. Usa formato Markdown limpio, bien estructurado con encabezados (#, ##, ###), viñetas, tablas cuando corresponda y bloques de notas importantes.
      3. Añade siempre una sección inicial de "Instrucciones de Uso" redactada de forma directa y útil.
      4. Si es un contrato o plantilla de propuesta, incluye marcadores de posición claros como [Nombre del Cliente], [Tarifa por Hora], [Fecha], etc.
      5. Al final de todo el documento, añade un aviso de exención de responsabilidad en cursiva:
         "*Descargo de responsabilidad: Este documento es una plantilla generada por IA para propósitos informativos y de referencia. No constituye asesoramiento legal profesional. Se recomienda revisar este documento con un abogado antes de su firma.*"
      6. No incluyas explicaciones previas ni posteriores fuera del documento Markdown. Genera directamente el texto del infoproducto.
    `;

    const prompt = `
      Genera una plantilla premium y exhaustiva sobre: "${topic}".
      Debe contener cláusulas claras (si es un contrato) o pasos detallados (si es una guía).
      Asegúrate de que cubra los siguientes puntos clave:
      - Introducción y contexto de uso.
      - Definición de los servicios, alcance del trabajo e hitos.
      - Tarifas, formas de pago, intereses por mora y propiedad intelectual.
      - Cláusulas de terminación del servicio y resolución de conflictos.
      - Secciones de firmas y anexos.
    `;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);

    const content = result.response.text();

    // Crear la carpeta de salida si no existe
    const outputDir = path.join(__dirname, '..', 'output', 'markdown');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Guardar el archivo Markdown
    const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    const outputPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(outputPath, content, 'utf8');

    console.log('\x1b[32m[AssetForge] ¡Contenido generado con éxito!\x1b[0m');
    console.log(`Guardado en: \x1b[34m${path.relative(process.cwd(), outputPath)}\x1b[0m\n`);
    
    console.log('--- Vista previa del contenido generado ---');
    console.log(content.split('\n').slice(0, 15).join('\n') + '\n...');
    console.log('-----------------------------------------');
    console.log('\nPróximo paso: Ejecuta el compilador de PDF con:');
    console.log(`\x1b[33mnode scripts/compile_pdf.js "output/markdown/${fileName}"\x1b[0m\n`);

  } catch (error) {
    console.error('\x1b[31mError durante la generación de contenido:\x1b[0m', error.message);
  }
}

generateAsset();
