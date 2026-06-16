import { useEffect } from"react";

export const useTextFavicon = (faviconText, tabTitle, options = {}) => {
 useEffect(() => {
 // 1. UPDATE THE BROWSER TAB TEXT
 if (tabTitle) {
 document.title = tabTitle;
 }

 // 2. UPDATE THE FAVICON TEXT
 if (!faviconText) return;

 const backgroundColor = options.bgColor ||"#10b981"; // Emerald accent
 const textColor = options.textColor ||"#ffffff";
 const fontSize = options.fontSize ||"20px";
 const fontFamily = options.fontFamily ||"monospace";

 const canvas = document.createElement("canvas");
 canvas.width = 32;
 canvas.height = 32;
 const ctx = canvas.getContext("2d");

 // Paint Background Box
 ctx.fillStyle = backgroundColor;
 ctx.fillRect(0, 0, 32, 32);

 // Paint Text
 ctx.fillStyle = textColor;
 ctx.font = `bold ${fontSize} ${fontFamily}`;
 ctx.textAlign ="center";
 ctx.textBaseline ="middle";
 
 const displayText = faviconText.substring(0, 2).toUpperCase();
 ctx.fillText(displayText, 16, 16);

 // Swap the shortcut icon link element
 let link = document.querySelector("link[rel~='icon']");
 if (!link) {
 link = document.createElement("link");
 link.rel ="icon";
 document.head.appendChild(link);
 }
 link.href = canvas.toDataURL("image/png");

 }, [faviconText, tabTitle, options.bgColor, options.textColor]);
};