import { getOne } from "../controllers/productController";
import { createResponse } from "../utils";

export const getProductById = async (event) => {
  try {
    const { id } = event.pathParameters;
    console.log("product id - ", id);

    if (!id?.trim()) {
      return createResponse({
        statusCode: 400,
        body: {
          error: { message: `invalid product id - ${id}` },
        },
      });
    }

    const product = await getOne(id);

    if (product) {
      return createResponse({
        statusCode: 200,
        body: { product },
      });
    }

    return createResponse({
      statusCode: 404,
      body: {
        error: { message: `product with id - ${id} not found` },
      },
    });
  } catch (error) {
    return createResponse({
      statusCode: 500,
      body: { error: error.message },
    });
  }
};
