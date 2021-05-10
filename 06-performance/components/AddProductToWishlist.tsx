export interface AddProductToWishlistProps {
  onAddToWishList: () => void;
  onRequestClose: () => void;
}

export function AddProductToWishlist({
  onRequestClose,
  onAddToWishList,
}: AddProductToWishlistProps) {
  return (
    <span>
      Deseja adicionar ao favoritos?
      <button onClick={onAddToWishList}>Sim</button>
      <button onClick={onRequestClose}>Não</button>
    </span>
  );
}
