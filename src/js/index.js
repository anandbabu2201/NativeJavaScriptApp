import Search from './models/Search';
import * as searchView from './views/searchView';
import * as itemView from './views/itemView';
import { elements, renderLoader ,clearLoader } from './views/fields';
import Item from './models/Item'
import List from './models/LIst';
import Likes from './models/Likes'
import * as listView from './views/listView';
import * as likesView from './views/likesView'

/** Global State of the app 
 * - search Object
 * - current recipe object
 * - shopping List object
 * - Liked recipes
 */

 const state = {};


 const controlSearch = async ()=>{
     // 
     const query = searchView.getInput();
     
     if(query) {
         
         // New search Object and add to state
     state.search= new Search(query);
    
     searchView.clearInput();
     searchView.clearResults();
     renderLoader(elements.searchResList)
     try {
        // Search for recipes.
     await state.search.getResults();
     clearLoader();
     // render results on UI
         searchView.renderResults(state.search.results)
     } catch(err){
         console.log(err);
         clearLoader();

     }
     
     }
 }


 elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
})

window.addEventListener('load',e=>{
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click',e=> {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.results,goToPage)
    }
})

/** Item control */

// elements.searchResList.addEventListener('click', e=>{
//     let id = e.target.closest('.results__link').href;
//      id = id.substring(id.lastIndexOf('/')+2);
//     const eachItem = new Item(id);
//     state.eachItem = eachItem;
// })

const getEachItem = async ()=>{
    const id = window.location.hash.replace('#','')
    if(id){
        itemView.clearItem();
        renderLoader(elements.item);
        if(state.search) searchView.highligtSelected(id)
        state.eachItem = new Item(id);
        // window.r = state.eachItem
        try {
            await state.eachItem.getItem();
            state.eachItem.parseIngrediants()
            state.eachItem.calcTime();
            state.eachItem.calcServings();
            clearLoader();
            itemView.renderItem(state.eachItem,state.likes.isLiked(id))
        } catch(error){
            console.log(error);
        }
        
    }

}

// window.addEventListener('hashchange',getEachItem)
// window.addEventListener('load',getEachItem)
['hashchange','load'].forEach(event=>window.addEventListener(event,getEachItem));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.eachItem.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingrediant);
        listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


// Like control 

const controlLikes=()=> {

    if(!state.likes) state.likes  = new Likes()

    const currentID = state.eachItem.id;

    if(!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            currentID,
            state.eachItem.title,
            state.eachItem.author,
            state.eachItem.img
        );
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);
    } else {

        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
    }
    likesView.toggleListMenu(state.likes.getNumLikes());
}

// Restore like recipes on page Load 

window.addEventListener('load',()=>{
    state.likes= new Likes();
    state.likes.readStorage();
    likesView.toggleListMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like=>likesView.renderLike(like));
})

//Handling recipe button clicks 

elements.item.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *'))
    {
        if(state.eachItem.servings > 1) {
            state.eachItem.updateServings('dec');
            itemView.updateServingsIngredients(state.eachItem);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {

        state.eachItem.updateServings('inc');
        itemView.updateServingsIngredients(state.eachItem);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } 
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    } 
})

