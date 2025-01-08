import express from 'express';


import {allowedTo, protect} from "../Controllers/auth_controller";
import {
    createReview,
    getReviews,
    getSpecificReview,
    updateReview,
    deleteReview, createFilterObj, setProductAndUserIdToBody
} from "../Controllers/review_controller";
import {
    createReviewValidator,
    deleteReviewValidator,
    getReviewValidator,
    updateReviewValidator
} from "../Utils/Validators/review_validator";

const router = express.Router({mergeParams: true});


router.route('/')
    .get(createFilterObj,getReviews)
    .post(
        protect,
        allowedTo('user','admin'),
        createReviewValidator,
        setProductAndUserIdToBody,
        createReview)
router.route('/:id')
    .get(getReviewValidator,getSpecificReview)
    .put(protect, allowedTo('user'), updateReviewValidator,updateReview)
    .delete(protect, allowedTo('user', 'admin', 'manager'),deleteReviewValidator ,deleteReview)

export default router;
