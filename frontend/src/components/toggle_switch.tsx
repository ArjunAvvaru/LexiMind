const ToggleSwitch = ({ label, toggle, handleToggle }) => {

  return (
    <label className="flex items-center">
    <span className="text-white mr-3">{label}</span>
    <div onClick={handleToggle} className={`relative flex items-center w-14 rounded-full p-1 select-none border-slate-600 border transition duration-75 ease-in ${toggle ? 'bg-blue-500' : 'bg-gray-400'}`}>
      <div className={`transform ${toggle ? 'translate-x-5' : 'translate-x-0'} flex w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-75 ease-in`}></div>
    </div>
    </label>
  );
};

export default ToggleSwitch;