import express from 'express';
import controller from '../controllers/userController';

const router = express.Router();

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/health', controller.healthCheck);

export = router;
