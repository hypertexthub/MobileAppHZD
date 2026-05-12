const Header = ({ title = '', search, setSearch }) => {
    const onClick = () => {
        console.log('click component header');

    };

    return (
        <header className="headertitle">

            <div className="headercontainer">
                <h2>{title}</h2>
                <div >
                    <input
                        type="text"
                        placeholder="Search machine..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
        </header>

    );
};
export default Header;