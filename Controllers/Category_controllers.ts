// Category_controllers.ts
import { Request, Response } from "express";
import categoryModel from "../Model/category_schema";

export const createCategory = (req: Request, res: Response) => {
    const name = req.body.name;
    const newCategory = new categoryModel({ name });

    newCategory.save()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });

    console.log(name);
};
