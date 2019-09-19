import React from 'react';
import { SucessButton } from '../button/button';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

const StyledP = styled.p`
  color: #ef5350;
  margin: 5px 0;
`;

const StyledModal = styled(Modal.Body)`

`;

export default ({ showPokemonModal, handlePokeModal, modalInfo }: any) => {
    console.log('modalInfo: ', modalInfo);

    if (modalInfo) {
      const stats = modalInfo.stats.map((stat: any) => {
        return {
          baseStat: stat.base_stat,
          name: stat.stat.name,
        }
      });

      return (
        <Modal show={showPokemonModal}>
          <Modal.Header>
            <Modal.Title style={{ color: '#ef5350' }}>Pokemon description</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <img src={modalInfo.imgUrl} alt={`${modalInfo.name} image`} />
            </div>
            <StyledP>Name: {modalInfo.name}</StyledP>
            <StyledP>Height: {modalInfo.height}</StyledP>
            <StyledP>Weight: {modalInfo.weight}</StyledP>
            <StyledP>Base experience: {modalInfo.baseExperience}</StyledP>
            {stats.map((stat: any) => <StyledP>{stat.name}: {stat.baseStat}</StyledP>)}
          </Modal.Body>

          <Modal.Footer>
            <SucessButton type="button" onClick={() => handlePokeModal(false)}>Close</SucessButton>
          </Modal.Footer>
        </Modal>
      )
    }
    else return (
      <Modal show={showPokemonModal}>
        <Modal.Header>
          <Modal.Title>Pokemon description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledP>
            No pokemon data
          </StyledP>
        </Modal.Body>
        <Modal.Footer>
          <SucessButton type="button" onClick={() => handlePokeModal(false)}>Close</SucessButton>
        </Modal.Footer>
      </Modal>)
}