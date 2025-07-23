import { Album, sequelize } from '../models/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON file
const albumsData = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'example-data', 'albums.json'), 'utf-8')
);

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Sync database and recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
    
    // Insert albums data
    const albums = await Album.bulkCreate(albumsData, {
      validate: true,
      individualHooks: true,
    });
    
    console.log(`Successfully seeded ${albums.length} albums into the database.`);
    
    // Display seeded data
    console.log('\nSeeded albums:');
    albums.forEach((album, index) => {
      console.log(`${index + 1}. ${album.title} by ${album.artist} (${album.year})`);
    });
    
    console.log('\nDatabase seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run seeding
seedDatabase(); 