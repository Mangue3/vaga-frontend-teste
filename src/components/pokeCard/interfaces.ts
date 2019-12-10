interface IPokeStats {
    effort: number;
    base_stat: number;
    stat: {
        name: string;
        url: string;
    }
}

export interface IPokeInfo {
    baseExperience: number,
    stats: IPokeStats[],
    imgUrl: string,
    weight: number,
    height: number,
    name: string,
}

export interface IPokeCard {
    id: number;
    name: string;
    imgUrl: string;
    handlePokeModal: (show: boolean, modalInfo?: IPokeInfo) => void;
    modalInfo: IPokeInfo;
}
