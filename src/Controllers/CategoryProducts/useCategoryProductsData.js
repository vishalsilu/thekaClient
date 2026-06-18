import { useState, useMemo, useEffect } from'react';
import { useNavigate, useParams } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { getProducts } from'../../Redux/controllers/metaDataController';
import { useTextFavicon } from'../../Utils/useTextFavicon';
import api from'../../config/api';

export const useCategoryProductsData = () => {
 const { type, category } = useParams();
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const { products, loading } = useSelector((state) => state.metaData);
 const data = useSelector((state) => state.siteData.data);

 const [sortBy, setSortBy] = useState('featured');
 const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
 
 const [filterOptions, setFilterOptions] = useState({
 Fit: [], Color: [], Size: [], Fabric: [], Pattern: []
 });

 const [activeFilters, setActiveFilters] = useState({
 Size: [], Color: [], Fabric: [], Pattern: [], Fit: []
 });

 const sortOptions = [
 { value:'featured', label:'Featured' },
 { value:'newest', label:'Newest Arrivals' },
 { value:'bestselling', label:'Best Selling' },
 { value:'rating', label:'Customer Rating' },
 { value:'low-to-high', label:'Price: Low to High' },
 { value:'high-to-low', label:'Price: High to Low' },
 { value:'oldest', label:'Date : Old to New' },
 ];

 // Sync remote API records matching active routing queries
 useEffect(() => {
 if (type && category) {
dispatch(getProducts({
  type: type.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  category: category.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}));
 }

 const fetchDynamicFilters = async () => {
 try {
 if (type && category) {
const cleanType = type.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const response = await api.get(`/category/weartype/${cleanType}/${cleanCategory}`);
 setFilterOptions(response.data);
 setActiveFilters({ Size: [], Color: [], Fabric: [], Pattern: [], Fit: [] });
 }
 } catch (error) {
 console.error('Error fetching live inventory filters:', error);
 }
 };

 fetchDynamicFilters();
 }, [category, type, dispatch]);

 // Handle scroll locking over active view port layers
 useEffect(() => {
 document.body.style.overflow = isMobileFilterOpen ?'hidden' :'unset';
 }, [isMobileFilterOpen]);

 // Track frame title transformations dynamically
 useTextFavicon('HR', `${type?.toUpperCase() ||'COLLECTION'}'s ${category?.toUpperCase()}-${data?.websiteName ||''}`, {
 bgColor:'#10b981',
 textColor:'#ffffff',
 });

 // Execute array filtering across multi-tier parameter states
 const filteredProducts = useMemo(() => {
 let result = [...products];

 result = result.filter((product) => {
 return Object.entries(activeFilters).every(([group, selectedOptions]) => {
 if (selectedOptions.length === 0) return true;

 const normalize = (v) => (v === undefined || v === null ?'' : String(v).trim().toLowerCase());
 const selectedSet = selectedOptions.map(normalize);

 if (group ==='Color') {
 if (product.variants && product.variants.length > 0) {
 return product.variants.some((v) => selectedSet.includes(normalize(v.color)));
 }
 if (product.color && Array.isArray(product.color)) {
 return product.color.some((c) => selectedSet.includes(normalize(c)));
 }
 return false;
 }

 if (group ==='Size') {
 if (product.variants && product.variants.length > 0) {
 return product.variants.some((v) => v.sizes?.some((s) => selectedSet.includes(normalize(s.size))));
 }
 if (product.size && Array.isArray(product.size)) {
 return product.size.some((sz) => selectedSet.includes(normalize(sz)));
 }
 return false;
 }

 const productKey = group.toLowerCase();
 return selectedSet.includes(normalize(product[productKey]));
 });
 });

 // Compute active sorting orders
 if (sortBy ==='low-to-high') {
 result.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
 } else if (sortBy ==='high-to-low') {
 result.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
 } else if (sortBy ==='newest') {
 result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
 } else if (sortBy ==='oldest') {
 result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
 }

// Ensure active sponsored products float to the top regardless of sort
try {
	const now = new Date();
	result.sort((a, b) => {
		const aActive = a.isSponsored && (!a.sponsorUntil || new Date(a.sponsorUntil) > now) ? 1 : 0;
		const bActive = b.isSponsored && (!b.sponsorUntil || new Date(b.sponsorUntil) > now) ? 1 : 0;
		if (aActive !== bActive) return bActive - aActive;
		if (aActive && bActive && a.sponsorPriority !== b.sponsorPriority) return b.sponsorPriority - a.sponsorPriority;
		return 0;
	});
} catch (err) {
	// ignore
}

 return result;
 }, [products, activeFilters, sortBy]);

 // Flatten nested variant nodes into a plain product list
 const flattenedProducts = useMemo(() => {
 const list = [];
 let seq = 0;
 for (let i = 0; i < filteredProducts.length; i++) {
 const p = filteredProducts[i];
 if (Array.isArray(p.variants) && p.variants.length > 0) {
 p.variants.forEach((v, index) => {
 const repSize = v.sizes && v.sizes.length > 0 ? v.sizes[0].size : '';
 const variantId = v.id ?? v._id ?? `${p.id || p._id}-${index}`;
 list.push({
 ...p,
 id: p.id || p._id,
 _id: p._id || p.id,
 variantId,
 thumbnail: v.images?.[0] || p.thumbnail || p.images?.[0],
 color: v.color || (Array.isArray(p.color) ? p.color[0] : p.color) || 'Default',
 inStock: Boolean(v.sizes?.some((s) => s.stock > 0) || v.stock > 0 || v.quantity > 0),
 size: repSize,
 __originalIndex: seq++,
 });
 });
 } else {
 // determine inStock for products without explicit variants
 const inStock = Boolean(
 (p.sizes && p.sizes.some((s) => s.stock > 0)) ||
 (p.stock > 0) ||
 (p.quantity > 0) ||
 (p.inStock === true)
 );
 list.push({ ...p, id: p.id || p._id, _id: p._id || p.id, inStock, __originalIndex: seq++ });
 }
 }

 // Move sold-out items to the end while preserving relative order
 list.sort((a, b) => {
 const aStock = a.inStock ? 1 : 0;
 const bStock = b.inStock ? 1 : 0;
 if (aStock !== bStock) return bStock - aStock; // inStock true first
 return (a.__originalIndex || 0) - (b.__originalIndex || 0);
});

 // remove helper key before returning
 return list.map(({ __originalIndex, ...rest }) => rest);
 }, [filteredProducts]);

 const handleSortChange = (newValue) => setSortBy(newValue);

 const handleFilterChange = (group, option) => {
 setActiveFilters((prev) => ({
 ...prev,
 [group]: prev[group].includes(option)
 ? prev[group].filter((i) => i !== option)
 : [...prev[group], option],
 }));
 };

 const clearFilters = () => {
 setActiveFilters({ Size: [], Color: [], Fabric: [], Pattern: [], Fit: [] });
 };

 return {
 type,
 category,
 navigate,
 products,
 loading,
 sortBy,
 isMobileFilterOpen,
 setIsMobileFilterOpen,
 filterOptions,
 activeFilters,
 sortOptions,
 flattenedProducts,
 filteredProducts,
 handleSortChange,
 handleFilterChange,
 clearFilters,
 };
};