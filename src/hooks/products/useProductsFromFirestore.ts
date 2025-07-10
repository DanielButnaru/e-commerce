import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import type { Product } from "../../types/product";

export function useProductsFromFirestore() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchProducts = async () => {
            setLoading(true);
            try{
                const querySnapshot = await getDocs(collection(db, "products"));
                const prods: Product[] = [];
                querySnapshot.forEach((docSnap) => {
                    prods.push({id: docSnap.id, ...(docSnap.data() as Product)});
                });
                setProducts(prods);
            } catch(err){
                setError("Eroare la incarcarea produselor");
            } finally{
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return {products, loading, error};
}
