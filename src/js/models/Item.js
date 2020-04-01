import axios from 'axios';

export default class Item {
    constructor(id){
        this.id = id ;
    }

    async getItem(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
             const { title,publisher,image_url,source_url,ingredients,author= 'Anand'} =res.data.recipe;
             this.title = title;
             this.publisher = publisher;
             this.img = image_url;
             this.url = source_url;
             this.ingredients = ingredients;
             this.author=author
        }
        catch(error) {
            console.log(error)
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;

    }

    calcServings() {
        this.servings= 4;
    }

    parseIngrediants() {
        const unitsLong = ["tablespoons",'tablesspoon','ounces','ounce','teaspoons','teaspoon','cups','pounds']
        const unitsShort =['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units =[...unitsShort,'kg','g'];
        const newIngrediants = this.ingredients.map(el=>{
            let ingrediant = el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingrediant =ingrediant.replace(unit,unitsShort[i])
            });
            ingrediant =ingrediant.replace(/ *\([^)]*\) */g,' ');
            const arrIng = ingrediant.split(' ');
            const unitIndex = arrIng.findIndex(el2=> units.includes(el2));
            let objIng;
            if(unitIndex>-1) {
                const arrCount = arrIng.slice(0,unitIndex); // 4 1/2 cups arr count is [4,1/2]
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit:arrIng[unitIndex],
                    ingrediant:arrIng.slice(unitIndex+1).join(' ')
                }
            } else if(parseInt(arrIng[0],10)) {

                objIng = {
                    count :parseInt(arrIng[0],10),
                    unit:'',
                    ingrediant:arrIng.slice(1).join(' ')
                }

            }
            else if(unitIndex === -1) {
                objIng= {
                 count: 1,
                 unit : '',
                 ingrediant
             }
            }
            return objIng;
        })
        this.ingredients = newIngrediants
    }

    updateServings (type) {
        const newServings = type === 'dec' ? this.servings-1 : this.servings + 1;

        this.ingredients.forEach(ing=>{
            ing.count = ing.count * (newServings/this.servings);
        });


        this.servings = newServings;
    }
}