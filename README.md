# SoloSuite & AssetForge: Portal Freelance e Infoproductos IA 🚀

Este proyecto es un sistema híbrido diseñado para generar ingresos pasivos:
1. **SoloSuite (Frontend)**: Un portal web interactivo con herramientas gratuitas (calculadora de tarifas, creador de propuestas, plantillas de e-mails de venta) para atraer tráfico orgánico masivo mediante posicionamiento web (SEO).
2. **AssetForge (Backend)**: Un motor en Node.js que utiliza la API de Gemini para generar guías y contratos profesionales en Markdown, y un compilador que los transforma en PDFs estéticos listos para vender en plataformas de descarga digital (Gumroad, Lemon Squeezy).

---

## 🛠️ Instalación y Requisitos

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Abre tu consola en este directorio e instala las dependencias:
   ```bash
   npm install
   ```

---

## ⚙️ Configuración de la API de Gemini (Opcional para pruebas)

El motor de generación utiliza la inteligencia artificial de Google Gemini para redactar los infoproductos.

1. Consigue una API Key gratuita en [Google AI Studio](https://aistudio.google.com/).
2. Abre el archivo `.env` en la raíz del proyecto.
3. Agrega tu API key:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```

---

## 🤖 Uso de AssetForge (Motor de Generación de PDFs)

### Paso 1: Generar el Contenido en Markdown
Ejecuta el script de generación especificando el tema del infoproducto entre comillas. Si no especificas un tema, se creará un contrato freelance por defecto.

```bash
# Ejemplo de generación personalizada
node scripts/generate_assets.js "Guia Completa de Finanzas para Creadores de Contenido"
```
*Esto creará un archivo `.md` en la carpeta `output/markdown/`.*

### Paso 2: Compilar el Markdown a PDF Premium
Usa el compilador de PDF pasando la ruta del archivo Markdown generado.

```bash
# Compilar el archivo generado a PDF
node scripts/compile_pdf.js "output/markdown/guia_completa_de_finanzas_para_creadores_de_contenido.md"
```
*Esto generará un PDF estilizado en la carpeta `output/pdf/` con cabeceras, pie de página numerado, fuentes elegantes y formato profesional.*

---

## 💻 Ejecución de SoloSuite (Portal Web Local)

Para visualizar e interactuar con el portal de herramientas web en tu navegador local, ejecuta:

```bash
npm start
```

Esto levantará un servidor local (usualmente en `http://localhost:3000` o `http://localhost:5000`). Abre esa dirección en tu navegador para ver la interfaz interactiva.

---

## 📂 Estructura de Archivos

* `src/`: Archivos del portal web (HTML, CSS y JS).
* `scripts/`: Scripts de automatización (generador de texto e integrador de PDF).
* `output/`: Carpeta autogenerada con tus activos (Markdown y PDF).
* `.env`: Archivo de configuración confidencial para tus credenciales de API.
