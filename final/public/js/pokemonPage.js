let currentPage = 1;
let randomFlavorItem = 0;
let flavorTextIndex = 0;
const flavorTextData = [];

/* On load of Pokemon Page */
$(() => {
    const urlQueries = new URLSearchParams(window.location.search);
    const pokemonName = urlQueries.get("name").toLowerCase();

    const pokemonTypesTitleContainer = $("#pokemonTitleAndTypesContainer");

    if (pokemonName) {
        const pokemonFetch = PokeAPI.getPokemonByName(pokemonName)
        .then(pokemonData => {
            if (pokemonData) {
                // Set the title of the Pokemon page
                const pokemonNameTitle = $("#pokemonNameTitle");
                pokemonNameTitle.text(removeHyphens(pokemonName));

                // Set the Pokemon's image
                const pokemonMainImage = $("#pokemonMainImage");
                pokemonMainImage.attr("src", pokemonData.sprites.front_default);

                /* Show all the Pokemon's types as buttons */
                const pokemonTypeBtns = $(".pokemonTypeBtn");

                for (let i=0; i < pokemonData.types.length; i++) {
                    const pokemonTypeBtn = $("<button disabled></button>");

                    pokemonTypeBtn.addClass("pokemonTypeBtn");
                    pokemonTypeBtn.text(pokemonData.types[i].type.name);
                    pokemonTypesTitleContainer.append(pokemonTypeBtn);
                }

                
                const speciesFetch = fetchJsonFromUrl(pokemonData.species.url)
                .then(speciesData => {
                    if (speciesData) {
                        /* Show the description of the pokemon */
                        const speciesParagraph = $("#pokemonDescription");

                        $("#pokemonRandomBtn").click(e => {
                            setFlavorText();
                        });

                        $("#pokemonAddToListBtn").click(e => {
                            const slotNum = document.getElementById("selectRosterSlot").selectedIndex + 1;

                            $.post('/pokemon', {pokemonName: urlQueries.get("name"), slotNum: slotNum});
                        });

                        speciesData.flavor_text_entries.forEach(flavor_item => {
                            if (flavor_item.language.name === "en") {
                                flavorTextData.push(flavor_item);
                            }
                        });

                        setFlavorText();

                        /* Evolution section */
                        const evolutionFecth = fetchJsonFromUrl(speciesData.evolution_chain.url)
                        .then(evolutionData => {
                            const evolutionContent = $("#evolutionContent");
                            let numOfEvolutionForms = 0;

                            if (evolutionData.chain.species.name && evolutionData.chain.evolves_to[0]) {
                                numOfEvolutionForms += 2;

                                if (evolutionData.chain.evolves_to[0].evolves_to[0]) {
                                    numOfEvolutionForms++;
                                }

                            } 
                            
                            

                            for (let i=0; i < numOfEvolutionForms; i++) {
                                const container = $("<div></div>");
                                container.addClass("evolutionItem");

                                const containerName = $("<h3></h3>");
                                containerName.addClass("pokemonEvolutionName");
                                container.append(containerName);

                                const containerLink = $("<a></a>");
                                containerLink.addClass("pokemonEvolutionLink");
                                
                                const containerLinkImg = $("<img>");
                                containerLinkImg.attr("width", "200");
                                containerLinkImg.attr("height", "200");
                                containerLinkImg.addClass("pokemonEvolutionLinkImg");
                                containerLink.append(containerLinkImg);
                                container.append(containerLink);

                                evolutionContent.append(container);
                            };                            

                            for (let i=0; i < numOfEvolutionForms; i++) {
                                let speciesName = "";

                                switch(i) {
                                    case 0:
                                        speciesName = evolutionData.chain.species.name;
                                        break;
                                    case 1:
                                        speciesName = evolutionData.chain.evolves_to[0].species.name;
                                        break;
                                    case 2:
                                        speciesName = evolutionData.chain.evolves_to[0].evolves_to[0].species.name;
                                        break;
                                }

                                $($(".pokemonEvolutionName")[i]).text(removeHyphens(speciesName));

                                const evolutionPokemonFetch = PokeAPI.getPokemonByName(speciesName)
                                .then(evolutionPokemonData => {
                                    $($(".pokemonEvolutionLink")[i]).attr("href", `pokemon?name=${speciesName}`);
                                    $($(".pokemonEvolutionLinkImg")[i]).attr("src", evolutionPokemonData.sprites.front_default);
                                });
                            }

                            if (numOfEvolutionForms === 0) {
                                $("#pokemonEvolutionTitle").text("");
                            }
                        });
                    }
                });

                /* Set Base Stats */
                $("#hpBaseStat").text(pokemonData.stats[0].base_stat + " HP");
                $("#attackBaseStat").text(pokemonData.stats[1].base_stat + " Attack");
                $("#defenceBaseStat").text(pokemonData.stats[2].base_stat + " Defence");
                $("#saBaseStat").text(pokemonData.stats[3].base_stat + " Special Attack");
                $("#sdBaseStat").text(pokemonData.stats[4].base_stat + " Special Defence");
                $("#speedBaseStat").text(pokemonData.stats[5].base_stat + " Speed");

                /* Tab Layout */
                setTabButtons("moves"); // Set the initial tab on a page load.

                // Add click event handlers for switching between tabs
                $("#tabLayoutMovesBtn").click(e => {
                    setTabButtons("moves");
                });

                $("#tabLayoutEncountersBtn").click(e => {
                    setTabButtons("encounters");
                });

                $("#tabLayoutGamesBtn").click(e => {
                    setTabButtons("games");
                });
            }
        });
    }
});

/*
 * Creates and renders the tab content on the browser window,
 * based on the current tab.
 */
function setTabContent() {
    const tabLayoutContent = $("#tabLayoutContent");
    const tabLayoutTabBtnsBtnList = $(".tabLayoutTabBtnsBtn");

    const urlQueries = new URLSearchParams(window.location.search);
    const pokemonName = urlQueries.get("name").toLowerCase();

    const pokemonFetch = PokeAPI.getPokemonByName(pokemonName)
    .then(pokemonData => {
        for (let i=0; i < tabLayoutTabBtnsBtnList.length; i++) {
            if ($(tabLayoutTabBtnsBtnList[i]).hasClass("tabLayoutTabBtnsBtnCurrent")) {
                let maxPages = 1;
                switch(i) {
                    case 0: // Moves Tab
                        tabLayoutContent.html("");
                        maxPages = Math.ceil(pokemonData.moves.length / 4);
                        
                        let currentMoveLimit = (currentPage-1)*4+4;

                        if (pokemonData.moves.length < currentMoveLimit) {
                            currentMoveLimit = pokemonData.moves.length;
                        }

                        for (let i=(currentPage-1)*4; i < currentMoveLimit; i++) {
                            const moveItem = $("<p></p>");
                            moveItem.text(removeHyphens(pokemonData.moves[i].move.name));
                            moveItem.addClass("moveItem");
                            tabLayoutContent.append(moveItem);
                        }

                        createPaginationButtons(maxPages);
                        break;
                    case 1: // Encounters Tab
                        tabLayoutContent.html("<p>Encounters</p>");

                        const encountersFetch = PokeAPI.getEncountersByPokemonName(pokemonData.name)
                        .then(encountersData => {
                            tabLayoutContent.html("");
                            maxPages = Math.ceil(encountersData.length / 4);

                            let currentEncounterLimit  = (currentPage-1)*4+4;

                            if (encountersData.length < currentEncounterLimit) {
                                currentEncounterLimit = encountersData.length;
                            }

                            for (let i=(currentPage-1)*4; i < currentEncounterLimit; i++) {
                                const encounterItem = $("<p></p>");
                                encounterItem.text(removeHyphens(encountersData[i].location_area.name));
                                encounterItem.addClass("moveItem");
                                tabLayoutContent.append(encounterItem);
                            }

                            createPaginationButtons(maxPages);
                        })
                        
                        break;
                    case 2: // Games Tab
                        tabLayoutContent.html("");
                        maxPages = Math.ceil(pokemonData.game_indices.length / 4);

                        let currentGameLimit  = (currentPage-1)*4+4;

                        if (pokemonData.game_indices.length < currentGameLimit) {
                            currentGameLimit = pokemonData.game_indices.length;
                        }

                        for (let i=(currentPage-1)*4; i < currentGameLimit; i++) {
                            const gameItem = $("<p></p>");
                            gameItem.text(removeHyphens(pokemonData.game_indices[i].version.name));
                            gameItem.addClass("moveItem");
                            tabLayoutContent.append(gameItem);
                        }

                        createPaginationButtons(maxPages);
                        
                        break;
                }
            }
        }
    });
}

/*
 * Updates the Tab Buttons to highlight the newly selected tab
 * and to add a class to the selected tab and to remove the class
 * from the previously selected tab.
 */
function setTabButtons(tabName) {
    const tabLayoutTabBtnsBtnList = $(".tabLayoutTabBtnsBtn");

    switch(tabName) {
        case "moves":
            $(tabLayoutTabBtnsBtnList[0]).addClass("tabLayoutTabBtnsBtnCurrent");
            $(tabLayoutTabBtnsBtnList[1]).attr("class", "tabLayoutTabBtnsBtn");
            $(tabLayoutTabBtnsBtnList[2]).attr("class", "tabLayoutTabBtnsBtn");
            break;
        case "encounters":
            $(tabLayoutTabBtnsBtnList[1]).addClass("tabLayoutTabBtnsBtnCurrent");
            $(tabLayoutTabBtnsBtnList[0]).attr("class", "tabLayoutTabBtnsBtn");
            $(tabLayoutTabBtnsBtnList[2]).attr("class", "tabLayoutTabBtnsBtn");
            currentPage = 1;
            break;
        case "games":
            $(tabLayoutTabBtnsBtnList[2]).addClass("tabLayoutTabBtnsBtnCurrent");
            $(tabLayoutTabBtnsBtnList[0]).attr("class", "tabLayoutTabBtnsBtn");
            $(tabLayoutTabBtnsBtnList[1]).attr("class", "tabLayoutTabBtnsBtn");
            currentPage = 1;
            break;
    }
    
    setTabContent();
}

/*
 * Creates and renders the pagination buttons
 * and adds event handlers to handle
 * navigation between pages.
 */
function createPaginationButtons(maxPages) {
    const tabLayoutContent = $("#tabLayoutContent");
    const tabPaginationContainer = $("<div></div>");

    if (currentPage !== 1) {
        const prevButton = $("<button></button>");
        prevButton.text("Prev");
        prevButton.addClass("tabPaginationButton");
        prevButton.attr("id", "prevButton");

        prevButton.click(e => { 
            if (currentPage !== 1) {
                currentPage--;
                tabPaginationContainer.remove();
                createPaginationButtons(maxPages);
                setTabContent();
            }
        });

        const firstButton = $("<button></button>");
        firstButton.text(currentPage-1);
        firstButton.addClass("tabPaginationButton");
        firstButton.attr("id", "firstButton");

        firstButton.click(e => { 
            if (currentPage !== 1) {
                currentPage--;
                tabPaginationContainer.remove();
                createPaginationButtons(maxPages);
                setTabContent();
            }
        });

        tabPaginationContainer.append(prevButton);
        tabPaginationContainer.append(firstButton);
    }

    const secondButton = $("<button></button>");
    secondButton.text(currentPage);
    secondButton.addClass("tabPaginationButton");
    secondButton.addClass("currentTabPaginationButton");
    secondButton.attr("id", "secondButton");

    tabPaginationContainer.append(secondButton);

    if (currentPage < maxPages) {
        const nextButton = $("<button></button>");
        nextButton.text("Next");
        nextButton.addClass("tabPaginationButton");
        nextButton.attr("id", "nextButton");

        nextButton.click(e => { 
            currentPage++;
            tabPaginationContainer.remove();
            createPaginationButtons(maxPages); 
            setTabContent();
        });

        const thirdButton = $("<button></button>");
        thirdButton.text(currentPage+1);
        thirdButton.addClass("tabPaginationButton");
        thirdButton.attr("id", "thirdButton");

        thirdButton.click(e => { 
            currentPage++;
            tabPaginationContainer.remove();
            createPaginationButtons(maxPages);
            setTabContent();
        });

        tabPaginationContainer.append(thirdButton);
        tabPaginationContainer.append(nextButton);
    }

    tabLayoutContent.append(tabPaginationContainer);
}

function setFlavorText() {
    if (flavorTextData.length > 0) {
        while (randomFlavorItem == flavorTextIndex) {
            randomFlavorItem = Math.floor(Math.random() * flavorTextData.length);
        }

        flavorTextIndex = randomFlavorItem;
        $("#pokemonDescription").text(flavorTextData[randomFlavorItem].flavor_text);
    }
}
