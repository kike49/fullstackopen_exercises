import { filterChange } from "../reducers/filterReducer"
import { useDispatch } from "react-redux"

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {dispatch(filterChange(event.target.value))}

  return (
    <div>
      Filter content <input onChange={handleChange} />
      <br />
      <hr />
    </div>
  )
}

export default Filter
