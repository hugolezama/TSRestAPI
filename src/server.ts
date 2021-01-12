import express, { Application, NextFunction, Request, Response } from 'express';
import log from './config/logging';
import config from './config/config';
const mongoose = require('mongoose');
import userRoutes from './routes/userRoutes';

const NAMESPACE = 'Server';

const router: Application = express();

// Database Config
mongoose.connect(config.mongo.url, config.mongo.options, () => log.info(NAMESPACE, 'Connected to DB!!'));

router.use((req: Request, res: Response, next: NextFunction) => {
    log.info(
        NAMESPACE,
        `METHOD - [${req.method}], 
  URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
        log.info(
            NAMESPACE,
            `METHOD - [${req.method}], 
    URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });

    next();
});

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Rules of the API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/api/v1/users', userRoutes);

/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    return res.status(404).json({
        message: error.message
    });

    next();
});

router.listen(config.server.port, () => {
    return log.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`);
});
