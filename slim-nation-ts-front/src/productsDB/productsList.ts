interface IProduct{id:string,productName:string, energy:number, protein:number,fat:number,carbs:number, fiber:number }


const productsList:Array <IProduct> = [{id:"1",productName:"Chicken breast",energy:160, protein:15.1, fat:2.1, carbs:0, fiber:0},{id:"2",productName:"Oats dry",energy:363, protein:13.1, fat:5.7, carbs:60, fiber:10}]
export default productsList;