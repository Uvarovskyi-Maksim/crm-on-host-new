const LeftMenu = ({ hideLeftMenu, userName, userRole, logout, LeaveImg, hideMenu, HideImg, activeMenuItem, showBlock, LeedImg, ListImg, BuyerImg, ProductListImg, AnalyticsImg, AddUserImg }) => {
    return(
        <div style={{ display: "block" }} className={`left_menu ${hideLeftMenu ? "hide" : ""}`}>
        <div className={`manager_name_block ${hideLeftMenu ? "hide" : ""}`}>
            <div className="name">
                {userName}
            </div>
            <div className="role">
                {userRole}
            </div>
            <img onClick={logout} className="logout" src={LeaveImg} alt="" />
        </div>
        <div className="menu_block">
            <div className="menu_arrow" onClick={hideMenu}><img className="menu_arrow_img" src={HideImg} alt="" /></div>
            <div className="left_menu_buttons">
                <div
                    className={`menu_element ${activeMenuItem === 'Лиды' ? 'active_el' : ''} `}
                    onClick={() => showBlock('Лиды')}
                >

                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={LeedImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Лиды</div>

                </div>
                <div
                    className={`menu_element ${activeMenuItem === 'Список менеджеров' ? 'active_el' : ''}`}
                    onClick={() => showBlock('Список менеджеров')}
                >
                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={ListImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Список менеджеров</div>


                </div>

                <div
                    className={`menu_element ${activeMenuItem === 'Покупатели' ? 'active_el' : ''}`}
                    onClick={() => showBlock('Покупатели')}
                >
                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={BuyerImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Покупатели</div>
                </div>
                <div
                    className={`menu_element ${activeMenuItem === 'Продукты' ? 'active_el' : ''}`}
                    onClick={() => showBlock('Продукты')}
                >
                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={ProductListImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Продукты</div>
                </div>
                <div
                    className={`menu_element ${activeMenuItem === 'Аналитика' ? 'active_el' : ''}`}
                    onClick={() => showBlock('Аналитика')}
                >
                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={AnalyticsImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Аналитика</div>
                </div>
                <div
                    className={`menu_element ${activeMenuItem === 'Удалённые' ? 'active_el' : ''}`}
                    onClick={() => showBlock('Удалённые')}
                >
                    <img style={{ width: "25px", height: "25px", marginLeft: "10px" }} src={AddUserImg} alt="" /> <div className={`menu_text mob ${hideLeftMenu ? "hide" : ""}`}>Удалённые</div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default LeftMenu;