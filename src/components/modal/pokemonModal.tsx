import React from 'react';
import { SucessButton } from '../button/button';
import { Modal } from 'react-bootstrap';

export default ({ showPokemonModal, handlePokeModal, modalInfo }: any) => {

    return (
      <Modal show={showPokemonModal}>
        <Modal.Header>
          <Modal.Title>Pokemon description</Modal.Title>
        </Modal.Header>

        
        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <SucessButton type="button" onClick={() => handlePokeModal(false)}>Close</SucessButton>
        </Modal.Footer>
    </Modal>
        )
}