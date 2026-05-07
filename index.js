const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Formata uptime em dias/horas/minutos
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

// Uso de CPU por core
function getCpuCores() {
  const cpus = os.cpus();
  return cpus.map((cpu, i) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const used = total - cpu.times.idle;
    return {
      core: i,
      model: cpu.model,
      speed: cpu.speed,
      usage: Math.round((used / total) * 100)
    };
  });
}

// Lista arquivos do projeto
function getProjectFiles() {
  try {
    return fs.readdirSync(process.cwd()).map(name => {
      try {
        const stat = fs.statSync(path.join(process.cwd(), name));
        return {
          name,
          type: stat.isDirectory() ? 'Dir' : 'Arquivo',
          size: stat.isDirectory() ? '-' : (stat.size / 1024).toFixed(2) + ' KB'
        };
      } catch { return null; }
    }).filter(Boolean);
  } catch { return []; }
}

// Interfaces de rede
function getNetworkInterfaces() {
  const ifaces = os.networkInterfaces();
  const result = [];
  for (const [name, addrs] of Object.entries(ifaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      result.push({ iface: name, ip: addr.address, family: addr.family });
    }
  }
  return result;
}

// IP principal
function getMainIP() {
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) return addr.address;
    }
  }
  return '127.0.0.1';
}

// Detecta ambiente de execução
function detectEnvironment() {
  if (process.env.RENDER)              return 'Executando no Render';
  if (process.env.RAILWAY_ENVIRONMENT) return 'Executando no Railway';
  if (process.env.VERCEL)              return 'Executando no Vercel';
  if (process.env.KOYEB_SERVICE_NAME)  return 'Executando no Koyeb';
  return 'Executando Localmente';
}

// ── ENDPOINT PRINCIPAL ──────────────────────────────────────────────────────
app.get('/api/sysinfo', (req, res) => {
  const totalMem  = os.totalmem();
  const freeMem   = os.freemem();
  const usedMem   = totalMem - freeMem;
  const memPct    = Math.round((usedMem / totalMem) * 100);
  const cores     = getCpuCores();
  const avgCpu    = Math.round(cores.reduce((a, c) => a + c.usage, 0) / cores.length);
  const uptimeSec = os.uptime();
  const files     = getProjectFiles();
  const fileCount = files.filter(f => f.type === 'Arquivo').length;
  const mainIP    = getMainIP();
  const network   = getNetworkInterfaces();

  res.json({
    // Barra de resumo do topo
    summary: {
      ram:       memPct,
      cpuAvg:    avgCpu,
      uptime:    formatUptime(uptimeSec),
      fileCount,
      mainIP,
      status:    memPct < 80 && avgCpu < 90 ? 'NORMAL' : 'ALERTA'
    },

    // Card Sistema
    sistema: {
      hostname:   os.hostname(),
      so:         os.type(),
      release:    os.release(),
      platform:   os.platform(),
      arch:       os.arch(),
      endianness: os.endianness(),
      node:       process.version
    },

    // Card Usuário
    usuario: {
      user:  os.userInfo().username,
      home:  os.userInfo().homedir,
      tmp:   os.tmpdir(),
      shell: os.userInfo().shell || 'N/A',
      uid:   os.userInfo().uid,
      gid:   os.userInfo().gid
    },

    // Card Memória RAM
    memoria: {
      total:  (totalMem / 1024 / 1024 / 1024).toFixed(2),
      usada:  (usedMem  / 1024 / 1024 / 1024).toFixed(2),
      livre:  (freeMem  / 1024 / 1024 / 1024).toFixed(2),
      porCpu: ((usedMem / 1024 / 1024 / 1024) / cores.length).toFixed(2),
      pct:    memPct
    },

    // Card CPU
    cpu: {
      nucleos: cores.length,
      modelo:  cores[0]?.model || 'N/A',
      loadAvg: os.loadavg().map(v => v.toFixed(2)).join(' | '),
      cores
    },

    // Card Rede
    rede: {
      mainIP,
      interfaces: network.length,
      lista: network
    },

    // Card Arquivos
    arquivos: {
      lista: files.slice(0, 8)
    },

    // Card Tempo
    tempo: {
      uptime:   formatUptime(uptimeSec),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      iso:      new Date().toISOString(),
      local:    new Date().toLocaleString('pt-BR')
    },

    // Card Aplicação
    aplicacao: {
      pid:      process.pid,
      dir:      process.cwd(),
      memNode:  (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB',
      execPath: process.execPath,
      port:     PORT
    },

    // Card Ambiente
    ambiente: {
      status:    detectEnvironment(),
      port:      PORT,
      nodeEnv:   process.env.NODE_ENV || 'development',
      kernelAws: os.release().toLowerCase().includes('aws') ? 'Sim' : 'Não'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ SO Dashboard rodando em http://localhost:${PORT}`);
});
