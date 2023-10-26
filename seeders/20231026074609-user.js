'use strict';
const db = require('../models/index');
const faker = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    const lastUser = await db.User.findOne({
      order: [['no_anggota', 'DESC']],
    });

    let no_anggota = 1;

    if (lastUser) {
      no_anggota = parseInt(lastUser.no_anggota) + 1;
      if (no_anggota > 9999) {
        no_anggota = 1;
      }
    }

    for (let i = 1; i <= 1000; i++) {
      const formattedNoAnggota = no_anggota.toString().padStart(4, '0'); 
      const fakeData = {
        no_anggota: formattedNoAnggota,
        name: faker.name.findName(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        phone_number: faker.phone.phoneNumberFormat(),
        role: 'user',
        gender: faker.random.arrayElement(['Male', 'Female']),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(fakeData);

      no_anggota++; 
      if (no_anggota > 9999) {
        no_anggota = 1;
      }
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
