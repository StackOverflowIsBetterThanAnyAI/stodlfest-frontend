import { useScreenWidth } from '../../hooks/useScreenWidth'
import type { ListJobsItemProps } from '../../types/types'

const ListJobsItem = ({ index, job }: ListJobsItemProps) => {
    const SCREEN_WIDTH = useScreenWidth()

    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            {SCREEN_WIDTH === 'MOBILE' ? (
                <div className="flex flex-col gap-2">
                    <span className="flex justify-between">
                        <span className="text-base md:text-lg">{job.job}</span>
                        {job.requires_legal_age ? (
                            <span className="text-sm md:text-base text-right self-start font-bold w-full">
                                <span
                                    aria-hidden="true"
                                    className="inline-flex justify-center items-center p-1 outline-2 outline-zinc-200 rounded-full aspect-square"
                                >
                                    18+
                                </span>
                                <span className="sr-only">
                                    Volljährigkeit erforderlich
                                </span>
                            </span>
                        ) : (
                            <span className="sr-only">
                                Keine Volljährigkeit erforderlich
                            </span>
                        )}
                    </span>
                    <span className="text-base md:text-lg">
                        {`${job.workers} erforderliche Helfer`}
                    </span>
                </div>
            ) : (
                <span className="gap-4 grid grid-cols-3 items-center">
                    <span className="text-base md:text-lg">{job.job}</span>
                    <span className="text-base md:text-lg">
                        {`${job.workers} erforderliche Helfer`}
                    </span>
                    {job.requires_legal_age ? (
                        <span className="text-sm md:text-base text-right self-start font-bold w-full">
                            <span
                                aria-hidden="true"
                                className="inline-flex justify-center items-center p-1 outline-2 outline-zinc-200 rounded-full aspect-square"
                            >
                                18+
                            </span>
                            <span className="sr-only">
                                Volljährigkeit erforderlich
                            </span>
                        </span>
                    ) : (
                        <span className="sr-only">
                            Keine Volljährigkeit erforderlich
                        </span>
                    )}
                </span>
            )}
        </div>
    )
}

export default ListJobsItem
