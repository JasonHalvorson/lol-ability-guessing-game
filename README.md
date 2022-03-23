![League of Legends Ability Guessing Game](https://github.com/JasonHalvorson/lol-ability-guessing-game/blob/main/public/lol-ability-guessing-game-og.png?raw=true "League of Legends Ability Guessing Game")

Built using [Next.js](https://nextjs.org/) and [TailwindCSS](https://tailwindcss.com/)

### [View Website](https://lol-ability-guessing-game.vercel.app/)

## How to Play:

You are given the icon of a Champion's ability, the name of the Champion, and what key the ability is mapped to. For example:

![Shen E Ability Icon](https://user-images.githubusercontent.com/47071224/159639222-fca2670d-8334-4e77-8422-b25783f7bbd6.png)

**Shen E**

You then have to guess the name of that ability in the text box (Shen's E is called "Shadow Dash"). If the answer is correct, a green border will surround the text box and you will be unable to type until you click the Get New Ability button.

## Incremental Static Regeneration

This app uses Riot Games' [Data Dragon API](https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html) to collect and cache all the abilities and their images.
Furthermore, this app uses Next.js' [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) to keep the data up to date without having to rebuild the app every time a new Champion is released.

This code in `/pages/index.js` allows this to happen:

```
import getChampions from '../utils/getChampions';

export async function getStaticProps() {
    const championList = await getChampions();

    return {
        props: {
            championList,
        },
        revalidate: 86400,
    };
}
```

`getStaticProps()` is a server-side function that is run on build time, but can also be given a `revalidate` property which will cause it to be run again after the period has expired. In this instance, the cache is valid for 86400 seconds, or one day. After that time has elapsed, the next request to the app will cause Next.js to rerun `getStaticProps()` in the background. Once it has finished running, Next.js will invalidate the stale cache, causing all future requests to have the latest Champion list from the new cache.

## To run locally:

### Prerequisites

This project was made with [Node.js](https://nodejs.org) version 16.13.0.

### Setup

Download the code by either cloning this repository using git:

```
git clone https://github.com/JasonHalvorson/lol-ability-guessing-game.git
```

... or [download a zip of the source code](https://github.com/JasonHalvorson/lol-ability-guessing-game/archive/refs/heads/master.zip).

Once downloaded, open a terminal window in the project directory, and install dependencies with:

```
npm install
```

Start the development server:

```
npm run dev
```

And view it in your browser at `http://localhost:3000`.
