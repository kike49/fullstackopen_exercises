const Search = ({search, handler}) => {
    return (
        <div>
            Find countries: <input type="text" value={search} onChange={handler} />
        </div>
    )
}

export default Search
