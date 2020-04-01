import { elements } from './fields'

export const getInput =() => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value='';
};

export const clearResults =() => {
 elements.searchResList.innerHTML='';
 elements.searchResPages.innerHTML='';
};

export const highligtSelected = id =>{
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el=> {
        el.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title,limit=17)=>{
    const newTitle=[];
    if(title.length > limit)
    {
        title.split(' ').reduce((acc,curr)=>{
            if(acc + curr.length <= limit ){
                newTitle.push(curr)
            }
            return acc+curr.length;
        },0)

        return `${newTitle.join(' ')}...`;
    }
    
    return title;

}

const renderItem = item => {
    const markup = `<li>
                <a class="results__link" href="#${item.recipe_id}">
                    <figure class="results__fig">
                        <img src="${item.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitle(item.title)}</h4>
                        <p class="results__author">${item.publisher}</p>
                    </div>
                </a>
            </li>`
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

const createButton = (page, type) => ` 
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ?'left' : 'right'}"></use>
        </svg>
       
        </button>
    `

const renderButtons=(page, numResults, resPerPage)=>{
    const pages = Math.ceil(numResults / resPerPage);
    let button ;

    if(page === 1 && pages > 1) {
       button = createButton(page,'next');
    } else if ( page < pages){
        button = `
        ${createButton(page,'prev')}
        ${createButton(page,'next')}`;
    }
    else if(page === pages ){
        button = createButton(page,'prev');
    }

    elements.searchResPages.insertAdjacentHTML("afterbegin",button)
};

export const renderResults = (items,page=1,itemPerPage =10 ) =>{
    const start = (page -1)*itemPerPage ;
    const end = page*itemPerPage ;
    items.slice(start,end).forEach(renderItem)
    
    // render pagination buttons 
    renderButtons(page,items.length,itemPerPage);
}