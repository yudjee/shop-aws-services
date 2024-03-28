import { create } from "../controllers/productController";
import { createResponse } from "../utils";

export const createProduct = async (event) => {
  try {
    const data = JSON.parse(event.body);
    console.log("body - ", data);

    if (
      !data?.price ||
      !data?.count ||
      !data?.title?.trim() ||
      !data?.description?.trim() ||
      !data?.image
    ) {
      return createResponse({
        statusCode: 400,
        body: { error: `invalid product data` },
      });
    }

    const response = await create(data);

    return createResponse({
      statusCode: 200,
      body: response,
    });
  } catch (error) {
    return createResponse({
      statusCode: 500,
      body: { error: `${error.message}` },
    });
  }
};
