import '../pages/rolePages/adminPage/adminPageStyle.css'
import React, { useState, useEffect, useRef } from "react";

import { fetchDataById, handleEditData, registerManager, registerClient, registerBuyer, registerProduct, formatDateTime, handleDeleteData, registerNotice } from "../common/EditData";
import BucketImg from '../../img/bucket.png'
import EditImg from '../../img/edit.png'

import DatePicker from 'react-datepicker';


import 'react-datepicker/dist/react-datepicker.css';

const LeedInfo = ({
    adminkey,
    dataProducts,
    editClientMode,
    editClientViewMode,
    selectedClient,
    handleClientClick,
    handleEditClient,
    managerIDOptions,
    ManagerStatusOptions,
    handleRegistrationNotice,
    registrationDataNotice,
    handleRegistrationNoticeChange,
    dataNotices,
    selectedNotice,
    handleEditNotice,
    handleNoticeClick,
    setSelectedNotice,
    editNoticeMode,
    leedNotice,
    close,
    handleDeleteNotice,
    closeNoticeEdit,
    setSelectedClient,
    editClientModeMobile,
    handleDataClick,
    editClientModeEmail,
    editClientModeName,
    editClientModeDate,
    editClientModeStatus,
    editClientModeManager,
    editClientModePayment,
    editClientModeProduct,
    editClientModeNotice,
    editClientModeSecondPhone,
    editClientModePaymentCost,
    setEditClientModeEmail,
    setEditClientModeName,
    setEditClientModeDate,
    setEditClientModeStatus,
    setEditClientModeManager,
    setEditClientModeProduct,
    setEditClientModePayment,
    setEditClientModeNotice,
    setEditClientModePaymentCost,
    setEditClientModeSecondPhone,
    closeMobile,
    closeEmail,
    closeName,
    closeDate,
    closeStatus,
    closeManager,
    closeProduct,
    closePayment,
    closePaymentCost,
    closeNotice,
    closeSecondPhone,
    checkedProducts,
    setCheckedProducts,
    paymentArray,
    products,
    handleDeleteClient,
    handleDateChange,
    registrationDataClient,
    setProducts
}) => {
    const [viewEdit, setEditClientMode] = useState(false)
    const [paymentIndex, setPaymentIndex] = useState(0);
    const handleRerender = () => {
        handleDataClick(selectedClient._id, setEditClientMode)
    };

    const fetchDataById = async (id, apiEndpoint, setDataFunction, setEditModeFunction, setCheckedProducts, setPaymentIndex, index) => {
        try {
            //// console.log(id);
            localStorage.setItem('LeedID', id)
            const currentDate = new Date();
            const formattedDateTime = formatDateTime(currentDate);


            const response = await fetch(`${apiEndpoint}?_id=${id}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Ошибка при получении данных: ${errorText}`);
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setDataFunction(data);
                setPaymentIndex(index)
                setEditModeFunction(true);
                setCheckedProducts(data.product || [])

            }
        } catch (error) {
            console.error(`Ошибка при получении данных: ${error}`);
        }
    };



    const handleDataClickPay = async (id, setMode, index) => {
        fetchDataById(id, '/api/getClientData', setSelectedClient, setMode, setCheckedProducts, setPaymentIndex, index);
    }

    const handleQuantityChange = (index, count) => {
        const updatedProducts = selectedClient.product.map((product, i) => {
            if (i === index) {
                const totalPrice = product.cost * count;
                return { ...product, count, totalPrice };
            }
            return product;
        });
        setSelectedClient(prevSelectedClient => ({
            ...prevSelectedClient,
            product: updatedProducts
        }));
    };

    const handleQuantityChangeCost = (index, cost) => {
        const updatedProducts = selectedClient.product.map((product, i) => {
            if (i === index) {

                return { ...product, cost };
            }
            return product;
        });
        setSelectedClient(prevSelectedClient => ({
            ...prevSelectedClient,
            product: updatedProducts
        }));
    };

    const getTotalPrice = (index) => {
        const product = selectedClient.product[index];
        if (product) {
            return product.cost * product.count;
        }
        return 0;
    };

    const handleEditData = async (apiEndpoint, requestData) => {
        try {
            const response = await fetch(apiEndpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
            console.log(JSON.stringify(requestData));

            if (response.ok) {
                alert('Редактирование прошло успешно!')


            } else {
                alert("Не удалось обновить данные. Пожалуйста, попробуйте снова.");
            }
        } catch (error) {
            console.error(`Ошибка при обновлении данных: ${error}`);
        }
    };


    const cancelLeed = async () => {
        // Создаем объект requestData с необходимыми данными
        const requestData = {
            _id: selectedClient._id,
            status: "cancel"
        };

        // Вызываем функцию handleEditData, передавая объект requestData
        await handleEditData('/api/updateClientData', requestData);
    };

    async function deleteProduct(clientId, productIndex, way) {
        try {
            const response = await fetch(`/api/client/${clientId}/${way}/${productIndex}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete product: ${errorMessage}`);
            }
            if (response.ok) {
                const data = await response.json();
                console.log(data)
            }


        } catch (error) {
            // Обработка ошибок
            console.error('Error deleting product:', error.message);
            throw error;
        }
    }



    const noticeArr = dataNotices.filter((notice) => localStorage.getItem('LeedID') === notice.noticeID)


    return (
        <div>
            {editClientViewMode && selectedClient && (
                <>
                    <div className={`overlay ${editClientViewMode && selectedClient ? "active" : ""}`} onClick={close}></div>

                    <div className={`user_modal ${editClientViewMode && selectedClient ? "show" : ""}`} onMouseEnter={handleRerender} >
                        <div className="close" onClick={close}>
                            &times;
                        </div>
                        <div className="user_modal_left_side">
                            <button onClick={handleRerender}>Список продуктов</button>
                            <div className="status_block">
                                <div>Статус: <span onClick={() => handleDataClick(selectedClient._id, setEditClientModeStatus)}>{selectedClient.status}</span> </div> <div>{selectedClient.dateOfCreated}</div>

                            </div>
                            <div className='user_modal_left_main'>
                                <div className='user_modal_left_block'>
                                    <div className="content">
                                        <h3>Про лид</h3>
                                        <label className='el'>Менеджер:</label>
                                        <select
                                            name="managerID"
                                            value={selectedClient.managerID}
                                            onClick={() => handleDataClick(selectedClient._id, setEditClientModeManager)}
                                            required
                                        >
                                            <option value={adminkey}>Я</option>
                                            {managerIDOptions.map((option) => (
                                                <option key={option._id} value={option.managerID}>
                                                    {option.nameManager}
                                                </option>
                                            ))}
                                        </select>

                                        <div className='el' style={{ display: "flex" }}><span>Дата созвона:</span> <div className='leed_el' onClick={() => handleDataClick(selectedClient._id, setEditClientModeDate)}>{formatDateTime(new Date(selectedClient.selectedDate))}</div></div>

                                        <div className='el' style={{ display: "flex" }}>
                                            <span>Заметка:</span>
                                            <div className='leed_el' onClick={() => handleDataClick(selectedClient._id, setEditClientModeNotice)}>
                                                {selectedClient.notice || '(Пусто)'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='user_modal_right_block'>
                                    <div className="content">
                                        <h3>Клиент</h3>
                                        <div className='el' style={{ display: "flex" }}>
                                            <span>Имя:</span>
                                            <div className='leed_el' onClick={() => handleDataClick(selectedClient._id, setEditClientModeName)}>
                                                {selectedClient.clientName || 'Укажите имя'}
                                            </div>
                                        </div>
                                        <div className='el' style={{ display: "flex" }}>
                                            <span>Почта:</span>
                                            <div className='leed_el' onClick={() => handleDataClick(selectedClient._id, setEditClientModeEmail)}>
                                                {selectedClient.email || 'Добавить почту'}
                                            </div>
                                        </div>
                                        <div className='el'><div style={{ display: "flex" }}>
                                            <div><span>Номер телефона:</span></div>
                                            <div onClick={() => handleClientClick(selectedClient._id)} className='leed_el' >{selectedClient.phone || 'Добавить номер телефона'} </div></div>
                                        </div>
                                        <div className='el'><div style={{ display: "flex" }}>
                                            <div><span>Доп. номер телефона:</span></div>
                                            <div onClick={() => handleDataClick(selectedClient._id, setEditClientModeSecondPhone)} className='leed_el' >{selectedClient.secondPhone || 'Добавить номер телефона'} </div></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='leed_el' onClick={() => handleDataClick(selectedClient._id, setEditClientModeProduct)}>
                                <div className='add_pay_btn'>Открыть список продуктов</div>
                            </div>
                            <div style={{ width: "100%" }} className='user_modal_left_block'>
                                <ul className='product_ul'>
                                    <div className='el'>
                                        <div className='title_block'>Товары / Услуги</div>
                                    </div>

                                    {selectedClient.product.map((product, index) => (
                                        <li key={index}>
                                            {product.name} -
                                            <div>
                                                <label htmlFor="">Количество</label>
                                                <input
                                                    className='pruduct_data_input'
                                                    type="number"
                                                    defaultValue={Number(product.count)}
                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                />
                                            </div>
                                            -
                                            <div className='product_ul_el' >
                                                <label htmlFor="">Цена</label>
                                                <input
                                                    className='pruduct_data_input'
                                                    type="number"
                                                    defaultValue={Number(product.cost)}
                                                    onChange={(e) => handleQuantityChangeCost(index, parseInt(e.target.value))}
                                                /> <div className='currency'>₴</div>
                                            </div>
                                            <div><label htmlFor="">Общая цена:</label> {getTotalPrice(index)}</div>
                                            <div onMouseUp={handleRerender} onMouseDown={() => deleteProduct(selectedClient._id, index, 'product')}>
                                                <img className='bucketImg' src={BucketImg} alt="" />
                                            </div>

                                        </li>

                                    ))}
                                </ul>
                                <div className='btn_form_block'>
                                    <button className='register' style={{ width: "120px", marginLeft: "20px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                        Сохранить изменения
                                    </button>
                                </div>
                            </div>

                            <div style={{ width: "100%" }} className='user_modal_left_block payment_block'>
                                <div className='el'> <div className='title_block'>Оплаты</div><div className='add_pay_btn' onClick={() => handleDataClick(selectedClient._id, setEditClientModePayment)}>Добавить оплату</div></div>

                                <ul className='product_ul'>

                                    {Array.isArray(selectedClient.payment) && selectedClient.payment.map((paymentItem, index) => (
                                        <li key={index} >
                                            <div>{paymentItem.paymentStatus || ''}</div>
                                            <div>{paymentItem.paymentMethod || ''}</div>
                                            <div>{paymentItem.cost || ''}</div>
                                            <div>{paymentItem.notice || ''}</div>

                                            <div>{new Date(paymentItem.selectedDate).toLocaleString()}</div>
                                            <div onClick={() => handleDataClickPay(selectedClient._id, setEditClientModePaymentCost, index)}>
                                                <img className='bucketImg' src={EditImg} alt="" />
                                            </div>
                                            <div onMouseUp={handleRerender} onMouseDown={() => deleteProduct(selectedClient._id, index, 'payment')}>
                                                <img className='bucketImg' src={BucketImg} alt="" />
                                            </div>

                                        </li>
                                    ))}
                                </ul>
                            </div>



                            <div className='btn_form_block'>
                                <button className='register' style={{ width: "120px" }} type="button" onClick={() => cancelLeed(selectedClient._id)}>
                                    Отменить лид
                                </button>
                                <button className='register' style={{ width: "120px", backgroundColor: "purple" }} type="button" onClick={() => handleDeleteClient(selectedClient._id)}>
                                    Удалить лид
                                </button>
                            </div>
                        </div>
                        <div className="user_modal_right_side">
                            <div className='notice_container'>
                                <h4>Комментарии:</h4>
                                <ul className='notice_block'>
                                    {noticeArr.map(notice => (
                                        <li key={notice._id} >
                                            <div className='notice_date'>{notice.noticeDate} </div>

                                            <div className='notice_element'>{notice.content}
                                                <div className='edit_btns'>
                                                    <div onClick={() => handleNoticeClick(notice._id)}><img className='bucketImg' src={EditImg} alt="" /></div>
                                                    <div onClick={() => handleDeleteNotice(notice._id)}><img className='bucketImg' src={BucketImg} alt="" /></div>
                                                </div>
                                            </div>

                                        </li>
                                    ))}
                                    <EditNotice selectedNotice={selectedNotice} handleEditNotice={handleEditNotice} editNoticeMode={editNoticeMode} setSelectedNotice={setSelectedNotice} close={closeNoticeEdit}></EditNotice>
                                </ul>
                                <EditMobile close={closeMobile} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeMobile}></EditMobile>
                                <EditEmail close={closeEmail} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeEmail} ></EditEmail>
                                <EditName close={closeName} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeName} ></EditName>
                                <EditDate close={closeDate} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeDate} ></EditDate>
                                <EditStatus close={closeStatus} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeStatus} ></EditStatus>
                                <EditPayment setEditClientMode={setEditClientModePayment} close={closePayment} registrationDataClient={registrationDataClient} handleDateChange={handleDateChange} paymentArray={paymentArray} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModePayment} ></EditPayment>
                                <EditPaymentMode close={closePaymentCost} paymentIndex={paymentIndex} paymentArray={paymentArray} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModePaymentCost}></EditPaymentMode>

                                <EditSecondMobile close={closeSecondPhone} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeSecondPhone}></EditSecondMobile>

                                <EditNoticeMode close={closeNotice} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeNotice}></EditNoticeMode>

                                <EditManager close={closeManager} adminkey={adminkey} managerIDOptions={managerIDOptions} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeManager} ></EditManager>
                                <EditProduct setCheckedProducts={setCheckedProducts} checkedProducts={checkedProducts} close={closeProduct} dataProducts={dataProducts} handleEditClient={handleEditClient} selectedClient={selectedClient} setSelectedClient={setSelectedClient} editClientMode={editClientModeProduct} ></EditProduct>

                                <div className='add_notice'>
                                    <textarea name="content" placeholder='Введите комментарий' value={registrationDataNotice.content} onChange={handleRegistrationNoticeChange} required cols="30" rows="2"></textarea>

                                    <button type="button" onClick={handleRegistrationNotice}>Отправить</button></div>
                            </div>


                        </div>
                    </div>
                </>
            )}
        </div>


    )
}

const EditPayment = ({
    editClientMode,
    setEditClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    paymentArray,
    registrationDataClient,
    close
}) => {

    const handleEditData = async (requestData) => {
        try {
            const response = await fetch('/api/updateClientDataPayment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),

            });
            console.log(JSON.stringify(requestData))
            if (response.ok) {
                setEditClientMode(false)
                return await response.text();
            } else {
                throw new Error('Ошибка при обновлении данных');
            }
        } catch (error) {
            console.error(`Ошибка при обновлении данных: ${error}`);
            throw error;
        }
    };


    const handleDateChange = (date) => {
        if (selectedClient.payment) {
            const newDate = new Date(date); // Преобразуем значение в объект даты
            console.log("Выбрана новая дата:", newDate);
            setSelectedClient({
                ...selectedClient,
                payment: {
                    ...selectedClient.payment,
                    selectedDate: newDate
                }
            });
        }
    };

    const handlePaymentStatusChange = (status) => {
        setSelectedClient({
            ...selectedClient,
            payment: {
                ...selectedClient.payment,
                paymentStatus: status
            }
        });
    };

    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className='input_name'>Оплата:</div>
                                        <select
                                            name="payment"
                                            value={selectedClient.payment.paymentMethod} // Установка значения из объекта payment
                                            onChange={(e) => setSelectedClient({
                                                ...selectedClient,
                                                payment: { ...selectedClient.payment, paymentMethod: e.target.value }// Обновление paymentMethod
                                            })}
                                        >
                                            <option value="">Выберите оплату</option>
                                            {paymentArray.map((buyer) => (
                                                <option key={buyer} value={buyer}>
                                                    {buyer}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className='input_name'>Статус оплаты:</div>
                                        <div>
                                            <div
                                                className={`status_btn ${selectedClient.payment.paymentStatus === "Оплачено" ? "selected" : ""}`}
                                                onClick={() => handlePaymentStatusChange("Оплачено")}
                                            >
                                                Оплачено
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className={`status_btn ${selectedClient.payment.paymentStatus === "Не оплачено" ? "selected" : ""}`}
                                                onClick={() => handlePaymentStatusChange("Не оплачено")}
                                            >
                                                Не оплачено
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <div className='input_name'>Сумма:</div>
                                        <input type="number"
                                            value={selectedClient.payment.cost}
                                            onChange={(e) => setSelectedClient({
                                                ...selectedClient,
                                                payment: { ...selectedClient.payment, cost: e.target.value }
                                            })} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className='input_name'>Заметка:</div>
                                        <input type="textarea"
                                            value={selectedClient.payment.notice}
                                            onChange={(e) => setSelectedClient({
                                                ...selectedClient,
                                                payment: { ...selectedClient.payment, notice: e.target.value }
                                            })} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className='input_name'>Дата оплаты:</div>
                                        <DatePicker
                                            selected={selectedClient.payment.selectedDate}
                                            onChange={handleDateChange}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeInputLabel="Enter Time"
                                            timeIntervals={5}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            shouldCloseOnSelect={false}
                                            placeholderText='Выберите дату'
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditData(selectedClient)}>
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const EditPaymentMode = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    paymentArray,
    paymentIndex,
    close
}) => {


    const handlePaymentStatusChange = (newStatus) => {
        const updatedPayment = { ...selectedClient.payment[paymentIndex], paymentStatus: newStatus };
        const updatedPayments = [...selectedClient.payment];
        updatedPayments[paymentIndex] = updatedPayment;
        setSelectedClient({
            ...selectedClient,
            payment: updatedPayments
        });
    };

    const handlePaymentMethodChange = (newMethod) => {
        const updatedPayment = { ...selectedClient.payment[paymentIndex], paymentMethod: newMethod };
        const updatedPayments = [...selectedClient.payment];
        updatedPayments[paymentIndex] = updatedPayment;
        setSelectedClient({
            ...selectedClient,
            payment: updatedPayments
        });
    };

    const handleDateChange = (newDate) => {
        if (newDate instanceof Date) {
            console.log("newDate is a Date object:", newDate);
            const updatedPayment = { ...selectedClient.payment[paymentIndex], selectedDate: newDate };
            const updatedPayments = [...selectedClient.payment];
            updatedPayments[paymentIndex] = updatedPayment;
            setSelectedClient({
                ...selectedClient,
                payment: updatedPayments
            });
        } else {
            console.error("newDate is not a Date object:", newDate);
        }
    };


    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className='input_name'>Оплата:</div>
                                        <select
                                            value={selectedClient.payment[paymentIndex].paymentMethod}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        >
                                            <option value="">Выберите метод оплаты</option>
                                            {paymentArray.map((method) => (
                                                <option key={method} value={method}>
                                                    {method}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className='input_name'>Статус оплаты:</div>
                                        <div>
                                            <div
                                                className={`status_btn ${selectedClient.payment[paymentIndex].paymentStatus === "Оплачено" ? "selected" : ""}`}
                                                onClick={() => handlePaymentStatusChange("Оплачено")}
                                            >
                                                Оплачено
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className={`status_btn ${selectedClient.payment[paymentIndex].paymentStatus === "Не оплачено" ? "selected" : ""}`}
                                                onClick={() => handlePaymentStatusChange("Не оплачено")}
                                            >
                                                Не оплачено
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input_td">
                                        <div className='input_name'>Сумма</div>
                                        <input
                                            type="number"
                                            name="phone"
                                            value={selectedClient.payment[paymentIndex].cost}
                                            onChange={(e) => {
                                                const newCost = e.target.value;
                                                console.log("Изменяемое значение cost:", newCost);
                                                const updatedPayment = [...selectedClient.payment];
                                                updatedPayment[paymentIndex] = { ...updatedPayment[paymentIndex], cost: newCost };
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    payment: updatedPayment
                                                });
                                            }}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input_td">
                                        <div className='input_name'>Заметка</div>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={selectedClient.payment[paymentIndex].notice}
                                            onChange={(e) => {
                                                const notice = e.target.value;
                                                console.log("Изменяемое значение notice:", notice);
                                                const updatedPayment = [...selectedClient.payment];
                                                updatedPayment[paymentIndex] = { ...updatedPayment[paymentIndex], notice: notice };
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    payment: updatedPayment
                                                });
                                            }}
                                            required
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <div className='input_name'>Дата оплаты</div><br />
                                        <DatePicker
                                            selected={new Date(selectedClient.payment[paymentIndex].selectedDate)}
                                            onChange={date => handleDateChange(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeInputLabel="Enter Time"
                                            timeIntervals={5}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            shouldCloseOnSelect={false}
                                        />

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};



const EditMobile = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>

                            <tbody>

                                <tr>
                                    <td className="input_td">


                                        <input
                                            type="number"
                                            name="phone"
                                            value={selectedClient.phone}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                                            required
                                        />

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>

                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>

                        </div>

                    </form>
                </div>
            )}
        </div>
    )
}

const EditSecondMobile = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>

                            <tbody>

                                <tr>
                                    <td className="input_td">


                                        <input
                                            type="number"
                                            name="phone"
                                            value={selectedClient.secondPhone}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, secondPhone: e.target.value })}
                                            required
                                        />

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>

                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>

                        </div>

                    </form>
                </div>
            )}
        </div>
    )
}

const EditNoticeMode = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>

                            <tbody>

                                <tr>
                                    <td className="input_td">


                                        <input
                                            type="text"
                                            name="notice"
                                            value={selectedClient.notice}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, notice: e.target.value })}
                                            required
                                        />

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>

                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>

                        </div>

                    </form>
                </div>
            )}
        </div>
    )
}

const EditProduct = ({
    dataProducts,
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close,
    checkedProducts,
    setCheckedProducts
}) => {

    useEffect(() => {
        setSelectedClient(prevSelectedClient => ({ ...prevSelectedClient, product: checkedProducts }));
        console.log(checkedProducts)
    }, [checkedProducts]);

    const handleCheckboxChange = (productId, productName, productCost, productCount) => {
        const productIndex = checkedProducts.findIndex(item => item._id === productId && item.name === productName && item.cost === productCost && item.count === productCount);

        if (productIndex !== -1) {
            setCheckedProducts(prevCheckedProducts => prevCheckedProducts.filter((item, index) => index !== productIndex));
        } else {
            setCheckedProducts(prevCheckedProducts => [...prevCheckedProducts, { _id: productId, name: productName, cost: productCost, count: productCount }]);
        }
    };

    const isChecked = (productId, productName, productCost, productCount) => {
        console.log(checkedProducts.some(item => item._id === productId && item.name === productName && item.cost === productCost && item.count === productCount))
        return checkedProducts.some(item => item._id === productId && item.name === productName && item.cost === productCost && item.count === productCount);
    };

    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                {dataProducts.map((option) => (
                                    <tr key={option._id}>
                                        <td>{option.name}</td>
                                        <td>{option.cost}</td>
                                        <td>{option.count}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={isChecked(option._id, option.name, option.cost, option.count)}
                                                onChange={() => handleCheckboxChange(option._id, option.name, option.cost, option.count)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id, checkedProducts)}>
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}




const EditEmail = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="input_td">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={selectedClient.email}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                                            required
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const EditName = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="input_td">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={selectedClient.clientName}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, clientName: e.target.value })}
                                            required
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const EditManager = ({
    adminkey,
    managerIDOptions,
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="input_td">
                                        <select
                                            name="managerID"
                                            value={selectedClient.managerID}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, managerID: e.target.value })}
                                            required
                                        >
                                            <option value={adminkey}>Я</option>
                                            {managerIDOptions.map((option) => (
                                                <option key={option._id} value={option.managerID}>
                                                    {option.nameManager}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const EditStatus = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="input_td">
                                        <select
                                            name="status"
                                            value={selectedClient.status}
                                            onChange={(e) => setSelectedClient({ ...selectedClient, status: e.target.value })}
                                            required
                                        >
                                            <option value="new">Потенциальный</option>
                                            <option value="in_processing">Я подумаю,наберать систематично</option>
                                            <option value="agreed">Договорились, но не отгрузили</option>
                                            <option value="successful">Успешный</option>
                                            <option value="return">Клиент купил на стороне. Вернуть!</option>
                                            <option value="nds">НДС</option>
                                            <option value="wholesale">Опт</option>
                                            <option value="cancel">Отменённый</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const EditDate = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close
}) => {

    return (
        <div>
            {editClientMode && selectedClient && (
                <div style={{ display: "block", backgroundColor: "#b2abab" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td className="input_td">
                                        <DatePicker
                                            selected={selectedClient.selectedDate ? new Date(selectedClient.selectedDate) : null}
                                            onChange={(date) => setSelectedClient({ ...selectedClient, selectedDate: date })}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeInputLabel="Enter Time"
                                            timeIntervals={5}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            shouldCloseOnSelect={false}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>
                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}




const EditForm = ({
    adminkey,
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    managerIDOptions,
    ManagerStatusOptions,
    handleDeleteClient,
    registrationDataClient,
    handleRegistrationClientChange,
    dataProducts,
    paymentArray,
    handleDateChange,

    close }) => {

    return (
        <div>
            {editClientMode && selectedClient && (
                <div>
                    <div className={`overlay ${editClientMode && selectedClient ? "active" : ""}`} onClick={close}></div>
                    <div className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                        <div className="close" onClick={close}>
                            &times;
                        </div>

                        <form className='client_reg_form'>
                            <h2 className='leed_head_txt'>Редактирование лида</h2>


                            <div >
                                <h3 style={{ color: "#445486" }}>Контактная информация</h3>
                                <div className='client_info'>
                                    <div className='client_info_left'>
                                        <div className="input_td">
                                            <div className='input_name'>Имя:</div>
                                            <input
                                                type="text"
                                                name="clientName"
                                                value={selectedClient.clientName}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, clientName: e.target.value })}
                                                required
                                            /></div>

                                        <div className="input_td">
                                            <div className='input_name'>Email:</div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={selectedClient.email}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='client_info_right'>
                                        <div className="input_td">
                                            <div className='input_name'>Номер телефона:</div>
                                            <input
                                                type="number"
                                                name="phone"
                                                value={selectedClient.phone}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="input_td">
                                            <div className='input_name'>Второй номер телефона:</div>
                                            <input
                                                type="number"
                                                name="secondPhone"
                                                value={selectedClient.secondPhone}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, secondPhone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <h3 style={{ color: "#445486" }}>Дополнительная информация</h3>
                                    <div className='client_info'>
                                        <div className='client_info_left'>
                                            <div className="input_td">
                                                <div className='input_name'>Менеджер:</div>
                                                <select
                                                    name="managerID"
                                                    value={selectedClient.managerID}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, managerID: e.target.value })}
                                                    required
                                                >
                                                    <option value={adminkey}>Я</option>
                                                    {managerIDOptions.map((option) => (
                                                        <option key={option._id} value={option.managerID}>
                                                            {option.email}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='input_td'>
                                                <div className='input_name'>Статус:</div>
                                                <select
                                                    name="status"
                                                    value={selectedClient.status}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, status: e.target.value })}
                                                    required
                                                >
                                                    <option value="new">Потенциальный</option>
                                                    <option value="in_processing">Я подумаю,наберать систематично</option>
                                                    <option value="agreed">Договорились, но не отгрузили</option>
                                                    <option value="successful">Успешный</option>
                                                    <option value="return">Клиент купил на стороне. Вернуть!</option>
                                                    <option value="nds">НДС</option>
                                                    <option value="wholesale">Опт</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='client_info_right'>
                                            <div className='input_td'>
                                                <div className='input_name'>Продукт:</div>
                                                <select
                                                    name="product"
                                                    value={selectedClient.product}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, product: e.target.value })}
                                                >
                                                    <option value="">Выберите продукт</option>
                                                    {dataProducts.map((buyer) => (
                                                        <option key={buyer._id} value={buyer.name}>
                                                            {buyer.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='input_td'>
                                                <div className='input_name'>Оплата:</div>
                                                <select
                                                    name="payment"
                                                    value={selectedClient.payment}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, payment: e.target.value })}
                                                >
                                                    <option value="">Выберите оплату</option>
                                                    {paymentArray.map((buyer) => (
                                                        <option key={buyer} value={buyer}>
                                                            {buyer}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='input_td'>
                                                <div className='input_name'>Дата созвона:</div>
                                                <DatePicker
                                                    selected={selectedClient.selectedDate ? new Date(selectedClient.selectedDate) : null}
                                                    onChange={(date) => setSelectedClient({ ...selectedClient, selectedDate: date })}
                                                    showTimeSelect
                                                    timeFormat="HH:mm" // Формат времени 24 часа
                                                    timeInputLabel="Enter Time"
                                                    timeIntervals={5}
                                                    dateFormat="MMMM d, yyyy HH:mm" // Формат даты с часами в 24-часовом формате
                                                    shouldCloseOnSelect={false} // Включаем возможность ввода времени с клавиатуры
                                                />







                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div>

                                <div>

                                </div>

                            </div>
                            <div className="btn_form_block">
                                <button className='register' style={{ width: "120px", backgroundColor: "purple" }} type="button" onClick={() => handleDeleteClient(selectedClient._id)}>
                                    Удалить лид
                                </button>
                                <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                    Сохранить изменения
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

const EditFormBuyer = ({
    editClientMode,
    handleDeleteClient,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    managerIDOptions,
    ManagerStatusOptions,
    close }) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <><div className={`overlay ${editClientMode && selectedClient ? "active" : ""}`} onClick={close}></div>

                    <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                        <div className="close" onClick={close}>
                            &times;
                        </div>

                        <form>
                            <h3 style={{ textAlign: "center" }}>Редактирование данных покупателя: {selectedClient.name}</h3>

                            <table style={{ width: "100%" }}>

                                <tbody>

                                    <tr>
                                        <td className="input_td">
                                            <div>Имя:</div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedClient.name}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Email:</div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={selectedClient.email}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Номер телефона:</div>
                                            <input
                                                type="number"
                                                name="phone"
                                                value={selectedClient.phone}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Заметка:</div>
                                            <input
                                                type="text"
                                                name="notice"
                                                value={selectedClient.notice}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, notice: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Менеджер:</div>
                                            <select
                                                name="managerID"
                                                value={selectedClient.managerID}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, managerID: e.target.value })}
                                                required
                                            >
                                                {managerIDOptions.map((option) => (
                                                    <option key={option._id} value={option.managerID}>
                                                        {option.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='btn_form_block'>
                                <button className='register' style={{ width: "120px", backgroundColor: "purple" }} type="button" onClick={() => handleDeleteClient(selectedClient._id)}>
                                    Удалить
                                </button>
                                <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient.id)}>
                                    Сохранить изменения
                                </button>

                            </div>

                        </form>
                    </div></>
            )}
        </div>
    )
}

const EditFormTask = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    close }) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <>
                    <div className={`overlay ${editClientMode && selectedClient ? "active" : ""}`} onClick={close}></div>

                    <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>
                        <div className="close" onClick={close}>
                            &times;
                        </div>

                        <form>
                            <table style={{ width: "100%" }}>

                                <tbody>

                                    <tr>
                                        <td className="input_td">
                                            <div>Статус:</div>

                                            <select
                                                name="taskStatus"
                                                value={selectedClient.taskStatus}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, taskStatus: e.target.value })}
                                            >
                                                <option value="false">Не выполнено</option>
                                                <option value="true">Выполнено</option>


                                            </select>
                                        </td>


                                    </tr>
                                </tbody>
                            </table>
                            <div className='btn_form_block'>

                                <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient._id)}>
                                    Сохранить изменения
                                </button>

                            </div>

                        </form>
                    </div></>
            )}
        </div>
    )
}

const EditNotice = ({
    editNoticeMode,
    setSelectedNotice,
    selectedNotice,
    handleEditNotice,
    close }) => {
    return (
        <div>
            {editNoticeMode && selectedNotice && (
                <div style={{ display: "block" }} className={`user_modal ${editNoticeMode && selectedNotice ? "show" : ""}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>

                    <form>
                        <table style={{ width: "100%" }}>

                            <tbody>

                                <tr>
                                    <td className="input_td">


                                        <input
                                            type="text"
                                            name="phone"
                                            value={selectedNotice.content}
                                            onChange={(e) => setSelectedNotice({ ...selectedNotice, content: e.target.value })}
                                            required
                                        />

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div className='btn_form_block'>

                            <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditNotice(selectedNotice._id)}>
                                Сохранить изменения
                            </button>

                        </div>

                    </form>
                </div>
            )}
        </div>
    )
}

const EditFormProduct = ({
    editClientMode,
    setSelectedClient,
    selectedClient,
    handleEditClient,
    handleDeleteClient,
    close }) => {
    return (
        <div>
            {editClientMode && selectedClient && (
                <>
                    <div className={`overlay ${editClientMode && selectedClient ? "active" : ""}`} onClick={close}></div>
                    <div style={{ display: "block" }} className={`user_modal ${editClientMode && selectedClient ? "show" : ""}`}>

                        <h3 style={{ textAlign: "center" }}>Редактирование продукта: {selectedClient.name}</h3>
                        <div className="close" onClick={close}>
                            &times;
                        </div>

                        <form >
                            <table style={{ width: "100%" }}>
                                <tbody>

                                    <tr>
                                        <td className="input_td">
                                            <div>Наименование:</div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedClient.name}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Цена:</div>
                                            <input
                                                type="number"
                                                name="cost"
                                                value={selectedClient.cost}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, cost: e.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="input_td">
                                            <div>Количество:</div>
                                            <input
                                                type="number"
                                                name="count"
                                                value={selectedClient.count}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, count: e.target.value })}
                                                required
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="btn_form_block">
                                <button className='register' style={{ width: "120px", backgroundColor: "purple" }} type="button" onClick={() => handleDeleteClient(selectedClient._id)}>
                                    Удалить
                                </button>
                                <button className='register' style={{ width: "120px" }} type="button" onClick={() => handleEditClient(selectedClient.id)}>
                                    Сохранить изменения
                                </button>

                            </div>

                        </form>
                    </div></>
            )}
        </div>
    )
}


const LeedInfoClose = ({
    adminkey,
    editClientMode,
    editClientViewMode,
    selectedClient,
    handleClientClick,
    handleEditClient,
    managerIDOptions,
    ManagerStatusOptions,
    handleRegistrationNotice,
    registrationDataNotice,
    handleRegistrationNoticeChange,
    dataNotices,
    selectedNotice,
    handleEditNotice,
    handleNoticeClick,
    setSelectedNotice,
    editNoticeMode,
    leedNotice,
    close,
    handleDeleteNotice,
    closeNoticeEdit
}) => {
    const [viewEdit, setViewEdit] = useState(false)

    const view = () => {
        setViewEdit(true)
    }

    const noticeArr = dataNotices.filter((notice) => localStorage.getItem('LeedID') === notice.noticeID)


    return (
        <div>
            {editClientViewMode && selectedClient && (
                <>
                    <div className={`overlay ${editClientViewMode && selectedClient ? "active" : ""}`} onClick={close}></div>

                    <div className={`user_modal ${editClientViewMode && selectedClient ? "show" : ""}`}>
                        <div className="close" onClick={close}>
                            &times;
                        </div>
                        <div className="user_modal_left_side">

                            <div className="status_block">
                                <div>Статус: <span>{selectedClient.status}</span> </div> <div>{selectedClient.dateOfCreated}</div>

                            </div>
                            <div className='user_modal_left_main'>
                                <div className='user_modal_left_block'>
                                    <div className="content">
                                        <h3>Про лид</h3>
                                        <label className='el'>Менеджер:</label>
                                        <select
                                            name="managerID"
                                            value={selectedClient.managerID}
                                            required
                                        >
                                            <option value={adminkey}>Я</option>
                                            {managerIDOptions.map((option) => (
                                                <option key={option._id} value={option.managerID}>
                                                    {option.nameManager}
                                                </option>
                                            ))}
                                        </select>

                                        <div className='el'><span>Продукт:</span> {selectedClient.product}</div>
                                        <div className='el'><span>Оплата:</span> {selectedClient.payment}</div>
                                        <div className='el'><span>Дата созвона:</span> {formatDateTime(new Date(selectedClient.selectedDate))}</div>
                                    </div>

                                </div>
                                <div className='user_modal_right_block'>
                                    <div className="content">
                                        <h3>Клиент</h3>
                                        <div className='el' onClick={view}><span>Имя:</span> {selectedClient.clientName}</div>
                                        <div className='el'><span>Почта:</span> {selectedClient.email}</div>
                                        <div className='el'><div style={{ display: "flex" }}><div><span>Номер телефона:</span></div> <div style={{ marginLeft: "10px" }}>{selectedClient.phone} <br /> {selectedClient.secondPhone}</div></div></div>
                                    </div>
                                </div>
                            </div>



                        </div>
                        <div className="user_modal_right_side">
                            <div className='notice_container'>
                                <h4>Комментарии:</h4>
                                <ul className='notice_block'>
                                    {noticeArr.map(notice => (
                                        <li key={notice._id} >
                                            <div className='notice_date'>{notice.noticeDate} </div>

                                            <div className='notice_element'>{notice.content}</div>
                                            <div onClick={() => handleNoticeClick(notice._id)}>Редактировать</div>
                                            <div onClick={() => handleDeleteNotice(notice._id)}>Удалить</div>

                                        </li>
                                    ))}
                                    <EditNotice selectedNotice={selectedNotice} handleEditNotice={handleEditNotice} editNoticeMode={editNoticeMode} setSelectedNotice={setSelectedNotice} close={closeNoticeEdit}></EditNotice>

                                </ul>

                                <div className='add_notice'>
                                    <textarea name="content" placeholder='Введите комментарий' value={registrationDataNotice.content} onChange={handleRegistrationNoticeChange} required cols="30" rows="2"></textarea>

                                    <button type="button" onClick={handleRegistrationNotice}>Отправить</button></div>
                            </div>


                        </div>
                    </div>
                </>
            )}
        </div>


    )
}
// ClientRegistrationForm.js

const ClientRegistrationForm = ({
    addLeedMode,
    adminKey,
    close,
    registrationDataClient,
    handleRegistrationClientChange,
    handleDateChange,
    dataBuyers,
    dataProducts,
    paymentArray,
    handleRegistrationClient,
    setRegistrationDataClient
}) => {
    const [secondPhone, setSecondPhone] = useState(false)

    const openSecondPhoneBlock = () => {
        setSecondPhone(true)
    }

    const closeSecondPhoneBlock = () => {
        setSecondPhone(false)
    }

    return (
        addLeedMode && (
            <>
                <div className={`overlay ${addLeedMode ? "active" : ""}`} onClick={close}></div>

                <div style={{ backgroundColor: "#fff" }} className={`user_modal ${addLeedMode ? 'show' : ''}`}>
                    <form className='client_reg_form'>
                        <h2 className='leed_head_txt'>Создание лида</h2>
                        <div className="close" onClick={close}>
                            &times;
                        </div>
                        {secondPhone && <div>
                            <div style={{ backgroundColor: "#fff", border: "3px solid", top: "39%", width: "20%", left: "64%" }} className={`user_modal ${addLeedMode ? 'show' : ''}`}>
                                <div className="close" onClick={closeSecondPhoneBlock}>
                                    &times;
                                </div>
                                <div className="input_td"><div className='input_name'>Второй номер</div><input type="number" name="secondPhone" value={registrationDataClient.secondPhone} onChange={handleRegistrationClientChange} required /></div>

                            </div>
                        </div>}

                        <div>
                            <h3 style={{ color: "#445486" }}>Контактная информация</h3>
                            <div className='client_info'>

                                <div className='client_info_left'>
                                    <div className="input_td"><div className='input_name'>Имя<span style={{ color: "red" }}>*</span></div><input type="text" name="clientName" value={registrationDataClient.clientName} onChange={handleRegistrationClientChange} required /></div>

                                    <div className="input_td"><div className='input_name'>Email</div><input type="email" name="email" value={registrationDataClient.email} onChange={handleRegistrationClientChange} required /></div>

                                </div>
                                <div className='client_info_right'>
                                    <div className="input_td"><div style={{ position: "relative" }} className='input_name'>Номер телефона<span style={{ color: "red" }}>*</span><div className='open_second_number' onClick={openSecondPhoneBlock}>+</div></div><input type="number" name="phone" value={registrationDataClient.phone} onChange={handleRegistrationClientChange} required /></div>
                                    <div className="input_td">
                                        <div className='input_name'>Покупатель:</div>
                                        <select
                                            name="buyerID"
                                            value={registrationDataClient.buyerID}
                                            onChange={(e) => {
                                                const selectedBuyer = dataBuyers.find((buyer) => buyer.email === e.target.value);
                                                handleRegistrationClientChange(e);
                                                setRegistrationDataClient((prevData) => ({
                                                    ...prevData,
                                                    clientName: selectedBuyer.name,
                                                    email: selectedBuyer.email,
                                                    phone: selectedBuyer.phone,
                                                }));
                                            }}
                                        >
                                            <option value="">Выберите покупателя из базы</option>
                                            {dataBuyers.map((buyer) => (
                                                <option key={buyer._id} value={buyer.email}>
                                                    {buyer.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div>
                            <h3 style={{ color: "#445486" }}>Дополнительная информация</h3>
                            <div className='client_info'>
                                <div className='client_info_left'>
                                    <div className="input_td">
                                        <div className='input_name'>Дата созвона:</div>
                                        <DatePicker
                                            className='input_date'
                                            selected={registrationDataClient.selectedDate}
                                            onChange={handleDateChange}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={5}
                                            dateFormat="MMMM d, yyyy HH:mm"
                                            placeholderText='Выберите дату'

                                        />
                                    </div>

                                </div>
                                <div className='client_info_right'>
                                    <div className="input_td">

                                        <div className='input_name'>Статус:</div>
                                        <select name="status" value={registrationDataClient.status} onChange={handleRegistrationClientChange}>
                                            <option value="new">Потенциальный</option>
                                            <option value="in_processing">Я подумаю,наберать систематично</option>
                                            <option value="agreed">Договорились, но не отгрузили</option>
                                            <option value="successful">Успешный</option>
                                            <option value="return">Клиент купил на стороне. Вернуть!</option>
                                            <option value="nds">НДС</option>
                                            <option value="wholesale">Опт</option>
                                        </select>
                                    </div>
                                </div>
                            </div>



                            <div style={{ display: "none" }} className="input_td">
                                <div>Role:</div>
                                <select name="role" value={registrationDataClient.role} onChange={handleRegistrationClientChange}>
                                    <option value=""></option>
                                    <option value="client">Client</option>
                                </select>
                            </div>

                        </div>


                        <button className='register' type="button" onClick={handleRegistrationClient}>
                            Добавить
                        </button>


                    </form>

                </div>
            </>
        )
    );
};

const TaskForm = ({ selectedManager, registrationDataTask, handleRegistrationTaskChange, handleRegistrationTask }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    return (
        <>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td className='input_td'>
                                <div>Задание</div>
                                <input type="text" name="taskLine" value={registrationDataTask.taskLine} onChange={handleRegistrationTaskChange} required />
                                <input style={{ display: "none" }} type="text" name="managerID" value={registrationDataTask.managerID = selectedManager.managerID} onChange={handleRegistrationTaskChange} required />
                                <input className="date" type="date" placeholder='Дата начала' value={registrationDataTask.startDate = startDate} onInput={handleStartDateChange} onChange={handleRegistrationTaskChange} />
                                <input className="date" type="date" placeholder='Дата конца' value={registrationDataTask.endDate = endDate} onInput={handleEndDateChange} onChange={handleRegistrationTaskChange} />

                            </td>
                        </tr>
                    </tbody>
                    <button className='register' type="button" onClick={handleRegistrationTask}>
                        Добавить
                    </button>
                </table>
            </div>

        </>
    )
}


const TaskFormRegister = ({ close, editTaskMode, registrationDataTask, handleRegistrationTaskChange, handleRegistrationTask }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    return (
        editTaskMode && <>
            <div className={`overlay ${editTaskMode ? "active" : ""}`} onClick={close}></div>
            <div style={{ display: "block" }} className={`user_modal ${editTaskMode ? "show" : ""}`}>
                <div className="close" onClick={close}>
                    &times;
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td className='input_td'>
                                <div>Задание</div>
                                <input type="text" name="taskLine" value={registrationDataTask.taskLine} onChange={handleRegistrationTaskChange} required />
                                <input className="date" type="date" value={registrationDataTask.startDate = startDate} onInput={handleStartDateChange} onChange={handleRegistrationTaskChange} />
                                <input className="date" type="date" value={registrationDataTask.endDate = endDate} onInput={handleEndDateChange} onChange={handleRegistrationTaskChange} />

                            </td>
                        </tr>
                    </tbody>
                    <button className='register' type="button" onClick={handleRegistrationTask}>
                        Добавить
                    </button>
                </table>
            </div>

        </>
    )
}

const EditManagerForm = ({
    editMode,
    selectedManager,
    handleEditManager,
    setSelectedManager,
    close,
    registrationDataTask,
    handleRegistrationTaskChange,
    handleRegistrationTask
}) => {
    const [taskMode, setTaskMode] = useState(null)
    const toggleTaskMode = () => {
        setTaskMode((prevMode) => {
            return prevMode === "edit" ? null : "edit";
        });
    };
    return (
        editMode && selectedManager && (
            <div>
                <div className={`overlay ${editMode && selectedManager ? "active" : ""}`} onClick={close}></div>

                <div style={{ display: "block" }} className={`user_modal ${editMode ? 'show' : ''}`}>
                    <div className="close" onClick={close}>
                        &times;
                    </div>
                    <form >
                        <table style={{ width: "100%" }}>
                            <h3>Редактирование данных менеджера: {selectedManager.email}</h3>

                            <tbody>

                                <tr>
                                    <td className="input_td">
                                        <div>Имя:</div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={selectedManager.nameManager}
                                            onChange={(e) => setSelectedManager({ ...selectedManager, nameManager: e.target.value })}
                                            required
                                        />
                                    </td>
                                    <td className="input_td">
                                        <div>Email:</div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={selectedManager.email}
                                            onChange={(e) => setSelectedManager({ ...selectedManager, email: e.target.value })}
                                            required
                                        />
                                    </td>
                                    <td className="input_td">
                                        <div>Пароль:</div>
                                        <input
                                            type="text"
                                            name="password"
                                            value={selectedManager.password}
                                            onChange={(e) => setSelectedManager({ ...selectedManager, password: e.target.value })}
                                            required
                                        />
                                    </td>
                                    <td className="input_td">
                                        <div className='register add_task' onClick={toggleTaskMode}>Добавить задачу</div>
                                    </td>
                                    {taskMode &&
                                        <TaskForm selectedManager={selectedManager} registrationDataTask={registrationDataTask} handleRegistrationTaskChange={handleRegistrationTaskChange} handleRegistrationTask={handleRegistrationTask} />
                                    }
                                </tr>
                            </tbody>

                            <button type="button" className='register' style={{ width: "150px" }} onClick={() => handleEditManager(selectedManager.id)}>
                                Сохранить изменения
                            </button>
                        </table>
                    </form>
                </div>
            </div>
        )
    );
};

export default ClientRegistrationForm;

export { LeedInfoClose, EditForm, EditFormBuyer, EditFormProduct, LeedInfo, ClientRegistrationForm, EditManagerForm, EditFormTask, TaskFormRegister };