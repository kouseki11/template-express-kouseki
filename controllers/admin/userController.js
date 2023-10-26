const db = require('../../models/index');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const createUser = async (req, res, next) => {
    const { name, email, address, phone_number, role, gender, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await db.sequelize.transaction();

    try {

        const lastUser = await db.User.findOne({
            order: [['no_anggota', 'DESC']],
            transaction,
        });

        let no_anggota = 1;

        if (lastUser) {
            no_anggota = parseInt(lastUser.no_anggota) + 1;
        }

        // Format no_anggota with leading zeros
        const formattedNoAnggota = no_anggota.toString().padStart(4, '0');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.User.create({
            no_anggota: formattedNoAnggota,
            name,
            email,
            address,
            phone_number,
            role,
            gender,
            password: hashedPassword,
        }, {
            transaction,
        });

        await transaction.commit();

        res.status(201).json(user.toJSON());
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Could not create the user' });
    }
};



const getAllUsers = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {

        // Define pagination parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = 10; // Number of products per page

        // Calculate the offset based on the current page and page size
        const offset = (page - 1) * pageSize;

        const users = await db.User.scope('active').findAll({
            order: [['no_anggota', 'DESC']],
            limit: pageSize,
            offset: offset,
            transaction,
        });

        await transaction.commit();

        res.status(200).json(users);
    } catch (error) {
        await transaction.rollback();
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Could not fetch users' });
    }
};

const updateUser = async (req, res, next) => {
    const id_user = req.params.id_user;
    const { name, email, address, phone_number, role, gender, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({
            where: {
                id: id_user
            },
            transaction
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name;
        user.email = email;
        user.address = address;
        user.phone_number = phone_number;
        user.role = role;
        user.gender = gender;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        await transaction.commit();

        res.status(200).json(user.toJSON());
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Could not update the user' });
    }
};

const getUserById = async (req, res) => {
    const { id_user } = req.params;

    const transaction = await db.sequelize.transaction();
    try {

        const user = await db.User.findOne({
            where: {
                id: id_user
            },
            transaction
        });

        await transaction.commit();

        if (user) {
            res.status(200).json(user.toJSON());
        } else {
            res.status(404).json({ error: "User not Found" });
        }

    } catch (error) {
        await transaction.rollback();
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Could not fetch users' });
    }
};


const deleteUser = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { id_user } = req.params;

        const user = await db.User.findOne({
            where: {
                id: id_user,
            },
            transaction,
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                status: 'failed',
                message: `User with ID ${id_user} does not exist`,
            });
        }

        const deleted_at = new Date();

        await user.update({ deletedAt: deleted_at }, { transaction });

        await transaction.commit();

        res.status(200).json(user.toJSON());
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Could not delete the user' });
    }
};



module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
};
