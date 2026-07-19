import { FiSearch } from 'react-icons/fi';

function AnimatedSearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form onSubmit={onSubmit} className="relative flex items-center justify-center w-full max-w-2xl mx-auto">
      <div className="relative w-full group">
        {/* Halo animé en fond */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-70 blur-md transition-all duration-700
                     bg-[conic-gradient(from_0deg,#42D1B3,#8B5CF6,#F97316,#42D1B3)]
                     group-hover:opacity-100 group-focus-within:opacity-100
                     animate-[spin_6s_linear_infinite]"
        />

        {/* Champ réel, par-dessus le halo */}
        <div className="relative bg-slate-900 rounded-xl flex items-center px-5 py-4 gap-3">
          <FiSearch className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Rechercher une formation...'}
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
          />
          <button
            type="submit"
            className="btn-primary shrink-0 whitespace-nowrap"
          >
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
}

export default AnimatedSearchBar;
