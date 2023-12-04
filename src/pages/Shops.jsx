import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { Box, Button, Chip, Grid, IconButton } from "@mui/material";
import DataTable from "../components/DataTable/DataTable";
import { MoreHoriz } from "@mui/icons-material";
import Dropdownmenu from "../components/Dropdown/DropdownMenu";
import { getApi, postApi, putApi } from "../config/configAxios";
import CustomLoader from "../components/customLoader/CustomLoader";
import TransitionsModal from "../components/Modal";
import { ExcelFileUpload } from "../components/ExcelFileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

const ShopsList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [shopList, setShopList] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const response = await getApi("shop");
      setShopList(response.data.shop);
    } catch (error) {
      console.error("An error occurred while fetching data.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle action
  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case "delete":
          Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to active this shop?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axios
                  .delete(`delete-shop/${itemId}`)
                  .then((res) => {
                    toast.success(res.data?.message);
                  })
                  .catch((err) => {
                    toast.error("An error occurred while deleting");
                  })
                  .finally(() => {
                    fetchData();
                  });
              } catch (error) {
                Swal.fire(
                  "Error",
                  "An error occurred while delete the item.",
                  "error"
                );
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("Cancelled", "The shop was not disabled.", "info");
            }
          });
          break;
        default:
          await putApi(`status-shop/${itemId}`, { status: actionType });
          toast.success("Shop has been updated");
      }
      fetchData();
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      handleMenuClose();
    }
  };

  const actionItems = [
    { type: "active" },
    { type: "disabled" },
    { type: "delete" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Shop name", width: 150 },
    { field: "shopCode", headerName: "Shop Code", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status.toLowerCase();

        if (status === "active") {
          return <Chip size="small" label={status} color="success" />;
        } else if (status === "disabled") {
          return <Chip size="small" label={status} color="info" />;
        } else {
          return null;
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex">
          <IconButton
            onClick={(event) => handleMenuOpen(event, params.row.itemId)}
          >
            <MoreHoriz />
          </IconButton>
          <Dropdownmenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleAction={(actionType) => handleAction(actionType)}
            actionItems={actionItems}
          />
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const newData = shopList.map((data, index) => ({
      itemId: data.id,
      id: index + 1,
      name: data.name || "",
      shopCode: data.shop_code || "",
      address: data.address || "",
      status: data.status || "Active",
    }));

    setData(newData);
  }, [shopList]);

  // handle file submit
  const [open, setOpen] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file[0]);
      try {
        await postApi("add-shop", formData);
        fetchData();
        toast.success("Shops uploaded successfully");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred while uploading data."
        );
      } finally {
        setOpen(false);
        setLoading(false);
      }
    } else {
      toast.error("please select a file");
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);

  return (
    <AdminLayout title={"Shops list"}>
      <Helmet>
        <title>Shops list</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            sx={{ textTransform: "capitalize", mb: 2 }}
            onClick={handleOpen}
          >
            Add Shops
          </Button>
          <TransitionsModal
            title={"Upload shops data use excel"}
            handleSubmit={handleSubmit}
            open={open}
            setOpen={setOpen}
            isSubmitting={loading}
          >
            <ExcelFileUpload setFile={setFile} />
          </TransitionsModal>
          {loading ? (
            <CustomLoader />
          ) : (
            <DataTable data={data} columns={columns} />
          )}
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ShopsList;
