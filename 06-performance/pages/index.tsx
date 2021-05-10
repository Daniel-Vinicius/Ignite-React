import { FormEvent, useCallback, useState } from "react";

import { SearchResults } from "../components/SearchResults";

type Product = {
  id: number;
  price: number;
  title: string;
  priceFormatted: string;
};

type Results = {
  totalPrice: number;
  data: Product[];
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Results>({ data: [], totalPrice: 0 });

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const products = data.map((product: Product) => {
      return {
        ...product,
        priceFormatted: formatter.format(product.price),
      };
    });

    const totalPrice = data.reduce(
      (total: number, product: { price: number }) => {
        return total + product.price;
      },
      0
    );

    setResults({ totalPrice, data: products });
  }

  const onAddToWishList = useCallback(async (id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        onAddToWishList={onAddToWishList}
        results={results.data}
        totalPrice={results.totalPrice}
      />
    </div>
  );
}
