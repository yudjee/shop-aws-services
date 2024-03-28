import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { generateUUID } from "../utils";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const productsTable = "shop_products";
const productsCountTable = "shop_products_count";

export const getAll = async () => {
  try {
    const productsCountData = await dynamo.send(
      new ScanCommand({ TableName: productsCountTable })
    );
    const productsData = await dynamo.send(
      new ScanCommand({ TableName: productsTable })
    );

    const productsList = productsData.Items.map((item) => {
      return {
        ...item,
        count: productsCountData.Items.find((countItem) => {
          return countItem.id === item.id;
        }).count,
      };
    });

    return productsList;
  } catch (error) {
    return throwError(error);
  }
};

export const getOne = async (id) => {
  try {
    const productCountData = await dynamo.send(
      new GetCommand({
        TableName: productsCountTable,
        Key: {
          id: id,
        },
      })
    );

    const productData = await dynamo.send(
      new GetCommand({
        TableName: productsTable,
        Key: {
          id: id,
        },
      })
    );

    if (productData?.Item) {
      return { ...productData.Item, count: productCountData.Item.count };
    }

    return throwError(`product with id - ${id} not found`);
  } catch (error) {}
};

export const create = async ({
  id = generateUUID(),
  price,
  image,
  description,
  title,
}) => {
  try {
    const productResponse = await dynamo.send(
      new PutCommand({
        TableName: productsTable,
        Item: {
          description,
          title,
          price,
          image,
          id,
        },
      })
    );

    const countResponse = await dynamo.send(
      new PutCommand({
        TableName: productsCountTable,
        Item: {
          id,
          count: 1,
        },
      })
    );

    return { productResponse, countResponse };
  } catch (error) {
    return throwError(error);
  }
};
