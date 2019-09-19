import axios from 'axios';
import { POKE_API_URL } from '../env/env';

export class PokemonService {
    /**
     * @description Lists all pokemons with pagination
     * @param {number} offset initial position to get the results
     * @param {number} limit max size of result list
     */
    listPokemons(offset = 0, limit = 10): Promise<any> {
        return axios.get(`${POKE_API_URL}pokemon?offset=${offset}&limit=${limit}`);
    }

    /**
     * @description Returns a pokemon data
     * @param {number | string} id Pode ser o id ou o nome do pokemon 
     */
    getDetailById(id: number | string) {
        return axios.get(`${POKE_API_URL}pokemon/${id}/`);
    }
}