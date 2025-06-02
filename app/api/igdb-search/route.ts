import { NextRequest, NextResponse } from 'next/server';
import igdb from 'igdb-api-node';

const client = igdb(
    process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
    process.env.NEXT_PUBLIC_TWITCH_APP_ACCESS_TOKEN!
);

export async function POST(req: NextRequest) {
    const { search } = await req.json();
    try {
        const response = await client
            .fields([
                'name',
                'cover.url',
                'platforms.name',
                'genres.name',
                'first_release_date',
                'rating',
                'summary',
                'url',
            ])
            .where(`name ~ *\"${search}\"*`)
            .limit(10)
            .request('/games');
        return NextResponse.json({ data: response.data });
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar jogos.' }, { status: 500 });
    }
}
