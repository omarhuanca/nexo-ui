export function NexoLogo() {
  return (
    <span className="flex items-center gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
          className="fill-blue-600"
        />
        <path
          d="M12 6.5L17 9.25V14.75L12 17.5L7 14.75V9.25L12 6.5Z"
          className="fill-white"
        />
      </svg>
      <span className="text-lg font-semibold text-slate-900">nexo</span>
    </span>
  )
}
