import { generatePolicy } from "../utils";

export const basicAuthorizer = async (event, _context, callback) => {
  if (event.type !== "TOKEN") {
    return callback("Unauthorized");
  }

  try {
    const authorizationToken = event.authorizationToken;

    const base64Credentials = authorizationToken.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );

    const [username, password] = credentials.split(":");
    const storedUserPassword = process.env[username];

    const effect =
      storedUserPassword && storedUserPassword === password ? "Allow" : "Deny";

    return callback(
      "succes message",
      generatePolicy(username, event.methodArn, effect)
    );
  } catch (error) {
    if (error.message === "Access Deny") {
      return callback(
        "error message",
        generatePolicy(username, event.methodArn, "Deny")
      );
    }

    return callback("Unauthorized 333 " + error.message);
  }
};
