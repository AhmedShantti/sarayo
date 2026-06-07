// Simple line cart icon — inherits color via currentColor.
export default function CartIcon({ className = 'h-5 w-5' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h2.2l1.9 11a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.5L21 7H5.2" />
        </svg>
    );
}
