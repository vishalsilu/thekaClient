import { StrictMode } from'react'
import { BrowserRouter } from'react-router-dom' 
import { createRoot } from'react-dom/client'
import'./index.css'
import App from'./App.jsx'
import { Provider } from"react-redux"
import store from'./Redux/Store.js'
import { GoogleReCaptchaProvider } from'react-google-recaptcha-v3'


createRoot(document.getElementById('root')).render(
 <StrictMode>
 <BrowserRouter> 
 <Provider store={store}>
 {/* FIXED: Changed from process.env to import.meta.env */}
 <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
 <App />
 </GoogleReCaptchaProvider>
 </Provider>
 </BrowserRouter>
 </StrictMode>,
)