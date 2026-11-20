module.exports = {
  apps: [
    {
      name: 'tansacvenhuong-backend',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
