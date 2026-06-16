import React from "react";

const PoshPolicy = () => {
  return (
    <div className="text-sm text-gray-800 leading-relaxed space-y-4 font-content">

      {/* HEADER META */}
      <div className="border border-gray-300 rounded-md p-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div><b>DOCUMENT OWNER:</b> HUMAN RESOURCES DEPARTMENT</div>
          <div><b>DATE:</b> 15-05-2024</div>
          <div><b>POLICY NAME:</b> PREVENTION OF SEXUAL HARASSMENT (POSH)</div>
          <div><b>REF No.:</b> CMS/HRM/POL-PRO_FY24-25_V.1_0019</div>
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
              <th className="border p-1">Reviewers</th>
              <th className="border p-1">Approvers</th>
              <th className="border p-1">Review Date</th>
              <th className="border p-1">Release Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1.0</td>
              <td className="border p-1">Poonam Mulye</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">01-01-2019</td>
              <td className="border p-1">06-01-2019</td>
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
              <th className="border p-1">Reviewers</th>
              <th className="border p-1">Approvers</th>
              <th className="border p-1">Review Date</th>
              <th className="border p-1">Release Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">1.1</td>
              <td className="border p-1">Varada Rotti</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">06-02-2023</td>
              <td className="border p-1">09-02-2023</td>
            </tr>
            <tr>
              <td className="border p-1">1.2</td>
              <td className="border p-1">Mrudul Mangoli</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">Manisha Patil</td>
              <td className="border p-1">04-05-2024</td>
              <td className="border p-1">15-05-2024</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* OBJECTIVE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">OBJECTIVE</h4>
        <p>
          The objective of this policy is to provide a work environment that ensures that every employee
          is treated with dignity and respect and is afforded equitable treatment.
        </p>
        <p className="mt-1">
          CMS is committed to promoting a professional, growth-oriented and equal-opportunity workplace
          and will not tolerate any form of harassment.
        </p>
      </section>

      {/* SCOPE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">SCOPE</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>All CMS employees including management and contractual staff.</li>
          <li>All company-related activities conducted outside CMS premises.</li>
          <li>Any social, business or official function affecting workplace relations.</li>
        </ul>
      </section>

      {/* DEFINITION */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">DEFINITION</h4>
        <p>Sexual harassment includes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Unwelcome sexual advances (verbal, written or physical)</li>
          <li>Requests or demands for sexual favors</li>
          <li>Sexually oriented conduct</li>
          <li>Sex-oriented verbal abuse or kidding</li>
        </ul>
      </section>

      {/* WHEN */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">WHEN IT QUALIFIES</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Interferes with work performance or creates a hostile environment</li>
          <li>Submission becomes a condition of employment</li>
          <li>Used in employment-level decisions</li>
        </ul>
      </section>

      {/* RESPONSIBILITY */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">RESPONSIBILITY</h4>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Each CMS member must ensure their conduct is compliant.</li>
          <li>Management is responsible for prevention, investigation & corrective actions.</li>
        </ol>
      </section>

      {/* WHAT TO DO */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">WHAT TO DO WHEN HARASSMENT OCCURS</h4>

        <p className="font-semibold mt-2">A. Informal Resolution</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Communicate objections directly to the harasser.</li>
          <li>Approach committee members if needed.</li>
        </ul>

        <p className="font-semibold mt-2">B. Formal Resolution</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>File a complaint with IC members.</li>
          <li>Valid complaints lead to corrective actions.</li>
          <li>Actions may include apology, counseling, warning, suspension or discharge.</li>
        </ul>
      </section>

      {/* CONFIDENTIALITY */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">CONFIDENTIALITY</h4>
        <p>
          All complaints, investigations and outcomes are strictly confidential.
        </p>
      </section>

      {/* NO REPRISAL */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">NO REPRISAL</h4>
        <p>
          Any retaliation against complainants will be treated as a disciplinary offense.
        </p>
      </section>

      {/* PROCEDURE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">PROCEDURES AND RAISING A COMPLAINT</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Complaints must be submitted within 3 months of incident.</li>
          <li>HR will forward complaints to IC within 7 days.</li>
          <li>IC is responsible for resolution.</li>
        </ul>
      </section>

      {/* COMMITTEE */}
      <section>
        <h4 className="font-semibold text-red-700 mb-1">POSH COMMITTEE MEMBERS</h4>
        <p>Email: <b>posh@cms.co.in</b></p>

        <div className="overflow-x-auto mt-2">
          <table className="w-full border text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">Sr No</th>
                <th className="border p-1">Name</th>
                <th className="border p-1">Contact</th>
                <th className="border p-1">Designation</th>
                <th className="border p-1">Gender</th>
                <th className="border p-1">Position</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "Shanthi P Kumarr", "9323187221", "Sr Manager - Admin", "Female", "Presiding Officer"],
                ["2", "Prashant P Sawant", "9819113555", "Advocate", "Male", "External IC"],
                ["3", "Mahesh Tilve", "9819133700", "Consultant", "Male", "IC Member"],
                ["4", "Jayanta Chakraborty", "9226373350", "PMO", "Male", "IC Member"],
                ["5", "Susheela Poojari", "9819634217", "AM - Accounts", "Female", "IC Member"],
                ["6", "Mrudul Mangoli", "8169484211", "Manager - HR", "Female", "IC Member"]
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border p-1">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-2">
          IC Members list is displayed at Head Office and all Regional Offices.
        </p>
      </section>

    </div>
  );
};

export default PoshPolicy;
