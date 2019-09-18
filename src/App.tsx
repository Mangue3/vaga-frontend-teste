import React, { useEffect, useState } from 'react';
import { IPokeCard } from './components/pokeCard/interfaces';
import { PokemonService } from './services/pokemon.service';
import { NeultralInput } from './components/input/input';
import PokemonLogo from './assets/imgs/pokemon.png';
import PokemonModal from './components/modal/pokemonModal';
import PokeCard from './components/pokeCard/pokeCard';

const App: React.FC = () => {
  const [pokeInfos, setPokeInfos] = useState<IPokeCard[]>([]);
  const [errorListMessage, setErrorListMessage] = useState<String>('');
  const [showPokemonModal, setShowPokemonModal] = useState<boolean>(false);
  const [pokeModalInfo, setPokeModalInfo] = useState<any>();
  const pokemonService = new PokemonService();

  const handlePokeModal = (show: boolean, modalInfo?: any): void => {
    setShowPokemonModal(show);
    if (show && modalInfo)
      setPokeModalInfo(modalInfo);
  }
  
  useEffect(() => {
    pokemonService.listPokemons()
      .then(async ({ data }) => {
        setPokeInfos([]);
        setErrorListMessage('');

        let newPokePage: IPokeCard[] = [];
        await data.results.forEach(({ name }: any) => {
          pokemonService.getDetailById(name)
            .then(({ data }: any) => {
              console.log('data: ', data)
              const pokeCardInfo = {
                name,
                id: data.id,
                description: '',
                imgUrl: data.sprites.front_default,
                handlePokeModal,
                modalInfo: {
                  baseExperience: data.base_experience,
                  stats: data.stats,
                  types: data.types,
                  imgUrl: data.sprites.front_default,
                  name,
                }
              };
              newPokePage.push(pokeCardInfo);
            })
        });

        setTimeout(() => {
          setPokeInfos(newPokePage);
        }, 1000);
      })
      .catch(_ => {
        setErrorListMessage('A server error ocurred');
        setPokeInfos([]);
      });
  }, []);

  return (
    <div className="w-100">
      <div className="w-50 mx-auto my-0 d-flex justify-content-center align-items-center flex-column">
        <img src={PokemonLogo} alt="Pokemon logo" width="200" />
        <div className="row w-100">
          <fieldset className="col-6 d-flex align-items-start justify-content-center flex-row">
            <label htmlFor="search-field">Digite para filtrar</label>
            <NeultralInput id="search-field" type="text" />
          </fieldset>
          <fieldset className="col-6">
            <select style={{ height: 30 }} className="custom-select" multiple>
              <option value="1">Fire</option>
              <option value="2">Earth</option>
              <option value="3">Air</option>
              <option value="3">Water</option>
              <option value="3">Grass</option>
              <option value="3">Normal</option>
              <option value="3">Ice</option>
              <option value="3">Fighting</option>
              <option value="3">Poison</option>
              <option value="3">Ground</option>
              <option value="3">Flying</option>
            </select>
          </fieldset>
        </div>
        <div className="w-100">
          {errorListMessage && errorListMessage}
          {pokeInfos.map(info => <PokeCard key={info.id} {...info} />)}
        </div>
      </div>

      <PokemonModal 
        handlePokeModal={handlePokeModal} 
        showPokemonModal={showPokemonModal}
        modalInfo={pokeModalInfo}  />
    </div>
  );
}

export default App;
