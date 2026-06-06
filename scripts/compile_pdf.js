const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Obtener el archivo Markdown desde los argumentos de la línea de comandos
const inputArg = process.argv[2];
if (!inputArg) {
  console.error('\x1b[31mError: Debes especificar el archivo Markdown a compilar.\x1b[0m');
  console.log('Uso: node scripts/compile_pdf.js "output/markdown/tu_archivo.md"');
  process.exit(1);
}

const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`\x1b[31mError: El archivo no existe en la ruta:\x1b[0m ${inputPath}`);
  process.exit(1);
}

console.log(`\n\x1b[36m[AssetForge] Compilando PDF desde:\x1b[0m ${path.basename(inputPath)}`);

async function compilePDF() {
  try {
    const mdContent = fs.readFileSync(inputPath, 'utf8');

    // Configurar el documento PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 54, bottom: 70, left: 54, right: 54 },
      bufferPages: true // Habilita la numeración de páginas correcta al final
    });

    // Definir nombre del archivo PDF de salida
    const outputDir = path.join(__dirname, '..', 'output', 'pdf');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pdfName = path.basename(inputPath, '.md') + '.pdf';
    const outputPath = path.join(outputDir, pdfName);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Sistema de colores premium
    const colors = {
      primary: '#4f46e5',   // Indigo
      text: '#1f2937',      // Dark Gray
      muted: '#6b7280',     // Muted Gray
      lightBg: '#f9fafb',   // Background highlight
      border: '#e5e7eb',    // Light border
      accent: '#0d9488'     // Teal
    };

    // Procesar contenido por bloques (párrafos)
    const blocks = mdContent.split(/\n\n+/);
    let isFirstBlock = true;

    for (let block of blocks) {
      block = block.trim();
      if (!block) continue;

      // --- H1 TITLE (# ) ---
      if (block.startsWith('# ')) {
        const text = block.substring(2).trim();
        
        if (!isFirstBlock) {
          doc.addPage();
        }
        isFirstBlock = false;

        // Banner del título
        doc.fillColor(colors.primary);
        doc.font('Helvetica-Bold').fontSize(24);
        doc.text(text, { align: 'left' });
        doc.moveDown(0.5);
        
        // Línea divisoria decorativa
        doc.strokeColor(colors.primary).lineWidth(2)
           .moveTo(doc.page.margins.left, doc.y)
           .lineTo(doc.page.width - doc.page.margins.right, doc.y)
           .stroke();
        
        doc.moveDown(1.5);
        continue;
      }

      // --- H2 SECTION (## ) ---
      if (block.startsWith('## ')) {
        const text = block.substring(3).trim();
        
        // Evitar cabeceras huérfanas al final de la página
        if (doc.y > doc.page.height - doc.page.margins.bottom - 80) {
          doc.addPage();
        } else {
          doc.moveDown(1.5);
        }

        doc.fillColor(colors.primary);
        doc.font('Helvetica-Bold').fontSize(15);
        doc.text(text);
        doc.moveDown(0.6);
        continue;
      }

      // --- H3 SUBSECTION (### ) ---
      if (block.startsWith('### ')) {
        const text = block.substring(4).trim();
        
        if (doc.y > doc.page.height - doc.page.margins.bottom - 60) {
          doc.addPage();
        } else {
          doc.moveDown(1);
        }

        doc.fillColor(colors.text);
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text(text);
        doc.moveDown(0.5);
        continue;
      }

      // --- H4 SUBSECTION (#### ) ---
      if (block.startsWith('#### ')) {
        const text = block.substring(5).trim();
        
        if (doc.y > doc.page.height - doc.page.margins.bottom - 40) {
          doc.addPage();
        } else {
          doc.moveDown(0.8);
        }

        doc.fillColor(colors.text);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(text);
        doc.moveDown(0.4);
        continue;
      }

      // --- BLOCKQUOTE / CALLOUT (> ) ---
      if (block.startsWith('> ')) {
        const lines = block.split('\n').map(l => l.replace(/^>\s?/, '').trim());
        const text = lines.join(' ');
        
        doc.moveDown(0.5);
        const startX = doc.x;
        const startY = doc.y;
        
        // Reservar espacio temporal para calcular la altura
        doc.font('Helvetica-Oblique').fontSize(10);
        const textHeight = doc.heightOfString(text, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 20 });
        
        // Dibujar caja de fondo claro
        doc.rect(startX, startY - 4, doc.page.width - doc.page.margins.left - doc.page.margins.right, textHeight + 10)
           .fillColor(colors.lightBg).fill();
        
        // Dibujar borde lateral de color acento
        doc.rect(startX, startY - 4, 4, textHeight + 10)
           .fillColor(colors.accent).fill();

        // Escribir el texto
        doc.fillColor(colors.text);
        doc.font('Helvetica-Oblique').fontSize(10);
        doc.text(text, startX + 15, startY, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 25
        });
        
        doc.x = startX; // Resetear x
        doc.y = startY + textHeight + 12; // Mover y después de la caja
        continue;
      }

      // --- LIST ITEMS (- or *) ---
      if (block.startsWith('- ') || block.startsWith('* ') || /^\d+\.\s/.test(block)) {
        const items = block.split('\n');
        doc.moveDown(0.5);
        
        for (let item of items) {
          item = item.trim();
          if (!item) continue;
          
          let bullet = '• ';
          let itemText = item;
          
          if (item.startsWith('- ')) {
            itemText = item.substring(2);
          } else if (item.startsWith('* ')) {
            itemText = item.substring(2);
          } else {
            const match = item.match(/^(\d+\.)\s(.*)/);
            if (match) {
              bullet = match[1] + ' ';
              itemText = match[2];
            }
          }
          
          // Escribir la viñeta y el texto juntos para evitar desalineaciones y overlapping
          doc.fillColor(colors.text).font('Helvetica').fontSize(10.5);
          const fullText = bullet + itemText;
          renderInlineStyles(doc, fullText, colors);
          doc.moveDown(0.3);
        }
        doc.moveDown(0.5);
        continue;
      }

      // --- TEXTO PÁRRAFO NORMAL ---
      doc.fillColor(colors.text).font('Helvetica').fontSize(10.5);
      renderInlineStyles(doc, block, colors);
      doc.moveDown(0.8);
      isFirstBlock = false;
    }

    // --- AGREGAR CABECERAS Y PIES DE PÁGINA A TODO EL DOCUMENTO ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      // No poner cabecera ni pie si es una primera página especial, 
      // pero para documentos cortos de freelancers queda muy pro tenerlo en todo.
      
      // Cabecera de Página
      doc.fillColor(colors.muted).font('Helvetica-Bold').fontSize(8);
      doc.text('SOLOSUITE | ACTIVOS PREMIUM', doc.page.margins.left, 25);
      
      doc.strokeColor(colors.border).lineWidth(0.5)
         .moveTo(doc.page.margins.left, 35)
         .lineTo(doc.page.width - doc.page.margins.right, 35)
         .stroke();

      // Pie de Página
      doc.strokeColor(colors.border).lineWidth(0.5)
         .moveTo(doc.page.margins.left, doc.page.height - 45)
         .lineTo(doc.page.width - doc.page.margins.right, doc.page.height - 45)
         .stroke();

      doc.fillColor(colors.muted).font('Helvetica').fontSize(8);
      doc.text(
        `Documento generado con AssetForge. Reservados todos los derechos.`,
        doc.page.margins.left,
        doc.page.height - 35
      );
      
      doc.text(
        `Página ${i + 1} de ${range.count}`,
        doc.page.width - doc.page.margins.right - 100,
        doc.page.height - 35,
        { width: 100, align: 'right' }
      );
    }

    // Finalizar el documento
    doc.end();

    writeStream.on('finish', () => {
      console.log('\x1b[32m[AssetForge] ¡PDF compilado con éxito!\x1b[0m');
      console.log(`Guardado en: \x1b[34m${path.relative(process.cwd(), outputPath)}\x1b[0m\n`);
    });

  } catch (error) {
    console.error('\x1b[31mError durante la compilación de PDF:\x1b[0m', error.stack);
  }
}

// Helper para parsear estilos en línea como negrita (**)
function renderInlineStyles(doc, text, colors) {
  // Reemplazar saltos de línea simples por espacios en textos corrientes
  const sanitizedText = text.replace(/\n/g, ' ');
  const parts = sanitizedText.split('**');
  
  // Encontrar el último índice que tiene texto no vacío
  let lastNonEmptyIndex = parts.length - 1;
  while (lastNonEmptyIndex >= 0 && parts[lastNonEmptyIndex] === '') {
    lastNonEmptyIndex--;
  }

  // Si todo el texto está vacío, no hacemos nada
  if (lastNonEmptyIndex < 0) return;

  for (let i = 0; i <= lastNonEmptyIndex; i++) {
    const part = parts[i];
    const isBold = i % 2 !== 0;
    
    if (isBold) {
      doc.font('Helvetica-Bold').fillColor(colors.primary);
    } else {
      // Verificar si es cursiva común del disclaimer final
      if (part.startsWith('*') && part.endsWith('*')) {
        doc.font('Helvetica-Oblique').fillColor(colors.muted);
      } else {
        doc.font('Helvetica').fillColor(colors.text);
      }
    }

    // Si es el último elemento que realmente vamos a dibujar, continued es false
    const isLastRendered = (i === lastNonEmptyIndex);
    
    // Si el texto es cursiva y tiene asteriscos, quitar los asteriscos del renderizado
    let textToDraw = part;
    if (!isBold && part.startsWith('*') && part.endsWith('*')) {
      textToDraw = part.substring(1, part.length - 1);
    }

    doc.text(textToDraw, {
      continued: !isLastRendered,
      lineGap: 4
    });
  }
}

compilePDF();
