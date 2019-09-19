import React, { useEffect, useState } from 'react';
import { IPokeCard } from './components/pokeCard/interfaces';
import { PokemonService } from './services/pokemon.service';
import { NeultralInput } from './components/input/input';
import PokemonLogo from './assets/imgs/pokemon.png';
import PokemonModal from './components/modal/pokemonModal';
import PokeCard from './components/pokeCard/pokeCard';
import { ThemeProvider } from 'styled-components';
import theme from './App.theme';
import ReactPaginate from 'react-paginate';
import './App.scss';

interface IPagination {
  selected: number;
}

const SPA: React.FC = () => {
  // Handle list
  const [pokeList, setPokeList] = useState<IPokeCard[]>([]);
  const [errorListMessage, setErrorListMessage] = useState<string>('');

  // Handle modal 
  const [showPokemonModal, setShowPokemonModal] = useState<boolean>(false);
  const [pokeModalInfo, setPokeModalInfo] = useState<any>();

  // Handle pagination
  const [pageCount, setPageCount] = useState<number>(0);
  const [actualOffset, setActualOffset] = useState<number>(0);

  const pokemonService = new PokemonService();

  const handlePokeModal = (show: boolean, modalInfo?: any): void => {
    setShowPokemonModal(show);
    if (show && modalInfo)
      setPokeModalInfo(modalInfo);
  }

  const handlePagination = (data: IPagination) => {
    const { selected } = data;
    const offset = Math.ceil(selected * 10);
    setActualOffset(offset);
  }

  /**
   * @description Loads the list 
   */
  const loadList = () => {
    pokemonService.listPokemons(actualOffset)
      .then(async ({ data }) => {
        setPokeList([]);
        setErrorListMessage('');
        setPageCount(data.count);

        let newPokePage: IPokeCard[] = [];
        await data.results.forEach(({ name }: any) => {
          pokemonService.getDetailById(name)
            .then(({ data }: any) => {
              const pokeCardInfo = {
                name,
                id: data.id,
                description: '',
                imgUrl: data.sprites.front_default,
                handlePokeModal,
                modalInfo: {
                  baseExperience: data.base_experience,
                  stats: data.stats,
                  // types: data.types,
                  imgUrl: data.sprites.front_default,
                  weight: data.weight,
                  height: data.height,
                  name,
                }
              };
              newPokePage.push(pokeCardInfo);
            })
        });

        setTimeout(() => {
          setPokeList(newPokePage);
        }, 1000);
      })
      .catch(_ => {
        setErrorListMessage('A server error ocurred');
        setPokeList([]);
      });

  } 
  
  useEffect(() => loadList(), [, actualOffset]);

  return (
    <ThemeProvider theme={theme}>
      <div className="w-100">
        <div className="w-50 mx-auto my-0 d-flex justify-content-center align-items-center flex-column">
          <img src={PokemonLogo} alt="Pokemon logo" width="200" />
          <div className="row w-100">
            <fieldset className="col-6 d-flex align-items-start justify-content-center flex-row">
              <label htmlFor="search-filter">Digite para filtrar</label>
              <NeultralInput id="search-filter" type="text" />
            </fieldset>
            <fieldset className="col-6">
              <label htmlFor="select-filter">Filtre pelo tipo</label>
              <select id="select-filter" style={{ height: 30 }} className="custom-select" multiple>
                <option value="1">Fire</option>
                <option value="2">Earth</option>
                <option value="3">Air</option>
                <option value="4">Water</option>
                <option value="5">Grass</option>
                <option value="6">Normal</option>
                <option value="7">Ice</option>
                <option value="8">Fighting</option>
                <option value="9">Poison</option>
                <option value="10">Ground</option>
                <option value="11">Flying</option>
              </select>
            </fieldset>
          </div>
          <div className="w-100">
            {errorListMessage && errorListMessage}
            {pokeList.map(info => <PokeCard key={info.id} {...info} />)}
            <div className="d-flex justify-content-end">
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePagination}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </div>
        <PokemonModal 
          handlePokeModal={handlePokeModal} 
          showPokemonModal={showPokemonModal}
          modalInfo={pokeModalInfo}  />
      </div>
    </ThemeProvider>
  );
}

export default SPA;
