import { getProductById } from "../getProductById";
import { getOne } from "../../controllers/productController";

jest.mock("../../controllers/productController");

describe("getProductById", () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = { pathParameters: { id: "1" } };
  });

  it("should return 400 if id is not a number", async () => {
    mockEvent.pathParameters.id = "abc";

    const response = await getProductById(mockEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: { message: `product id - abc is not a number` },
    });
  });

  it("should return 404 if product not found", async () => {
    getOne.mockResolvedValue(null);

    const response = await getProductById(mockEvent);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      error: { message: `product with id - 1 not found` },
    });
  });

  it("should return 200 and product if product is found", async () => {
    const mockProduct = { name: "test", price: 100 };
    getOne.mockResolvedValue(mockProduct);

    const response = await getProductById(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      product: mockProduct,
    });
  });

  it("should return 500 if any error occurs", async () => {
    const error = new Error("DB Error");
    getOne.mockRejectedValue(error);
    const response = await getProductById(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: "DB Error" });
  });
});
