 const RadioButton = ({ name, value, label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-full border ${checked ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center transition-all duration-300`}>
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          )}
        </div>
      </div>
      <span className="text-grey-700">{label}</span>
    </label>
  );
};
export default RadioButton;
