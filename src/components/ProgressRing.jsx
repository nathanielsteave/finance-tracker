export const ProgressRing = ({ progress = 0, size = 80, stroke = 6, color = '#007AFF', label }) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="none" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            {label && <span className="absolute text-xs font-bold">{label}</span>}
        </div>
    );
};