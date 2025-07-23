import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Album, sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Routes

// Get all albums
app.get('/api/albums', async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Get album by ID
app.get('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

// Create new album - handle both single creates and batch creates from AjaxStore
app.post('/api/albums', async (req, res) => {
  try {
    const { body } = req;
    const albumsData = Array.isArray(body) ? body : [body];
    
    const results = await Promise.all(
      albumsData.map(albumData => Album.create(albumData))
    );
    
    // Return single object if single album was created, array if multiple
    const response = Array.isArray(body) ? results : results[0];
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(400).json({ error: 'Failed to create album' });
  }
});

// Update album - handle both single updates and batch updates from AjaxStore
app.put('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    
    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    // Allow partial updates with null values
    await album.update(body);
    res.json(album);
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(400).json({ error: 'Failed to update album' });
  }
});

// Handle batch updates from AjaxStore
app.put('/api/albums', async (req, res) => {
  try {
    const { body } = req;
    const updates = Array.isArray(body) ? body : [body];
    
    const results = await Promise.all(
      updates
        .filter(({ id }) => id) // Only process items with valid IDs
        .map(async updateData => {
          const album = await Album.findByPk(updateData.id);
          if (album) {
            await album.update(updateData);
            return album;
          }
          return null;
        })
    );
    
    res.json(results.filter(Boolean)); // Remove null values
  } catch (error) {
    console.error('Error batch updating albums:', error);
    res.status(400).json({ error: 'Failed to update albums' });
  }
});

// Delete album
app.delete('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    await album.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// Handle batch deletes from AjaxStore
app.delete('/api/albums', async (req, res) => {
  try {
    const { body } = req;
    const ids = body?.ids || (Array.isArray(body) ? body.map(({ id }) => id) : []);
    
    if (ids.length > 0) {
      await Album.destroy({
        where: { id: ids }
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error batch deleting albums:', error);
    res.status(500).json({ error: 'Failed to delete albums' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
};

startServer(); 