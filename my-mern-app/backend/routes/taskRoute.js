const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authmiddleware = require('../middleware/middlewareAuth');

router.route('/create').post(authmiddleware,taskController.createTask);
router.route('/').get(authmiddleware,taskController.displayTask);
router.route('/edit/:taskId').put(authmiddleware,taskController.editTask);
router.route('/delete/:taskId').delete(authmiddleware,taskController.deleteTask);
router.route('/complete/:taskId').put(authmiddleware,taskController.completeTask);
   
module.exports = router;     