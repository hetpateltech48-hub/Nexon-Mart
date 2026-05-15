import React, { useState } from 'react';

const RazorpayModal = ({ order, user, onClose, onSuccess }) => {
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [email, setEmail] = useState(user?.email || 'customer@example.com');
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD, UPI, NETBANKING
  const [processing, setProcessing] = useState(false);

  // Form values
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('customer@okaxis');

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      // Simulate success response structure from Razorpay
      const paymentResponse = {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        razorpay_signature: `sig_mock_${Math.random().toString(36).substring(2, 20)}`,
      };
      onSuccess(paymentResponse);
    }, 2000);
  };

  const amountInRupees = (order.amount / 100).toFixed(2);

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div 
        className="card border-0 shadow-lg overflow-hidden animate__animated animate__fadeInUp"
        style={{
          width: '420px',
          borderRadius: '16px',
          background: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Top Header section matching Razorpay Theme */}
        <div className="bg-primary text-white p-4 text-center position-relative" style={{ background: 'linear-gradient(135deg, #0d6efd, #0b5ed7)' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
            aria-label="Close"
          ></button>
          
          <div 
            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow"
            style={{ width: '60px', height: '60px' }}
          >
            <strong className="text-primary fs-4">NM</strong>
          </div>
          
          <h5 className="fw-bold m-0">NexusMart</h5>
          <p className="small opacity-75 m-0 mt-1">Payment gateway integration</p>
          <div className="mt-3 fs-4 fw-bold">₹{amountInRupees}</div>
        </div>

        {/* Modal Body */}
        <div className="p-4 bg-light" style={{ minHeight: '300px' }}>
          {processing ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h6 className="fw-bold text-dark">Processing Payment...</h6>
              <p className="text-muted small">Connecting with Razorpay Payment Engine</p>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              {/* Contact info */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Phone</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Email</label>
                  <input 
                    type="email" 
                    className="form-control form-control-sm" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Payment Methods tabs */}
              <label className="form-label small text-muted mb-2">Select Payment Method</label>
              <div className="btn-group btn-group-sm w-100 mb-3" role="group">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="paymentMethod" 
                  id="methodCard" 
                  checked={paymentMethod === 'CARD'} 
                  onChange={() => setPaymentMethod('CARD')} 
                />
                <label className="btn btn-outline-primary" htmlFor="methodCard">💳 Card</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="paymentMethod" 
                  id="methodUpi" 
                  checked={paymentMethod === 'UPI'} 
                  onChange={() => setPaymentMethod('UPI')} 
                />
                <label className="btn btn-outline-primary" htmlFor="methodUpi">📱 UPI / QR</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="paymentMethod" 
                  id="methodNetbanking" 
                  checked={paymentMethod === 'NETBANKING'} 
                  onChange={() => setPaymentMethod('NETBANKING')} 
                />
                <label className="btn btn-outline-primary" htmlFor="methodNetbanking">🏦 Netbanking</label>
              </div>

              {/* Dynamic Sub-form based on selection */}
              {paymentMethod === 'CARD' && (
                <div className="card p-3 border-0 shadow-sm mb-4 bg-white">
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-0">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={cardNumber} 
                      onChange={e => setCardNumber(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-0">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="MM/YY" 
                        value={cardExpiry} 
                        onChange={e => setCardExpiry(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-0">CVV</label>
                      <input 
                        type="password" 
                        className="form-control form-control-sm" 
                        placeholder="123" 
                        value={cardCvv} 
                        onChange={e => setCardCvv(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="card p-3 border-0 shadow-sm mb-4 bg-white">
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-0">Virtual Payment Address (VPA)</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="e.g. name@upi" 
                      value={upiId} 
                      onChange={e => setUpiId(e.target.value)} 
                      required 
                    />
                  </div>
                  <span className="text-muted small text-center d-block">Or scan the generated Razorpay dynamic QR</span>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="card p-3 border-0 shadow-sm mb-4 bg-white">
                  <label className="form-label small text-muted mb-1">Choose Bank</label>
                  <select className="form-select form-select-sm" defaultValue="SBI">
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Submit Payment Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
                style={{ borderRadius: '8px' }}
              >
                Pay Securely ₹{amountInRupees}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-top text-center py-2">
          <span className="text-muted small">🔒 Razorpay Trusted Security (Simulation mode)</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
