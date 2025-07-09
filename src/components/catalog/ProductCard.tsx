import type { Product } from "../../types/product"
import { Button } from "../ui/button"
import { useDispatch } from "react-redux"
import { addToCart } from "../../store/slice/cartSlice"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-primary font-bold">{product.price.toFixed(2)} RON</span>
        <Button size="sm" onClick={() => dispatch(addToCart(product)) } className="text-black">
          Adaugă în coș
        </Button>
       
      </div>

    </div>
  )
}
