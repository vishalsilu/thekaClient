import { useState, useEffect } from'react';
import { useDispatch, useSelector } from'react-redux';
import { useNavigate } from'react-router-dom';
import { toast } from'react-hot-toast';
import { addAddress, updateAddress, deleteAddress } from'../Redux/controllers/crudUser';
import { fetchMyOrders } from'../Redux/thunks/orderThunks';
import { clearError } from'../Redux/slices/authSlice';
import { confirmAction } from'../Utils/alertHelper';

export const useProfile = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const { user, isAuthenticated, isLoading, error,token } = useSelector(state => state.auth);
 const { orders } = useSelector(state => state.orders);

 const [activeTab, setActiveTab] = useState('orders');
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editIndex, setEditIndex] = useState(null);
 const [formData, setFormData] = useState({
 userId: user?.id ||"",
 type:'Home',
 firstName:'',
 lastName:'',
 mobile:'',
 street:'',
 city:'',
 state:'',
 zip:'',
 address:'',
 isDefault: false,
 country:'India'
 });

 useEffect(() => {
 if (!isLoading && (!isAuthenticated || !user)) navigate('/');
 }, [isAuthenticated, user, isLoading, navigate]);

 useEffect(() => {
 if (error) {
 const timer = setTimeout(() => dispatch(clearError()), 3000);
 return () => clearTimeout(timer);
 }
 }, [error, dispatch]);

 useEffect(()=>{
dispatch(fetchMyOrders())
 },[isAuthenticated && token])

 const handleInputChange = (e) => {
 const { name, value, type, checked } = e.target;
 setFormData(prev => ({ ...prev, [name]: type ==='checkbox' ? checked : value }));
 };

 const handleOpenModal = (index = null) => {
 if (index !== null) {
 setEditIndex(index);
 setFormData({ ...user.addresses[index], userId: user?.id });
 } else {
 setEditIndex(null);
 setFormData({ userId: user?.id, type:'Home', firstName:'', lastName:'', mobile:'', street:'', city:'', state:'', zip:'', address:'', isDefault: false, country:'India' });
 }
 setIsModalOpen(true);
 };

 const saveAddressAction = async () => {
 if (!formData.firstName || !formData.mobile || !formData.street) {
 return toast.error("Required fields missing");
 }
 try {
 if (editIndex !== null) {
 await dispatch(updateAddress(formData)).unwrap();
 toast.success("Updated");
 } else {
 await dispatch(addAddress(formData)).unwrap();
 toast.success("Saved");
 }
 setIsModalOpen(false);
 } catch (err) {
 toast.error(err.message ||"Failed to save");
 }
 };

 const deleteAddressAction = (id) => {
 confirmAction({
 title:"Delete Address?",
 onConfirm: () => dispatch(deleteAddress({ userId: user?.id, id }))
 });
 };

 return {
 user, orders, activeTab, setActiveTab, isModalOpen, setIsModalOpen,
 formData, handleInputChange, handleOpenModal, saveAddressAction, 
 deleteAddressAction, dispatch, fetchMyOrders, error
 };
};