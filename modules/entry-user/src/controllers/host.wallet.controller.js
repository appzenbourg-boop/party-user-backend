import { Host } from '../models/Host.js';
import { WithdrawalRequest } from '../models/WithdrawalRequest.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import mongoose from 'mongoose';

// ── GET WALLET DETAILS ──────────────────────────────────────────────────────
export const getWalletDetails = async (req, res, next) => {
    try {
        const hostId = req.user.id;
        const host = await Host.findById(hostId).select('wallet bankDetails').lean();

        if (!host) {
            return res.status(404).json({ success: false, message: 'Host not found' });
        }

        // Get last 10 transactions
        const transactions = await WalletTransaction.find({ hostId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Get pending withdrawal requests
        const pendingWithdrawals = await WithdrawalRequest.find({ hostId, status: 'PENDING' })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: {
                wallet: host.wallet,
                bankDetails: host.bankDetails,
                transactions,
                pendingWithdrawals
            }
        });
    } catch (error) {
        next(error);
    }
};

// ── UPDATE BANK DETAILS ─────────────────────────────────────────────────────
export const updateBankDetails = async (req, res, next) => {
    try {
        const hostId = req.user.id;
        const { accountNumber, ifscCode, accountHolderName, upiId, bankName } = req.body;

        const host = await Host.findByIdAndUpdate(
            hostId,
            {
                bankDetails: {
                    accountNumber,
                    ifscCode,
                    accountHolderName,
                    upiId,
                    bankName
                }
            },
            { new: true }
        ).select('bankDetails').lean();

        res.status(200).json({
            success: true,
            message: 'Bank details updated successfully',
            data: host.bankDetails
        });
    } catch (error) {
        next(error);
    }
};

// ── REQUEST WITHDRAWAL ──────────────────────────────────────────────────────
export const requestWithdrawal = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const hostId = req.user.id;
        const { amount } = req.body;

        const amountNum = Number(amount);
        if (!amountNum || amountNum <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
        }

        const host = await Host.findById(hostId).session(session);
        if (!host) {
            throw new Error('Host not found');
        }

        if (host.wallet.balance < amountNum) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }

        // 1. Deduct from available balance, add to pendingWithdrawal
        host.wallet.balance -= amountNum;
        host.wallet.pendingWithdrawal += amountNum;
        await host.save({ session });

        // 2. Create Withdrawal Request
        const withdrawal = await WithdrawalRequest.create([{
            hostId,
            amount: amountNum,
            status: 'PENDING',
            bankDetails: host.bankDetails
        }], { session });

        // 3. Create Transaction Ledger (DEBIT)
        await WalletTransaction.create([{
            hostId,
            amount: -amountNum, // Negative for debit
            type: 'DEBIT',
            description: `Withdrawal Request #${withdrawal[0]._id.toString().slice(-6)}`,
            withdrawalId: withdrawal[0]._id,
            balanceAfter: host.wallet.balance
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            data: withdrawal[0]
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
