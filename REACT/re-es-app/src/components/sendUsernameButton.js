// import { useState } from "react";
// import { Button, Input } from "@/components/ui/button";
// import axios from "axios";

// export default function SendUsernameButton() {
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");

//   const sendUsername = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/send-username", { username });
//       setMessage(response.data.message);
//     } catch (error) {
//       setMessage("Error sending username");
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <Input
//         type="text"
//         placeholder="Enter username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="border p-2 rounded w-full"
//       />
//       <Button onClick={sendUsername} className="bg-blue-500 text-white p-2 rounded">
//         Send Username
//       </Button>
//       {message && <p className="text-green-500">{message}</p>}
//     </div>
//   );
// }
