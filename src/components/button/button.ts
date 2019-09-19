import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 5px;
  width: 100px;
  height: 30px;
`;

export const SucessButton = styled(Button)`
  background-color: #ef5350;
  color: #fff;
  align-self: flex-end;
`;

export const SecondSucessButton = styled(Button)`
  background-color: #4a83f6;
  color: #fff;
`;

export const NeutralButton = styled(Button)`
  border: thin solid #AAA;
  color: #AAA;
  background-color: #fff;
  border-radius: 5px;
`;