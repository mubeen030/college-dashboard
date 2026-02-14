import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  RotateCcw,
  Download,
  Send,
  Layout,
  X
} from "lucide-react";

const SUBJECTS = [
  "Mathematics",
  "Data Structures",
  "Web Development",
  "Python",
  "Operating Systems",
  "Networking",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CLASSES = ["FYBCA", "SYBCA", "TYBCA"];
const DIVISIONS = ["A", "B"];
const TIME_SLOTS = [
  "08:15 - 09:15",
  "09:15 - 10:15",
  "10:15 - 11:15",
  "11:15 - 11:30",
  "11:30 - 12:30",
  "12:30 - 01:30",
  "01:30 - 02:30",
];

const EliteAdminMaster = () => {
  const [allData, setAllData] = useState({});
  const [currentClass, setCurrentClass] = useState("FYBCA");
  const [currentDiv, setCurrentDiv] = useState("A");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const [formData, setFormData] = useState({
    subject: "",
    startTime: "08:15",
    endTime: "09:15",
    type: "Theory",
    teacher: "",
    room: "",
  });

  const classKey = `${currentClass}-${currentDiv}`;
  const currentSchedule = allData[classKey] || {};

  const handleAddClick = (day) => {
    setActiveDay(day);
    setFormData({
      subject: "",
      startTime: "08:15",
      endTime: "09:15",
      type: "Theory",
      teacher: "",
      room: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newEntry = { ...formData, id: Date.now() };
    const daySchedule = currentSchedule[activeDay] || [];

    const updatedDaySchedule = [...daySchedule, newEntry].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    setAllData({
      ...allData,
      [classKey]: { ...currentSchedule, [activeDay]: updatedDaySchedule },
    });

    setIsModalOpen(false);
  };

  const handleExport = () => {
    const flatData = [];
    Object.keys(currentSchedule).forEach((day) => {
      currentSchedule[day].forEach((slot) => {
        flatData.push({ Day: day, ...slot });
      });
    });

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, `${classKey}_Schedule.xlsx`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Layout size={18} />
          </div>
          <h1 className="text-lg font-bold">Elite Admin</h1>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="text-xs text-slate-400">Class</label>
            <select
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}
              className="mt-2 w-full bg-slate-800 rounded-xl px-4 py-3 text-sm"
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Division</label>
            <select
              value={currentDiv}
              onChange={(e) => setCurrentDiv(e.target.value)}
              className="mt-2 w-full bg-slate-800 rounded-xl px-4 py-3 text-sm"
            >
              {DIVISIONS.map((d) => (
                <option key={d}>Division {d}</option>
              ))}
            </select>
          </div>

          <div className="pt-6 border-t border-slate-700 space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700"
            >
              <Download size={16}/> Export Excel
            </button>

            <button
              onClick={() => setAllData({ ...allData, [classKey]: {} })}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/30"
            >
              <RotateCcw size={16}/> Reset Grid
            </button>
          </div>
        </div>
      </aside>


      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white sticky top-0 z-40 border-b px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-xs text-slate-400">
              {currentClass} • {currentDiv}
            </p>
            <h2 className="text-xl font-bold">Timetable Manager</h2>
          </div>

          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm">
            <Send size={16}/> Save & Push
          </button>
        </header>


        {/* TABLE */}
        <div className="p-8">
          <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 w-36 border-r text-left text-slate-500">Time</th>
                    {DAYS.map((day) => (
                      <th key={day} className="p-4 text-center text-slate-500">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {TIME_SLOTS.map((slot) => {
                    const isRecess = slot === "11:15 - 11:30";

                    return (
                      <tr key={slot} className="border-t">
                        <td className="p-4 border-r text-center font-semibold text-slate-600">
                          {slot}
                        </td>

                        {DAYS.map((day) => {
                          const entries =
                            currentSchedule[day]?.filter((e) =>
                              e.startTime.startsWith(
                                slot.split(" - ")[0].substring(0, 2)
                              )
                            ) || [];

                          if (isRecess) {
                            return (
                              <td key={day} className="p-2">
                                <div className="h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-semibold">
                                  Break
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={`${day}-${slot}`}
                              onClick={() => handleAddClick(day)}
                              className="p-3 min-w-[170px] cursor-pointer hover:bg-slate-50"
                            >
                              {entries.length > 0 ? (
                                entries.map((entry, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded-xl border-l-4 mb-2
                                    ${
                                      entry.type === "Theory"
                                        ? "bg-indigo-50 border-indigo-500"
                                        : "bg-emerald-50 border-emerald-500"
                                    }`}
                                  >
                                    <p className="font-semibold text-xs">
                                      {entry.subject}
                                    </p>
                                    <p className="text-[11px] opacity-70">
                                      {entry.startTime} - {entry.endTime}
                                    </p>
                                    {entry.teacher && (
                                      <p className="text-[11px] opacity-70">
                                        {entry.teacher}
                                      </p>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                                  <Plus className="w-5 h-5 text-slate-300"/>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>


      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">

            <div className="bg-indigo-600 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Add Session</h3>
                <p className="text-xs opacity-80">
                  {activeDay} • {currentClass}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X/>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <select
                required
                className="w-full bg-slate-50 rounded-xl px-4 py-3"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  className="bg-slate-50 rounded-xl px-4 py-3"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
                <input
                  type="time"
                  className="bg-slate-50 rounded-xl px-4 py-3"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                {["Theory", "Lab"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold
                      ${
                        formData.type === t
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Teacher"
                  className="bg-slate-50 rounded-xl px-4 py-3"
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                />
                <input
                  placeholder="Room"
                  className="bg-slate-50 rounded-xl px-4 py-3"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                />
              </div>

              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold">
                Save Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliteAdminMaster;
