import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { getApi } from "../config/configAxios";
import { toast } from "react-toastify";
import CustomLoader from "../components/customLoader/CustomLoader";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApi("get-dashboard-data");
        setDashboardData(res.data);
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data[0]);
        } else if (err.request) {
          // The request was made but no response was received
          toast.error("No response received from the server");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("Error occurred while making the request");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h4>Salesman & shop info</h4>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"streamline:shopping-store-2-store-shop-shops-stores"}
              title={"Shops"}
              subTitle={"Total"}
              countNumber={dashboardData?.shops}
              color={"#2980b9"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"humbleicons:users"}
              title={"Active salesman"}
              subTitle={"Total"}
              countNumber={dashboardData?.activeSalesmans}
              color={"#27ae60"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"humbleicons:users"}
              title={"Disabled salesman"}
              subTitle={"Total"}
              countNumber={dashboardData?.disabledSalesmans}
              color={"#EA2027"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"ri:secure-payment-fill"}
              title={"Admin"}
              subTitle={"Total"}
              countNumber={dashboardData?.admin}
              color={"#F4D160"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"tdesign:building"}
              title={"Active shops"}
              subTitle={"Total"}
              countNumber={dashboardData?.activeShops}
              color={"#FF6AC2"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard
              icon={"tdesign:building"}
              title={"Disabled shops"}
              subTitle={"Total"}
              countNumber={dashboardData?.disabledShops}
              color={"#EA2027"}
            />
          </Grid>
        </Grid>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
