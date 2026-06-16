import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import Service from "../../services/Service";
import { ToastContainer, toast } from "react-toastify";

// export default function TierSettings({ open, onClose, thresholds, setThresholds }) {
//   const [tiers, setTiers] = useState([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       Service.getTiers()
//         .then((res) => {
//           // backend returns ResponseUtil wrapper: res.data.data
//           const list = (res.data && res.data.data) ? res.data.data : [];
//           // Ensure id is string and start is number
//           const cleaned = list.map((t) => ({
//             id: t.id,
//             tierName: t.tierName,
//             start: Number(t.start || 0),
//           }));
//           setTiers(cleaned);
//         })
//         .catch((err) => {
//           console.error(err);
//           toast.error("Failed to load tiers");
//         });
//     }
//   }, [open]);

//   const onChangeStart = (id, value) => {
//     setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, start: value } : t)));
//   };

//   const validateOrder = (list) => {
//     // Expect ascending ordered starts (lowest -> highest). We check monotonic increasing.
//     for (let i = 1; i < list.length; i++) {
//       if (Number(list[i].start) <= Number(list[i - 1].start)) {
//         return {
//           ok: false,
//           message: `${list[i].tierName} start must be greater than ${list[i - 1].tierName} start`,
//         };
//       }
//     }
//     return { ok: true };
//   };

//   const handleSave = async () => {
//     const sortedByStart = [...tiers].sort((a, b) => Number(a.start) - Number(b.start));
//     const val = validateOrder(sortedByStart);
//     if (!val.ok) {
//       toast.error(val.message);
//       return;
//     }

//     setSaving(true);
//     try {
//       // update each existing tier via PUT; use Promise.all
//       await Promise.all(
//         tiers.map((t) =>
//           Service.updateTier(t.id, {
//             id: t.id,
//             tierName: t.tierName,
//             start: Number(t.start),
//           })
//         )
//       );

//       // after success, build thresholds object expected by your Filter logic
//       const newThresh = {};
//       tiers.forEach((t) => {
//         const key = String(t.tierName).toLowerCase(); // "bronze", "silver", etc.
//         // ensure known keys exist; keep exact names if you prefer
//         if (key.includes("platinum")) newThresh.platinum = Number(t.start);
//         else if (key.includes("gold")) newThresh.gold = Number(t.start);
//         else if (key.includes("silver")) newThresh.silver = Number(t.start);
//         else if (key.includes("bronze")) newThresh.bronze = Number(t.start);
//         else newThresh[key] = Number(t.start); // fallback, but keep naming
//       });

//       // ensure default keys exist (if some are missing)
//       setThresholds((prev) => ({ ...prev, ...newThresh }));

//       toast.success("Tiers updated");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save tiers");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       <Modal open={open} onClose={onClose}>
//         <Box
//           sx={{
//             width: "520px",
//             maxHeight: "80vh",
//             overflowY: "auto",
//             bgcolor: "white",
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             p: 3,
//             borderRadius: 1,
//           }}
//         >
//           <h3 className="text-lg font-semibold mb-3">Tier Settings</h3>

//           <div className="space-y-2">
//             {tiers.map((t) => (
//               <div key={t.id} className="flex items-center justify-between gap-4">
//                 <div className="w-1/2">
//                   <label className="text-xs text-gray-600">{t.tierName}</label>
//                 </div>
//                 <div className="w-1/2 flex items-center gap-2">
//                   <input
//                     type="number"
//                     value={t.start}
//                     onChange={(e) => onChangeStart(t.id, e.target.value)}
//                     className="border px-2 py-1 rounded text-sm w-full"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 flex justify-end gap-2">
//             <button
//               onClick={onClose}
//               className="px-3 py-1 rounded border hover:bg-gray-100"
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600"
//               disabled={saving}
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </Box>
//       </Modal>

//       <ToastContainer />
//     </>
//   );
// }
// export default function TierSettings({ onClose }) {
//   const [tiers, setTiers] = useState([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     Service.getTiers()
//       .then((res) => {
//         const list = res.data?.data || [];
//         const cleaned = list.map((t) => ({
//           id: t.id,
//           tierName: t.tierName,
//           start: Number(t.start || 0),
//         }));
//         setTiers(cleaned);
//       })
//       .catch(() => toast.error("Failed to load tiers"));
//   }, []);

//   const onChangeStart = (id, value) => {
//     setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, start: value } : t)));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await Promise.all(
//         tiers.map((t) =>
//           Service.updateTier(t.id, { id: t.id, tierName: t.tierName, start: Number(t.start) })
//         )
//       );
//       toast.success("Tiers updated");
//       onClose();
//     } catch {
//       toast.error("Failed to save tiers");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[600px] h-2/3 border overflow-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-1 mb-2">
//         <span className="font-semibold text-gray-700 text-sm">Tier Settings</span>
//         <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
//       </div>

//       <div className="space-y-2">
//         {tiers.map((t) => (
//           <div key={t.id} className="flex items-center justify-between gap-4">
//             <div className="w-1/2 text-sm">{t.tierName}</div>
//             <input
//               type="number"
//               value={t.start}
//               onChange={(e) => onChangeStart(t.id, e.target.value)}
//               className="border px-2 py-1 rounded text-sm w-1/2"
//             />
//           </div>
//         ))}
//       </div>

//       <div className="mt-4 flex justify-end gap-2">
//         <button onClick={onClose} className="px-3 py-1 rounded border hover:bg-gray-100" disabled={saving}>
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           className="px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600"
//           disabled={saving}
//         >
//           {saving ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }

export default function TierSettings({ onClose, thresholds, setThresholds }) {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Service.getTiers()
      .then((res) => {
        const list = (res.data && res.data.data) ? res.data.data : [];
        // sort ascending by start to show in logical order
        const cleaned = list
          .map((t) => ({ id: t.id, tierName: t.tierName, start: Number(t.start || 0) }))
          .sort((a, b) => a.start - b.start);
        setTiers(cleaned);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load tiers");
      })
      .finally(() => setLoading(false));
  }, []);

  const onChangeStart = (id, value) => {
    // keep number or empty string
    const v = value === "" ? "" : Number(value);
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, start: v } : t)));
  };

  const validateOrder = (list) => {
    // must be strictly increasing by start
    for (let i = 1; i < list.length; i++) {
      if (Number(list[i].start) <= Number(list[i - 1].start)) {
        return {
          ok: false,
          message: `${list[i].tierName} start must be greater than ${list[i - 1].tierName} start`,
        };
      }
    }
    return { ok: true };
  };

  const handleSave = async () => {
    // ensure all start fields are numbers
    const normalized = tiers.map((t) => ({ ...t, start: Number(t.start || 0) }));
    const val = validateOrder(normalized);
    if (!val.ok) {
      toast.error(val.message);
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        normalized.map((t) =>
          Service.updateTier(t.id, { id: t.id, tierName: t.tierName, start: Number(t.start) })
        )
      );

      // update parent thresholds object
      const newThresh = {};
      normalized.forEach((t) => {
        const key = String(t.tierName).toLowerCase();
        if (key.includes("platinum")) newThresh.platinum = Number(t.start);
        else if (key.includes("gold")) newThresh.gold = Number(t.start);
        else if (key.includes("silver")) newThresh.silver = Number(t.start);
        else if (key.includes("bronze")) newThresh.bronze = Number(t.start);
      });

      setThresholds((prev) => ({ ...prev, ...newThresh }));
      toast.success("Tiers updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save tiers");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="absolute z-50 bg-white shadow-lg rounded-r-md p-3 top-0 left-60 w-[600px]  border overflow-auto">
        <div className="flex justify-between items-center border-b pb-1 mb-2">
          <span className="font-semibold text-gray-700 text-sm">Tier Settings</span>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {tiers.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4">
                <div className="w-1/2 text-sm">{t.tierName}</div>
                <input
                  type="number"
                  value={t.start}
                  onChange={(e) => onChangeStart(t.id, e.target.value)}
                  className="border px-2 py-1 rounded text-sm w-1/2"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border hover:bg-gray-100" disabled={saving}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600"
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

