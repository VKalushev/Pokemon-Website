class Pokemon {
    #pokemon;
    #hp;
    #attack;
    #defense;
    #speed;

    constructor(pokemonID){
        this.pokemon = fetchPokemonById(pokemonID);
        PokeAPI.getPokemonById(pokemonID)
            .then(pokemonData => {
                if(pokemonData){
                    this.hp = pokemonData.stats[0].base_stat;
                    this.attack = pokemonData.stats[1].base_stat;
                    this.defense = pokemonData.stats[2].base_stat;
                    this.speed = pokemonData.stats[3].base_stat;
                }
            });
    }

    get getHP(){
        return this.hp;
    }

    get getAttack(){
        return this.attack;
    }

    get getDefense(){
        return this.defense;S
    }

    get getSpeed(){
        return this.speed;
    }

}