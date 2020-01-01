module.exports = function(sequelize, DataTypes) {
  const Unit = sequelize.define("unit", {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [01]
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: [01]
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        len: [01]
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        len: [01]
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        len: [01]
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      validate: {
        len: [05]
      }
    },
    // owner_id: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     len: [01]
    //   },
    //   allowNull: false
    // },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        len: [01]
      },
      allowNull: false
    },
    tools: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    climate: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "available"
    },
    last_request_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_occupied_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      },
      allowNull: true
    }
  });

  Unit.associate = function(models) {
    Unit.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      },
    });
  };

  return Unit;
};