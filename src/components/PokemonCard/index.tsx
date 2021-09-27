import {FC, memo, useCallback, useEffect, useMemo, useState} from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";

import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Contract} from "ethers";
import mainContract from "../../assets/KarlosWildPokemonLand.json";

interface Props {
    name: string;
    image: string;
}

const PokemonCard: FC<Props> = ({name, image}) => {
    const {library} = useWeb3React<Web3Provider>();
    const contract = useMemo(() => new Contract(mainContract.networks[5777].address, mainContract.abi, library), [library]);
    const signer = useMemo(() => library && contract.connect(library.getSigner()), [contract, library]);

    const [alreadyOwned, setAlreadyOwned] = useState(false);

    const isOwned = useCallback(async (pokemonName) => {
        const owned = await contract.isOwned(pokemonName);
        setAlreadyOwned(owned);
    }, [contract]);


    const handleCatch = useCallback(async () => {
        if (signer) {
            await signer.catchPokemon(name);
            setAlreadyOwned(true);
        }
    }, [name, signer]);

    useEffect(() => {
        isOwned(name);
    }, [isOwned, name]);

    return (
        <Card>
            <CardMedia
                component="img"
                alt={`${name} artwork`}
                height="140"
                image={image}
                sx={{objectFit: 'contain'}}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">

                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" disabled={alreadyOwned} onClick={handleCatch}>
                    {!alreadyOwned? 'Catch' : 'Already Owned'}
                </Button>
            </CardActions>
        </Card>
    )
}

export default memo(PokemonCard);
