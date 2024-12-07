class ApiFeatures {
    mongooseQuery: any
    queryString: any
    constructor(mongooseQuery: any, queryString: any) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObject = { ...this.queryString };
        const excludesFields: string[] = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludesFields.forEach((element) => delete queryStringObject[element]);

        let queryStr = JSON.stringify(queryStringObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))
        return this
    }
}
export default ApiFeatures