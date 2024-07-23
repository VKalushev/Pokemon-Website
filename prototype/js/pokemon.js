
const BASE_API_URL = 'https://pokeapi.co/api/v2';
const LAST_POKEMON_ID = 897; 
const LAST_ITEM_ID = 748;

async function fetchJsonFromUrl(url) {
	return await $.getJSON(url, (data) => {
		return data;
	})
	.fail(() => {
		return {};
	});
}

function fetchPokemon(query) {
	return fetchJsonFromUrl(`${BASE_API_URL}/pokemon/${query}`);
}

function fetchItem(query) {
	return fetchJsonFromUrl(`${BASE_API_URL}/item/${query}`);
}

function fetchPokemonById(id) {
	return fetchPokemon(id);
}

function fetchItemById(id) {
	return fetchItem(id);
}

function fetchPokemonByName(name) {
	name = name.toLowerCase();
	return fetchPokemon(name);
}

function fetchItemByName(name) {
	name = name.toLowerCase();
	return fetchItem(name);
}

function fetchLocationById(id){
	return fetchJsonFromUrl(`${BASE_API_URL}/location-area/${id}`);
}

function fetchLocationByName(name){
	return fetchJsonFromUrl(`${BASE_API_URL}/location-area/${name}`);
}

class PokeAPI {
	static getPokemonByName(name) {
		return fetchPokemonByName(name);
	}

	static getItemByName(name) {
		return fetchItemByName(name);
	}

	static getPokemonById(id) {
		return fetchPokemonById(id);
	}

	static getItemById(id) {
		return fetchItemById(id);
	}

	static getPokemonList(limit, offset) {
		return fetchJsonFromUrl(`${BASE_API_URL}/pokemon?limit=${limit}&offset=${offset}`);
	}

	static getItemList(limit, offset) {
		return fetchJsonFromUrl(`${BASE_API_URL}/item?limit=${limit}&offset=${offset}`);
	}

	static getEncountersByPokemonName(name) {
		return fetchJsonFromUrl(`${BASE_API_URL}/pokemon/${name}/encounters`);
	}

	static getLocationById(id){
		return fetchLocationById(id);
	}
	
	static getLocationById(id) {
		return fetchJsonFromUrl(`${BASE_API_URL}/location-area/${id}`);
	}
}

function removeHyphens(text) {
	const textSplitList = text.split('-');
	let formattedText = '';

	textSplitList.forEach(splitItem => {
		formattedText += ' ' + splitItem;
	});

	return formattedText;
}