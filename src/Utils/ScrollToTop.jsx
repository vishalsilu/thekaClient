import { useEffect } from"react";
import { useLocation } from"react-router-dom";

const ScrollToTop = () => {
 const { pathname } = useLocation();

 useEffect(() => {
 const scroll = () => {
 window.scrollTo({
 top: 0,
 left: 0,
 behavior:"instant", //'smooth' can sometimes be interrupted by renders
 });
 };

 // Request animation frame ensures the DOM is ready
 requestAnimationFrame(scroll);
}, [pathname]);

 return null;
};

export default ScrollToTop;