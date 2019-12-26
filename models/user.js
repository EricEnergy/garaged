
var bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    console.log(user)
  });

    User.associate = function(models) {
    User.hasMany(models.unit, {
      onDelete: "cascade"
    });
  };

  return User;
};










// module.exports = function(sequelize, DataTypes) {
//   const User = sequelize.define("user", {
//     email: {
//       type: DataTypes.STRING,
//       validate: {
//         isEmail: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       validate: {
//         len: [5]
//       }
//     },
//     image: {
//       type: DataTypes.STRING,
//       validate: {
//         isUrl: true
//       },
//       allowNull: true
//     }
//   });


//   User.associate = function(models) {
//     // Associating User with Posts
//     // When an User is deleted, also delete any associated Units
//     User.hasMany(models.unit, {
//       onDelete: "cascade"
//     });
//   };

//   return User;
// };
