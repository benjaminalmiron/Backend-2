import { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);


const __dirname = dirname(__filename);


const rootDir = dirname(__dirname);  

export default rootDir;

