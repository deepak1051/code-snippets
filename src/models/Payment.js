import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  },
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
