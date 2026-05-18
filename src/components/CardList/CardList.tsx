import CardItem from '../CardItem/CardItem';

type CardListProps = {
  list: { name: string; url: string }[];
  currentPage: number;
};

function CardList({ list, currentPage }: CardListProps) {
  if (list.length === 0) {
    return <p className="text-center text-gray-500 py-8">No Pokémon found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {list.map((pokemon) => (
        <CardItem
          key={pokemon.name}
          name={pokemon.name}
          url={pokemon.url}
          currentPage={currentPage}
        />
      ))}
    </div>
  );
}

export default CardList;
