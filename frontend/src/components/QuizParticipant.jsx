// import React, { useEffect, useState } from 'react';
// import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// const QuizParticipant = ({ roomId }) => {
//   const [participants, setParticipants] = useState([]);

//   useEffect(() => {
//     // Fetch participants from backend
//     const fetchParticipants = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/participants/${roomId}`);
//         const data = await response.json();
//         setParticipants(data);
//       } catch (error) {
//         console.error('Error fetching participants:', error);
//       }
//     };

//     fetchParticipants();
//     const interval = setInterval(fetchParticipants, 5000); // Poll every 5 seconds
//     return () => clearInterval(interval);
//   }, [roomId]);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
//       <Typography variant="h6">Participants</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {participants.map((participant, index) => (
//               <TableRow key={index}>
//                 <TableCell>{participant}</TableCell>
//                 <TableCell>Joined</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default QuizParticipant;


import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const QuizParticipants = ({ roomId }) => {
  const [participants, setParticipants] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch participants from the backend
    fetch(`http://localhost:8000/api/participants?roomId=${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {  // Check if the data is an array
          setParticipants(data);
        } else {
          setParticipants([]);  // Fallback to an empty array if the response is not an array
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching participants:', error);
        setParticipants([]);  // Handle error case
        setLoading(false);
      });
  }, [roomId]);

  if (loading) {
    return <Typography>Loading participants...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">Participantsii</Typography>
      <List>
        {participants.map((participant, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${participant.name} joined`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default QuizParticipants;
