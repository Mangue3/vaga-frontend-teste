import React, { useEffect, useState } from 'react';
import { IPokeCard, IPokeInfo } from './components/pokeCard/interfaces';
import { PokemonService } from './services/pokemon.service';
import { NeultralInput } from './components/input/input';
import { SecondSucessButton } from './components/button/button';
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
  const [pokeModalInfo, setPokeModalInfo] = useState<IPokeInfo>();

  // Handle pagination
  const [pageCount, setPageCount] = useState<number>(0);
  const [actualOffset, setActualOffset] = useState<number>(0);

  const [disablePagination, setDisablePagination] = useState<boolean>(false);

  const [initialFormikValues] = useState<IFilterForm>({
    name: '',
    type: '',
  })

  const pokemonService = new PokemonService();

  const handlePokeModal = (show: boolean, modalInfo?: IPokeInfo): void => {
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
          imgUrl: data.sprites.front_default,
          handlePokeModal,
          modalInfo: {
            baseExperience: data.base_experience,
            stats: data.stats,
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
   * @param {string} pokemonName loads a list of 1 result filtered by 1 pokemon name
   */
  const loadList = (pokemonName = ''): void => {
    setLoadingPokeList(true);
    if (pokemonName) {
      setDisablePagination(true);
      getPokemonData(pokemonName)
        .then(pokemonInfo => {
          setPokeList([pokemonInfo]);
          setLoadingPokeList(false);
          setPageCount(1);
        });
    } else {
      setDisablePagination(false);
      pokemonService.listPokemons(actualOffset)
        .then(async ({ data }) => {
          setErrorListMessage('');
          setPageCount(Math.ceil(data.count / 10));
  
          let newPokePage: IPokeCard[] = [];

          for (let i = 0; i < data.results.length; i++) {
            await getPokemonData(data.results[i].name)
              .then(pokemonInfo => {
                newPokePage.push(pokemonInfo);
              });
          }
  
          setPokeList(newPokePage);
          setLoadingPokeList(false);
        })
        .catch(_ => {
          setErrorListMessage('A server error ocurred');
          setPokeList([]);
          setLoadingPokeList(false);
        });
    }
  }

  /**
   * @description Loads the list by the pokemon's type
   * @param {string} type 
   */
  const loadListByType = (type: string): void => {
    setLoadingPokeList(true);
    pokemonService.getPokemonListByType(type)
      .then(async ({ data }: any) => {
        setErrorListMessage('');
        setPageCount(Math.ceil(data.slot / 10));

        let newPokePage: IPokeCard[] = [];
        await data.pokemon.forEach(({ pokemon: { name } }: any) => {
          getPokemonData(name)
            .then(pokemonInfo => {
              newPokePage.push(pokemonInfo);
            });
        })
      
      setTimeout(() => {
        setPokeList(newPokePage);
        setLoadingPokeList(false);
      }, 1000);
    })
    .catch(_ => {
      setErrorListMessage('A server error ocurred');
      setPokeList([]);
      setLoadingPokeList(false);
    })
  }

  const submitFilter = ({ name, type }: IFilterForm) => {
    if (name)
      loadList(name);
    else if (type)
      loadListByType(type);
    else 
      loadList();
  }
  
  useEffect(() => loadList(), [, actualOffset]);

  return (
    <ThemeProvider theme={theme}>
      <div className="w-100">
        <div className="w-50 mx-auto my-0 d-flex justify-content-center align-items-center flex-column">
          <img src={PokemonLogo} alt="Pokemon logo" width="200" />
          <Formik initialValues={initialFormikValues} onSubmit={submitFilter}>
            {({ handleChange, handleSubmit, values }) => (
              <form className="row w-100 my-4" onSubmit={handleSubmit}>
                <fieldset className="col-12 col-xl-4 d-flex align-items-start justify-content-center flex-row pb-3">
                  <label htmlFor="search-filter">Name</label>
                  <NeultralInput 
                    id="search-filter" 
                    type="text"
                    name="name"
                    onChange={handleChange} 
                    value={values.name} />
                </fieldset>
                <fieldset className="col-12 col-xl-4 d-flex justify-content-center align-items-center pb-3">
                  <label htmlFor="select-filter">Type</label>
                  <select 
                    id="select-filter"
                    name="type" 
                    style={{ height: 30, width: 200 }}
                    className="custom-select"
                    onChange={handleChange} 
                    value={values.type}
                  >
                    <option value="">---</option>
                    <option value="eletric">Eletric</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="normal">Normal</option>
                    <option value="ice">Ice</option>
                    <option value="fighting">Fighting</option>
                    <option value="poison">Poison</option>
                    <option value="ground">Ground</option>
                    <option value="flying">Flying</option>
                    <option value="psychic">Psychic</option>
                    <option value="bug">Bug</option>
                    <option value="rock">Rock</option>
                    <option value="ghost">Ghost</option>
                    <option value="dark">Dark</option>
                    <option value="dragon">Dragon</option>
                    <option value="steel">Steel</option>
                    <option value="fairy">Fairy</option>
                  </select>              
                </fieldset>
                <div className="col-12 col-xl-4 d-flex justify-content-center align-items-end flex-row">
                  <SecondSucessButton type="submit">Filter</SecondSucessButton>
                </div>
              </form>
              )
            }
          </Formik>
          <div className="w-100">
            {loadingPokeList && <Spinner style={{ position: 'fixed', top: '48%', left: '48%' }} />}
            {errorListMessage && <p>{errorListMessage}</p>}
            {pokeList.map(info => <PokeCard key={info.id} {...info} />)}
            <div className="d-flex justify-content-end my-2">
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
