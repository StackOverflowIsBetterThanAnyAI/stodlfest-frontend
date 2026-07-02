import FormNewTask from '../components/form/FormNewTask'

const Vorbereitung = () => {
    return (
        <main className="max-w-7xl w-full mx-auto items-center p-8 flex flex-col gap-8 xs:gap-16">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold flex justify-center text-center items-center">
                Vorbereitungen
            </h1>
            <div>
                <h2>Anstehende Aufgaben</h2>
            </div>
            <div>
                <h2>Erledigte Aufgaben</h2>
            </div>
            <FormNewTask />
        </main>
    )
}

export default Vorbereitung
