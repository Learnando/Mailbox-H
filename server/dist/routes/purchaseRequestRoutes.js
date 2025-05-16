"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const purchaseRequestController_1 = require("../controllers/purchaseRequestController");
const PurchaseRequest_1 = __importDefault(require("../models/PurchaseRequest"));
const purchaseRequestController_2 = require("../controllers/purchaseRequestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 📥 Submit new request (user)
router.post("/", upload_1.default.single("screenshot"), purchaseRequestController_1.createPurchaseRequest);
// 📄 Get all requests (admin)
router.get("/", purchaseRequestController_1.getAllPurchaseRequests);
// 📥 Get requests by user ID
// 📥 Get requests by user ID
router.get("/user/:userId", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const requests = await PurchaseRequest_1.default.find({
            userId,
            deletedByUser: { $ne: true }, // ✅ EXCLUDE soft-deleted requests
        }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    }
    catch (err) {
        next(err);
    }
});
// 🔄 Update status, fee, receipt, and mark as paid
router.patch("/:id/status", purchaseRequestController_1.updatePurchaseStatus);
router.patch("/:id/fee", purchaseRequestController_1.setPurchaseFinalFee);
router.patch("/:id/paid", purchaseRequestController_1.markPurchaseAsPaid);
router.patch("/:id/receipt", upload_1.default.single("receipt"), purchaseRequestController_1.uploadPurchaseReceipt);
router.patch("/:id/cancel", purchaseRequestController_2.cancelPurchaseRequest);
router.patch("/:id/soft-delete", authMiddleware_1.isAuth, purchaseRequestController_1.userSoftDeletePurchaseRequest);
// ❌ Delete a request
router.patch("/:id", purchaseRequestController_1.deletePurchaseRequest);
exports.default = router;
