import { Request, Response, NextFunction } from 'express';
import log from '../config/logging';
import User from '../models/user';
const Joi = require('joi');
const NAMESPACE = 'User Controller';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        log.error(NAMESPACE, error.message);
        res.status(500).send(error.message);
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateUser(req.body);

    if (error) {
        log.error(NAMESPACE, error);
        return res.status(400).send(error.details[0].message);
    }
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: parseInt(req.body.age)
    });

    try {
        const saved = await user.save();
        res.status(201).send(saved);
    } catch (error) {
        log.error(NAMESPACE, error);
        res.status(500).send(error.message);
    }
};

const healthCheck = async (req: Request, res: Response) => {
    log.info(NAMESPACE, `User healt check route called`);

    return res.status(200).json({
        message: 'OK'
    });
};

function validateUser(user: any) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().integer().positive().min(18).required()
    });

    return schema.validate(user);
}

export default { healthCheck, getAllUsers, createUser };
