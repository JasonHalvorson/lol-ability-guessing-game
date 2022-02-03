import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import getChampions from '../utils/getChampions';
import HistoryContainer from '../components/HistoryContainer';
import { ClockIcon } from '@heroicons/react/outline';

export async function getStaticProps() {
    const championList = await getChampions();

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
    const [score, setScore] = useState({ correct: 0, incorrect: 0, percent: null, percentColor: 0 });
    const [correct, setCorrect] = useState(false);
    const [history, setHistory] = useState([]);
    const [openHistory, setOpenHistory] = useState(false);

    const [champion, setChampion] = useState('');
    const [championSplash, setChampionSplash] = useState('');
    const [abilityKey, setAbilityKey] = useState('');
    const [ability, setAbility] = useState('');
    const [abilityImage, setAbilityImage] = useState([]);

    const calcPercent = (correct, total) => ((correct / total) * 100).toFixed(0);

    const calcPercentColor = (percent) => {
        if (percent >= 100) return 'bg-purple-700';
        if (percent >= 95) return 'bg-violet-700';
        if (percent >= 90) return 'bg-indigo-700';
        if (percent >= 85) return 'bg-blue-700';
        if (percent >= 80) return 'bg-sky-700';
        if (percent >= 75) return 'bg-cyan-700';
        if (percent >= 70) return 'bg-teal-700';
        if (percent >= 60) return 'bg-emerald-700';
        if (percent >= 50) return 'bg-green-700';
        if (percent >= 40) return 'bg-lime-700';
        if (percent >= 30) return 'bg-yellow-700';
        if (percent >= 20) return 'bg-amber-700';
        if (percent >= 0) return 'bg-red-700';
    };

    const handleGuess = (event) => {
        const userGuess = event.target.value;
        setGuess(userGuess);

        if (userGuess.replace(/[^A-Z0-9]+/gi, '').toLowerCase() === ability.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase()) {
            setCorrect(true);
            const newCorrectScore = (score.correct += 1);
            const newPercent = calcPercent(newCorrectScore, newCorrectScore + score.incorrect);
            const newPercentColor = calcPercentColor(newPercent);
            setScore({ ...score, correct: newCorrectScore, percent: newPercent, percentColor: newPercentColor });
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
        const newChampionSplash = `/images/${newChampion.image}`;
        const newAbilityKey = Object.keys(newChampion.abilities)[Math.floor(Math.random() * Object.keys(newChampion.abilities).length)];
        const newAbility = newChampion.abilities[newAbilityKey];
        const newAbilityImage = [newAbility.image, `${newChampion.name} ${newAbilityKey}`];

        if (champion) {
            setHistory([{ champion: champion.name, abilityKey, ability, abilityImage, correct }, ...history]);

            if (!correct) {
                const newIncorrectScore = (score.incorrect += 1);
                const newPercent = calcPercent(score.correct, score.correct + newIncorrectScore);
                const newPercentColor = calcPercentColor(newPercent);
                setScore({ ...score, incorrect: newIncorrectScore, percent: newPercent, percentColor: newPercentColor });
            }
        }
        setChampion(newChampion);
        setChampionSplash(newChampionSplash);
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
            {championSplash && (
                <div className="absolute inset-0">
                    <Image className="h-full w-full object-cover" src={championSplash} layout="fill" alt={`${champion.name} Splash Art`} />
                    <div className="absolute inset-0 bg-purple-700 mix-blend-multiply" />
                </div>
            )}
            <Head>
                {/* HTML Meta Tags */}
                <title>League of Legends Ability Guessing Game</title>
                <meta name="description" content="Test your League of Legends knowledge in this Ability name guessing game!" />
                <link rel="icon" href="/favicon.ico" />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://lol-ability-guessing-game.vercel.app/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="League of Legends Ability Guessing Game" />
                <meta property="og:description" content="Test your League of Legends knowledge in this Ability name guessing game!" />
                <meta property="og:image" content="https://lol-ability-guessing-game.vercel.app/lol-ability-guessing-game-og.png" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="lol-ability-guessing-game.vercel.app" />
                <meta property="twitter:url" content="https://lol-ability-guessing-game.vercel.app/" />
                <meta name="twitter:title" content="League of Legends Ability Guessing Game" />
                <meta name="twitter:description" content="Test your League of Legends knowledge in this Ability name guessing game!" />
                <meta name="twitter:image" content="https://lol-ability-guessing-game.vercel.app/lol-ability-guessing-game-og.png" />
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
                            <div className={`mt-8 grid grid-cols-12`}>
                                <div className="col-span-2">
                                    {history.length > 0 && (
                                        <button onClick={() => setOpenHistory(true)} type="button" className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-transparent hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                            <ClockIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                                <div className="col-span-8 mx-auto">
                                    <button onClick={() => getNewAbility(championList)} id="newAbilityButton" type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                        Get New Ability
                                    </button>
                                </div>
                                <div className="col-span-2 ml-auto">
                                    {history.length > 0 && (
                                        <div className="flex flex-row">
                                            <p className={`inline-flex items-center p-1.5 rounded-full shadow-sm text-white ${score.percentColor}`}>{score.percent}%</p>
                                            <div className="flex flex-col">
                                                <span className="inline-flex items-center px-2.5 py-0.5 mb-0.5 rounded-full text-xs font-medium bg-green-400 text-gray-900 self-center">{score.correct}</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400 text-gray-900 self-center">{score.incorrect}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
            {history.length > 0 && <HistoryContainer history={history} open={openHistory} setOpen={setOpenHistory} />}
        </div>
    );
}
