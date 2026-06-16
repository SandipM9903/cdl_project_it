function StatusCard({ icon: Icon, label, count, colorClass, countClass }) {
  return (
     <div
      className="flex flex-col items-start bg-white p-6 rounded-xl transition-shadow duration-300 ease-in-out gap-4 shadow-md hover:shadow-2xl"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
        {Icon && <Icon className={`${colorClass} w-6 h-6`} />}
      </div>

      <span className="text-base font-semibold text-gray-800">{label}</span>

      <span className={`${countClass} text-lg font-bold`}>{count}</span>
    </div>
  );
}

export default StatusCard;