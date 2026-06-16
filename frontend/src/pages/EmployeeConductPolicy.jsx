import React from "react";

const EmployeeConductPolicy = () => {
  return (
    <div className="text-sm text-gray-800 leading-relaxed space-y-4 font-content">

      {/* HEADER META */}
      <div className="border border-gray-300 rounded-md p-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div><b>DOCUMENT OWNER:</b> HUMAN RESOURCES DEPARTMENT</div>
          <div><b>DATE:</b> 18-08-2024</div>
          <div><b>POLICY NAME:</b> EMPLOYEE CONDUCT AND DISCIPLINARY ACTION POLICY</div>
          <div><b>REF No.:</b> CMS/HRM/POL-PRO_FY 24-25_V.1_0008</div>
        </div>
      </div>

      {/* VERSION HISTORY */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">VERSION HISTORY</h4>
        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Version</th>
              <th className="border p-1">Authors</th>
              <th className="border p-1">Reviewer</th>
              <th className="border p-1">Reviewers</th>
              <th className="border p-1">Approvers</th>
              <th className="border p-1">Review Date</th>
              <th className="border p-1">Release Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1.0</td>
              <td className="border p-1">Mrudul Mangoli</td>
              <td className="border p-1">Minal Patne</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1"></td>
              <td className="border p-1">22-01-2020</td>
              <td className="border p-1">27-01-2020</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* CHANGE HISTORY */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">CHANGE HISTORY</h4>
        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Version</th>
              <th className="border p-1">Authors</th>
              <th className="border p-1">Reviewer</th>
              <th className="border p-1">Reviewers</th>
              <th className="border p-1">Approvers</th>
              <th className="border p-1">Review Date</th>
              <th className="border p-1">Release Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1.1</td>
              <td className="border p-1">Mrudul Mangoli</td>
              <td className="border p-1">Minal Patne</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">Anil Menon</td>
              <td className="border p-1">16-08-2024</td>
              <td className="border p-1">18-08-2024</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* PURPOSE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">PURPOSE</h4>
        <p>
          The policy is designed to achieve fair methods for dealing with disciplinary and other matters,
          thereby contributing to sound relationships between CMS and its employees.
        </p>
      </section>

      {/* SCOPE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">SCOPE</h4>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>All New Joinees</li>
          <li>Branch Offices & Regional Offices</li>
          <li>On-Roll / Off-Roll / Consultants / Freelancers / Trainees</li>
        </ul>
      </section>

      {/* COMPANY EXPECTATIONS */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">COMPANY’S EXPECTATIONS</h4>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Follow all policies & procedures.</li>
          <li>Comply with Code of Conduct.</li>
          <li>Maintain professional relationships.</li>
          <li>Behave appropriately with colleagues, clients & visitors.</li>
          <li>Clarify expectations with your reporting manager.</li>
          <li>Cooperate with R1 / BU Head & HR.</li>
        </ol>
      </section>

      {/* RESPONSIBILITIES */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">R1 / BU HEAD RESPONSIBILITY</h4>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Set example through conduct.</li>
          <li>Reinforce standards of behavior.</li>
          <li>Attempt informal resolution first.</li>
          <li>Investigate complaints promptly.</li>
          <li>Implement disciplinary decisions.</li>
          <li>Monitor improvement.</li>
          <li>Seek HR guidance when unsure.</li>
        </ol>
      </section>

      {/* IT SYSTEMS */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">USE OF COMPANY EQUIPMENT & IT SYSTEMS</h4>
        <p>
          Company assets are strictly for business purposes. Installation of software is prohibited.
          CMS reserves the right to monitor all systems. No expectation of privacy exists.
        </p>
      </section>

      {/* PROPERTY */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">EMPLOYER INFORMATION & PROPERTY</h4>
        <p>
          CMS information and property must not be removed. On exit, all assets must be returned.
          Violations may result in termination.
        </p>
      </section>

      {/* INTERNAL COMPLAINT */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">INTERNAL COMPLAINT PROCEDURES</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>First approach immediate supervisor.</li>
          <li>If unresolved in 5 days, escalate to HR with written complaint.</li>
          <li>Company resolves with confidentiality.</li>
        </ul>
      </section>

      {/* IMMEDIATE DISMISSAL */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">IMMEDIATE DISMISSAL / MISCONDUCT</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Breach of trust</li>
          <li>Harassment</li>
          <li>Insubordination</li>
          <li>Alcohol or drug abuse</li>
          <li>Unauthorized access</li>
          <li>Sleeping on duty</li>
          <li>Absenteeism</li>
          <li>Conflict of interest</li>
        </ul>
      </section>

      {/* OTHER DISCIPLINARY ACTION */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">DISCIPLINE OTHER THAN TERMINATION</h4>
        <p>
          CMS may issue corrective action for performance, attendance or conduct problems to allow improvement.
        </p>
      </section>

      {/* WRITTEN WARNINGS */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">WRITTEN WARNINGS</h4>
        <p>
          HR will issue written warnings with defined timelines. Employees on warning are not eligible for
          promotions, bonuses or transfers.
        </p>
      </section>

      {/* DISMISSALS */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">DISMISSALS</h4>
        <p>
          Employment is at will. CMS can terminate employment without notice. Only MD can approve
          employment contracts.
        </p>
      </section>

      {/* REFERENCE CHECK */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">REFERENCE CHECKS</h4>
        <p>
          All references must go through HR. No employee may provide references independently.
        </p>
      </section>

      {/* INVESTIGATIONS */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">INTERNAL INVESTIGATIONS & SEARCHES</h4>
        <p>
          CMS may inspect desks, belongings and workstations. Employees must cooperate fully.
        </p>
      </section>

    </div>
  );
};

export default EmployeeConductPolicy;
