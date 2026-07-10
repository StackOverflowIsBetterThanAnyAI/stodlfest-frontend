import type { ListJobsItemProps } from '../../types/types'

const ListJobsItem = ({ index, job }: ListJobsItemProps) => {
    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            <span className="flex flex-wrap gap-4 justify-between">
                <span className="text-base md:text-lg">{job.job}</span>
                <span className="text-base md:text-lg">
                    {job.workers} erforderliche Helfer
                </span>
                <span className="text-base md:text-lg">
                    {job.requires_legal_age ? '18+' : ''}
                </span>
            </span>
        </div>
    )
}

export default ListJobsItem
