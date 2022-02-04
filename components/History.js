import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import Image from 'next/image';

export default function History({ history }) {
    console.log(history);
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {/* map history with historyEntry and index as params */}

                {history.map((historyEntry, idx) => (
                    <li key={idx}>
                        <div className="relative pb-8">
                            {idx !== history.length - 1 ? <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-purple-500" aria-hidden="true" /> : null}
                            <div className="relative flex items-center space-x-3">
                                <>
                                    <div className="relative">
                                        <span className="absolute h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center ring-8 ring-gray-900" />
                                        <Image width={40} height={40} className="rounded-full" src={historyEntry.abilityImage[0]} alt={historyEntry.abilityImage[1]} unoptimized={true} />

                                        <span className="absolute -bottom-0.5 -right-1 bg-gray-900 rounded-full px-0.5 py-px">{historyEntry.correct ? <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" /> : <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                                                <p className={`font-medium ${historyEntry.correct ? 'text-green-400' : 'text-red-400'}`}>
                                                    {historyEntry.champion} {historyEntry.abilityKey} - <span className="font-bold">{historyEntry.ability.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
