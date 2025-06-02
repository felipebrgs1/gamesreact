import igdb from 'igdb-api-node';

// Use variáveis de ambiente compatíveis com Next.js
const client = igdb(
    process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
    process.env.NEXT_PUBLIC_TWITCH_APP_ACCESS_TOKEN
);

export default client;