import React, { useState, useEffect, useRef } from "react";
import { EditForm, LeedInfo } from "../../../forms/editForm";
import handleClientClicks from '../../../common/Click'
import ClockImg from '../../../../img/clock.png'
import ClientImg from '../../../../img/client.png'
import ManagerImg from '../../../../img/manager.png'
import EditImg from '../../../../img/edit.png'
import UpdateImg from '../../../../img/update.png'
import { formatDateTime } from "../../../common/EditData";

const View = ({
  data,
  handleDataClick,
  setMyDataLeed,
  handleNoticeClick,
  keyManage,
  handleClientClick,
  editClientMode,
  setSelectedClient,
  selectedClient,
  handleEditClient,
  managerIDOptions,
  ManagerStatusOptions,
  registrationDataClient,
  handleRegistrationClientChange,
  handleEditNotice,
  selectedNotice,
  dataProducts,
  handleClientDoubleClick,
  editClientViewMode,
  handleDeleteClient,
  handleRegistrationNotice,
  registrationDataNotice,
  handleRegistrationNoticeChange,
  dataNotices,
  paymentArray,
  handleDateChange,
  hasUncompletedTaskToday,
  dataManagers,
  close,
  taskToday,
  setSelectedNotice,
  editNoticeMode,
  setStatusFilter,
  setLoadedItems,
  setStatusFilterInProcessing,
  setLoadedItemsInProcessing,
  setStatusFilterAgreed,
  setLoadedItemsAgreed,
  setStatusFilterSuccesful,
  setLoadedItemsSuccesful,
  setStatusFilterReturn,
  setLoadedItemsReturn,
  setStatusFilterNds,
  setLoadedItemsNds,
  setStatusFilterWholesale,
  setLoadedItemsWholesale,
  setStatusFilterCancel,
  setLoadedItemsCancel,
  filterBlock,
  leedNotice,
  closeNoticeEdit,
  handleDeleteNotice,
  myDataLeed,
  closeFilter,
  cancelSort,
  sortActivated,
  setSortActivated,
  sortedData,
  setSortedData,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setEditClientModeEmail,
  setEditClientModeName,
  setEditClientModeDate,
  setEditClientModeStatus,
  setEditClientModeManager,
  setEditClientModeProduct,
  setEditClientModePayment,
  setEditClientModePaymentCost,
  setEditClientModeSecondPhone,
  setEditClientModeNotice,
  editClientModeMobile,
  editClientModeEmail,
  editClientModeName,
  editClientModeDate,
  editClientModeStatus,
  editClientModeManager,
  editClientModeProduct,
  editClientModeNotice,
  editClientModePayment,
  editClientModePaymentCost,
  editClientModeSecondPhone,
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
  products,
  setProducts,
  addPayment
}) => {
  const myData = data.filter((person) => keyManage === person.managerKey || keyManage === person.managerID);
  // console.log(myDataLeed)
  const [visibleItemsNew, setVisibleItemsNew] = useState(5);
  const [visibleItemsInProcessing, setVisibleItemsInProcessing] = useState(5);
  const [visibleItemsAgreed, setVisibleItemsAgreed] = useState(5);
  const [visibleItemsSuccessful, setVisibleItemsSuccessful] = useState(5);
  const [visibleItemsReturn, setVisibleItemsReturn] = useState(5);
  const [visibleItemsNds, setVisibleItemsNds] = useState(5);
  const [visibleItemsWholesale, setVisibleItemsWholesale] = useState(5);
  const [visibleItemsCancel, setVisibleItemsCancel] = useState(100);
  const [reversed, setReversed] = useState(false);
  const [checkedItems, setCheckedItems] = useState(true);
  const [editClientPending, setEditClientPending] = useState(false);



  const [activeMenuItem, setActiveMenuItem] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })

  const [showCancelStatus, setShowCancelStatus] = useState(false);

  const [draggedItem, setDraggedItem] = useState(null);

  const newStatusColsRef = useRef(null);
  const inProcessingStatusColsRef = useRef(null);
  const agreedStatusColsRef = useRef(null)
  const succesfulStatusColsRef = useRef(null)
  const returnStatusColsRef = useRef(null)
  const ndsStatusColsRef = useRef(null)
  const wholesaleStatusColsRef = useRef(null)
  const cancelStatusColsRef = useRef(null)

  useEffect(() => {
    sortDateToday();
  }, []);

  const filteredData = () => {
    let filtered = sortActivated ? sortedData : myDataLeed;

    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.dateOfCreated) >= new Date(startDate) &&
          new Date(item.dateOfCreated) <= new Date(endDate)
      );
    }

    return filtered;
  };

  const status = (statusType) => {
    return filteredDataWithCheckboxes().filter(
      (person) => statusType === person.status
    );
  };

  const handleScroll = (ref, setVisibleItems) => {
    const element = ref.current;
    if (element.scrollHeight - element.scrollTop < 1.3 * element.clientHeight) {
      setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
    }
  };

  useEffect(() => {
    const newStatusElement = newStatusColsRef.current;
    const inProcessingStatusElement = inProcessingStatusColsRef.current;
    const agreedStatusElement = agreedStatusColsRef.current;
    const successfulStatusElement = succesfulStatusColsRef.current;
    const returnStatusElement = returnStatusColsRef.current;
    const ndsStatusElement = ndsStatusColsRef.current;
    const wholesaleStatusElement = wholesaleStatusColsRef.current;
    const cancelStatusElement = cancelStatusColsRef.current;


    newStatusElement.addEventListener("scroll", () => handleScroll(newStatusColsRef, setVisibleItemsNew));
    inProcessingStatusElement.addEventListener("scroll", () => handleScroll(inProcessingStatusColsRef, setVisibleItemsInProcessing));
    agreedStatusElement.addEventListener("scroll", () => handleScroll(agreedStatusColsRef, setVisibleItemsAgreed));
    successfulStatusElement.addEventListener("scroll", () => handleScroll(succesfulStatusColsRef, setVisibleItemsSuccessful));
    returnStatusElement.addEventListener("scroll", () => handleScroll(returnStatusColsRef, setVisibleItemsReturn));
    ndsStatusElement.addEventListener("scroll", () => handleScroll(ndsStatusColsRef, setVisibleItemsNds));
    wholesaleStatusElement.addEventListener("scroll", () => handleScroll(wholesaleStatusColsRef, setVisibleItemsWholesale));
    // cancelStatusElement.addEventListener("scroll", () => handleScroll(cancelStatusColsRef, setVisibleItemsCancel));
    return () => {
      newStatusElement.removeEventListener("scroll", () => handleScroll(newStatusColsRef, setVisibleItemsNew));
      inProcessingStatusElement.removeEventListener("scroll", () => handleScroll(inProcessingStatusColsRef, setVisibleItemsInProcessing));
      agreedStatusElement.removeEventListener("scroll", () => handleScroll(agreedStatusColsRef, setVisibleItemsAgreed));
      successfulStatusElement.removeEventListener("scroll", () => handleScroll(succesfulStatusColsRef, setVisibleItemsSuccessful));
      returnStatusElement.removeEventListener("scroll", () => handleScroll(returnStatusColsRef, setVisibleItemsReturn));
      ndsStatusElement.removeEventListener("scroll", () => handleScroll(ndsStatusColsRef, setVisibleItemsNds));
      wholesaleStatusElement.removeEventListener("scroll", () => handleScroll(wholesaleStatusColsRef, setVisibleItemsWholesale));
      // cancelStatusElement.removeEventListener("scroll", () => handleScroll(cancelStatusColsRef, setVisibleItemsCancel));

    };
  }, [setVisibleItemsNew, setVisibleItemsInProcessing, setVisibleItemsAgreed, setVisibleItemsCancel]);

  useEffect(() => {
    if (selectedClient && editClientPending) {
      handleEditClient(selectedClient);
      handleLoadMoreWithStatusFilterLoad('new', setStatusFilter, setLoadedItems)
      setEditClientPending(false);
    }
  }, [selectedClient, editClientPending]);

  const handleDragStart = (event, item) => {
    setDraggedItem(item._id);
  };

  const handleDrop = (event, statusType) => {
    event.preventDefault();
    const clientID = draggedItem;

    const updatedData = myDataLeed.map(item => {
      if (item._id === clientID) {
        setSelectedClient({ ...item, status: statusType });
        return { ...item, status: statusType };
      }
      return item;
    });

    setMyDataLeed(updatedData);
    setEditClientPending(true); // Устанавливаем флаг ожидания обработки
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  let lastTapTime = 0;

  // function handleClientClicks(clientId) {
  //   const currentTime = new Date().getTime();
  //   const tapDelay = 300;

  //   if (currentTime - lastTapTime < tapDelay) {
  //     handleClientDoubleClick(clientId);
  //   } else {
  //     setTimeout(() => {
  //       if (new Date().getTime() - lastTapTime >= tapDelay) {
  //         console.log("One!")
  //       }
  //     }, tapDelay);
  //   }

  //   lastTapTime = currentTime;
  // }

  const renderStatusElements = (statusType, ref, visibleItems) => {
    return status(statusType)
      .slice(0, visibleItems)
      .map((client) => (
        <li
          className="statusColsElement"
          key={client._id}
          onClick={() => handleClientClicks(client._id, handleClientDoubleClick)}
          draggable
          onDragStart={(event) => handleDragStart(event, client)}
        >
          <div className="managers_name_block">
            <img className="clock_img" src={ManagerImg} alt="" />
            {dataManagers.map((el) => {
              if (el.managerID === client.managerID) {
                return <div>{el.nameManager}</div>;
              }
            })}
          </div>
          <div
            className={`date_name_block ${hasUncompletedTaskToday.some((el) => el.email === client.email) ? "uncompleted_tasks" : ""
              }`}
            id={`${taskToday.some((el) => el.email === client.email) ? "today_tasks" : "asd"}`}
          >
            <img className={`clock_img `} src={ClockImg} alt="" />
            {formatDateTime(new Date(client.selectedDate))}
          </div>
          <div className="client_name_block">
            <img className="clock_img" src={ClientImg} alt="" />
            {client.clientName}
          </div>
          <div
            className="date_name_block"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              color: "rgb(170 170 170)",
              backgroundColor: "#fff",
            }}
          >
            {client.dateOfCreated}
          </div>
          <div
            style={{
              width: "max-content",
              textAlign: "center",
              position: "absolute",
              top: "0",
              right: "0",
              cursor: "pointer",
            }}
            onClick={() => handleClientClick(client._id)}
          >
            <img className="clock_img" src={EditImg} alt="" />
          </div>
        </li>
      ));
  };



  const sortDate = () => {
    const sorted = filteredData().slice().sort((a, b) => {
      const firstDate = new Date(a.dateOfCreated);
      const secondDate = new Date(b.dateOfCreated);
      return firstDate - secondDate;
    });
    setSortedData(sorted);
    setSortActivated(true);
    setActiveMenuItem({ 1: true, 2: false, 3: false, 4: false, 5: false })
    // console.log(activeMenuItem)
  };

  const sortDateToday = () => {
    const today = new Date();
    const sorted = filteredData().slice().sort((a, b) => {
      const firstDate = new Date(a.selectedDate);
      const secondDate = new Date(b.selectedDate);
      if (firstDate.toDateString() === today.toDateString()) {
        return -1; // первый элемент - сегодняшняя дата
      } else if (secondDate.toDateString() === today.toDateString()) {
        return 1; // второй элемент - сегодняшняя дата
      }
      return firstDate - secondDate; // обычная сортировка
    });
    setSortedData(sorted);
    setSortActivated(true);
    setActiveMenuItem({ 1: false, 2: false, 3: false, 4: false, 5: true });
    // console.log(activeMenuItem);
  };



  const sortDatePhone = () => {
    const sorted = filteredData().slice().sort((a, b) => {
      const firstDate = new Date(a.selectedDate);
      const secondDate = new Date(b.selectedDate);
      return firstDate - secondDate;
    });
    setSortedData(sorted);
    setSortActivated(true);
    setActiveMenuItem({ 1: false, 2: true, 3: false, 4: false, 5: false })
    // console.log(activeMenuItem)
  };
  const sortByEmail = () => {
    const sorted = myDataLeed.slice().sort((a, b) => {
      const firstName = a.email.toLowerCase();
      const secondName = b.email.toLowerCase();
      if (firstName < secondName) {
        return -1;
      }
      if (firstName > secondName) {
        return 1;
      }
      return 0;
    });
    setSortedData(sorted);
    setSortActivated(true);
    setActiveMenuItem({ 1: false, 2: false, 3: true, 4: false, 5: false })
    // console.log(activeMenuItem)
  };



  const sortByName = () => {
    const sorted = myDataLeed.slice().sort((a, b) => {
      const firstName = a.clientName.toLowerCase();
      const secondName = b.clientName.toLowerCase();
      if (firstName < secondName) {
        return -1;
      }
      if (firstName > secondName) {
        return 1;
      }
      return 0;
    });
    setSortedData(sorted);
    setSortActivated(true);
    setActiveMenuItem({ 1: false, 2: false, 3: false, 4: true, 5: false })
    // console.log(activeMenuItem)
  };



  // const cancelSort = () => {
  //   setSortActivated(false);
  //   setSortedData([]);
  //   setStartDate(null)
  //   setEndDate(null)
  //   setActiveMenuItem(false)
  // };

  const reverseData = (dataArray) => {
    return dataArray.slice().reverse();
  };

  const handleReverseData = () => {
    setSortActivated(true);

    if (reversed) {
      setSortedData(sortedData.length == 0 ? myDataLeed : sortedData);
      setReversed(false);
    } else {
      const newData = sortedData.length > 0 ? reverseData(sortedData) : reverseData(myDataLeed);
      setSortedData(newData);
      setReversed(true);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  const handleLoadMoreWithStatusFilter = (status, state, count) => {
    cancelSort()
    state(status);
    count(prev => prev + 10);

  };
  const handleLoadMoreWithStatusFilterLoad = (status, state, count) => {
    cancelSort()
    state(status);
    count(prev => prev + 0);

  };
  const handleCheckboxChange = (managerId) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [managerId]: !prevState[managerId]
    }));
  }

  const filteredDataWithCheckboxes = () => {
    let filtered = sortActivated ? sortedData : myDataLeed;

    const selectedManagerIds = Object.keys(checkedItems).filter(
      (managerId) => checkedItems[managerId]
    );

    if (selectedManagerIds.length > 0) {
      filtered = filtered.filter((item) =>
        selectedManagerIds.includes(item.managerID)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.dateOfCreated) >= new Date(startDate) &&
          new Date(item.dateOfCreated) <= new Date(endDate)
      );
    }
    return filtered;
  };


  // console.log(status('new'))
  return (
    <div>
      {filterBlock && <div className="sort_block">
        <div className="close" onClick={closeFilter}>
          &times;
        </div>
        <div className="flexBtn">
          <div className="period_search">

            <div className="sort_head_txt">Период:</div>
            <div className="period_inputs">
              <input className="date" type="date" onChange={handleStartDateChange} />
              <input className="date" type="date" placeholder="" onChange={handleEndDateChange} />
            </div>
          </div>
          <div className="period_search">
            <div className="sort_head_txt">Сортировка:</div>
            <div className="filter_btns" >
              <div style={{ marginLeft: "0" }} className={`filter_btn ${activeMenuItem[1] === true ? 'active_el' : ''}`} onClick={sortDate}>По Дате</div>

              <div className={`filter_btn ${activeMenuItem[2] === true ? 'active_el' : ''}`} onClick={sortDatePhone}>По Дате созвона</div>
              <div className={`filter_btn ${activeMenuItem[3] === true ? 'active_el' : ''}`} onClick={sortByEmail}>По Email</div>
              <div className={`filter_btn ${activeMenuItem[4] === true ? 'active_el' : ''}`} onClick={sortByName}>По Имени</div>
              <div className={`filter_btn ${activeMenuItem[5] === true ? 'active_el' : ''}`} onClick={sortDateToday}>Позвонить сегодня</div>

              <div className="filter_btn" onClick={cancelSort}>Отменить сортировку</div>
              <div className="filter_btn" onClick={handleReverseData}>Повернуть</div>

            </div>
          </div>
          {/* <div onClick={()=>sortedData.reverse()}> Перевернуть</div> */}
          <div>
            <div className="sort_head_txt">Отменённые:</div>
            <div className="cancel_block">

              <div style={{ paddingLeft: "0" }} className={`cancel_txt ${showCancelStatus == false ? 'active_el_hide' : ''}`}>Скрыть</div>
              <div className="cancel_checkbox">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showCancelStatus}
                    onChange={() => setShowCancelStatus(!showCancelStatus)}
                  />
                  <span className="slider"></span>

                </label>
              </div>
              <div className={`cancel_txt ${showCancelStatus == true ? 'active_el_hide' : ''}`}>Показать</div>
            </div>
          </div>
        </div>
        <div style={{ color: "black" }} className="">
          <ul>
            {dataManagers.filter((person) => person.managerKey === keyManage || person.managerID === keyManage).map(manager => (
              <li key={manager._id}>
                <label>
                  {manager.nameManager}
                  <input
                    type="checkbox"
                    value={manager.nameManager}
                    onChange={() => handleCheckboxChange(manager.managerID)}
                    checked={checkedItems[manager.managerID]}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>

      </div>}
      <div className="table_block">
        <div className="statusBlock">
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'new')}>
            <div className="status_name">
              <h4>Потенциальный ({renderStatusElements("new", newStatusColsRef, 100000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('new', setStatusFilter, setLoadedItems)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={newStatusColsRef}>
              {renderStatusElements("new", newStatusColsRef, visibleItemsNew)}

            </div>

          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'in_processing')}>

            <div className="status_name">
              <h4>Я подумаю, наберать систематично ({renderStatusElements("in_processing", inProcessingStatusColsRef, 10000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('in_processing', setStatusFilterInProcessing, setLoadedItemsInProcessing)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={inProcessingStatusColsRef}>
              {renderStatusElements("in_processing", inProcessingStatusColsRef, visibleItemsInProcessing)}

            </div>
          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'agreed')}>
            <div className="status_name">
              <h4>Договорились, но не отгрузили ({renderStatusElements("agreed", agreedStatusColsRef, 1000000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('agreed', setStatusFilterAgreed, setLoadedItemsAgreed)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={agreedStatusColsRef}>
              {renderStatusElements("agreed", agreedStatusColsRef, visibleItemsAgreed)}

            </div>
          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'successful')}>
            <div className="status_name">
              <h4>Успешный ({renderStatusElements("successful", succesfulStatusColsRef, 1000000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('successful', setStatusFilterSuccesful, setLoadedItemsSuccesful)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={succesfulStatusColsRef}>
              {renderStatusElements("successful", succesfulStatusColsRef, visibleItemsSuccessful)}

            </div>
          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'return')}>
            <div className="status_name">
              <h4>Клиент купил на стороне. Вернуть! ({renderStatusElements("return", returnStatusColsRef, 1000000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('return', setStatusFilterReturn, setLoadedItemsReturn)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={returnStatusColsRef}>
              {renderStatusElements("return", returnStatusColsRef, visibleItemsReturn)}

            </div>
          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'nds')}>
            <div className="status_name">
              <h4>НДС ({renderStatusElements("nds", ndsStatusColsRef, 10000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('nds', setStatusFilterNds, setLoadedItemsNds)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={ndsStatusColsRef}>
              {renderStatusElements("nds", ndsStatusColsRef, visibleItemsNds)}

            </div>
          </ul>
          <ul className="statusCols" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'wholesale')}>
            <div className="status_name">
              <h4>Опт ({renderStatusElements("wholesale", wholesaleStatusColsRef, 10000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('wholesale', setStatusFilterWholesale, setLoadedItemsWholesale)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={wholesaleStatusColsRef}>
              {renderStatusElements("wholesale", wholesaleStatusColsRef, visibleItemsWholesale)}

            </div>
          </ul>
          {showCancelStatus && <ul className="statusCols cancel" onDragOver={(event) => allowDrop(event)} onDrop={(event) => handleDrop(event, 'cancel')}>
            <div className="status_name">
              <h4>Отменённые ({renderStatusElements("cancel", cancelStatusColsRef, 1000000000000).length})</h4>
              <div className="upload_el" onClick={() => handleLoadMoreWithStatusFilter('cancel', setStatusFilterCancel, setLoadedItemsCancel)}><img className="update_img" src={UpdateImg} /></div>

            </div>
            <div className="status_els" ref={cancelStatusColsRef}>
              {renderStatusElements("cancel", cancelStatusColsRef, visibleItemsCancel)}

            </div>
          </ul>}
        </div>
      </div>

      <EditForm handleDateChange={handleDateChange} paymentArray={paymentArray} handleDeleteClient={handleDeleteClient} registrationDataClient={registrationDataClient} handleRegistrationClientChange={handleRegistrationClientChange} dataProducts={dataProducts} adminkey={keyManage} editClientMode={editClientMode} setSelectedClient={setSelectedClient} selectedClient={selectedClient} handleEditClient={handleEditClient} managerIDOptions={managerIDOptions} ManagerStatusOptions={ManagerStatusOptions} close={close} />
      <LeedInfo
        setEditClientModeSecondPhone={setEditClientModeSecondPhone} editClientModeSecondPhone={editClientModeSecondPhone} closeSecondPhone={closeSecondPhone}
        setEditClientModeNotice={setEditClientModeNotice} editClientModeNotice={editClientModeNotice} closeNotice={closeNotice} editClientModePaymentCost={editClientModePaymentCost} setEditClientModePaymentCost={setEditClientModePaymentCost} closePaymentCost={closePaymentCost} handleDateChange={handleDateChange} closePayment={closePayment} paymentArray={paymentArray} setEditClientModePayment={setEditClientModePayment} editClientModePayment={editClientModePayment} addPayment={addPayment} handleDeleteClient={handleDeleteClient} setProducts={setProducts} products={products} setCheckedProducts={setCheckedProducts} checkedProducts={checkedProducts} closeProduct={closeProduct} closeName={closeName} closeDate={closeDate} closeStatus={closeStatus} closeManager={closeManager} setEditClientModeProduct={setEditClientModeProduct} setEditClientModeManager={setEditClientModeManager} setEditClientModeStatus={setEditClientModeStatus} setEditClientModeDate={setEditClientModeDate} editClientModeProduct={editClientModeProduct} editClientModeManager={editClientModeManager} editClientModeStatus={editClientModeStatus} editClientModeDate={editClientModeDate} setEditClientModeName={setEditClientModeName} editClientModeName={editClientModeName} closeEmail={closeEmail} setEditClientModeEmail={setEditClientModeEmail} handleDataClick={handleDataClick} closeMobile={closeMobile} editClientModeEmail={editClientModeEmail} editClientModeMobile={editClientModeMobile} handleDeleteNotice={handleDeleteNotice} closeNoticeEdit={closeNoticeEdit} leedNotice={leedNotice} editNoticeMode={editNoticeMode} setSelectedNotice={setSelectedNotice} handleNoticeClick={handleNoticeClick} handleEditNotice={handleEditNotice} selectedNotice={selectedNotice} dataNotices={dataNotices} handleRegistrationNoticeChange={handleRegistrationNoticeChange} registrationDataNotice={registrationDataNotice} handleRegistrationNotice={handleRegistrationNotice} handleClientClick={handleClientClick} registrationDataClient={registrationDataClient} handleRegistrationClientChange={handleRegistrationClientChange} dataProducts={dataProducts} adminkey={keyManage} editClientViewMode={editClientViewMode} setSelectedClient={setSelectedClient} selectedClient={selectedClient} handleEditClient={handleEditClient} managerIDOptions={managerIDOptions} ManagerStatusOptions={ManagerStatusOptions} close={close} />
    </div>
  );
};

export default View;
