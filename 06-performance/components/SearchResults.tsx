import { useMemo } from "react";

import { ProductItem } from "./ProductItem";

interface SearchResultsProps {
  results: Array<{
    id: number;
    price: number;
    title: string;
  }>;
}

export function SearchResults({ results }: SearchResultsProps) {
  const totalPrice = useMemo(() => {
    return results.reduce((acc, product) => {
      // const inverseSqrt5 = 0.44721359549995793928183473374626;
      // const phi = 1.6180339887498948482045868343656;

      // const calculopesado = Math.floor(
      //   Math.pow(phi, product.price) * inverseSqrt5 + 0.5
      // );

      return acc + product.price;
    }, 0);
  }, [results]);

  return (
    <div>
      <h2>{totalPrice}</h2>
      {results.map((product) => {
        return <ProductItem product={product} />;
      })}
    </div>
  );
}
