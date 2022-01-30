import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export async function getStaticProps() {
    const championList = {};

    // Get latest version of League
    console.log('Getting latest version of League...');
    const versions = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versionsJson = await versions.json();
    const latest = versionsJson[0];
    console.log('Latest version of League:', latest);

    // Get list of champions
    console.log('Getting list of champions...');
    const champions = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);
    const championsJson = await champions.json();
    console.log('Champions:', Object.keys(championsJson.data).length);

    // Format into object which is cached for 1 day
    console.log('Formatting champion names and abilities into object...');
    for (const champion in championsJson.data) {
        const championData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion/${champion}.json`);
        const championJson = await championData.json();

        championList[champion] = {
            name: championJson.data[champion].name,
            abilities: {
                Q: {
                    name: championJson.data[champion].spells[0].name,
                    image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[0].id}.png`,
                },
                W: {
                    name: championJson.data[champion].spells[1].name,
                    image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[1].id}.png`,
                },
                E: {
                    name: championJson.data[champion].spells[2].name,
                    image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[2].id}.png`,
                },
                R: {
                    name: championJson.data[champion].spells[3].name,
                    image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[3].id}.png`,
                },
            },
        };
    }

    console.log('Done!');

    if (versions.status !== 200) {
        throw new Error('Failed to fetch API');
    }

    return {
        props: {
            championList,
        },
        // If the page gets a request after the list has been cached for 24 hours, it will rerun getStaticProps()
        revalidate: 86400,
    };
}

export default function Game({ championList }) {
    const [guess, setGuess] = useState('');
    const [correct, setCorrect] = useState(false);

    const [champion, setChampion] = useState('');
    const [abilityKey, setAbilityKey] = useState('');
    const [ability, setAbility] = useState('');
    const [abilityImage, setAbilityImage] = useState([]);

    const handleGuess = (event) => {
        const userGuess = event.target.value;
        setGuess(userGuess);

        if (userGuess.replace(/[^A-Z0-9]+/gi, '').toLowerCase() === ability.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase()) {
            setCorrect(true);
        }
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            getNewAbility(championList);
        }
    };

    const getNewAbility = (championList) => {
        const newChampion = Object.values(championList)[Math.floor(Math.random() * Object.values(championList).length)];
        const newAbilityKey = Object.keys(newChampion.abilities)[Math.floor(Math.random() * Object.keys(newChampion.abilities).length)];
        const newAbility = newChampion.abilities[newAbilityKey];
        const newAbilityImage = [newAbility.image, `${newChampion.name} ${newAbilityKey}`];

        setChampion(newChampion);
        setAbilityKey(newAbilityKey);
        setAbility(newAbility);
        setAbilityImage(newAbilityImage);
        setCorrect(false);
        setGuess('');

        try {
            document.getElementById('guess').focus();
        } catch (error) {
            // If running for the first time, the form isn't loaded yet, so wait.
            setTimeout(() => {
                document.getElementById('guess').focus();
            }, 300);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
            <Head>
                <title>LoL Ability Guessing Game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="relative px-6 pt-10 pb-8 bg-gray-900 shadow-xl ring-1 ring-gray-900/5 sm:max-w-xl sm:mx-auto sm:rounded-lg sm:px-10 text-white">
                <div className="relative flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-center">LoL Ability Guessing Game</h1>
                    {champion ? (
                        <div className="">
                            <div className="mt-8 text-center">
                                <Image id="abilityImg" src={abilityImage[0]} width={64} height={64} alt={abilityImage[1]} />
                                <h2 className="text-2xl font-bold">
                                    {champion.name} {abilityKey}
                                </h2>
                            </div>
                            <div className="mt-8 mx-auto">
                                <label htmlFor="guess" className="sr-only">
                                    Guess
                                </label>
                                <input onChange={handleGuess} onKeyDown={handleEnter} value={correct ? ability.name : guess} type="text" name="guess" id="guess" className={`shadow-sm block w-full sm:text-sm border-gray-700 bg-gray-800 rounded-md text-center ${correct ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-purple-500 focus:border-purple-500'}`} />
                            </div>
                            <div className="mt-8 text-center">
                                <button onClick={() => getNewAbility(championList)} id="newAbilityButton" type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                    Get new ability
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 mx-auto">
                            <button onClick={() => getNewAbility(championList)} type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ">
                                Start Game
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
