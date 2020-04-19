import Router from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import CourierController from './app/controllers/CourierController';
import DeliveryController from './app/controllers/DeliveryController';
import CourierDeliveryController from './app/controllers/CourierDeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/couriers/:id', CourierController.show);

routes.get('/courier/:id/deliveries', CourierDeliveryController.index);

routes.put('/delivery/:id/status', DeliveryStatusController.update);

routes.get('/delivery/:id/problems', DeliveryProblemController.show);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.delete('/recipients/:id', RecipientController.delete);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/couriers', CourierController.store);
routes.put('/couriers/:id', CourierController.update);
routes.get('/couriers', CourierController.index);
routes.delete('/couriers/:id', CourierController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.get('/problems', DeliveryProblemController.index);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

export default routes;
