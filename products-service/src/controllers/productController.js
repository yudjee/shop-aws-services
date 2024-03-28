import { products } from "../data/products";

export const getAll = async () => {
  return products;
};

export const getOne = async (id) => {
  return products.find((product) => product.id === id);
};
