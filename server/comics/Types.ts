export type ManhwaT = {
    Name: string;
    Link: string;
    Image: string;
    Rating: number | null;
    Chapter: number | null;
    Modified: string;
    Status: string;
    Source: string;
    Genres: string[]
}

export let DefaultManhwa: ManhwaT = {
    Name: 'Default',
    Link: 'Default',
    Image: 'Default',
    Rating: 0,
    Chapter: 0,
    Modified: 'Unknown',
    Status: 'Unknown',
    Source: 'Default',
    Genres: []
}
