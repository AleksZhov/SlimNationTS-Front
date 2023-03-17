import { IProductVM, IProduct } from './../../../../interfaces/interfaces';
import { useState } from "react";
import { GetProductsUseCase } from '../../../../Domain/UseCase/Product/GetProducts';



export default function ProductListData(): IProductVM {
    const [error, setError] = useState("");
    const [products, setProducts] = useState<IProduct[]>([]);
    async function getProducts(): Promise<void>{
        const { result, error } = await GetProductsUseCase();
        setError(error);
        setProducts(result);
    }
    return {error, products,getProducts}
}