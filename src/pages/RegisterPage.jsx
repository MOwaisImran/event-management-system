import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';
import { validateRegister } from '../utils/validators';

const FIELDS = [
  ['name', 'Name', 'text'],
  ['email', 'Email', 'email'],
  ['password', 'Password', 'password'],
  ['confirmPassword', 'Confirm password', 'password'],
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((s) => s.auth.error);
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  // Clear any leftover error when leaving the page
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // Registration succeeded -> welcome + go to events
  useEffect(() => {
    if (currentUser) {
      dispatch(showToast({ type: 'success', message: `Welcome, ${currentUser.name}!` }));
      navigate('/events', { replace: true });
    }
  }, [currentUser, dispatch, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length === 0) dispatch(registerUser(form));
  };

  return (
    <div className="card form-card">
      <h1>Create account</h1>
      {authError && <div className="alert alert-error">{authError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map(([field, label, type]) => (
          <label key={field} className="field">
            <span>{label}</span>
            <input
              name={field}
              type={type}
              value={form[field]}
              onChange={handleChange}
              className={errors[field] ? 'invalid' : ''}
            />
            {errors[field] && <small className="error-text">{errors[field]}</small>}
          </label>
        ))}
        <button className="btn btn-block" type="submit">Register</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}