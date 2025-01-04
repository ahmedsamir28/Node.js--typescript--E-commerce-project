"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../Controllers/user_controllers");
const router = express_1.default.Router();
router.route('/').get(user_controllers_1.getUsers).post(user_controllers_1.uploadUserImage, user_controllers_1.resizeUserIMage, user_controllers_1.createUser);
router.route('/:id').get(user_controllers_1.getSpecificUser).put(user_controllers_1.updateUser).delete(user_controllers_1.deleteUser);
exports.default = router;
