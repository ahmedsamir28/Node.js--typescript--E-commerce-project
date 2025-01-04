"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter() {
        const queryStringObject = Object.assign({}, this.queryString);
        const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludesFields.forEach((element) => delete queryStringObject[element]);
        let queryStr = JSON.stringify(queryStringObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sort = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sort);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }
        return this;
    }
    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }
    search(modelName) {
        const keyword = this.queryString.keyword;
        if (keyword) {
            let query = {};
            const regex = new RegExp(keyword, 'i');
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ];
            }
            else {
                query = { name: { $regex: regex } };
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    paginate(countDocuments) {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 5;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        const pagination = {
            currentPage: page,
            limit: limit,
            numberOfPages: Math.ceil(countDocuments / limit),
        };
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }
}
exports.default = ApiFeatures;
