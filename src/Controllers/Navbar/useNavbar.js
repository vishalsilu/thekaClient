// useNavbar.js
import { useState, useEffect, useRef, useMemo } from'react';
import { useDispatch, useSelector } from'react-redux';
import { useNavigate } from'react-router-dom';
import { searchEveryThing } from'../../Redux/controllers/metaDataController';
import { cleanResult } from'../../Redux/slices/metaDataSlice';

export const useNavbar = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 
 // States
 const [isClick, setIsClick] = useState(false);
 const [isSearchClick, setIsSearchClick] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const [searchCollection, setSearchCollection] = useState('All Collections');
 const [isSearchFocused, setIsSearchFocused] = useState(false);
 const [isHeaderVisible, setIsHeaderVisible] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);

 // Selectors
 const Data = useSelector(state => state.siteData.data);
 const searchResult = useSelector(state => state.metaData.searchResult);
 const collections = useSelector(state => state.metaData.collections);
 const totalUnits = useSelector(state => state.cart.totalQuantity);
 const { isAuthenticated, user } = useSelector(state => state.auth);

 // Logic Handlers
 const handleScroll = () => {
 const currentScrollY = window.scrollY;
 if (currentScrollY <= 60) { setIsHeaderVisible(true); }
 else { setIsHeaderVisible(currentScrollY < lastScrollY); }
 setLastScrollY(currentScrollY);
 };

 const handleSearchSubmit = (e) => {
 e.preventDefault();
 if (searchTerm.trim()) {
 setIsSearchFocused(false);
 navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}&collection=${encodeURIComponent(searchCollection)}`);
 }
 };

 // Data processing
 const normalizedSearch = useMemo(() => {
 // ... (Your existing filtering logic)
 }, [searchCollection, searchResult]);

 useEffect(() => {
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, [lastScrollY]);

 return {
 isClick, setIsClick, isSearchClick, setIsSearchClick,
 searchTerm, setSearchTerm, searchCollection, setSearchCollection,
 isSearchFocused, setIsSearchFocused, isHeaderVisible,
 Data, collections, totalUnits, isAuthenticated, user,
 handleSearchSubmit, normalizedSearch, dispatch
 };
};