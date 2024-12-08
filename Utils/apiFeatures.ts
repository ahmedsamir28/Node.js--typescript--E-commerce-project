import { Query } from 'mongoose';

interface IPaginationResult {
    currentPage: number,
    limit: number,
    numberOfPages: number,
    next?: number,
    prev?: number

}
class ApiFeatures {
    mongooseQuery: Query<any, any>;
    queryString: Record<string, any>;
    paginationResult?: IPaginationResult;

    constructor(mongooseQuery: Query<any, any>, queryString: Record<string, any>) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObject = { ...this.queryString };
        const excludesFields: string[] = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludesFields.forEach((element) => delete queryStringObject[element]);

        let queryStr = JSON.stringify(queryStringObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sort = (this.queryString.sort as string).split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sort);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }

        return this;
    }

    fildes() {
        if (this.queryString.fields) {
            const fields = (this.queryString.fields as string).split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }

        return this
    }

    search(modelName: string) {
        const keyword: string = this.queryString.keyword as string;
        if (keyword) {
            let query: any = {};
            const regex = new RegExp(keyword, 'i');
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ];
            } else {
                query = { name: { $regex: regex } }; 
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    
    paginate(countDocuments: number) {
        const page = parseInt(this.queryString.page as string, 10) || 1;
        const limit = parseInt(this.queryString.limit as string, 10) || 5;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination: IPaginationResult = {
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

export default ApiFeatures;
