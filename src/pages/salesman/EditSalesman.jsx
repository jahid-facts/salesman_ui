import React, { useEffect, useState } from "react";
import TransitionsModal from "../../components/Modal";
import { Grid, TextField } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const EditSalesman = ({ openEdit, setOpenEdit, userEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    // Update userData when userEdit changes
    if (userEdit) {
      setUserData({
        name: userEdit.name || "",
        email: userEdit.email || "",
        number: userEdit.number || "",
      });
    }
  }, [userEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };
  console.log(userData);
  console.log(userEdit);

  const handleSubmitEdit = async () => {
    setIsSubmitting(true);

    try {
      const data = {
        name: userData.name,
        email: userData.email,
        number: userData.number,
      };

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}update-user/${userEdit.id}`,
        data
      );

      toast.success("User updated successfully");
      setOpenEdit(false); // Close the modal on successful submission
    } catch (err) {
      toast.error(err?.response?.data[0] || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <TransitionsModal
        title={"Edit user"}
        handleSubmit={handleSubmitEdit}
        open={openEdit}
        setOpen={setOpenEdit}
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleSubmitEdit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="number"
                label="Number"
                name="number"
                value={userData.number}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </form>
      </TransitionsModal>
    </div>
  );
};

export default EditSalesman;
