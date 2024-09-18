const router = require('express').Router();
const crudController = require('./controller');
const userController = require('./user.controller')

router.post('/insertRequests', crudController.insertRequests);

router.post('/findAll', crudController.readRequests);

router.get('/findById', crudController.readById);

router.put('/editById', crudController.updateManyRequests);

router.post('/removeById', crudController.deleteRequest);

router.post('/register', userController.register);

router.post('/login', userController.login);



module.exports = router;