import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminEditProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState(299);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        setName(data.name);
        setBrand(data.brand);
        setCategory(data.category);
        setPrice(data.price);
        setDescription(data.description);
        setCurrentImage(data.image);
      } catch (err) {
        setStatus({ loading: false, error: err.response?.data?.message || 'Failed to load product details.', success: '' });
      }
    };

    fetchProduct();
  }, [id, user]);

  if (!user || !user.isAdmin) {
    return <div className="container mt-5 alert alert-danger">Access Denied: You must hold an active Admin session.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    if (file) {
      formData.append('image', file);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`${API_URL}/api/products/${id}`, formData, config);
      setStatus({ loading: false, error: '', success: 'Product updated successfully!' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.message || 'Update failed', success: '' });
    }
  };

  return (
    <div className="container mt-3">
      <div className="max-w-md mx-auto card border-0 shadow-sm p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Edit Product</h4>
          <span className="badge bg-primary">Admin Control</span>
        </div>

        {status.error && <div className="alert alert-danger py-2 small">{status.error}</div>}
        {status.success && <div className="alert alert-success py-2 small">{status.success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-2">
            <div className="col-8">
              <label className="form-label small text-muted mb-1">Title</label>
              <input type="text" className="form-control form-control-sm" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="col-4">
              <label className="form-label small text-muted mb-1">Price (₹)</label>
              <input type="number" className="form-control form-control-sm" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small text-muted mb-1">Brand</label>
              <input type="text" className="form-control form-control-sm" value={brand} onChange={e => setBrand(e.target.value)} required />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">Category</label>
              <select className="form-select form-select-sm" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Electronics">Electronics</option>
                <option value="Laptops">Laptops</option>
                <option value="Study Gear">Study Gear</option>
              </select>
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label small text-muted mb-1">Current Image</label>
            {currentImage && (
              <div className="mb-2">
                <img 
                  src={getImageUrl(currentImage)} 
                  alt="Current" 
                  style={{ maxHeight: '80px', objectFit: 'contain' }} 
                  className="img-thumbnail d-block" 
                />
              </div>
            )}
            <label className="form-label small text-muted mb-1">Replace Image File (Optional)</label>
            <input type="file" className="form-control form-control-sm" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted mb-1">Description</label>
            <textarea className="form-control form-control-sm" rows="2" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
          </div>

          <div className="d-flex gap-2">
            <button type="button" onClick={() => navigate('/')} className="btn btn-outline-secondary btn-sm w-50 fw-bold">
              Cancel
            </button>
            <button type="submit" disabled={status.loading} className="btn btn-dark btn-sm w-50 fw-bold">
              {status.loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
