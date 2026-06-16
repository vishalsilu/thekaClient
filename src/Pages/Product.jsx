import React, { useEffect } from'react'
import ProductDetailModal from'../Components/Products/ProductDetailModal'
import { useParams } from'react-router-dom'
import WhyUs from'../Components/Products/WhyUs'
import MoreCollections from'../Components/Collections/MoreCollections'
import ProductReviews from'../Components/Products/ProductReviews'
import AdvertisementBanner from'../Components/Ads/AdvertisementBanner';
import { useDispatch, useSelector } from'react-redux'
import { getCollections, getProductsByCollection } from'../Redux/controllers/metaDataController'

const Product = () => {
 const product = useSelector(state => state.metaData.product);
 
 return (
 <div className='w-full h-auto flex flex-col items-center justify-center'>
 {product && <ProductDetailModal key={product.id || product._id} />}
 <AdvertisementBanner location="product"  />
 {product && <ProductReviews reviews={product.reviews || []} productId={product.id || product._id} />}
 <MoreCollections />
 <WhyUs />
 </div>
 )
}

export default Product
