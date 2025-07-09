import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { Button } from "../ui/button";


const WishlistButton = () => {
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
    
    return (
        <div className="relative">
        <Button variant="ghost" size="icon">
            <Link to="/wishlist">
                <Heart />
                {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                    </span>
                )}
            </Link>

        </Button>
        </div>
      )
}

export default WishlistButton