export const SelectInput = ({ options, onChange, value }) => {
  console.log(value)
  return(
    <select value={value} onChange={onChange} className="rounded-sm border-solid border border-slate-400 p-1">
      {options?.map((el, i) => {
        return <option key={i}>{el}</option>
      })}
    </select>
  )
}