# MERN Stack Task Manager Application

A complete three-tier application built with MongoDB, Express.js, React.js, and Node.js, fully containerized with Docker.

## Project Structure

```
task-manager-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env (create this file)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── public/
│       └── index.html
└── README.md
```

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (optional, for version control)

### Step 1: Create Project Directory
```bash
mkdir task-manager-app
cd task-manager-app
```

### Step 2: Create Directory Structure
```bash
mkdir backend frontend
mkdir frontend/src frontend/public
```

### Step 3: Create Files
Copy the provided code into the respective files according to the project structure above.

### Step 4: Create Environment File
Create a `.env` file in the backend directory:

```bash
# backend/.env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/taskapp?authSource=admin
FRONTEND_URL=http://localhost:3000
```

### Step 5: Build and Run with Docker
```bash
# From the root directory (task-manager-app/)
docker-compose up --build
```

This command will:
- Build the backend and frontend Docker images
- Start MongoDB, Backend API, and Frontend services
- Create necessary networks and volumes

### Step 6: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (with optional query parameters)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Statistics
- `GET /api/stats` - Get task statistics

### Health Check
- `GET /api/health` - Health check endpoint

## Features

### Backend Features
- RESTful API with Express.js
- MongoDB integration with Mongoose
- Input validation and error handling
- Security middleware (Helmet, CORS, Rate limiting)
- Health check endpoint
- Graceful shutdown handling

### Frontend Features
- Modern React.js interface
- Task CRUD operations
- Priority levels (High, Medium, Low)
- Task filtering (All, Completed, Pending)
- Task sorting (Date, Title, Priority)
- Statistics dashboard
- Responsive design
- Real-time updates

### Database Schema
```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  completed: Boolean (default: false),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## Docker Configuration

### Services
1. **MongoDB**: Official MongoDB 7.0 image with authentication
2. **Backend**: Node.js application with Express API
3. **Frontend**: React development server

### Networking
- All services communicate through a custom bridge network
- MongoDB is only accessible from backend service
- Frontend and backend are exposed to host machine

### Volumes
- MongoDB data persisted in named volume
- Source code mounted for development (hot reload)

## Development Commands

```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Execute commands in running containers
docker-compose exec backend npm run dev
docker-compose exec frontend npm test
```

## Environment Variables

### Backend
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- MongoDB authentication
- Non-root user in Docker containers

## Production Considerations

For production deployment:
1. Use environment-specific `.env` files
2. Implement SSL/TLS certificates
3. Set up proper logging and monitoring
4. Use Docker secrets for sensitive data
5. Implement backup strategies for MongoDB
6. Use production-ready reverse proxy (Nginx)
7. Set up CI/CD pipeline

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **MongoDB connection**: Check MONGODB_URI format
3. **CORS errors**: Verify FRONTEND_URL in backend .env
4. **Build failures**: Clear Docker cache with `docker system prune`

### Useful Commands
```bash
# Check container status
docker ps

# View container logs
docker logs [container_name]

# Access container shell
docker exec -it [container_name] /bin/sh

# Check network connectivity
docker-compose exec backend ping mongodb
```

## License
MIT License - feel free to use this project for learning and development purposes.