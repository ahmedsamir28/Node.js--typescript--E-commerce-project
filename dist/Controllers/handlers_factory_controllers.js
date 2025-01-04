"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getSpecificItem = exports.getAllItems = exports.createItem = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiFeatures_1 = __importDefault(require("../Utils/apiFeatures"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const createItem = (model) => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newDocument = yield model.create(req.body);
    res.status(201).json({ data: newDocument });
}));
exports.createItem = createItem;
const getAllItems = (model, modelName = '') => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Default `req.filterObj` to an empty object if undefined
    const filter = req.filterObj || {};
    const documentsCounts = yield model.countDocuments();
    const apiFeatures = new apiFeatures_1.default(model.find(filter), req.query)
        .filter()
        .sort()
        .fields()
        .search(modelName)
        .paginate(documentsCounts);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = yield mongooseQuery;
    res.status(200).json({ results: documents.length, paginationResult, success: true, data: documents });
}));
exports.getAllItems = getAllItems;
const getSpecificItem = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const document = yield model.findById(id);
    if (!document) {
        return next(new apiError_1.default(`No item for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: document });
}));
exports.getSpecificItem = getSpecificItem;
const updateItem = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const document = yield model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
        return next(new apiError_1.default(`No item for this ID ${id}`, 400));
    }
    res.status(200).json({ success: true, data: document });
}));
exports.updateItem = updateItem;
const deleteItem = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const document = yield model.findByIdAndDelete(id);
    if (!document) {
        return next(new apiError_1.default(`No item for this ID ${id}`, 404));
    }
    res.status(204).send();
}));
exports.deleteItem = deleteItem;
