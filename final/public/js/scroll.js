


class Scroll {
        isDiskPngUsed = false;
        isHmUsed = false;
        isDataCardUsed = false;
        isGramUsed = false;
        scrollContainer;
        scrollTitle;
        usedItems = []; 
        gridItems = []
        rightIndexPosition = 4;
        leftIndexPosition = 0;
        previousGridSize = 5;
        amountOfClicks = 0;     
        lastID;
        buttonOnRight = $("<button><i class='fa fa-chevron-right fa-5x icon'></i></button>");
        buttonOnLeft = $("<button><i class='fa fa-chevron-left fa-5x icon'></i></button>");
        isPokemon;
        


        constructor(type,container,title){
            if(type === "pokemon"){
                this.isPokemon = true;
                this.lastID = LAST_POKEMON_ID;
            } else if(type === "item"){
                this.isPokemon = false;
                this.lastID = LAST_ITEM_ID;
            }

            this.scrollContainer = container;
            this.scrollTitle = title;
            this.buttonOnRight.addClass("arrow");
            this.buttonOnRight.addClass("arrow-right");
            
            
            this.buttonOnLeft.addClass("arrow");
            this.buttonOnLeft.addClass("arrow-left");
            
            this.scrollContainer.append(this.buttonOnRight);
            this.scrollContainer.append(this.buttonOnLeft);
            
        }
        
        /* ------------------------Functions Below------------------------ */
        
        /* Function to fill get the pokemons and the data needed about them  */
        render(scrollSize) {
            let usedIDs = [];
        
            for (let i=0; i < scrollSize; i++) {
                let id = Math.floor(Math.random() * this.lastID)+1;
                let item;
                
                if(this.isPokemon){
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
                        id = Math.floor(Math.random() * this.lastID)+1;
                        id = this.checkIfItemExists(id,usedIDs);
                    }

                    usedIDs[i] = id;
                    item = fetchItemById(usedIDs[i]);
                }

                this.usedItems[i] = item;
        
                this.gridItems.push($("<button><div></div></button>"));
                // this.gridItems.push($("<div></div>"));
                
                this.gridItems[i].addClass("grid-item");
        
                this.usedItems[i].then(data => {
                    if (data) {        
                        // const title = $("<h3></h3>").text(i) /* Testing variable */     
                        let image;
                        if(this.isPokemon){
                            image = $("<img />").attr('src', data.sprites.front_default).css("z-index","5");
                        } else {
                            image = $("<img />").attr('src', data.sprites.default).css("z-index","5");
                        }
                        image.addClass("grid-item-image");
                        
                        // this.gridItems[i].append(image,title);
                        this.gridItems[i].append(image);
                        if(i === 0){
                            const height = this.gridItems[0].css("height");
                            $(".arrow").css("height",height + "px");
                        }
                        if(this.isPokemon){
                            this.gridItems[i].click(e => {
                                // window.location.assign(`/prototype/item.html?name=${"Pikachu"}`);
                                // window.location.assign(`/prototype/item.html?name=${data.name}`);
                                window.location.assign(`/pokemon?name=${data.name}`);
                            });
                        } else {
                            this.gridItems[i].click(e => {
                                window.location.assign(`/item?name=${data.name}`);
                            });
                        }
                        
                        
                    } else {
                        numOfItemsNeeded++;
                    }
                    
                });
                
                
                
            }
        
            
            const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
            if(currentWidth >= 1400){
                this.rightIndexPosition = 5;
                this.previousGridSize = 6;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,6));
            } else if (currentWidth >=1150){
                this.rightIndexPosition = 4;
                this.previousGridSize = 5;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,5));
            } else if (currentWidth >=1020.5){
                this.rightIndexPosition = 3;
                this.previousGridSize = 4;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,4));
            } else if (currentWidth >=975){
                this.rightIndexPosition = 2;
                this.previousGridSize = 3;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,5));
            }  else if (currentWidth >=800){
                this.rightIndexPosition = 2;
                this.previousGridSize = 3;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,4));
            } else if (currentWidth >=600){
                this.rightIndexPosition = 1;
                this.previousGridSize = 2;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,3));
            } else if(currentWidth >=440) {
                this.rightIndexPosition = 0;
                this.previousGridSize = 1;
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,2));
            } else if(currentWidth >=220) {
                this.rightIndexPosition = 0;
                this.previousGridSize = 1;
                this.scrollContainer.html("");
                $("#scrollItemTitle").text("scrollItemTitle");
                this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(0,1));
            } else {
                this.scrollContainer.html("");
            }
            this.whenClicking();
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



    resize(){
        this.scrollContainer.html("");
        this.scrollContainer.append(this.scrollTitle);
        this.scrollContainer.prepend(this.buttonOnRight);
        this.scrollContainer.prepend(this.buttonOnLeft);
        const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
        if(currentWidth >= 1400){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,6));
        } else if (currentWidth >=1150){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,5));
        } else if (currentWidth >=1020.5){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,4));
        } else if (currentWidth >=975){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,5));
        } else if (currentWidth >=800){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,4));
        } else if (currentWidth >=600){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,3));
        } else if (currentWidth >=440){
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,2));
        }   else if (currentWidth >=220){
            this.scrollContainer.html("");
            this.scrollContainer.append(this.scrollTitle);
            this.scrollContainer.append(this.getFivePokemonsOutOfGridItems(this.leftIndexPosition,1));
        } else {
            this.scrollContainer.html("");
        }
        this.whenClicking();
    }

    /* Function that returns five pokeons with start index */
    /* Can add buttons that scroll through like 5 pokemons but will need to do some changes in the function*/
    getFivePokemonsOutOfGridItems(startIndex, amountOfGridsNeeded){
        let pokemons = [];

        for (let i = 0; i < amountOfGridsNeeded; i++,startIndex++){
            if(startIndex === this.gridItems.length){
                startIndex = 0;
            }
            pokemons[i] = this.gridItems[startIndex];
        }

        if(this.previousGridSize > amountOfGridsNeeded){
            this.rightIndexPosition--;
            if(this.rightIndexPosition === -1) {
                this.rightIndexPosition = this.gridItems.length-1;
            }
        } else if (this.previousGridSize < amountOfGridsNeeded){
            this.rightIndexPosition++;
            if(this.rightIndexPosition === this.gridItems.length){
                this.rightIndexPosition = 0;
            }
        }

        this.previousGridSize = amountOfGridsNeeded;
        return pokemons;


    }

    
    
    
    /* On click function for the button on the right hand side */
    whenClicking(){
        let gridItems = this.gridItems;
        let usedItems = this.usedItems;
        let amountOfClicks = this.amountOfClicks;
        let scrollContainer = this.scrollContainer;
        let rightIndexPosition = this.rightIndexPosition;
        let leftIndexPosition = this.leftIndexPosition;

        this.buttonOnRight.click(function(){
            let toRemove = gridItems[increaseLeftIndex()]
            toRemove.remove();
            let toAdd = gridItems[increaseRightIndex()]
            scrollContainer.append(toAdd); 
            if(amountOfClicks === usedItems.length){
                amountOfClicks = 0;
                makeButtonsWork ();
            }
            amountOfClicks++;
        });
        
        
        /* On click function for the button on the left hand side */
        this.buttonOnLeft.click(function(){
            let toRemove = gridItems[decreaseRightIndex()]
            toRemove.remove();
            let toAdd = gridItems[decreaseLeftIndex()]
            scrollContainer.prepend(toAdd);
            if(amountOfClicks === usedItems.length){
                amountOfClicks = 0;
                makeButtonsWork ();
            }
            amountOfClicks++;
            
        });
    
    
        
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
                this.leftIndexPosition = 0
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

        function makeButtonsWork(){
            for(let i = 0; i < usedItems.length; i++){
                usedItems[i].then(data => {    
                    
                    if(isPokemon){
                        gridItems[i].click(e => {
                            // window.location.assign(`/prototype/item.html?name=${"Pikachu"}`);
                            // window.location.assign(`/prototype/item.html?name=${data.name}`);
                            window.location.assign(`/pokemon?name=${data.name}`);
                        });
                    } else {
                        gridItems[i].click(e => {
                            window.location.assign(`/item?name=${data.name}`);
                        });
                    }
                    });
                }
            }
        
            this.gridItems = gridItems;
            this.usedItems = usedItems;
            this.amountOfClicks = amountOfClicks;
            this.scrollContainer = scrollContainer;
            this.rightIndexPosition = rightIndexPosition;
            this.leftIndexPosition = leftIndexPosition;
    }

    
        
}

let pokemonBarContainer = $("#scrollBarContainer")
let pokemonTitle = $("#scrollPokemonTitle")
let pokemonType = "pokemon";

let pokemonScroll = new Scroll(pokemonType,pokemonBarContainer,pokemonTitle);
pokemonScroll.render(25);

let itemScrollBarContainer = $("#itemsScrollBarContainer")
let itemTitle = $("#scrollItemTitle")
let itemType = "item";

let itemScroll = new Scroll(itemType,itemScrollBarContainer,itemTitle);
itemScroll.render(25);

$(window).resize(e => {
    pokemonScroll.resize();
    itemScroll.resize();
});