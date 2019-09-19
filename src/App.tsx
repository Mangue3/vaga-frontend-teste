import React, { useEffect, useState } from 'react';
import { IPokeCard } from './components/pokeCard/interfaces';
import { PokemonService } from './services/pokemon.service';
import { NeultralInput } from './components/input/input';
import { SecondSucessButton, NeutralButton } from './components/button/button';
import { Spinner } from './components/loading';
import PokemonLogo from './assets/imgs/pokemon.png';
import PokemonModal from './components/modal/pokemonModal';
import PokeCard from './components/pokeCard/pokeCard';
import { ThemeProvider } from 'styled-components';
import theme from './App.theme';
import ReactPaginate from 'react-paginate';
import { Formik } from 'formik';
import './App.scss';

interface IPagination {
  selected: number;
}

interface IFilterForm {
  name: string;
  type: string;
}

const SPA: React.FC = () => {
  // Handle list
  const [pokeList, setPokeList] = useState<IPokeCard[]>([]);
  const [errorListMessage, setErrorListMessage] = useState<string>('');
  const [loadingPokeList, setLoadingPokeList] = useState<boolean>(false);

  // Handle modal 
  const [showPokemonModal, setShowPokemonModal] = useState<boolean>(false);
  const [pokeModalInfo, setPokeModalInfo] = useState<any>();

  // Handle pagination
  const [pageCount, setPageCount] = useState<number>(0);
  const [actualOffset, setActualOffset] = useState<number>(0);

  const [disablePagination, setDisablePagination] = useState<boolean>(false);

  const [initialFormikValues] = useState<IFilterForm>({
    name: '',
    type: '',
  })

  const pokemonService = new PokemonService();

  const handlePokeModal = (show: boolean, modalInfo?: any): void => {
    setShowPokemonModal(show);
    if (show && modalInfo)
      setPokeModalInfo(modalInfo);
  }

  const handlePagination = (data: IPagination): void => {
    if (disablePagination) return;
    const { selected } = data;
    const offset = Math.ceil(selected * 10);
    setActualOffset(offset);
  }

  /**
   * @description Make a request to get the pokemon info by the name
   * @param {string} pokemonName 
   */
  const getPokemonData = async (pokemonName: string): Promise<IPokeCard> => {
    return await pokemonService.getPokemonDetail(pokemonName)
      .then(({ data }: any) => {
         return {
          name: pokemonName,
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
            name: pokemonName,
          }
        };
      })
  }

  /**
   * @description Loads the list 
   */
  const loadList = (pokemonName = '') => {
    setLoadingPokeList(true);
    if (pokemonName) {
      setDisablePagination(true);
      getPokemonData(pokemonName)
        .then(pokemonInfo => {
          setPokeList([pokemonInfo]);
          setLoadingPokeList(false);
        });
    } else {
      setDisablePagination(false);
      pokemonService.listPokemons(actualOffset)
        .then(async ({ data }) => {
          setErrorListMessage('');
          setPageCount(Math.ceil(data.count / 10));
  
          let newPokePage: IPokeCard[] = [];
          await data.results.forEach(async ({ name }: any) => {
            await getPokemonData(name)
              .then(pokemonInfo => {
                newPokePage.push(pokemonInfo);
              });
          });
  
          setTimeout(() => {
            setPokeList(newPokePage);
            setLoadingPokeList(false);
          }, 1000);
        })
        .catch(_ => {
          setErrorListMessage('A server error ocurred');
          setPokeList([]);
        });
    }
  }

  const handleFilter = (form: IFilterForm) => {
    loadList(form.name);
  }
  
  useEffect(() => loadList(), [, actualOffset]);

  return (
    <ThemeProvider theme={theme}>
      <div className="w-100">
        <div className="w-50 mx-auto my-0 d-flex justify-content-center align-items-center flex-column">
          <img src={PokemonLogo} alt="Pokemon logo" width="200" />
          <Formik initialValues={initialFormikValues} onSubmit={handleFilter}>
            {({ handleChange, handleSubmit, values, errors }) => (
              <form className="row w-100" onSubmit={handleSubmit}>
                <fieldset className="col-4 d-flex align-items-start justify-content-center flex-row">
                  <label htmlFor="search-filter">Name</label>
                  <NeultralInput 
                    id="search-filter" 
                    type="text"
                    name="name"
                    onChange={handleChange} 
                    value={values.name} />
                </fieldset>
                <fieldset className="col-4 d-flex justify-content-center align-items-center">
                  <label htmlFor="select-filter">Type</label>
                  <select 
                    id="select-filter"
                    name="type" 
                    style={{ height: 30 }} 
                    className="custom-select" 
                    multiple
                    onChange={handleChange} 
                    value={values.type}
                  >
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
                <div className="col-4 d-flex justify-content-center align-items-end">
                  {/* <NeutralButton type="button">Clear filter</NeutralButton> */}
                  <SecondSucessButton type="submit">Filter</SecondSucessButton>
                </div>
              </form>
              )
            }
          </Formik>
          <div className="w-100">
            {loadingPokeList && <Spinner style={{ position: 'fixed', top: '48%', left: '48%' }} />}
            {errorListMessage && <p>errorListMessage</p>}
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
