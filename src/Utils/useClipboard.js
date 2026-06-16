// useClipboard.js
import { useState } from'react';

export function useClipboard() {
 const [hasCopied, setHasCopied] = useState(false);

 const copy = async (text) => {
 await navigator.clipboard.writeText(text);
 setHasCopied(true);
 setTimeout(() => setHasCopied(false), 2000);
 };

 return { hasCopied, copy };
}