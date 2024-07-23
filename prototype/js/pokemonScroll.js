
$(() => {
let scrollBarContainer = $("#scrollBarContainer")
let pokemonTitle = $("#scrollPokemonTitle")
let usedPokemons = []; 
let gridItems = []
let rightIndexPosition = 4;
let leftIndexPosition = 0;
let previousGridSize = 5;
let amountOfClicks = 0;

const buttonOnRight = $("<button><i class='fa fa-chevron-right fa-5x icon'></i></button>");
buttonOnRight.addClass("arrow");
buttonOnRight.addClass("arrow-right");

const buttonOnLeft = $("<button><i class='fa fa-chevron-left fa-5x icon'></i></button>");
buttonOnLeft.addClass("arrow");
buttonOnLeft.addClass("arrow-left");

scrollBarContainer.prepend(buttonOnRight);
scrollBarContainer.prepend(buttonOnLeft);

fillWithRandomPokemon(25);

/* ------------------------Functions Below------------------------ */

/* Function to fill get the pokemons and the data needed about them  */
function fillWithRandomPokemon(numOfPokemonsNeeded) {
    let usedIDs = [];
    // gridItems.push(buttonOnRight);
    // gridItems.push(buttonOnLeft);
    for (let i=0; i < numOfPokemonsNeeded; i++) {
        let id = Math.floor(Math.random() * LAST_POKEMON_ID) + 1;
        usedIDs[i] = checkIfPokemonExists(id,usedIDs);
        let pokemon = fetchPokemonById(usedIDs[i]);
        usedPokemons[i] = pokemon;

        gridItems.push($("<button><div></div></button>"));
        // gridItems.push($("<div></div>"));
        
        gridItems[i].addClass("grid-item");

        usedPokemons[i].then(data => {
            if (data) {        
                // const title = $("<h3></h3>").text(i) /* Testing variable */     
                const image = $("<img />").attr('src', data.sprites.front_default).css("z-index","5");
                image.addClass("grid-item-image");
                
                // gridItems[i].append(image,title);
                gridItems[i].append(image);
                if(i === 0){
                    const height = gridItems[0].css("height");
                    $(".arrow").css("height",height + "px");
                }
                gridItems[i].click(e => {
                    // window.location.assign(`/prototype/pokemon.html?name=${"Pikachu"}`);
                    window.location.assign(`/prototype/pokemon.html?name=${data.name}`);
                });
                
            } else {
                numOfPokemonsNeeded++;
            }
            
        });
        
        
    }
 
    const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
    if(currentWidth >= 1400){
        rightIndexPosition = 5;
        previousGridSize = 6;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,6));
    } else if (currentWidth >=1150){
        rightIndexPosition = 4;
        previousGridSize = 5;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,5));
    } else if (currentWidth >=1020.5){
        rightIndexPosition = 3;
        previousGridSize = 4;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,4));
    } else if (currentWidth >=975){
        rightIndexPosition = 4;
        previousGridSize = 5;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,5));
    }  else if (currentWidth >=800){
        rightIndexPosition = 3;
        previousGridSize = 4;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,4));
    } else if (currentWidth >=600){
        rightIndexPosition = 2;
        previousGridSize = 3;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,3));
    } else if(currentWidth >=440) {
        rightIndexPosition = 1;
        previousGridSize = 2;
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,2));
    } else if(currentWidth >=220) {
        rightIndexPosition = 0;
        previousGridSize = 1;
        scrollBarContainer.html("");
        $("#scrollPokemonTitle").text("POKEMON");
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(0,1));
    } else {
        scrollBarContainer.html("");
    }
    whenClicking();
}

// * On click function for the button on the right hand side */
function whenClicking(){
    buttonOnRight.click(function(){
        let toRemove = gridItems[increaseLeftIndex()]
        toRemove.remove();
        let toAdd = gridItems[increaseRightIndex()]
        scrollBarContainer.append(toAdd); 
        if(amountOfClicks === usedPokemons.length){
            amountOfClicks = 0;
            makeButtonsWork();
        }
        amountOfClicks++;
    });
    
    
    /* On click function for the button on the left hand side */
    buttonOnLeft.click(function(){
        let toRemove = gridItems[decreaseRightIndex()]
        toRemove.remove();
        let toAdd = gridItems[decreaseLeftIndex()]
        scrollBarContainer.prepend(toAdd);
        if(amountOfClicks === usedPokemons.length){
            amountOfClicks = 0;
            makeButtonsWork();
        }
        amountOfClicks++;
        
    });

    function makeButtonsWork(){
        for(let i = 0; i < usedPokemons.length; i++){
            usedPokemons[i].then(data => {      
                    gridItems[i].click(e => {
                        // window.location.assign(`/prototype/item.html?name=${"Pikachu"}`);
                        window.location.assign(`/prototype/pokemon.html?name=${data.name}`);
                        });
                });
            }
    }
    
    
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
}

/* Function that returns five pokeons with start index */
/* Can add buttons that scroll through like 5 pokemons but will need to do some changes in the function*/
function getFivePokemonsOutOfGridItems(startIndex, amountOfGridsNeeded){
    let pokemons = [];

    for (let i = 0; i < amountOfGridsNeeded; i++,startIndex++){
        if(startIndex == gridItems.length){
            startIndex = 0;
        }
        pokemons[i] = gridItems[startIndex];
    }

    if(previousGridSize > amountOfGridsNeeded){
        rightIndexPosition--;
        if(rightIndexPosition === -1) {
            rightIndexPosition = gridItems.length-1;
        }
    } else if (previousGridSize < amountOfGridsNeeded){
        rightIndexPosition++;
        if(rightIndexPosition === gridItems.length){
            rightIndexPosition = 0;
        }
    }

    previousGridSize = amountOfGridsNeeded;
    return pokemons;
}


/* Function that checks if the new item exists already and if it does
    it gets a new one */
function checkIfPokemonExists(id, usedIds){
    
    for (let i=0; i < usedIds.length; i++){
        if(id == usedIds[i]){
            id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
            id =  checkIfPokemonExists(id,usedIds);
            i = 0;
        }
    }
    return id;
}


$(window).resize(e => {
    scrollBarContainer.html("");
    scrollBarContainer.append(pokemonTitle);
    scrollBarContainer.prepend(buttonOnRight);
    scrollBarContainer.prepend(buttonOnLeft);
    const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
    if(currentWidth >= 1400){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,6));
        // console.log(rightIndexPosition);
    } else if (currentWidth >=1150){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,5));
    } else if (currentWidth >=1020.5){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,4));
    } else if (currentWidth >=975){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,5));
    } else if (currentWidth >=800){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,4));
    } else if (currentWidth >=600){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,3));
    } else if (currentWidth >=440){
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,2));
    }   else if (currentWidth >=220){
        scrollBarContainer.html("");
        scrollBarContainer.append(pokemonTitle);
        scrollBarContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,1));
    } else {
        scrollBarContainer.html("");
    }
    whenClicking();
});
});
