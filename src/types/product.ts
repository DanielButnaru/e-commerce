 export interface Product {
  // Identificare de bază
  id?: string;
  sku: string; // Cod unic de produs (ex: "PROD-001-XL-RED")
  name: string;
  slug: string; // Pentru URL-uri SEO (ex: "bluza-alba-marime-xl")
  
  // Prețuri și promoții
  basePrice: number; // Preț de bază
  salePrice?: number; // Preț promoțional
  costPrice?: number; // Preț de cost (pentru profit)
  discountPercentage?: number; // Procent reducere
  isOnSale: boolean;

  // Descriere și conținut
  description: string;
  shortDescription?: string;
  specifications: { // Specificații tehnice
    key: string;
    value: string;
  }[];
  tags: string[]; // Etichete pentru căutare

  // Imagini și media
  thumbnail: string; // Imagine mică pentru liste
  images: string[]; // Galerie imagini
  videos?: string[]; // Videoclipuri produs
  colorSwatches?: { // Mostre de culoare
    color: string;
    image: string;
  }[];

  // Variante
  variants: {
    sizes: ProductSize[]; // Mărimi disponibile
    colors: ProductColor[]; // Culori disponibile
    materials?: ProductMaterial[]; // Materiale disponibile
    combinations?: ProductCombination[]; // Combinații predefinite
  };

  // Stoc și disponibilitate
  stock: number; // Stoc total
  stockStatus: 'in-stock' | 'out-of-stock' | 'pre-order';
  lowStockThreshold: number; // Alertă stoc scăzut
  manageStock: boolean; // Gestionare stoc activă

  // Logistică
  weight: number; // în kg
  dimensions: { // Dimensiuni de transport
    length: number;
    width: number;
    height: number;
  };
  shippingClass?: string; // Clasa de transport

  // Categorizare
  categories: string[];
  brand?: string;
  collection?: string; // Colecție apartenență

  // Comerț electronic
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating?: number; // 1-5 stele
  reviews?: ProductReview[]; // Recenzii

  // Personalizări
  customizableOptions?: {
    textEngraving?: boolean; // Personalizare text
    imageUpload?: boolean; // Încărcare imagine
    customText?: string; // Text predefinit
  };


  // Audit
  createdAt: Date;
  updatedAt: Date;
  relatedProducts: string[]; // ID-uri produse similare
}

// Interfețe auxiliare
interface ProductSize {
  id: string;
  name: string;
  priceModifier: number;
  stock: number;
  sizeGuide?: string; // Ghid mărimi
}

interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  image?: string;
}

interface ProductMaterial {
  id: string;
  name: string;
  description?: string;
}

interface ProductCombination {
  id: string;
  sku: string; // SKU specific (ex: "PROD-001-XL-RED")
  sizeId: string;
  colorId: string;
  materialId?: string;
  price: number; // Preț exact pentru combinație
  stock: number;
  image?: string; // Imagine specifică combinației
}

interface ProductReview {
  userId: string;
  rating: number;
  comment: string;
  date: Date;
}