import type { ListJobsItemProps } from '../../types/types'

const ListJobsItem = ({ index, job }: ListJobsItemProps) => {
    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            <div className="flex flex-wrap gap-x-4 justify-between items-center">
                <span className="flex flex-col">
                    <span className="text-base md:text-lg">{job.job}</span>
                    <span className="text-base md:text-lg">{job.workers}</span>
                </span>
            </div>
        </div>
    )
}

export default ListJobsItem
