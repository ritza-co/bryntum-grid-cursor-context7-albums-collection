# Bryntum Grid Express App

A full-stack application featuring a Bryntum Grid frontend connected to an Express.js backend with SQLite database.

## 🎵 Features

- **Frontend**: Vite + JavaScript with Bryntum Grid (v6.2.5 trial)
- **Backend**: Express.js + SQLite + Sequelize ORM
- **Full CRUD Operations**: Create, Read, Update, Delete albums using AjaxStore
- **Modern UI**: Stockholm theme with responsive design
- **Real-time Updates**: Changes reflected immediately in the grid
- **Data Validation**: Input sanitization and validation with `StringHelper.xss`
- **RESTful API**: Proper REST endpoints with batch operation support
- **Documentation-Driven**: Built following latest Bryntum documentation via Context7

## 🏗️ Project Structure

```
bryntum-grid-express-app/
├── package.json              # Root package with npm workspaces
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── backend/
│   ├── package.json         # Backend dependencies
│   ├── server.js           # Express server
│   ├── models/             # Sequelize models
│   │   ├── index.js        # Database configuration
│   │   └── Album.js        # Album model
│   ├── example-data/       # Seed data
│   │   └── albums.json     # Sample albums
│   └── scripts/
│       └── seed.js         # Database seeding script
└── frontend/
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    ├── index.html          # Main HTML file
    └── src/
        └── app.js          # Main application logic
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url> bryntum-grid-express-app
   cd bryntum-grid-express-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on http://localhost:3001
- Frontend server on http://localhost:3000

The frontend will automatically open in your browser.

## 📦 Available Scripts

### Root Package Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run seed` - Seed the database with example data
- `npm run install-all` - Install dependencies for all workspaces

### Backend Scripts

- `npm run dev --workspace=backend` - Start backend in development mode
- `npm run start --workspace=backend` - Start backend in production mode
- `npm run seed --workspace=backend` - Seed the database

### Frontend Scripts

- `npm run dev --workspace=frontend` - Start frontend development server
- `npm run build --workspace=frontend` - Build for production
- `npm run preview --workspace=frontend` - Preview production build

## 🎯 Usage

### Grid Features

- **View Albums**: Browse the complete albums collection
- **Add Album**: Click "Add Album" button to create a new record
- **Edit Albums**: Double-click any cell to edit (except ID)
- **Delete Albums**: Select rows and click "Delete Selected"
- **Refresh Data**: Click "Refresh" to reload from the database

### API Endpoints

The backend provides a REST API for album management:

- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `POST /api/albums` - Create new album
- `PUT /api/albums/:id` - Update album (partial updates supported)
- `DELETE /api/albums/:id` - Delete album
- `GET /health` - Health check endpoint

## 🔧 Configuration

### Database

The SQLite database is automatically created at `backend/database.sqlite`. The database schema supports:

- Album titles, artists, and genres
- Release years and durations
- Ratings (0-10 scale)
- Record labels and pricing
- Timestamps for creation and updates

### Environment Variables

Create a `.env` file in the backend directory for custom configuration:

```env
PORT=3001
DATABASE_URL=sqlite:database.sqlite
NODE_ENV=development
```

## 🛠️ Development

### Adding New Features

1. **Backend**: Add new routes in `server.js` and update models in `models/`
2. **Frontend**: Extend the grid configuration in `frontend/src/app.js`
3. **Database**: Update the Album model and re-run the seeding script

### Database Management

- **Reset Database**: Delete `backend/database.sqlite` and run `npm run seed`
- **Add Seed Data**: Edit `backend/example-data/albums.json`
- **Schema Changes**: Update `backend/models/Album.js`

## 🎨 Customization

### Theme

The application uses the Bryntum Stockholm theme. To change themes:

1. Replace the CSS import in `frontend/index.html`
2. Available themes: `stockholm`, `classic`, `classic-dark`, `classic-light`, `material`

### Grid Columns

Modify the columns array in `frontend/src/app.js` to:
- Add new columns
- Change column widths
- Update editors and renderers
- Customize validation

## 🔒 Security

- Input sanitization using `StringHelper.xss`
- SQL injection protection via Sequelize ORM
- CORS configuration for cross-origin requests
- Data validation on both client and server

## 📚 Technologies Used

- **Frontend**: Vite, JavaScript ES6+, Bryntum Grid
- **Backend**: Express.js, Sequelize, SQLite3
- **Development**: Nodemon, Concurrently, npm Workspaces

## 🐛 Troubleshooting

### Common Issues

1. **"Backend server not running"**
   - Ensure backend dependencies are installed: `npm install --workspace=backend`
   - Check if port 3001 is available
   - Verify database file permissions

2. **"Failed to load albums data"**
   - Run the seeding script: `npm run seed`
   - Check backend console for errors
   - Verify API endpoints with curl or Postman

3. **Bryntum Grid not loading**
   - Ensure frontend dependencies are installed: `npm install --workspace=frontend`
   - Check browser console for JavaScript errors
   - Verify Bryntum license (trial version included)

### Development Tips

- Use browser DevTools to monitor network requests
- Check backend console for API request logs
- Use `npm run dev` to start both servers simultaneously
- Database file is created automatically on first run

## 📄 License

This project uses Bryntum Grid Trial version. For production use, a commercial license is required.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Happy coding! 🎉 