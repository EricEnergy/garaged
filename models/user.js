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

// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    console.log(user)
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
