type Props = {
  message: string
  onRetry?: () => void
}

export function QueryError({ message, onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-900">
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-800 ring-1 ring-red-200 hover:bg-red-100"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
