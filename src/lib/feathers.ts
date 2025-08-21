import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";

const restClient = rest("http://localhost:3030");
const client = feathers();

client.configure(restClient.axios(axios));

export { client };
