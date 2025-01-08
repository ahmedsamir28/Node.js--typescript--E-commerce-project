import { check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import validatorMiddleware from '../../Middlewares/validatorMiddleware';
import reviewModel from "../../Model/review_model";

export const createReviewValidator = [
    check('review')
        .optional(),
    check('ratings')
        .notEmpty()
        .withMessage('ratings value required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 to 5'),
    check('user')
        .isMongoId()
        .withMessage('Invalid review id format'),
    check('product')
        .isMongoId()
        .withMessage('Invalid review Id format')
        .custom((val, { req } ) =>
            reviewModel.findOne({ user: req.user._id, product: req.body.product }).then(
                (review: any) => {
                    if (review) {
                        return Promise.reject(
                            new Error('You already created a review before')
                        );
                    }
                }
            )
        ),
    validatorMiddleware,
];

export const getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleware,
];

export const updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req } ) =>
            // check review ownerShip before update
            reviewModel.findById(val).then((review: any) => {
                if (!review) {
                    return Promise.reject(
                        new Error(`there is no review with id ${val}`)
                    );
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(
                        new Error('You are not allowed to perform this action')
                    );
                }
            })
        ),
    validatorMiddleware,
];

export const deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) => {
            if (req.user.role === 'user') {
                return reviewModel.findById(val).then((review: any) => {
                    if (!review) {
                        return Promise.reject(
                            new Error(`there is no review with id ${val}`)
                        );
                    }
                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(
                            new Error('You are not allowed to perform this action')
                        );
                    }
                });
            }
            return true;
        }),
    validatorMiddleware,
];
