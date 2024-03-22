import { getProductsList } from "../getProductsList";
import { getAll } from "../../controllers/productController";

jest.mock("../../controllers/productController");

describe("getProductsList", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 200 and a list of products if no errors occur", async () => {
    const mockProducts = [
      { name: "Product 1", price: 100 },
      { name: "Product 2", price: 200 },
    ];
    getAll.mockResolvedValue(mockProducts);

    const response = await getProductsList();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ products: mockProducts });
  });

  it("should return 500 if any error occurs", async () => {
    const error = new Error("DB Error");
    getAll.mockRejectedValue(error);

    const response = await getProductsList();

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: "DB Error" });
  });
});
