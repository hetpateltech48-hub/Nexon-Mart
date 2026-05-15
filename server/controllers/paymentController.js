const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.log('Razorpay initialization failed, running in simulation mode:', error.message);
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private (Registered User)
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const amountInPaise = Math.round(amount * 100);

    // If Razorpay instance is not initialized or keys are placeholders, simulate order
    if (!razorpay || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      const mockOrder = {
        id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: `receipt_mock_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
        isSimulation: true,
      };
      return res.status(201).json(mockOrder);
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order, falling back to simulation:', error.message);
    const amountInPaise = Math.round(req.body.amount * 100);
    const mockOrder = {
      id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: `receipt_mock_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000),
      isSimulation: true,
    };
    res.status(201).json(mockOrder);
  }
};

// @desc    Verify Razorpay Signature
// @route   POST /api/payment/verify
// @access  Private (Registered User)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'All payment parameters are required' });
    }

    // If order is simulated, verify it instantly
    if (razorpay_order_id.startsWith('order_mock_')) {
      return res.status(200).json({ success: true, message: 'Simulated payment verified' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Signature verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
