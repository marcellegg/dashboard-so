const express = require('express');
const cors = require('cors');
const os = require('os');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/sysinfo', (req, res) => {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const uptimeSeconds = os.uptime();
    
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    const interfaces = os.networkInterfaces();
    let mainIp = 'Desconhecido';
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                mainIp = alias.address;
            }
        }
    }

    let totalFiles = 0;
    try {
        const files = fs.readdirSync(__dirname);
        totalFiles = files.length;
    } catch (err) {
        totalFiles = 'Erro ao ler';
    }

    res.json({
        sistema: {
            host: os.hostname(),
            so: os.type(),
            release: os.release(),
            plataforma: os.platform(),
            arquitetura: os.arch(),
            endianness: os.endianness()
        },
        usuario: {
            ...os.userInfo()
        },
        memoria: {
            totalGB: (totalMem / 1024 / 1024 / 1024).toFixed(2),
            usadaGB: (usedMem / 1024 / 1024 / 1024).toFixed(2),
            livreGB: (freeMem / 1024 / 1024 / 1024).toFixed(2),
            usoPercent: ((usedMem / totalMem) * 100).toFixed(0)
        },
        cpu: {
            nucleos: cpus.length,
            modelo: cpus[0]?.model || 'N/A',
            loadAvg: os.loadavg().map(load => load.toFixed(2))
        },
        rede: {
            ipPrincipal: mainIp,
            interfacesTotal: Object.keys(interfaces).length
        },
        tempo: {
            uptimeFormatado: `${days}d ${hours}h ${minutes}m`,
            iso: new Date().toISOString()
        },
        aplicacao: {
            pid: process.pid,
            diretorio: __dirname,
            versaoNode: process.version,
            porta: PORT,
            ambiente: process.env.NODE_ENV || 'local',
            status: process.env.RENDER ? 'Executando no Render' : 'Executando Localmente'
        },
        arquivosTotais: totalFiles
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});