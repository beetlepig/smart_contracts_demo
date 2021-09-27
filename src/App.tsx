import {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Container, CssBaseline, styled} from "@mui/material";
import AppMenu from "./components/Menu";
import PokemonCard from "./components/PokemonCard";

import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {InjectedConnector} from '@web3-react/injected-connector';


function App() {
    const [pokesList, setPokesList] = useState<{ [key:string]: any }[]>([]);

    const {activate, active} = useWeb3React<Web3Provider>();
    const injected = useMemo(() => new InjectedConnector({supportedChainIds: [1337]}), []);

    useEffect(() => {
        if (!active) {
            activate(injected).then((e) => console.log('connect success')).catch((e) => console.log(e));
        }
    }, [activate, injected, active]);


    useEffect(() => {
        async function getPokemonList() {
            const list: { name: string, url: string }[] = (await (await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=100')).json()).results;
            const listWithDetails = await Promise.all(list.map(async (poke) => await ((await fetch(poke.url)).json())));
            setPokesList(listWithDetails);
        }
        getPokemonList();
    }, [])

    return (
        <Fragment>
            <CssBaseline/>
            <AppMenu/>
            <StyledContainer maxWidth={'xl'}>
                {pokesList.map((pokemon) =>
                    <PokemonCard
                        key={pokemon.id}
                        name={pokemon.name}
                        image={pokemon.sprites.other["official-artwork"]['front_default']}
                    />
                )}
            </StyledContainer>
        </Fragment>
    );
}

const StyledContainer = styled(Container)(({theme}) => ({
    marginTop: theme.spacing(5),
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${theme.spacing(25)}), 1fr))`,
}));

export default App;
