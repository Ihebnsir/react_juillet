import { FiUser, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

export const ListeInscritsTable = ({ inscriptions }) => {
  if (!inscriptions?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <FiAlertTriangle className="mx-auto mb-3 h-6 w-6 text-slate-500 dark:text-slate-400" />
        <p>Aucun apprenant n'est inscrit sur cette offre pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700 dark:divide-slate-700 dark:text-slate-200">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th className="px-4 py-4 font-semibold">Apprenant</th>
            <th className="px-4 py-4 font-semibold">Date</th>
            <th className="px-4 py-4 font-semibold">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {inscriptions.map((inscription) => (
            <tr key={inscription.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <td className="px-4 py-4 flex items-center gap-3">
                <FiUser className="h-4 w-4 text-teal-600" />
                <span>{inscription.learnerName}</span>
              </td>
              <td className="px-4 py-4">{inscription.date}</td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <FiCheckCircle className="h-3.5 w-3.5" /> {inscription.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
