import type { FormRadioButtonProps } from '../../types/types'

const FormRadioButton = ({
    id,
    label,
    value,
    currentValue,
    onChange,
    onKeyDown,
}: FormRadioButtonProps) => {
    return (
        <div className="flex flex-nowrap gap-1">
            <input
                type="radio"
                id={id}
                name="priority"
                value={value}
                checked={currentValue === value}
                onChange={onChange}
                required
                onKeyDown={onKeyDown}
            />
            <label htmlFor={id} className="text-sm md:text-base">
                {label}
            </label>
        </div>
    )
}

export default FormRadioButton
