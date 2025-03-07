import { dirname } from "path";
import { fileURLToPath } from "url";

// Obtén la ruta del archivo actual (dirname.js)
const __filename = fileURLToPath(import.meta.url);

// Obtén la carpeta donde está el archivo
const __dirname = dirname(__filename);

// Subir dos directorios para llegar a la raíz del proyecto
const rootDir = dirname(__dirname);  // Esto sube un nivel al directorio "src"

export default rootDir;

