import axios from 'axios';

export default class Item {
    constructor(id){
        this.id = id ;
    }

    async getItem(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
             const { title,publisher,image_url,source_url,ingredients} =res.data.recipe;
             this.title = title;
             this.publisher = publisher;
             this.img = image_url;
             this.url = source_url;
             this.ingredients = ingredients;
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
}