const Checkbox = ({ name, checked, onChange, label, error }) => {
  return (
    <div className="group">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={`mt-1 h-5 w-5 rounded border-2 ${
            checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-400'
          } focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200`}
        />
        <span className={`text-sm transition-colors duration-200 ${
          error ? 'text-red-600' : 'text-gray-700 group-hover:text-gray-800'
        }`}>{label}</span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1 ml-8">{error}</p>}
    </div>
  );
};
export default Checkbox;