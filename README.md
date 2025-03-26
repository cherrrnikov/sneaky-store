## Sneaky-Store
A simple internet store with an admin panel.

🛠 Technologies

Backend:

  - Spring Boot

  - Hibernate

  - PostgreSQL

  - JWT

  - Maven

Frontend:

  - Vite + React

  - Infrastructure:

Docker

Nginx

Java Version: OpenJDK 23

🚀 Quick Start
Option 1: Run with .jar (requires Java 23+ and PostgreSQL)
Set up the database:

bash
Copy
createdb sneaky_store  
(Or create it via pgAdmin)

Run the application:

bash
Copy
java -jar sneaky-store-0.0.1-SNAPSHOT.jar  
The server will start at http://localhost:8080.

Option 2: Run with Docker (requires Docker & Docker Compose)
bash
Copy

docker-compose up --build  

The project will be available at http://localhost.

🔌 Access
Store Frontend:

Production: http://localhost

Development: http://localhost:3000 (if running Vite separately)

Admin Panel: /admin-login (ensure proper JWT authentication)

⚙️ Configuration
Modify settings in:

application.yml (Spring Boot configurations)

.env (React environment variables)

nginx.conf (Nginx server settings)

Note:

Ensure ports 8080, 5432 (PostgreSQL), and 80 are available.

On Linux, you may need to use sudo for Docker commands.

Adjust paths and configurations as needed for your setup.
