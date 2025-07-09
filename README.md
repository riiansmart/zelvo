# Zelvo

**Zelvo** is a modern, full-stack task management application designed to streamline productivity for individuals. Built with a powerful Spring Boot backend and an elegant React frontend, Zelvo combines robust functionality with an intuitive user experience to help you organize, track, and manage tasks efficiently.

---

## 🚀 Key Features

### 🔐 **Authentication & Security**
- JWT-based authentication with secure token management
- Role-based access control and user authorization
- Secure password hashing with BCrypt encryption
- OAuth2 integration support
- Comprehensive session management

### 📋 **Task Management**
- Full CRUD operations on tasks (Create, Read, Update, Delete)
- Advanced filtering and sorting capabilities:
  - Filter by status (Not Started, In Progress, Completed)
  - Sort by priority (Low, Medium, High)
  - Date-based filtering and sorting
  - Real-time text search across titles and descriptions
- Bulk task operations for improved efficiency
- Task categorization system
- Due date tracking and notifications

### 🎨 **User Interface & Experience**
- Modern, responsive design optimized for all devices
- Dual theme support (Light/Dark mode) with smooth transitions
- Visual design with customizable accents
- Intuitive navigation with collapsible sidebar
- Dashboard with comprehensive task overview and analytics
- Calendar integration for task scheduling and deadline management

### ⚙️ **User Preferences & Settings**
- Comprehensive settings page with organized sections:
  - **Profile Management**: Picture upload, personal information editing
  - **Theme Preferences**: Individual Light/Dark mode selection toggles
  - **Security Settings**: Password management with strength indicators
  - **Personal Information**: Name and contact details management
- Real-time preference saving and synchronization

### 📊 **Dashboard & Analytics**
- Interactive dashboard with task statistics and insights
- Recent task activity tracking
- Calendar widget for quick date navigation
- Task distribution charts and progress indicators
- Quick-access task creation and management tools

### 📅 **Calendar Integration**
- Dedicated calendar page for task scheduling
- Month/week/day view options
- Task deadline visualization
- Drag-and-drop task scheduling capabilities

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: CSS3 with custom themes and responsive design
- **State Management**: React Context API with custom hooks
- **Routing**: React Router for client-side navigation
- **Icons**: Lucide React for consistent iconography

### **Backend**
- **Framework**: Spring Boot 3.x with Java 17+
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with Spring Data JPA
- **Architecture**: RESTful API design with proper HTTP methods
- **Build Tool**: Maven for dependency management

### **Development & Deployment**
- **Database ORM**: Prisma for database schema management
- **Version Control**: Git with feature branch workflow
- **Development**: Hot reload and development servers
- **Production Ready**: Optimized builds and deployment configurations

---

## 📁 Project Architecture

```
zelvo/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/taskflow/backend/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST API endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # Custom exception handling
│   │   ├── mapper/           # Entity-DTO mappers
│   │   ├── model/            # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # Security configuration & JWT
│   │   └── service/          # Business logic layer
│   ├── src/main/resources/   # Application properties & configs
│   ├── src/test/            # Unit and integration tests
│   └── pom.xml              # Maven dependencies
│
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── navigation/   # Sidebar and navigation
│   │   │   ├── cards/        # Dashboard widgets
│   │   │   ├── task/         # Task-related components
│   │   │   └── ui/           # Common UI components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Main application pages
│   │   ├── services/         # API service functions
│   │   ├── styles/           # CSS stylesheets
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── prisma/              # Database schema and migrations
│   └── package.json         # npm dependencies
│
├── docs/                     # Documentation and assets
│   ├── imgs/                # Application screenshots
│   └── README.md            # Project documentation
│
└── README.md                # Main project readme
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Java 17+ and Maven
- PostgreSQL database

### **Backend Setup**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **Database Setup**
```bash
cd frontend
npx prisma migrate dev
npx prisma generate
```

---

## 🔮 Possible Future Enhancements

- **Team Collaboration**: Multi-user workspaces and task sharing
- **Advanced Analytics**: Detailed productivity insights and reporting
- **Mobile Applications**: Native iOS and Android apps
- **Integration APIs**: Third-party service integrations (Slack, Trello, etc.)
- **Advanced Notifications**: Email and push notification system
- **Export Features**: PDF and Excel task export capabilities

---

## 📄 License

This project is licensed under the MIT License.

