import { useNavigate } from'react-router-dom';

export const useHeroController = ({ Data }) => {
 const navigate = useNavigate();

 // Parse incoming banner strings accurately
 const titleText = Data?.title ||"";
 const [firstWord, secondWord, thirdWord] = titleText.split(" ");

 const handleNavigation = () => {
 const structuralDestination = Data?.ctaPath ||"/collections";
 navigate(structuralDestination);
 };

 return {
 firstWord,
 secondWord,
 thirdWord,
 handleNavigation,
 };
};