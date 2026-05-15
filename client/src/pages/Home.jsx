import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cart.find(x => x._id === product._id);
    
    if (existItem) {
      const updated = cart.map(x => x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    } else {
      localStorage.setItem('cartItems', JSON.stringify([...cart, { ...product, qty: 1 }]));
    }
    
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">University Tech Catalog</h2>
        <span className="badge bg-secondary">MERN v19.2</span>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          No gadgets in stock. Log in with your Admin account and click <strong>"+ Add Product"</strong> in the navbar to publish one!
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 bg-white">
                <img 
                  src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} 
                  className="card-img-top p-3" 
                  style={{ height: '220px', objectFit: 'contain' }} 
                  alt={p.name} 
                />
                <div className="card-body d-flex flex-column border-top">
                  <span className="badge bg-dark mb-2 align-self-start">{p.category}</span>
                  <h5 className="card-title fw-bold">{p.name}</h5>
                  <p className="card-text text-muted small mb-4 flex-grow-1">{p.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fs-5 fw-bold text-success">₹{p.price}</span>
                    <button 
                      onClick={() => addToCart(p)} 
                      className={`btn btn-sm fw-medium ${addedId === p._id ? 'btn-success' : 'btn-warning text-dark'}`}
                    >
                      {addedId === p._id ? '✓ Added to Cart' : '+ Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;