import axios from 'axios';
import { POKE_API_URL } from '../env/env';

export class PokemonService {

    /**
     * @description Lists all pokemons with pagination
     * @param offset 
     * @param limit 
     */
    listPokemons(offset = 0, limit = 10): Promise<any> {
        return axios.get(`${POKE_API_URL}pokemon?offset=${offset}&limit=${limit}`);
    }

    /**
     * @description Returns a pokemon data
     * @param id 
     */
    getDetailById(id: number) {
        return axios.get(`${POKE_API_URL}pokemon/${id}/`);
    }
}