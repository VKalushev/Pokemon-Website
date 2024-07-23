let scrollContainer;
let scrollTitle;
let usedItems = []; 
let gridItems = []
let rightIndexPosition = 4;
let leftIndexPosition = 0;
let previousGridSize = 5;
let amountOfClicks = 0;

let buttonOnRight = $("<button><i class='fa fa-chevron-right fa-5x icon'></i></button>");
let buttonOnLeft = $("<button><i class='fa fa-chevron-left fa-5x icon'></i></button>");
class Scroll {
        isDiskPngUsed = new Boolean(false);
        isHmUsed = new Boolean(false);
        isDataCardUsed = new Boolean(false);
        isGramUsed = new Boolean(false);
        isPokemon;
        lastID;

        


        constructor(type,container,title){
            if(type === "pokemon"){
                this.isPokemon = new Boolean(true);
                this.lastID = LAST_POKEMON_ID;
            } else if(type === "item"){
                this.isPokemon = new Boolean(false);
                this.lastID = LAST_ITEM_ID;
            }

            scrollContainer = container;
            scrollTitle = title;
            buttonOnRight.addClass("arrow");
            buttonOnRight.addClass("arrow-right");
            
            
            buttonOnLeft.addClass("arrow");
            buttonOnLeft.addClass("arrow-left");
            
            scrollContainer.append(buttonOnRight);
            scrollContainer.append(buttonOnLeft);
            
        }
        
        /* ------------------------Functions Below------------------------ */
        
        /* Function to fill get the pokemons and the data needed about them  */
        render(scrollSize) {
            let usedIDs = [];
        
            for (let i=0; i < scrollSize; i++) {
                let id = Math.floor(Math.random() * this.lastID)+1;
                let item;
                
                if(this.isPokemon === true){
                    usedIDs[i] = this.checkIfPokemonExists(id,usedIDs);
                    item = fetchPokemonById(usedIDs[i]);
                } else {
                    id = this.checkIfItemExists(id,usedIDs);

                    if((id >= 305 && id <= 396) || id === 660 || id === 661 || (id >= 745 && id <= 749)){
                        this.isDiskPngUsed = true; 
                    } else if(id >= 397 && id <= 404){
                        this.isHmUsed = true;
                    } else if(id >= 486 && id <= 512){
                        this.isDataCardUsed = true;
                    } else if(id === 664 || id === 665 || id === 666){
                        this.isGramUsed = true;
                    } else if (id === 680 || id === 667 || id === 672 ){
                        id = Math.floor(Math.random() * lastID)+1;
                        id = this.checkIfItemExists(id,usedIDs);
                    }

                    usedIDs[i] = id;
                    item = fetchItemById(usedIDs[i]);
                }

                usedItems[i] = item;
        
                gridItems.push($("<button><div></div></button>"));
                // gridItems.push($("<div></div>"));
                
                gridItems[i].addClass("grid-item");
        
                usedItems[i].then(data => {
                    if (data) {        
                        // const title = $("<h3></h3>").text(i) /* Testing variable */     
                        let image;
                        if(this.isPokemon === true){
                            image = $("<img />").attr('src', data.sprites.front_default).css("z-index","5");
                        } else {
                            image = $("<img />").attr('src', data.sprites.default).css("z-index","5");
                        }
                        image.addClass("grid-item-image");
                        
                        // gridItems[i].append(image,title);
                        gridItems[i].append(image);
                        if(i === 0){
                            const height = gridItems[0].css("height");
                            $(".arrow").css("height",height + "px");
                        }
                        gridItems[i].click(e => {
                            // window.location.assign(`/prototype/item.html?name=${"Pikachu"}`);
                            window.location.assign(`/prototype/item.html?name=${data.name}`);
                        });
                        
                    } else {
                        numOfItemsNeeded++;
                    }
                    
                });
                
                
                
            }
        
            
            const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
            // console.log(currentWidth)
            if(currentWidth >= 1400){
                rightIndexPosition = 5;
                previousGridSize = 6;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,6));
            } else if (currentWidth >=1150){
                rightIndexPosition = 4;
                previousGridSize = 5;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,5));
            } else if (currentWidth >=1020.5){
                rightIndexPosition = 3;
                previousGridSize = 4;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,4));
            } else if (currentWidth >=975){
                rightIndexPosition = 2;
                previousGridSize = 3;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,5));
            }  else if (currentWidth >=800){
                rightIndexPosition = 2;
                previousGridSize = 3;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,4));
            } else if (currentWidth >=600){
                rightIndexPosition = 1;
                previousGridSize = 2;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,3));
            } else if(currentWidth >=440) {
                rightIndexPosition = 0;
                previousGridSize = 1;
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,2));
            } else if(currentWidth >=220) {
                rightIndexPosition = 0;
                previousGridSize = 1;
                scrollContainer.html("");
                $("#scrollItemTitle").text("scrollItemTitle");
                scrollContainer.append(getFivePokemonsOutOfGridItems(0,1));
            } else {
                scrollContainer.html("");
            }
            whenClicking();
        }
        
        
        
        
        
        
        /* Function that checks if the new item exists already and if it does
            it gets a new one */
        checkIfItemExists(id, usedIds){
            
            for (let i=0; i < usedIds.length; i++){
                if(id == usedIds[i]){
                    id = Math.floor(Math.random() * this.lastID) + 1;
                    id =  this.checkIfItemExists(id,usedIds);
                    i = 0;
                } else if (this.isDiskPngUsed){
                    if((id >= 305 && id <= 396) || id === 660 || id === 661 || (id >= 745 && id <= 749)){
                        id = Math.floor(Math.random() * this.lastID) + 1;
                        id =  this.checkIfItemExists(id,usedIds);
                        i = 0;
                    }
                } else if (this.isHmUsed){
                    if(id >= 397 && id <= 404){
                        id = Math.floor(Math.random() * this.lastID) + 1;
                        id = this.checkIfItemExists(id,usedIds);
                        i = 0;
                    }
                } else if (this.isDataCardUsed){
                    if(id >= 486 && id <= 512){
                        id = Math.floor(Math.random() * this.lastID) + 1;
                        id = this.checkIfItemExists(id,usedIds); 
                        i = 0;
                    }
                } else if (this.isGramUsed){
                    if( id === 664 || id === 665 || id === 666){
                        id = Math.floor(Math.random() * this.lastID) + 1;
                        id =  this.checkIfItemExists(id,usedIds);
                        i = 0;
                    }
                } else if (id === 680 || id === 667 || id === 672 ){
                    id = Math.floor(Math.random() * this.lastID) + 1;
                    // console.log(id) + "Managed to get in";
                    id = this.checkIfItemExists(id,usedIds);
                    i = 0;
                }
            }
            return id;
        }

        checkIfPokemonExists(id, usedIds){
    
            for (let i=0; i < usedIds.length; i++){
                if(id == usedIds[i]){
                    id = Math.floor(Math.random() * this.lastID) + 1;
                    id =  this.checkIfPokemonExists(id,usedIds);
                    i = 0;
                }
            }
            return id;
        }
        
    get index(){
        return this.rightIndexPosition;
    }
        
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



/* Function that returns five pokeons with start index */
/* Can add buttons that scroll through like 5 pokemons but will need to do some changes in the function*/
function getFivePokemonsOutOfGridItems(startIndex, amountOfGridsNeeded){
    let pokemons = [];

    for (let i = 0; i < amountOfGridsNeeded; i++,startIndex++){
        if(startIndex === gridItems.length){
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



/* On click function for the button on the right hand side */
function whenClicking(){
    console.log(gridItems.length);
    buttonOnRight.click(function(){
        console.log(gridItems.length);
        let toRemove = gridItems[increaseLeftIndex()]
        toRemove.remove();
        let toAdd = gridItems[increaseRightIndex()]
        scrollContainer.append(toAdd); 
        if(amountOfClicks === usedItems.length){
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
        scrollContainer.prepend(toAdd);
        if(amountOfClicks === usedItems.length){
            amountOfClicks = 0;
            makeButtonsWork();
        }
        amountOfClicks++;
        
    });

    function makeButtonsWork(){
    for(let i = 0; i < usedItems.length; i++){
        usedItems[i].then(data => {      
                gridItems[i].click(e => {
                    // window.location.assign(`/prototype/item.html?name=${"Pikachu"}`);
                    window.location.assign(`/prototype/item.html?name=${data.name}`);
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