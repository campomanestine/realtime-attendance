import React, { useContext, useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import ErrorModal from "../modals/ErrorModal";
import { CHECKBOX_DEFAULT_STYLE } from "../../constants/Constant";
import { SemesterContext } from "../../context/SemesterContext";

export default function StudentListModal({
  toggleModal,
  addExisitingStudents,
  currentSemesterId,
}) {
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [selectedStudentList, setSelectedStudentList] = useState([]);
  const { semesters } = useContext(SemesterContext);
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axiosClient.get("/student");
        if (response.status === 200) {
          setStudentList(() => response.data);
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };

    getAllStudents();

    const sem = semesters.filter(
      (semester) => semester._id === currentSemesterId
    )[0];
    setCurrentSemester(() => sem);
  }, []);

  const toggleCheckbox = (checked, studentId) => {
    if (checked) {
      setSelectedStudentList(() => [...selectedStudentList, studentId]);
    } else {
      const newStudentIds = selectedStudentList.filter(
        (id) => id !== studentId
      );
      setSelectedStudentList(() => newStudentIds);
    }
  };

  const toggleCheckAll = (checked) => {
    if (checked) {
      const currentSelected = [];
      for (const student of studentList) {
        if (!checkIfStudentExist(student._id)) {
          currentSelected.push(student._id);
        }
      }
      setSelectedStudentList(() => currentSelected);
    } else {
      setSelectedStudentList(() => []);
    }
  };

  const handleAddStudents = () => {
    if (selectedStudentList) {
      addExisitingStudents(selectedStudentList);
    }
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  const checkIfStudentExist = (studentId) => {
    let exist = false;
    for (const student of currentSemester.students) {
      if (student.student_id === studentId) {
        exist = true;
      }
    }

    return exist;
  };

  return (
    <div
      className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-50 bg-gray-50"
      style={{ minHeight: "100vh" }}
    >
      <div className="modal w-full md:w-8/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header border-b px-4 py-3 mt-4">
          <p className="text-lg">Exisitng Students</p>
        </header>

        <main className="px-4 h-96 overflow-y-auto">
          <div className="w-full flex rounded-md bg-gray-50">
            <p className="w-full text-center">Name</p>
            <p className="w-full text-center">LRN</p>
          </div>
          <ul className="my-6">
            <li className="px-2 py-1 flex space-x-3">
              <input
                onChange={(e) => toggleCheckAll(e.target.checked)}
                type="checkbox"
                className={`${CHECKBOX_DEFAULT_STYLE}`}
              />
              <p className="text-sm mt-1">Check All</p>
            </li>
            {studentList.length > 0 &&
              studentList.map((student) => (
                <li
                  key={student._id}
                  className={
                    "flex items-center border-b space-x-4 cursor-pointer px-2 py-1 text-gray-900 rounded-sm hover:bg-green-50 "
                  }
                >
                  <div className="w-full flex space-x-4">
                    <input
                      onChange={(e) =>
                        toggleCheckbox(e.target.checked, student._id)
                      }
                      checked={selectedStudentList.includes(student._id)}
                      type="checkbox"
                      className={`${CHECKBOX_DEFAULT_STYLE}`}
                      disabled={checkIfStudentExist(student._id)}
                    />
                    <p
                      className={
                        checkIfStudentExist(student._id)
                          ? "inline-block mt-1 text-gray-400"
                          : "inline-block mt-1"
                      }
                    >
                      {student.last_name}, {student.first_name}{" "}
                      {student.middle_name !== "N/A"
                        ? student.middle_name[0].toUpperCase() + "."
                        : ""}
                      {student.suffix !== "N/A" ? `, ${student.suffix}` : ""}
                    </p>
                  </div>
                  <div className="w-full flex justify-center space-x-4">
                    <p
                      className={
                        checkIfStudentExist(student._id)
                          ? "inline-block mt-1 text-gray-400"
                          : "inline-block mt-1"
                      }
                    >
                      {student.school_id}
                    </p>
                  </div>
                </li>
              ))}

            {studentList && studentList.length === 0 && (
              <li>
                <p className="text-center text-xl text-gray-400">
                  No students yet.
                </p>
              </li>
            )}
          </ul>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleAddStudents}
            className={
              !selectedStudentList.length
                ? "px-2 uppercase flex py-2 text-sm rounded-md cursor-not-allowed text-gray-700 bg-gray-200"
                : "px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
            }
            type="submit"
            form="semester-form"
            disabled={!selectedStudentList.length}
          >
            Add Students
          </button>
        </footer>
      </div>
      {errorModalMessage && <ErrorModal title={errorModalMessage} />}
    </div>
  );
}
