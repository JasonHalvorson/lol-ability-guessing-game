import fs from 'fs';

export default async function getChampions() {
    const championList = {};

    // Get latest version of League
    console.log('Getting latest version of League...');
    const versions = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (versions.status !== 200) {
        throw new Error('Failed to fetch API');
    }
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

        // Aphelios Q is like five different unnamed abilities, and doesn't have an E ability.
        if (champion === 'Aphelios') {
            championList[champion] = {
                name: championJson.data[champion].name,
                image: `${championJson.data[champion].id}.jpg`,
                abilities: {
                    W: {
                        name: championJson.data[champion].spells[1].name,
                        image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[2].id}.png`,
                    },
                    R: {
                        name: championJson.data[champion].spells[3].name,
                        image: `http://ddragon.leagueoflegends.com/cdn/${latest}/img/spell/${championJson.data[champion].spells[3].id}.png`,
                    },
                },
            };
        } else {
            championList[champion] = {
                name: championJson.data[champion].name,
                image: `${championJson.data[champion].id}.jpg`,
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
    }

    // Get champion splash art
    console.log('Collecting champion splash art...');
    for (const champion in championsJson.data) {
        const splashArt = await fetch(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`);
        // download the image to /public/images/ if it doesn't exist
        if (!fs.existsSync(`./public/images/${champion}.jpg`)) {
            fs.writeFileSync(`./public/images/${champion}.jpg`, await splashArt.buffer());
        }
    }
    console.log('Done!');

    return championList;
}
