import { useEffect } from'react';
import { useDispatch, useSelector } from'react-redux';
import { getFeaturedCollection } from'../../Redux/controllers/metaDataController';
import { useTextFavicon } from'../../Utils/useTextFavicon';

export const useHomeData = () => {
 const dispatch = useDispatch();
 const { data, isLoading } = useSelector((state) => state.siteData);

 // Dynamic favicon and tab-title update controller hook
 useTextFavicon("HR", data?.websiteName?.toUpperCase() ||"Urban Theka // Cart (1)", {
 bgColor:"#10b981", 
 textColor:"#ffffff"
 });

 // Side effect pipeline to query your backend API architecture metadata blocks
 useEffect(() => {
 dispatch(getFeaturedCollection());
 }, [dispatch]);

 return {
 data,
 isLoading
 };
};