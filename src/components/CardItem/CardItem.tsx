import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type CardItemProps = {
  name: string;
  url: string;
  currentPage: number;
};

function CardItem({ name, url, currentPage }: CardItemProps) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [url]);
  return (
    <div
      onClick={() => navigate(`/detail/${name}?page=${currentPage}`)}
      className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition hover:bg-blue-300 cursor-pointer"
    >
      <h3 className="capitalize font-semibold mb-2 text-center">{name}</h3>
      {data && (
        <>
          <img
            src={data.sprites.front_default}
            alt={name}
            className="mx-auto mb-2"
          />

          <p className="text-sm text-gray-600 text-center ">
            Weight {data.weight} kg
          </p>
        </>
      )}
    </div>
  );
}
export default CardItem;
