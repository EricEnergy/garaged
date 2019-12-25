module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [5]
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      },
      allowNull: true
    }
  });


  User.associate = function(models) {
    // Associating User with Posts
    // When an User is deleted, also delete any associated Units
    User.hasMany(models.unit, {
      onDelete: "cascade"
    });
  };

  return User;
};
