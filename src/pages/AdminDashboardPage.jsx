import React, { useEffect, useState } from "react";
import Uparrow from "../components/Uparrow";
import MkdSDK from "../utils/MkdSDK";
import { useNavigate } from "react-router";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const AdminDashboardPage = () => {
  let sdk = new MkdSDK();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(null);
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);

  const accessTokenFromLocalStorage = localStorage.getItem("token");

  const apiFetcher = async () => {
    const header = {
      "Content-Type": "application/json",
      "x-project":
        "cmVhY3R0YXNrOmQ5aGVkeWN5djZwN3p3OHhpMzR0OWJtdHNqc2lneTV0Nw==",
      Authorization: `Bearer ${accessTokenFromLocalStorage}`,
    };
    try {
      const result = await fetch(
        "https://reacttask.mkdlabs.com/v1/api/rest/video/PAGINATE",
        {
          method: "POST", // Ensure the method is uppercase
          headers: header,
          body: JSON.stringify({
            payload: {},
            page: page,
            limit: 10,
          }),
        }
      );
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const data = await result.json();
      setData(data.list);
      setCharacters(data.list);
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsError(error.message);
      setIsLoading(false);
      console.error("Error:", error.message);
    }
  };

  const prevPage = () => {
    if (page <= 1) {
      setPage(1);
      return;
    }
    setPage(page - 1);
  };

  const nextPage = () => {
    if (page >= 2) {
      setPage(2);
      return;
    }
    setPage(page + 1);
  };

  const logoutHandler = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/admin/login");
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCharacters(items);
  };

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  useEffect(() => {
    console.log("gfgfg",role, token);
    if (token && role) {
      apiFetcher();
    }
  }, [page, token, role]);

  if (loading)
    return (
      <p className="text-[20px] absolute left-[50%] translate-x-[-50%]">
        Loading....
      </p>
    );
  if (error)
    return (
      <p className="text-[20px] absolute left-[50%] translate-x-[-50%]">
        An error has occured
      </p>
    );

  return (
    <div className="bg-[#111111] py-10 px-5">
      <div className="flex items-start w-[1280px] mx-auto flex-col gap-[10rem] min-h-screen text-gray-700">
        <div className="w-full flex justify-between">
          <span className="text-white uppercase font-bold text-[24px]">
            APP
          </span>
          <button
            onClick={logoutHandler}
            className="flex gap-2 bg-[#9bff00] text-[#050505] items-center px-4 py-1 rounded-full"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_7709_333)">
                <path
                  d="M5 20C5 17.544 6.991 15.553 9.447 15.553H14.553C17.009 15.553 19 17.544 19 20"
                  stroke="#696969"
                  strokeWidth="1.4824"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.0052 5.2448C16.6649 6.90453 16.6649 9.59548 15.0052 11.2552C13.3455 12.9149 10.6545 12.9149 8.9948 11.2552C7.33507 9.59548 7.33507 6.90453 8.9948 5.2448C10.6545 3.58507 13.3455 3.58507 15.0052 5.2448"
                  stroke="#696969"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_7709_333">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Logout
          </button>
        </div>
        <div className="w-full relative flex flex-col gap-4 items-start">
          <div className="w-full flex justify-between items-center">
            <span className="text-white font-bold text-[30px]">
              Today's leaderboard
            </span>
            <div className="flex gap-4 bg-[#1d1d1d] text-[#050505] items-center px-8 py-4 rounded-xl">
              <span className="text-[14px] text-[white]">30 May 2022 .</span>
              <div className="uppercase bg-[#9bff00] text-[#050505] px-3 py-2 rounded-xl">
                Submissions open
              </div>
              <span className="text-[14px] text-[white]">11:34 .</span>
            </div>
          </div>
          <div className="flex mt-8 gap-6 w-full flex-col items-start">
            <div className="flex w-full items-center justify-between">
              <span className="text-white text-[16px]">Title</span>
              <span className="text-white text-[16px]">Author</span>
              <span className="text-white text-[16px]">Most Liked</span>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <div
                    className="characters flex flex-col gap-6 w-full items-start"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {characters.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            className="flex border py-6 px-4 rounded-lg border-[#2E2E2E] justify-between w-full items-center"
                          >
                            <div className="flex gap-4">
                              <p className="text-white">{item.id}</p>
                              <img
                                className="w-[100px]"
                                src={item.photo}
                                alt=""
                              />
                              <p className="text-white text-[16px] w-[400px]">
                                {item.title}
                              </p>
                            </div>
                            <div className="flex gap-2 absolute left-[50%] translate-x-[-50%]">
                              <img
                                className="w-[24px] rounded-full"
                                src={item.photo}
                                alt=""
                              />
                              <p className="text-white text-[16px]">
                                {item.username}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[16px] text-white">
                                {item.like}
                              </span>
                              <Uparrow />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="fixed right-[10%] bottom-10 flex gap-5">
            <button
              onClick={nextPage}
              className="text-[16px] p-3 bg-[#9bff00] text-black"
            >
              Next
            </button>
            <button
              onClick={prevPage}
              className="text-[16px] p-3 bg-[#9bff00] text-black"
            >
              Previous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
