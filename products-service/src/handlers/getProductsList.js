import { getAll } from "../controllers/productController";
import { createResponse } from "../utils";

export const getProductsList = async (event) => {
  try {
    const products = await getAll();

    return createResponse({
      statusCode: 200,
      body: { products },
    });
  } catch (error) {
    return createResponse({
      statusCode: 500,
      body: { error: error.message },
    });
  }
};
