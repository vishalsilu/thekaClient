import Swal from'sweetalert2';

export const confirmAction = ({ 
 title ="Are you sure?", 
 text ="You won't be able to revert this!", 
 icon ="warning", 
 confirmText ="Yes, do it!",
 onConfirm 
}) => {
 Swal.fire({
 title,
 text,
 icon,
 showCancelButton: true,
 confirmButtonColor:"#2563eb", // Primary blue
 cancelButtonColor:"#ef4444", // Danger red
 confirmButtonText: confirmText
 }).then((result) => {
 if (result.isConfirmed && onConfirm) {
 onConfirm(); // This runs your logic (delete, update, etc.)
 }
 });
};