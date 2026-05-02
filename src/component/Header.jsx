const Header = ({ title = 'Horizon Zero Dawn Machines' }) => {
    const onClick = () => {
        console.log('click component header');

    };

    return (
        <header className="headertitle">

            <div className="container">
                <h3>{title}</h3>
                <div >
                    <input className="inputstyle"></input>
                    <button onClick={onClick}>Search</button>
                </div>
            </div>
        </header>

    );
};
export default Header;
