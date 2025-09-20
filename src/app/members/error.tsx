'use client'

export default function Error({ error }: { error: Error }) {
    console.error(error)

    return (
        <div className="p-4 text-red-500">
            <h2>Something went wrong loading members.</h2>
            <p>{error.message}</p>
        </div>
    )
}
