import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RazorpayModal from '../components/RazorpayModal';
import { API_URL, getImageUrl } from '../config';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('CART');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('cartItems')) || []);
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const updateQty = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item._id === id) {
        const newQ = item.qty + delta;
        return newQ > 0 ? { ...item, qty: newQ } : null;
      }
      return item;
    }).filter(Boolean);

    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const startPayment = async () => {
    if (!user) {
      setErrorMessage('Please login first to proceed with payment.');
      return;
    }
    setCheckoutStep('PROCESSING');
    setErrorMessage('');
    try {
      const { data: order } = await axios.post(
        `${API_URL}/api/payment/order`,
        { amount: parseFloat(subtotal) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (order.isSimulation || !window.Razorpay) {
        setRazorpayOrder(order);
        setShowRazorpayModal(true);
        setCheckoutStep('CART');
        return;
      }

      // Official Razorpay Checkout Flow
      const options = {
        key: order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'NexonMart',
        description: 'Store Purchase',
        order_id: order.id,
        handler: async function (response) {
          setCheckoutStep('PROCESSING');
          try {
            await axios.post(
              `${API_URL}/api/payment/verify`,
              response,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setCheckoutStep('SUCCESS');
            localStorage.removeItem('cartItems');
            setCartItems([]);
          } catch (error) {
            setErrorMessage('Payment verification failed.');
            setCheckoutStep('CART');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#0d6efd',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setErrorMessage(response.error.description);
        setCheckoutStep('CART');
      });
      rzp.open();
      setCheckoutStep('CART');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to initialize payment.');
      setCheckoutStep('CART');
    }
  };

  const handleSimulatedSuccess = async (response) => {
    setShowRazorpayModal(false);
    setCheckoutStep('PROCESSING');
    try {
      await axios.post(
        `${API_URL}/api/payment/verify`,
        response,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCheckoutStep('SUCCESS');
      localStorage.removeItem('cartItems');
      setCartItems([]);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Payment verification failed.');
      setCheckoutStep('CART');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2);

  if (checkoutStep === 'PROCESSING') {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }}></div>
        <h4 className="fw-bold">Contacting Razorpay Gateway...</h4>
        <p className="text-muted small">Verifying cryptographic Webhook HMAC signature</p>
      </div>
    );
  }

  if (checkoutStep === 'SUCCESS') {
    return (
      <div className="container mt-5 text-center">
        <div className="card border-0 shadow-sm p-5 max-w-md mx-auto bg-white">
          <div className="display-1 text-success mb-2">✓</div>
          <h2 className="fw-bold text-dark">Payment Captured!</h2>
          <p className="text-muted mb-1">Simulated Webhook Handshake: <span className="badge bg-success">200_OK</span></p>
          <p className="text-muted small mb-4">Transaction ID: #rzp_test_{Math.floor(100000 + Math.random() * 900000)}</p>
          <Link to="/" className="btn btn-dark px-4 py-2 fw-medium">Return to Storefront</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h3 className="fw-bold mb-4">Review Your Cart</h3>
      {cartItems.length === 0 ? (
        <div className="alert alert-secondary">Your cart is empty. <Link to="/" className="fw-bold">Go grab some tech</Link></div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <ul className="list-group list-group-flush">
                {cartItems.map(item => (
                  <li key={item._id} className="list-group-item py-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="me-3" />
                      <div>
                        <h6 className="mb-0 fw-bold">{item.name}</h6>
                        <small className="text-muted">₹{item.price} x {item.qty}</small>
                      </div>
                    </div>
                    <div className="btn-group">
                      <button onClick={() => updateQty(item._id, -1)} className="btn btn-sm btn-outline-dark">-</button>
                      <span className="btn btn-sm btn-light disabled px-3 fw-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="btn btn-sm btn-outline-dark">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 bg-dark text-white">
              <h5 className="fw-bold mb-3">Checkout Summary</h5>
              <div className="d-flex justify-content-between mb-4 fs-5">
                <span>Total:</span>
                <span className="fw-bold text-warning">₹{subtotal}</span>
              </div>
              {errorMessage && <div className="alert alert-danger py-2 small mb-3">{errorMessage}</div>}
              <button onClick={startPayment} className="btn btn-warning fw-bold py-2 text-dark w-100">
                Pay with Razorpay 💳
              </button>
            </div>
          </div>
        </div>
      )}

      {showRazorpayModal && razorpayOrder && (
        <RazorpayModal 
          order={razorpayOrder}
          user={user}
          onClose={() => setShowRazorpayModal(false)}
          onSuccess={handleSimulatedSuccess}
        />
      )}
    </div>
  );
};

export default Cart;