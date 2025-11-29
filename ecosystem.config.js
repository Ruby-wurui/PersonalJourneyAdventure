module.exports = {
  apps: [{
    name: 'portfolio-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_BACKEND_URL: 'http://149.88.88.205:4001',
      NEXT_PUBLIC_SOCKET_URL: 'http://149.88.88.205:4001'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git', '.next'],
    max_restarts: 10,
    min_uptime: '10s',
    autorestart: true
  }]
};
