import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import createAlbumModel from './Album.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: console.log,
  define: {
    timestamps: true,
    underscored: false,
  },
});

// Import models
const Album = createAlbumModel(sequelize, Sequelize.DataTypes);

// Define associations here if needed
// Album.associate = (models) => {
//   // Define associations
// };

export {
  sequelize,
  Sequelize,
  Album,
}; 