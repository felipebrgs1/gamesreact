'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Game {
    id: number;
    name: string;
    cover?: { url: string };
    platforms?: { name: string }[];
    genres?: { name: string }[];
    first_release_date?: number;
    rating?: number;
    summary?: string;
    url?: string;
}

export default function Home() {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/igdb-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search }),
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResults(data.data);
        } catch {
            setError('Erro ao buscar jogos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-full rounded bg-indigo-300 p-4'>
            <form
                onSubmit={handleSearch}
                className='mb-8 w-full max-w-md flex gap-2'
            >
                <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar jogo...'
                    className='flex-1 p-2 rounded border bg-white border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
                <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                >
                    Buscar
                </button>
            </form>
            {loading && <div>Carregando...</div>}
            {error && <div className='text-red-500'>{error}</div>}
            <div className='flex flex-col items-center gap-6 w-full max-w-xl min-h-[200px] overflow-y-auto max-h-[70vh] p-2 bg-white bg-opacity-60 rounded shadow-inner'>
                {!loading && !error && results.length === 0 && (
                    <div className='text-gray-600 text-center w-full py-8'>
                        Nenhum jogo encontrado.
                    </div>
                )}
                {results.map((game) => (
                    <div
                        key={game.id}
                        className='bg-white rounded-lg border border-gray-200 p-6 w-full flex flex-col sm:flex-row gap-6 items-center shadow-sm transition-all duration-200'
                    >
                        {game.cover?.url && (
                            <Image
                                src={
                                    game.cover.url.startsWith('//')
                                        ? `https:${game.cover.url.replace(
                                              't_thumb',
                                              't_cover_big',
                                          )}`
                                        : game.cover.url.replace(
                                              't_thumb',
                                              't_cover_big',
                                          )
                                }
                                alt={game.name}
                                width={96}
                                height={128}
                                className='w-24 h-32 object-cover rounded-md border border-gray-100 bg-gray-50'
                            />
                        )}
                        <div className='flex-1 w-full'>
                            <h2 className='text-xl font-semibold mb-1 break-words'>
                                {game.name}
                            </h2>
                            <div className='text-xs text-gray-500 mb-1'>
                                {game.platforms
                                    ?.map((p) => p.name)
                                    .join(', ') || 'Plataformas desconhecidas'}
                            </div>
                            <div className='text-xs text-gray-500 mb-1'>
                                {game.genres?.map((g) => g.name).join(', ') ||
                                    'Gêneros desconhecidos'}
                            </div>
                            <div className='text-xs text-gray-500 mb-1'>
                                Lançamento:{' '}
                                {game.first_release_date
                                    ? new Date(
                                          game.first_release_date * 1000,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </div>
                            <div className='text-xs text-gray-500 mb-1'>
                                Nota:{' '}
                                {game.rating ? game.rating.toFixed(1) : 'N/A'}
                            </div>
                            <div className='text-sm text-gray-700 mb-2 break-words'>
                                {game.summary || 'Sem descrição.'}
                            </div>
                            {game.url && (
                                <a
                                    href={game.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 underline text-xs'
                                >
                                    Ver na IGDB
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
