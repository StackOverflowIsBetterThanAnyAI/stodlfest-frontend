const FormHeader = () => {
    return (
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold flex justify-center text-center items-center">
            Aufgabe anlegen
        </h2>
    )
}

const FormRadioButton = ({ id, label }: { id: string; label: string }) => {
    return (
        <div className="flex flex-nowrap gap-1">
            <input type="radio" id={id} name="priority" value="high" />
            <label htmlFor={id} className="text-sm md:text-base">
                {label}
            </label>
        </div>
    )
}

const FormNewTask = () => {
    return (
        <form className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full">
            <FormHeader />
            <div className="flex flex-wrap gap-2 items-center">
                <label
                    htmlFor="task-add"
                    className="font-bold text-base md:text-lg"
                >
                    Aufgabe:
                </label>
                <input
                    type="text"
                    placeholder="Aufgabe"
                    id="task-add"
                    className="w-full min-w-32 outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 text-sm md:text-base"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="description-add"
                    className="font-bold text-base md:text-lg"
                >
                    Beschreibung:
                </label>
                <textarea
                    placeholder="Beschreibung"
                    id="description-add"
                    className="w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 text-sm md:text-base"
                />
            </div>
            <fieldset>
                <legend className="font-bold text-base md:text-lg">
                    Priorität:
                </legend>
                <div className="flex w-full flex-wrap gap-x-4 gap-y-1 items-center">
                    <FormRadioButton id="low-add" label="Niedrig" />
                    <FormRadioButton id="medium-add" label="Mittel" />
                    <FormRadioButton id="high-add" label="Hoch" />
                </div>
            </fieldset>
            <button
                type="submit"
                className="secondary-text-pseudo outline-2 outline-zinc-500 px-2 py-1 text-base md:text-lg"
            >
                Aufgabe anlegen
            </button>
        </form>
    )
}

export default FormNewTask
