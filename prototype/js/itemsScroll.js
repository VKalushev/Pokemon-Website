$(() => {
let itemsScrollContainer = $("#itemsScrollBarContainer");
let itemTitle = $("#scrollItemTitle")
let usedItems = []; 
let gridItems = []
let rightIndexPosition = 4;
let leftIndexPosition = 0;
let isDiskPngUsed = new Boolean(false);
let isHmUsed = new Boolean(false);
let isDataCardUsed = new Boolean(false);
let isGramUsed = new Boolean(false);
let previousGridSize = 5;
let amountOfClicks = 0;

const buttonOnRight = $("<button><i class='fa fa-chevron-right fa-5x icon'></i></button>");
buttonOnRight.addClass("arrow");
buttonOnRight.addClass("arrow-right");

const buttonOnLeft = $("<button><i class='fa fa-chevron-left fa-5x icon'></i></button>");
buttonOnLeft.addClass("arrow");
buttonOnLeft.addClass("arrow-left");

itemsScrollContainer.append(buttonOnRight);
itemsScrollContainer.append(buttonOnLeft);

fillWithRandomItems(25);

/* ------------------------Functions Below------------------------ */

/* Function to fill get the pokemons and the data needed about them  */
function fillWithRandomItems(numOfItemsNeeded) {
    let usedIDs = [];

    for (let i=0; i < numOfItemsNeeded; i++) {
        let id = Math.floor(Math.random() * LAST_ITEM_ID)+1;

        id = checkIfItemExists(id,usedIDs);
        if((id >= 305 && id <= 396) || id === 660 || id === 661 || (id >= 745 && id <= 749)){
            isDiskPngUsed = true; 
        } else if(id >= 397 && id <= 404){
            isHmUsed = true;
        } else if(id >= 486 && id <= 512){
            isDataCardUsed = true;
        } else if(id === 664 || id === 665 || id === 666){
            isGramUsed = true;
        } else if (id === 680 || id === 667 || id === 672 ){
            id = Math.floor(Math.random() * LAST_ITEM_ID)+1;
            id = checkIfItemExists(id,usedIDs);
        }

        usedIDs[i] = id;
        let item = fetchItemById(usedIDs[i]);
        usedItems[i] = item;

        gridItems.push($("<button><div></div></button>"));
        // gridItems.push($("<div></div>"));
        
        gridItems[i].addClass("grid-item");

        usedItems[i].then(data => {
            if (data) {        
                // const title = $("<h3></h3>").text(i) /* Testing variable */     
                const image = $("<img />").attr('src', data.sprites.default).css("z-index","5");
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
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,6));
    } else if (currentWidth >=1150){
        rightIndexPosition = 4;
        previousGridSize = 5;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,5));
    } else if (currentWidth >=1020.5){
        rightIndexPosition = 3;
        previousGridSize = 4;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,4));
    } else if (currentWidth >=975){
        rightIndexPosition = 2;
        previousGridSize = 3;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,5));
    }  else if (currentWidth >=800){
        rightIndexPosition = 2;
        previousGridSize = 3;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,4));
    } else if (currentWidth >=600){
        rightIndexPosition = 1;
        previousGridSize = 2;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,3));
    } else if(currentWidth >=440) {
        rightIndexPosition = 0;
        previousGridSize = 1;
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,2));
    } else if(currentWidth >=220) {
        rightIndexPosition = 0;
        previousGridSize = 1;
        itemsScrollContainer.html("");
        $("#scrollItemTitle").text("scrollItemTitle");
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(0,1));
    } else {
        itemsScrollContainer.html("");
    }
    whenClicking();
}

/* On click function for the button on the right hand side */
function whenClicking(){
    buttonOnRight.click(function(){
        let toRemove = gridItems[increaseLeftIndex()]
        toRemove.remove();
        let toAdd = gridItems[increaseRightIndex()]
        itemsScrollContainer.append(toAdd); 
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
        itemsScrollContainer.prepend(toAdd);
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

// function getFivePokemonsOutOfGridItems(startIndex){
//     let pokemons = [];
//     for (let i = startIndex; i < startIndex + 5; i++){
//         pokemons[i] = gridItems[i];      
//     }
//     return pokemons;
// }


/* Function that checks if the new item exists already and if it does
    it gets a new one */
function checkIfItemExists(id, usedIds){
    
    for (let i=0; i < usedIds.length; i++){
        if(id == usedIds[i]){
            id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
            id =  checkIfItemExists(id,usedIds);
            i = 0;
        } else if (isDiskPngUsed){
            if((id >= 305 && id <= 396) || id === 660 || id === 661 || (id >= 745 && id <= 749)){
                id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
                id =  checkIfItemExists(id,usedIds);
                i = 0;
            }
        } else if (isHmUsed){
            if(id >= 397 && id <= 404){
                id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
                id = checkIfItemExists(id,usedIds);
                i = 0;
            }
        } else if (isDataCardUsed){
            if(id >= 486 && id <= 512){
                id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
                id = checkIfItemExists(id,usedIds); 
                i = 0;
            }
        } else if (isGramUsed){
            if( id === 664 || id === 665 || id === 666){
                id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
                id =  checkIfItemExists(id,usedIds);
                i = 0;
            }
        } else if (id === 680 || id === 667 || id === 672 ){
            id = Math.floor(Math.random() * LAST_ITEM_ID) + 1;
            // console.log(id) + "Managed to get in";
            id = checkIfItemExists(id,usedIds);
            i = 0;
        }
    }
    return id;
}



$(window).resize(e => {
    itemsScrollContainer.html("");
    itemsScrollContainer.append(itemTitle);
    itemsScrollContainer.prepend(buttonOnRight);
    itemsScrollContainer.prepend(buttonOnLeft);
    const currentWidth = ($(window).width() * MAIN_CONTAINER_HEIGHT_RATIO);
    if(currentWidth >= 1400){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,6));
        // console.log(rightIndexPosition);
    } else if (currentWidth >=1150){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,5));
    } else if (currentWidth >=1020.5){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,4));
    } else if (currentWidth >=975){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,5));
    } else if (currentWidth >=800){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,4));
    } else if (currentWidth >=600){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,3));
    } else if (currentWidth >=440){
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,2));
    }   else if (currentWidth >=220){
        itemsScrollContainer.html("");
        itemsScrollContainer.append(itemTitle);
        itemsScrollContainer.append(getFivePokemonsOutOfGridItems(leftIndexPosition,1));
    } else {
        itemsScrollContainer.html("");
    }
    whenClicking();
});


});
