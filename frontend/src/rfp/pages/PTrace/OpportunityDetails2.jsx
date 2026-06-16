export default function OpportunityDetails2({ opportunity, show }) {
  if (!show) return null;

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-md shadow-md w-[280px] max-h-[70vh] overflow-y-auto text-xs">
      
      {/* Description and Overview */}
      <div className="flex flex-col gap-1 mb-2 ">
        <span title={opportunity.oppDesc} className="text-gray-700 font-medium text-sky-500 truncate bg-sky-100 px-1 py-0.5 border-b border-gray-100">{opportunity.oppDesc}</span>
        <span title={opportunity.oppOverView} className="text-gray-500 truncate px-1 ">{opportunity.oppOverView}</span>
      </div>

      {/* Location & Budget */}
      <div className="flex flex-wrap gap-2 mb-2 px-1">
        <span title="City" className="px-2 py-0.5 bg-slate-100 rounded-full text-gray-600">
          {opportunity.customerCity}
        </span>
        <span title="State" className="px-2 py-0.5 bg-slate-100 rounded-full text-gray-600">
          {opportunity.customerState}
        </span>
        <span title="Budget" className="px-2 py-0.5 bg-green-100 rounded-full text-green-600">
          ₹ {opportunity.customerProjBudget}
        </span>
      </div>

      {/* Date and Quarter */}
      <div className="flex justify-between items-center pb-1 px-1">
         <span className="px-0.5 py-0.5 bg-sky-50 text-sky-500 rounded-full text-xs" title="Project Type">{opportunity.rfpProjectType.projectType}</span>
          <span className="px-0.5 py-0.5 bg-sky-50 text-sky-500 rounded-full text-xs" title="Billing">{opportunity.billingType.billingType}</span>
          <span className="px-0.5 py-0.5 bg-green-50 text-green-500 rounded-full text-xs" title="Eval Type">{opportunity.rfpEvalType.evalType}</span>

        <span className="text-[7px] px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">
          {opportunity.oppQuarter} / {opportunity.oppYear}
        </span>
      </div>
    </div>
  );
}
