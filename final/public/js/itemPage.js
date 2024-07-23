let randomFlavorItem = 0;
let flavorTextIndex = 0;
const flavorTextData = [];
let description = $("#itemDescription");
let typesContainer = $("#itemTitleAndTypesContainer");

/* On load of item Page */
$(() => {
    const urlQueries = new URLSearchParams(window.location.search);
    const itemName = urlQueries.get("name").toLowerCase();
    
    if (itemName) {
        const itemFetch = fetchItemByName(itemName)
        .then(itemData => {
            if (itemData) {
                // Set the title of the item page
                const itemNameTitle = $("#itemNameTitle");
                itemNameTitle.text(removeHyphens(itemName));

                // Set the item's image
                const itemMainImage = $("#itemMainImage");
                itemMainImage.attr("src", itemData.sprites.default);
                
                const itemImage = $("#itemImage");
                const itemCost = $("<h2 id = 'itemCost'></h2>");
                itemCost.text("円" + itemData.cost);
                itemImage.append(itemCost);

                const itemTypeBtn = $("<button disabled></button>");

                itemTypeBtn.addClass("itemTypeBtn");
                itemTypeBtn.text(removeHyphens(itemData.category.name));
                typesContainer.append(itemTypeBtn);

                    
                /* Show the description of the item */
                

                $("#itemRandomBtn").click(e => {
                    setFlavorTextItem();
                    });

                itemData.flavor_text_entries.forEach(flavor_item => {
                if (flavor_item.language.name === "en") {
                        flavorTextData.push(flavor_item);
                                
                    } 
               });

                setFlavorTextItem();            
            }
        });
    }
});


function setFlavorTextItem() {
    if (flavorTextData.length > 0) {
        while (randomFlavorItem == flavorTextIndex) {
            randomFlavorItem = Math.floor(Math.random() * flavorTextData.length);
        }

        flavorTextIndex = randomFlavorItem;
        description.text(flavorTextData[randomFlavorItem].text);
    }
}