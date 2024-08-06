'use client'

import { useState, useEffect } from "react";
import { Box, Modal, Typography, Stack, TextField, Button, Alert } from "@mui/material";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtADGUK_xAp4gECghtjCqvggrr6xyYdqU",
  authDomain: "inventory-management-6df67.firebaseapp.com",
  projectId: "inventory-management-6df67",
  storageBucket: "inventory-management-6df67.appspot.com",
  messagingSenderId: "217416177985",
  appId: "1:217416177985:web:6a58db0b0b7ef73f59e9c0",
  measurementId: "G-FELXBFE30T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
let analytics;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    try {
      const inventoryCollection = collection(firestore, 'inventory');
      const snapshot = await getDocs(inventoryCollection);
      const inventoryList = snapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
      setIsOnline(true);
      setErrorMessage('');
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIsOnline(false);
      setErrorMessage(`Error fetching inventory: ${error.message}`);
    }
  };

  const addOrUpdateItem = async (item, quantity) => {
    try {
      const docRef = doc(firestore, 'inventory', item);
      await setDoc(docRef, { quantity: parseInt(quantity) }, { merge: true });
      await updateInventory();
    } catch (error) {
      console.error("Error adding/updating item:", error);
      setIsOnline(false);
      setErrorMessage(`Error adding/updating item: ${error.message}`);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item);
      await deleteDoc(docRef);
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
      setIsOnline(false);
      setErrorMessage(`Error removing item: ${error.message}`);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setItemQuantity(1);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      width="100vw"
      height="100vh" 
      display="flex"
      flexDirection='column'
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: '#abebc6' }}
    >
      {!isOnline && (
        <Alert severity="error">
          There was an error connecting to the database. Please check your internet connection and try again.
          {errorMessage && <Typography>{errorMessage}</Typography>}
        </Alert>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="black"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">Add/Update Item</Typography>
          <TextField 
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField 
            label="Quantity"
            variant="outlined"
            fullWidth
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
          />
          <Button
            variant="contained" 
            onClick={() => {
              addOrUpdateItem(itemName, itemQuantity);
              handleClose();
            }}
          >
            Add/Update
          </Button>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: '800px', mb: 2 }}
      />
      <Box border='1px solid #333' mt={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor="#7dcea0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
            >
              <Typography 
                variant="h5"
                color='#333'
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography 
                  variant="h5"
                  color='#000000'
                >
                  {quantity}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setItemName(name);
                    setItemQuantity(quantity);
                    handleOpen();
                  }}
                >
                  Update
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}