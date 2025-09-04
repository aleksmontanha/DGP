module.exports = {
  apps: [
    {
      name: 'web-portal-dgp',
      cwd: '/var/portal-dgp/web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: '3000'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/portal-dgp/logs/pm2-web-error.log',
      out_file: '/var/portal-dgp/logs/pm2-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
};

