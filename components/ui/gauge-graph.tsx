export function GuageGraph({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100;
  const color =
    percentage < 50
      ? "text-red-500"
      : percentage < 80
        ? "text-yellow-500"
        : "text-green-500";

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className={`text-gray-200 stroke-current`}
          strokeWidth="10"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        />
        <circle
          className={`${color} stroke-current`}
          strokeWidth="10"
          cx="50"
          cy="50"
          strokeLinecap="round"
          r="40"
          fill="transparent"
          strokeDasharray={`${percentage * 2.51} 251.2`}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          fontFamily="Verdana"
          fontSize="12"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {value}/{max}
        </text>
      </svg>
    </div>
  );
}
