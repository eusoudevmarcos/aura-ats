declare module 'react-trello' {
  import { Component } from 'react';

  export interface Card {
    id: string;
    title: string;
    description?: string;
    label?: string;
    draggable?: boolean;
    metadata?: Record<string, any>;
    cardStyle?: React.CSSProperties;
  }

  export interface Lane {
    id: string;
    title: string;
    label: string;
    cards: Card[];
  }

  export interface BoardData {
    lanes: Lane[];
  }

  export interface BoardProps {
    data: BoardData;
    onCardClick?: (cardId: string) => void;
    onCardMoveAcrossLanes?: (
      cardId: string,
      sourceLaneId: string,
      targetLaneId: string
    ) => void;
    style?: React.CSSProperties;
    cardStyle?: React.CSSProperties;
    laneStyle?: React.CSSProperties;
    components?: {
      Card?: React.ComponentType<any>;
      Lane?: React.ComponentType<any>;
    };
  }

  export default class Board extends Component<BoardProps> {}
}
