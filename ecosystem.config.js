module.exports = {
	  apps: [
		      {
			            name: "chaintrack-server",
			            script: "dist/src/main.js",
			            cwd: "./server",   // adjust path
			            env: {
					            NODE_ENV: "production",
					            PORT: 4000
					          },
			            instances: 1,
			            autorestart: true,
			            watch: false,
			            max_memory_restart: "1000M", // restart if memory exceeds
			            error_file: "./logs/nest-error.log",
			            out_file: "./logs/nest-out.log",
			            log_date_format: "YYYY-MM-DD HH:mm Z"
			          },
		      {
			            name: "chaintrack-client",
			            script: "npm",
			            args: "run start",
			            cwd: "./frontend-scaffindo",  // adjust path
			            env: {
					            NODE_ENV: "production",
					            PORT: 3000
					          },
			            instances: 1,
			            autorestart: true,
			            watch: false,
			            max_memory_restart: "1000M",
			            error_file: "./logs/next-error.log",
			            out_file: "./logs/next-out.log",
			            log_date_format: "YYYY-MM-DD HH:mm Z"
			          }
		    ]
};

