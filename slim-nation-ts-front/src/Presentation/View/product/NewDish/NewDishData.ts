import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { useState } from "react";
import { useNavigate } from 'react-router-dom';


import { CreateProductUseCase } from "../../../../Domain/UseCase/Product/CreateProduct";
import { useUserCont } from '../../../../context/UserContext';
import { useProductListCont } from '../../../../context/ProductsListContext';
import { INewDishVM, product, IIngredient, INewDishData } from "../../../../types/types";


const initialNewDishData = { productName: "", energy: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, weight: 0 }


export default function NewDishData(): INewDishVM {

    const { currentUserData } = useUserCont()
    const { productsList, setProductsList } = useProductListCont();
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null);
    const [createNewProdError, setCreateNewProdError] = useState("");
   
    const [ingredients, setIngredients] = useState<IIngredient[] | []>([]);
    const[newDishData,setNewDishData] = useState<INewDishData>(initialNewDishData)



        const calculateNutrients = (): void => {
        if (ingredients.length > 0) {
            let totalWeight: number = ingredients.map(i => i.weight).reduce((a, b) => a + b);
            let totalEnergy: number = ingredients.map(i => i.energy*i.weight/100).reduce((a, b) => a + b);
            let totalProtein: number = ingredients.map(i => i.protein*i.weight/100).reduce((a, b) => a + b);
            let totalCarbs: number = ingredients.map(i => i.carbs*i.weight/100).reduce((a, b) => a + b);
            let totalFat: number = ingredients.map(i => i.fat*i.weight/100).reduce((a, b) => a + b);
            let totalFiber: number = ingredients.map(i => i.fiber*i.weight/100).reduce((a, b) => a + b);
           
            setNewDishData({...newDishData, weight:totalWeight,energy:totalEnergy, carbs:totalCarbs, protein:totalProtein, fat:totalFat, fiber:totalFiber})
        }
        else { setNewDishData(initialNewDishData) }
    }
    
    const addNewIngredient = (id: string):void => {
        const reqIngredient = productsList.find(product =>  product._id === id );
        if (reqIngredient) {
            const ingrToAdd: IIngredient = { ...reqIngredient, weight: 0 }
            const isIngAlreadyAdded = ingredients.find(ingr => ingr._id === id)
            if (!isIngAlreadyAdded) { setIngredients([...ingredients, ingrToAdd]) } else {
            Notify.warning("Ingredient is already in the list!")
        }
        }
    }

    const remIngrFromList = (id: string): void => {
        const newIngrArr = ingredients.filter(ingr => ingr._id !== id);
        setIngredients(newIngrArr);
        if(newIngrArr.length === 0){setNewDishData(initialNewDishData)}
    }


    const handleIngrWeightChange = (id: string, weight: number) => {
        const newArr = ingredients;
        const idx = newArr.findIndex(ingr=>ingr._id ===id)
        if (idx !== -1) {
            newArr[idx].weight = Number(weight);
        setIngredients(newArr)}
         calculateNutrients();
     }
    
    
    
    const handleDishNameChange = (name: string): void => {
    setNewDishData({...newDishData, productName:name})
    }

    async function addNewDishToDB() {
        const { productName, energy, protein, fat, fiber, carbs,weight } = newDishData;
        if (productName === "" || weight === 0) { Notify.warning("Please fill all required fields.") } else {
            const { error, result } = await CreateProductUseCase({
               
            productName,
            fat: Number((fat * 100 / weight).toFixed(1)),
            energy: Number((energy * 100 / weight).toFixed(1)),
            protein: Number((protein * 100 / weight).toFixed(1)),
            carbs: Number((carbs * 100 / weight).toFixed(1)),
            fiber: Number((fiber * 100 / weight).toFixed(1))
            }, currentUserData.accessToken)
             console.log('result: ', result);
            if (error && typeof error === "object" && "message" in error && error.message === "string") { setCreateNewProdError(error.message) }
            if(error === null){setError(null)}
            if (result) {
                setProductsList([...productsList, result])
                setNewDishData(initialNewDishData);
                setIngredients([]);
                navigate("/products-list")
            }
       }
    }
    
    return {error,products:productsList, addNewDishToDB,addNewIngredient,remIngrFromList, ingredients, handleIngrWeightChange,calculateNutrients, newDishData,handleDishNameChange}
}