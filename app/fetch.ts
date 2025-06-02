import client from "./igdb";

const response = await client
    .fields(['name', 'companies', 'platforms']) // fetches only the name, slug, summary, and platforms fields
    .where(`name = "Unity"`) // filter the results
    .request('/game_engines'); // execute the query and return a response object

console.log(response.data);