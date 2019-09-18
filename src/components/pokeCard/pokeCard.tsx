import React from 'react';

import { SucessButton } from '../button/button';
import { IPokeCard } from './interfaces';
import { PokeCard } from './styles';

export default ({ name, description, imgUrl, handlePokeModal, modalInfo }: IPokeCard) => (
    <PokeCard className="d-flex p-2 mt-3">
        <div>
            <img width="100" src={imgUrl} alt={name} />
        </div>
        <div>
            <h3>{name}</h3>
            <p className="my-1">{description}</p>
            <SucessButton onClick={() => handlePokeModal(true, modalInfo)} type="button">Detalhes</SucessButton>
        </div>
    </PokeCard>
)