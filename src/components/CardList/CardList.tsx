import { Component } from 'react';
import type { PokemonDetail } from '../../types/pokemon';
import type { CardListProps } from '../../types/index';
import CardItem from '../CardItem/CardItem';

class CardList extends Component<CardListProps> {
  render() {
    const { result } = this.props;

    return (
      <div className="grid grid-cols-3 gap-4">
        {result.map((pokemon: PokemonDetail) => (
          <CardItem key={pokemon.name} item={pokemon} />
        ))}
      </div>
    );
  }
}

export default CardList;
