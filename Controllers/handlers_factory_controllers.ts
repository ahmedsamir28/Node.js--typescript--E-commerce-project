import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import ApiFeatures from "../Utils/apiFeatures";
import ApiError from "../Utils/apiError";

interface CustomRequest extends Request {
    filterObj?: Record<string, any>;
}

export const createItem = (model: Model<any>) => expressAsyncHandler(async (req: Request, res: Response) => {
    const newDocument = await model.create(req.body);
    res.status(201).json({ data: newDocument });
})

export const getAllItems = (model: Model<any>, modelName: string = '') => expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    // Default `req.filterObj` to an empty object if undefined
    const filter = req.filterObj || {}
    
    const documentsCounts = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
        .filter()
        .sort()
        .fildes()
        .search(modelName)
        .paginate(documentsCounts)
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({ results: documents.length, paginationResult, success: true, data: documents });
});

export const getSpecificItem = (model: Model<any>) => expressAsyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const document = await model.findById(id)
    if (!document) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: document });
});

export const updateItem = (model: Model<any>) => expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const document = await model.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: document });
})

export const deleteItem = (model: Model<any>) => expressAsyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);

    if (!document) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(204).send();
});

