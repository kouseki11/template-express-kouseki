const router = require('express').Router()
const { body } = require('express-validator');
const userOrganization = require('../../middleware/userOrganization')
const { createUser, getAllUsers, deleteUser, updateUser, getUserById } = require('../../controllers/admin/userController');
const { isPhoneUnique, isEmailUnique, isPhoneUniqueForUpdate, isEmailUniqueForUpdate } = require('../../utils/customeValidator');

// Route For Create User
router.post('/create',
    [
        body('name').notEmpty().withMessage('Name is required.'),
        body('phone_number')
            .notEmpty()
            .withMessage('Phone Number is required.')
            .custom(async (value) => {
                if (!(await isPhoneUnique(value))) {
                    throw new Error('Phone Number is already in use.');
                }
            }),
        body('email')
            .notEmpty()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Email must be a valid email address.')
            .custom(async (value) => {
                if (!(await isEmailUnique(value))) {
                    throw new Error('Email is already in use.');
                }
            }),
        body('address').notEmpty().withMessage('Address is required.'),
        body('role').notEmpty().withMessage('Role is required.'),
        body('gender').notEmpty().withMessage('Gender is required.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ], createUser)

// Route For Get All User
router.get('/all', getAllUsers)

// Route For Get User By Id
router.get('/:id_user', getUserById)

// Route For Update User
router.post('/update/:id_user',
    [
        body('name').notEmpty().withMessage('Name is required.'),
        body('phone_number')
            .notEmpty()
            .withMessage('Phone Number is required.')
            .custom(async (value, { req }) => {
                if (!(await isPhoneUniqueForUpdate(value, req.params.id_user))) {
                    throw new Error('Phone Number is already in use.');
                }
            }),
        body('email')
            .notEmpty()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Email must be a valid email address.')
            .custom(async (value, { req }) => {
                if (!(await isEmailUniqueForUpdate(value, req.params.id_user))) {
                    throw new Error('Email is already in use.');
                }
            }),
        body('address').notEmpty().withMessage('Address is required.'),
        body('role').notEmpty().withMessage('Role is required.'),
        body('gender').notEmpty().withMessage('Gender is required.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ], updateUser)

// Route For Get User
router.post('/delete/:id_user', deleteUser)

module.exports = router