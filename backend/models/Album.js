const createAlbumModel = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100],
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 10,
      },
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: true,
      validate: {
        min: 1,
        max: 1000,
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 10,
      },
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'albums',
    indexes: [
      {
        fields: ['artist']
      },
      {
        fields: ['genre']
      },
      {
        fields: ['year']
      },
    ],
  });

  return Album;
};

export default createAlbumModel; 