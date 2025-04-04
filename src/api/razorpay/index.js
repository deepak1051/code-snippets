import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../../models/Payment.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      payment_capture: 1,
    });

    await Payment.create({
      orderId: order.id,
      amount,
      status: 'PENDING',
    });

    return res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignautre = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignautre !== razorpay_signature) {
      return res.status(400).json({ message: 'invalid signature' });
    }

    await Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
      },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'PAID',
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/razorpay-webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Validate webhook signature
  const shasum = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (shasum !== req.headers['x-razorpay-signature']) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid webhook signature' });
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    await Payment.findOneAndUpdate(
      { orderId: payload.payment.entity.order_id },
      { paymentId: payload.payment.entity.id, status: 'Paid' }
    );
  }

  res.json({ success: true });
});

export default router;
