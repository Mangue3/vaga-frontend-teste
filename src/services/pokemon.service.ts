import axios from 'axios';
import { POKE_API_URL } from '../env/env';

export class PokemonService {
    /**
     * @description Lists all pokemons with pagination
     * @param {number} offset initial position to get the results
     * @param {string} pokemonName
     * @param {number} limit max size of result list
     */
    listPokemons(offset = 0, pokemonName?: string, limit = 10): Promise<any> {
        if (pokemonName)
            return axios.get(`${POKE_API_URL}pokemon/${pokemonName}`);
        else
            return axios.get(`${POKE_API_URL}pokemon?offset=${offset}&limit=${limit}`);
    }

    /**
     * @description Returns a pokemon data
     * @param {number | string} id the pokemon's id or name 
     */
    getPokemonDetail(id: number | string) {
        return axios.get(`${POKE_API_URL}pokemon/${id}/`);
    }
}