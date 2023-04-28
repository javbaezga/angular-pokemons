export const DEFAULT_AUTHOR_ID = 1;

export const EMPTY_POKEMON = {
    id: 0,
    name: "",
    image: "",
    attack: 0,
    defense: 0,
    hp: 0,
    type: "None",
    idAuthor: DEFAULT_AUTHOR_ID
};

export interface Pokemon {
    [index: string]: number | string;
    id: number;
    name: string;
    image: string;
    attack: number;
    defense: number;
    hp: number;
    type: string;
    idAuthor: number;
};