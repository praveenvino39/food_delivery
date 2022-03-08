export interface CreateFoodInput {
    name:string;
    description:string;
    price:number;
    category:string;
    type:string;
    readyTime:number;
    images:[string];
}