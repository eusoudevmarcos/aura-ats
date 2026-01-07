import { createStore, combineReducers, AnyAction } from 'redux';

// Reducer para react-trello
// O react-trello usa Redux internamente e precisa de um reducer que processe suas actions
// O react-trello gerencia seu próprio estado através de actions como:
// - LOAD_BOARD, UPDATE_BOARD, MOVE_CARD, ADD_CARD, etc.
const trelloReducer = (state: any = { lanes: [] }, action: AnyAction) => {
  // O react-trello gerencia seu próprio estado
  // Este reducer processa as actions do react-trello ou retorna o estado atual
  switch (action.type) {
    case 'LOAD_BOARD':
    case 'UPDATE_BOARD':
      return action.payload || state;
    default:
      // Para outras actions do react-trello, retornar o estado atual
      // O react-trello gerencia seu próprio estado internamente
      return state;
  }
};

const rootReducer = combineReducers({
  board: trelloReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Criar store com reducer compatível com react-trello
// O react-trello vai gerenciar seu próprio estado através de actions internas
export const store = createStore(rootReducer);
