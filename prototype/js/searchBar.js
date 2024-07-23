const NUM_SEARCH_RESULTS_PER_PAGE = 6;

class SearchResult {
    constructor(type, url) {
        return (async () => {
            let dataFetch = await fetchJsonFromUrl(url)
                .then(data => {
                    return data;
                });

            if (dataFetch.sprites.default) {
                this.type = "item";
            } else {
                this.type = "pokemon";
            }

            try {
                switch(this.type) {
                    case "item":
                        this.name = dataFetch.name;
                        this.nameAddon = " (Item)";
                        this.imageUrl = dataFetch.sprites.default;
                        break;
                    case "pokemon":
                        this.name = dataFetch.name;
                        this.nameAddon = " (Pokemon)";
                        this.imageUrl = dataFetch.sprites.front_default;
                        break;
                }
            } catch(error) {
                console.error(error);
            }

            return this;
        })();
    }

    // Create the search results HTML elements and
    // add them to the search results container.
    addToContainer(containerId) {
        const container = $(containerId);

        const searchResultItem = $("<div></div>");
        searchResultItem.addClass("searchResultItem");

        const searchResultTitle = $("<h2></h2>");
        searchResultTitle.addClass("searchResultTitle");
        searchResultTitle.text(removeHyphens(this.name) + this.nameAddon);

        const searchResultImage = $("<img />");
        searchResultImage.addClass("searchResultImage");
        searchResultImage.attr("src", this.imageUrl);

        searchResultItem.append(searchResultTitle);
        searchResultItem.append(searchResultImage);

        container.append(searchResultItem);

        switch(this.type) {
            case "item":
                searchResultItem.click(e => {
                    window.location.assign(`/prototype/item.html?name=${this.name}`);
                });
                break;
            case "pokemon":
                searchResultItem.click(e => {
                    window.location.assign(`/prototype/pokemon.html?name=${this.name}`);
                });
                break;
            case "unknown":
                console.error(`The type ${this.type} is not a supported search result type.`)
                break;
        }
    }
}

/* On Load of a Page */
$(() => {
    const navSearchFormInput = $("#searchInput");
    const searchButton = $("#searchButton");
    const urlQueries = new URLSearchParams(window.location.search);

    if (urlQueries.get("searchTerm")) {
        $("#searchResultsTitle").text("Search Results - " + removeHyphens(urlQueries.get("searchTerm")));
        getSearchResults(urlQueries);
    }

    navSearchFormInput.on('keypress', (e) => {
        if(e.which == 13) {
            const searchText = navSearchFormInput.val().toLowerCase();
            window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=1`);
        }
    });

    searchButton.click(e => {
        const searchText = navSearchFormInput.val().toLowerCase();
        window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=1`);
    });
});

/* Search Result Functions */
async function getSearchResults(urlQueries) {
    const pageNumber = urlQueries.get("page");
    let limit = LAST_POKEMON_ID;
    let offset = 0;
    let isPokemonLimitReached = false;
    let isItemLimitReached = false;
    const searchTerm = urlQueries.get("searchTerm").toLowerCase();

    /* Find the search results */
    let allSearchResults = [];

    let pokemonList = await PokeAPI.getPokemonList(limit, offset)
        .then(listData => {
            let searchResults = [];
            const results = listData.results.sort();

            results.forEach(pokemon => {
                // If the name is similar to the search term, add to search results.
                if (pokemon.name.includes(searchTerm)) {
                    searchResults.push(pokemon);
                }
            });

            return searchResults;
        });

    pokemonList.forEach(pokemon => {
        allSearchResults.push(pokemon);
    })

    let itemList = await PokeAPI.getItemList(limit, offset)
        .then(listData => {
            let searchResults = [];
            const results = listData.results.sort();

            results.forEach(item => {
                // If the name is similar to the search term, add to search results.
                if (item.name.includes(searchTerm)) {
                    searchResults.push(item);
                }
            });

            return searchResults;
        });

    itemList.forEach(item => {
        allSearchResults.push(item);
    });

    /* Filter the seatch results */
    let filteredSearchResults = [];
    if (pageNumber == 1) {
        filteredSearchResults = allSearchResults.slice(0, NUM_SEARCH_RESULTS_PER_PAGE);
    } else {
        filteredSearchResults = allSearchResults.slice((pageNumber-1) * NUM_SEARCH_RESULTS_PER_PAGE, (pageNumber-1) * NUM_SEARCH_RESULTS_PER_PAGE + NUM_SEARCH_RESULTS_PER_PAGE);
    }

    if (filteredSearchResults.length === 0) {
        const searchResultsContainer = $("#searchResultsContainer");
        const mainContentContainer = $("#mainContent");
        const searchResultsEmptyTitle = $("<h2></h2>").text("End of Search Results");
        searchResultsEmptyTitle.addClass("searchResultsTitle");
        mainContentContainer.append(searchResultsEmptyTitle);
        setPaginationButtons(pageNumber, Number(pageNumber));
    } else {
        let maxPages = Math.ceil(allSearchResults.length / NUM_SEARCH_RESULTS_PER_PAGE);

        setPaginationButtons(pageNumber, maxPages);
        $("#searchResultsTitle").text(searchTerm + " - Page " + pageNumber + " of " + maxPages);

        filteredSearchResults.forEach(searchResultData => {
            const searchResult = new SearchResult("unknown", searchResultData.url)
                .then((result) => result.addToContainer("#searchResultsContainer"));
        });
    }
}

/* On Click : Pagination */
$("#nextBtn").click((e) => {
    const urlQueries = new URLSearchParams(window.location.search);
    let pageNumber = Number(urlQueries.get("page"));
    pageNumber += 1;
    const searchText = urlQueries.get("searchTerm");
    window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=${pageNumber}`);
});

$("#previousBtn").click((e) => {
    const urlQueries = new URLSearchParams(window.location.search);
    let pageNumber = Number(urlQueries.get("page"));

    if (pageNumber >= 2) {
        pageNumber -= 1;
    }
    const searchText = urlQueries.get("searchTerm");
    window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=${pageNumber}`);
});

$("#firstNumBtn").click((e) => {
    const urlQueries = new URLSearchParams(window.location.search);
    let pageNumber = Number(urlQueries.get("page"));
    pageNumber -= 1;
    const searchText = urlQueries.get("searchTerm");
    window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=${pageNumber}`);
});

$("#secondNumBtn").click((e) => {
    const urlQueries = new URLSearchParams(window.location.search);
    let pageNumber = Number(urlQueries.get("page"));
    const searchText = urlQueries.get("searchTerm");
    window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=${pageNumber}`);
});

$("#thirdNumBtn").click((e) => {
    const urlQueries = new URLSearchParams(window.location.search);
    let pageNumber = Number(urlQueries.get("page"));
    pageNumber += 1;
    const searchText = urlQueries.get("searchTerm");
    window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=${pageNumber}`);
});

function setPaginationButtons(pageNumber, maxPageNumber) {
    console.log(pageNumber);

    if (Number(pageNumber) === 1) {
        $("#firstNumBtn").css("display", "none");
        $("#previousBtn").css("display", "none");
    } else {
        $("#firstNumBtn").text(Number(pageNumber)-1);
        $("#firstNumBtn").css("display", "inline");
        $("#previousBtn").css("display", "inline");
    }

    $("#secondNumBtn").text(Number(pageNumber));

    if (Number(pageNumber)+1 > Number(maxPageNumber)) {
        $("#thirdNumBtn").css("display", "none");
        $("#nextBtn").css("display", "none");
    } else {
        $("#thirdNumBtn").css("display", "inline");
        $("#nextBtn").css("display", "inline");
        $("#thirdNumBtn").text(Number(pageNumber)+1);
    }
}