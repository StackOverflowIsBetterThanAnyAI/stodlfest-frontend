import type { ListMembersProps, MemberProps } from '../../types/types'
import ListMembersItem from './ListMembersItem'

const ListMembers = ({ allMembers }: ListMembersProps) => {
    return (
        <ul className="flex flex-col gap-4 mx-2">
            {allMembers.map((member: MemberProps, index: number) => (
                <li
                    key={member.id}
                    className={`flex flex-col ${index < allMembers.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                >
                    <ListMembersItem
                        index={index}
                        member={member}
                        key={member.id}
                    />
                </li>
            ))}
        </ul>
    )
}

export default ListMembers
