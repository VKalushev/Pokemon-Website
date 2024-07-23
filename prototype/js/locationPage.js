let scrollBarContainer = $("#scrollBarContainer")
let locationTitle = $("#locationTitle");
let gridItems = []
let rightIndexPosition = 4;
let leftIndexPosition = 0;
let differentVersion = [];
const games = new Set();
let buttonOnRight = $("<button><i class='fa fa-chevron-right fa-5x icon'></i></button>");
buttonOnRight.addClass("arrow");
buttonOnRight.addClass("arrow-right");

let buttonOnLeft = $("<button><i class='fa fa-chevron-left fa-5x icon'></i></button>");
buttonOnLeft.addClass("arrow");
buttonOnLeft.addClass("arrow-left");



const locationFetch = PokeAPI.getLocationById(210)
.then(pokemonData => {
        if(pokemonData){
            locationTitle.text(removeHyphens(pokemonData.location.name));
            scrollBarContainer.append(locationTitle);

            for (let i=0; i < pokemonData.pokemon_encounters.length; i++) {
                gridItems.push($("<button><div></div></button>"));
                gridItems[i].addClass("grid-item");  
                

                const pokemon = fetchPokemonByName(pokemonData.pokemon_encounters[i].pokemon.name)
                .then(data => {
                    if (data != {}) {        
                        for (let j=0; j < pokemonData.pokemon_encounters[i].version_details.length; j++){
                            games.add(pokemonData.pokemon_encounters[i].version_details[j].version.name);
                            // console.log(games);
                        }


                        for (let j=0; j < games.size; j++){
                            const image = $("<img />").attr('src', data.sprites.front_default);
                            image.addClass("grid-item-image");
                        
                            gridItems[i].append(image);
                            gridItems[i].click(e => {
                            window.location.assign(`/prototype/pokemon.html?name=${data.name}`);
                        });
                        }

                    }
                    
                });
                scrollBarContainer.append(getFivePokemonsOutOfGridItems(0));
                scrollBarContainer.prepend(buttonOnRight);
                scrollBarContainer.prepend(buttonOnLeft);
            }
            // scrollBarContainer.append(gridItems);
            
            
        }
});
    


/* ------------------------Functions Below------------------------ */

/* Function to fill get the pokemons and the data needed about them  */

/* On click function for the button on the right hand side */
buttonOnRight.click(function(){
    let toRemove = gridItems[increaseLeftIndex()]
    toRemove.remove();
    let toAdd = gridItems[increaseRightIndex()]
    scrollBarContainer.append(toAdd); 
});


/* On click function for the button on the left hand side */
buttonOnLeft.click(function(){
    let toRemove = gridItems[decreaseRightIndex()]
    toRemove.remove();
    let toAdd = gridItems[decreaseLeftIndex()]
    scrollBarContainer.prepend(toAdd);
    
});

/* Increase/Decrease functions for both indicators of the current index(arrows) */
function increaseRightIndex(){
    if(rightIndexPosition == gridItems.length-1) {
        rightIndexPosition = 0;
        return rightIndexPosition;
    } else {
        return ++rightIndexPosition;
    }
    
}

function decreaseRightIndex(){
    if(rightIndexPosition  == 0) {
        rightIndexPosition = gridItems.length-1;
        return 0;
    } else {
        return rightIndexPosition--;
    }
    
}

function increaseLeftIndex(){
    if(leftIndexPosition == gridItems.length-1) { 
        leftIndexPosition = 0
        return gridItems.length-1;
    } else {
        return leftIndexPosition++;
    }
    
}

function decreaseLeftIndex(){
    if(leftIndexPosition == 0) {
        leftIndexPosition = gridItems.length-1;
        return leftIndexPosition;
    } else {
        return --leftIndexPosition;
    }
    
}


/* Function that returns five pokeons with start index */
/* Can add buttons that scroll through like 5 pokemons but will need to do some changes in the function*/
function getFivePokemonsOutOfGridItems(startIndex){
    let fivePokemons = [];
    for (let i = startIndex; i < startIndex + 5; i++){
    fivePokemons[i] = gridItems[i];      
    }
    return fivePokemons;
}


/* Function that checks if the new pokemon exists already and if it does
    it gets a new one */
function checkIfPokemonExists(id, usedIds){
    for (let i=0; i < usedIds.length; i++){
        if(id == usedIds[i]){
            id = Math.floor(Math.random() * 300);
            checkIfPokemonExists(id,usedIds);
        }
    }
    return id;
}



