import express from 'express';
import { 
    getWalletDetails, 
    updateBankDetails, 
    requestWithdrawal 
} from '../controllers/host.wallet.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Ensure host is authenticated

router.get('/details', getWalletDetails);
router.put('/bank-details', updateBankDetails);
router.post('/withdraw', requestWithdrawal);

export default router;
