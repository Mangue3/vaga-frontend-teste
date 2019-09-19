import React from 'react';

import { SucessButton } from '../button/button';
import { IPokeCard } from './interfaces';
import { PokeCard } from './styles';

export default ({ name, imgUrl, handlePokeModal, modalInfo }: IPokeCard) => (
    <PokeCard className="d-flex jutify-content-center align-items-center flex-column p-2 mt-3 w-75 mx-auto">
        <h3>{name}</h3>
        <img width="100" src={imgUrl} alt={`${name} image`} />
        <SucessButton onClick={() => handlePokeModal(true, modalInfo)} type="button">Detalhes</SucessButton>
    </PokeCard>
)