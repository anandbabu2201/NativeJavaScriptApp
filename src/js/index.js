import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader ,clearLoader } from './views/fields';
import Item from './models/Item'

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
        state.eachItem = new Item(id);
        try {
            await state.eachItem.getItem();
            state.eachItem.calcTime();
            state.eachItem.calcServings();
        } catch(error){
            console.log(error);
        }
        
    }

}

// window.addEventListener('hashchange',getEachItem)
// window.addEventListener('load',getEachItem)
['hashchange','load'].forEach(event=>window.addEventListener(event,getEachItem));