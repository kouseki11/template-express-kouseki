const db = require('../models/index');
const { User } = db;

const isPhoneUnique = async (phone_number) => {
  const existingUser = await User.findOne({
    where: {
      phone_number: phone_number,
    },
  });
  return !existingUser;
};

const isEmailUnique = async (email) => {
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });
  return !existingUser;
};

const isPhoneUniqueForUpdate = async (phone_number, id) => {
  const user = await User.findOne({
    where: {
      phone_number: phone_number,
      id: { [db.Sequelize.Op.not]: id },
    },
  });
  return user === null;
};

const isEmailUniqueForUpdate = async (email, id) => {
  const user = await User.findOne({
    where: {
      email: email,
      id: { [db.Sequelize.Op.not]: id },
    },
  });
  return user === null;
};

module.exports = {
  isPhoneUnique,
  isEmailUnique,
  isPhoneUniqueForUpdate,
  isEmailUniqueForUpdate,
};
