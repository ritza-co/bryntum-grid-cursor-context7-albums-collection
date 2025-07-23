import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Album, sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for large requests
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method !== 'GET') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

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
    const albums = await Album.findAll({
      order: [['id', 'ASC']] // Consistent ordering
    });
    
    res.json({
      success: true,
      data: albums,
      total: albums.length
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    
    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.json({
        success: false,
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    res.json({
      success: false,
      message: 'Albums data could not be read. Please try again.'
    });
  }
});

// Create new album - handle Bryntum AjaxStore format
app.post('/api/albums', async (req, res) => {
  try {
    // Validate request structure
    if (!req.body.data || !Array.isArray(req.body.data)) {
      return res.json({
        success: false,
        message: 'Invalid request format. Expected { data: [...] } with array of albums.'
      });
    }

    // Validate and prepare album data
    const albumsData = req.body.data.map(album => {
      const { id, ...fields } = album; // Remove generated ID
      
      // Validate required fields
      if (!fields.title || !fields.artist) {
        throw new Error('Title and artist are required fields.');
      }
      
      return fields;
    });
    
    const newAlbums = await Album.bulkCreate(albumsData, { 
      validate: true,
      individualHooks: true 
    });
    
    res.json({ 
      success: true, 
      data: newAlbums 
    });
  } catch (error) {
    console.error('Error creating album:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationMessages = error.errors.map(err => err.message).join(', ');
      return res.json({
        success: false,
        message: `Validation failed: ${validationMessages}`
      });
    }
    
    // Handle other specific errors
    if (error.message.includes('required fields')) {
      return res.json({
        success: false,
        message: error.message
      });
    }
    
    res.json({
      success: false,
      message: 'Albums could not be created. Please check your data and try again.'
    });
  }
});

// Update albums - handle Bryntum AjaxStore format
app.patch('/api/albums', async (req, res) => {
  try {
    // Validate request structure
    if (!req.body.data || !Array.isArray(req.body.data)) {
      return res.json({
        success: false,
        message: 'Invalid request format. Expected { data: [...] } with array of albums.'
      });
    }

    const albumsData = req.body.data;
    const updatedAlbums = [];

    // Validate that all items have IDs
    for (const data of albumsData) {
      if (!data.id) {
        return res.json({
          success: false,
          message: 'All items must have an ID for updates.'
        });
      }
    }

    await sequelize.transaction(async (t) => {
      for (const data of albumsData) {
        const itemId = data.id;
        
        // Check if album exists first
        const existingAlbum = await Album.findByPk(itemId, { transaction: t });
        if (!existingAlbum) {
          throw new Error(`Album with id ${itemId} does not exist.`);
        }

        const [updated] = await Album.update(data, {
          where: { id: itemId },
          transaction: t,
          validate: true
        });

        if (updated) {
          const updatedAlbum = await Album.findOne({
            where: { id: itemId },
            transaction: t
          });
          updatedAlbums.push(updatedAlbum);
        } else {
          throw new Error(`Album with id ${itemId} could not be updated.`);
        }
      }
    });

    res.json({ 
      success: true, 
      data: updatedAlbums 
    });
  } catch (error) {
    console.error('Error updating albums:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationMessages = error.errors.map(err => err.message).join(', ');
      return res.json({
        success: false,
        message: `Validation failed: ${validationMessages}`
      });
    }
    
    // Handle specific error messages
    if (error.message.includes('does not exist') || error.message.includes('could not be updated')) {
      return res.json({
        success: false,
        message: error.message
      });
    }
    
    res.json({
      success: false,
      message: 'Error updating album records. Please check your data and try again.'
    });
  }
});

// Delete albums - handle Bryntum AjaxStore format
app.delete('/api/albums', async (req, res) => {
  try {
    // Validate request structure
    if (!req.body.ids || !Array.isArray(req.body.ids)) {
      return res.json({
        success: false,
        message: 'Invalid request format. Expected { ids: [...] } with array of album IDs.'
      });
    }

    const { ids } = req.body;

    // Validate that IDs are provided
    if (ids.length === 0) {
      return res.json({
        success: false,
        message: 'No album IDs provided for deletion.'
      });
    }

    // Validate that all IDs are valid numbers/integers
    const invalidIds = ids.filter(id => !Number.isInteger(Number(id)));
    if (invalidIds.length > 0) {
      return res.json({
        success: false,
        message: `Invalid album IDs: ${invalidIds.join(', ')}. IDs must be integers.`
      });
    }

    let deletedCount = 0;

    // Perform the delete operations in a single transaction
    await sequelize.transaction(async (t) => {
      // Check if albums exist before attempting to delete
      const existingAlbums = await Album.findAll({
        where: { id: ids },
        attributes: ['id'],
        transaction: t
      });

      const existingIds = existingAlbums.map(album => album.id);
      const nonExistentIds = ids.filter(id => !existingIds.includes(Number(id)));

      if (nonExistentIds.length > 0) {
        throw new Error(`Albums with IDs ${nonExistentIds.join(', ')} do not exist.`);
      }

      // Delete albums whose ID is in the ids array
      deletedCount = await Album.destroy({
        where: { id: ids },
        transaction: t
      });
    });

    if (deletedCount === 0) {
      return res.json({
        success: false,
        message: 'No albums were deleted. Please check the provided IDs.'
      });
    }

    res.json({ 
      success: true,
      message: `Successfully deleted ${deletedCount} album(s).`
    });
  } catch (error) {
    console.error('Error deleting albums:', error);
    
    // Handle specific error messages
    if (error.message.includes('do not exist')) {
      return res.json({
        success: false,
        message: error.message
      });
    }
    
    res.json({
      success: false,
      message: 'Could not delete selected album record(s). Please try again.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Don't send response if already sent
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start server
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
};

startServer(); 