import type { Product } from "../types/product";

export const products: Product[] = [
    {
        id: "1",
        name: "Product 1",
        price: 10,
        image: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        description: "Description 1",
        category: ["Category 1", "Category 2"],
    },
    {
        id: "2",
        name: "Product 2",
        price: 20,
        image: "https://images.pexels.com/photos/31023938/pexels-photo-31023938.jpeg",
        images: ["https://images.pexels.com/photos/32908779/pexels-photo-32908779.jpeg", "https://via.placeholder.com/150"],
        description: "Description 2",
        category:["Category 1", "Category 2"],
    },
    {
        id: "3",
        name: "Product 3",
        price: 30,
        image: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        description: "Description 3",
        category: ["Category 3", "Category 4"],
    },
    {
        id: "4",
        name: "Product 4",
        price: 40,
        image: "https://via.placeholder.com/150",
        images: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        description: "Description 4",
        category: ["Category 3", "Category 4"],
    },
];
