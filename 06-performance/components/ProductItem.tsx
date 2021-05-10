import { memo, useState } from "react";
import dynamic from "next/dynamic";

import { AddProductToWishlistProps } from "./AddProductToWishlist";

const AddProductToWishlist = dynamic<AddProductToWishlistProps>(
  () => {
    return import("./AddProductToWishlist").then(
      (mod) => mod.AddProductToWishlist
    );
  },
  {
    loading: () => <div>Loading...</div>,
  }
);

interface ProductItemProps {
  product: {
    id: number;
    price: number;
    title: string;
    priceFormatted: string;
  };
  onAddToWishList: (id: number) => void;
}

function ProductItemComponent({ product, onAddToWishList }: ProductItemProps) {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  async function showFormattedDate() {
    setIsAddingToWishlist(true);

    const { format } = await import("date-fns");

    const dateFormatted = format(new Date(), "dd/MM/yyyy");

    console.log(dateFormatted);
  }

  return (
    <div>
      {product.title} - <strong>{product.priceFormatted}</strong>
      <button onClick={showFormattedDate}>Adicionar ao Favoritos</button>
      {isAddingToWishlist && (
        <AddProductToWishlist
          onAddToWishList={() => onAddToWishList(product.id)}
          onRequestClose={() => setIsAddingToWishlist(false)}
        />
      )}
    </div>
  );
}

export const ProductItem = memo(
  ProductItemComponent,
  (prevProps, nextProps) => {
    return Object.is(prevProps.product, nextProps.product);
  }
);
