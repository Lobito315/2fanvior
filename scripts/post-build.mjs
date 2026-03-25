import fs from 'fs';
import path from 'path';

const openNextDir = path.join(process.cwd(), '.open-next');
const workerJs = path.join(openNextDir, 'worker.js');
const workerFinal = path.join(openNextDir, '_worker.js');
const routesFile = path.join(openNextDir, '_routes.json');
const assetsDir = path.join(openNextDir, 'assets');

console.log('--- Iniciando post-build para Cloudflare Pages ---');

// 1. Copiar worker.js a _worker.js
if (fs.existsSync(workerJs)) {
    fs.copyFileSync(workerJs, workerFinal);
    console.log('✅ worker.js copiado a _worker.js');
} else {
    console.error('❌ Error: .open-next/worker.js no encontrado');
    process.exit(1);
}

// 2. Mover archivos estáticos de assets/ a la raíz de .open-next
if (fs.existsSync(assetsDir)) {
    console.log('Moviendo activos estáticos de assets/ a la raíz...');
    const items = fs.readdirSync(assetsDir);
    
    for (const item of items) {
        const src = path.join(assetsDir, item);
        const dest = path.join(openNextDir, item);
        
        // Si el destino ya existe, lo eliminamos primero (para carpetas recurrentes como _next)
        if (fs.existsSync(dest)) {
            fs.rmSync(dest, { recursive: true, force: true });
        }
        
        fs.renameSync(src, dest);
        console.log(`  - Movido: ${item}`);
    }
    
    // Eliminar la carpeta assets vacía
    fs.rmSync(assetsDir, { recursive: true, force: true });
    console.log('✅ Activos estáticos movidos correctamente');
}

// 3. Crear _routes.json optimizado
const routes = {
    version: 1,
    include: ["/*"],
    exclude: [
        "/_next/*",
        "/favicon.ico",
        "/images/*",
        "/assets/*",
        "/*.png",
        "/*.jpg",
        "/*.svg",
        "/*.ico"
    ]
};

fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
console.log('✅ _routes.json generado con exclusiones estáticas');
console.log('--- Post-build completado con éxito ---');
