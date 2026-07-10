import type { JobProps, ListJobsProps } from '../../types/types'
import ListJobsItem from './ListJobsItem'

const ListJobs = ({ allJobs, ariaLabel }: ListJobsProps) => {
    return (
        <ul className="flex flex-col gap-4 mx-2" aria-label={ariaLabel}>
            {allJobs.map((job: JobProps, index: number) => (
                <li
                    key={job.id}
                    className={`flex flex-col ${index < allJobs.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                    aria-label={job.job}
                >
                    <ListJobsItem index={index} job={job} key={job.id} />
                </li>
            ))}
        </ul>
    )
}

export default ListJobs
