import { Component } from 'react';
import type { CardItemProps } from '../../types/index';

export default class CardItem extends Component<CardItemProps> {
  render() {
    const { item } = this.props;
    return (
      <div className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition hover:bg-blue-300 cursor-pointer ">
        <h3 className="capitalize font-semibold mb-2 text-center">
          {item.name}
        </h3>

        {item.image && (
          <img src={item.image} alt={item.name} className="mx-auto mb-2" />
        )}

        <p className="text-sm text-gray-600 text-center ">
          {item.description || 'No description'}
        </p>
      </div>
    );
  }
}
