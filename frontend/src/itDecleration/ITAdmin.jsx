import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
    Button,
    Paper,
    Chip,
    Card,
    CardContent,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const primaryColor = "#ef4444";
const secondaryColor = "#64748b";

const StyledTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
        backgroundColor: primaryColor,
        height: 3,
        borderRadius: 3,
    },
});

const StyledTab = styled(Tab)(({ theme }) => ({
    fontFamily: "'Header', sans-serif",
    fontWeight: "600",
    textTransform: "none",
    fontSize: "15px",
    minHeight: "40px",
    color: secondaryColor,
    "&.Mui-selected": {
        color: primaryColor,
    },
    "&:hover": {
        color: primaryColor,
        opacity: 0.8,
    }
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    padding: theme.spacing(2),
    minWidth: 180,
    textAlign: "center",
    backgroundColor: "#fef2f2",
    border: `1px solid #e2e8f0`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    }
}));

const CustomDatePicker = ({ value, onChange, label }) => {
    const [date, setDate] = useState(value || "");

    const handleDateChange = (e) => {
        const d = e.target.value;
        setDate(d);
        onChange?.(d);
    };

    return (
        <TextField
            fullWidth
            size="small"
            type="date"
            value={date}
            onChange={handleDateChange}
            label={label}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton size="small">
                            <CalendarTodayIcon fontSize="small" sx={{ color: primaryColor }} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                }
            }}
        />
    );
};

const CustomSelect = ({ label, value, options, onChange, fullWidth = true }) => {
    return (
        <FormControl fullWidth={fullWidth} size="small">
            <InputLabel id={`${label}-label`} shrink>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                value={value}
                label={label}
                onChange={onChange}
                notched
                sx={{ borderRadius: 2 }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const SelectionDropdown = ({ label, value, total, onChange, description }) => {
    const options = [
        { value: "all", label: "Select All" },
        { value: "half", label: "Select Half" },
        { value: "quarter", label: "Select Quarter" },
        { value: "none", label: "Select None" },
        { value: "custom", label: "Custom Amount" }
    ];

    const handleSelectionChange = (e) => {
        const selectionType = e.target.value;

        switch (selectionType) {
            case "all":
                onChange(total);
                break;
            case "half":
                onChange(Math.floor(total / 2));
                break;
            case "quarter":
                onChange(Math.floor(total / 4));
                break;
            case "none":
                onChange(0);
                break;
            case "custom":
                break;
            default:
                onChange(total);
        }
    };

    const getCurrentSelectionType = () => {
        if (value === total) return "all";
        if (value === Math.floor(total / 2)) return "half";
        if (value === Math.floor(total / 4)) return "quarter";
        if (value === 0) return "none";
        return "custom";
    };

    return (
        <Box className="flex flex-col gap-2 w-full">
            <Box className="flex items-center">
                <Typography className="font-semibold font-content">{label}</Typography>
                <Tooltip title={description} arrow placement="top">
                    <IconButton size="small" className="ml-1">
                        <InfoOutlinedIcon fontSize="small" className="text-gray-500" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box className="flex gap-2 items-center w-full">
                <FormControl size="small" className="min-w-[180px]">
                    <InputLabel>Selection Type</InputLabel>
                    <Select
                        value={getCurrentSelectionType()}
                        label="Selection Type"
                        onChange={handleSelectionChange}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {getCurrentSelectionType() === "custom" && (
                    <TextField
                        size="small"
                        type="number"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        inputProps={{
                            min: 0,
                            max: total
                        }}
                        className="w-24"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            }
                        }}
                    />
                )}

                <Typography variant="body2" className="text-gray-500 font-content">
                    of {total}
                </Typography>
            </Box>
        </Box>
    );
};

function ITAdmin() {
    const navigate = useNavigate();
    const [itDeclarationSubmitted, setItDeclarationSubmitted] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [itDeclarationOptions, setItDeclarationOptions] = useState({
        departments: { total: 15, selected: 15 },
        locations: { total: 10, selected: 10 },
        positions: { total: 150, selected: 150 },
        projects: { total: 300, selected: 300 },
        employees: { total: 15, selected: 15 },
    });
    const [poiOptions, setPoiOptions] = useState({
        departments: { total: 15, selected: 15 },
        locations: { total: 10, selected: 10 },
        positions: { total: 150, selected: 150 },
        projects: { total: 300, selected: 300 },
        employees: { total: 15, selected: 15 },
    });
    const [cutoffDate, setCutoffDate] = useState("");
    const [poiCutoffDate, setPoiCutoffDate] = useState("");
    const [financialYear, setFinancialYear] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmitButton = () => {
        if (tabValue === 0) {
            setItDeclarationSubmitted(true);
            setTabValue(1);
            toast.success("IT Declaration started successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            toast.success("POI Submission started successfully!", {
                position: "top-right",
                autoClose: 3000,
                onClose: () => navigate("/it-admin-status")
            });
        }
        window.scrollTo(0, 0);
    };

    const getCurrentFinancialYear = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        if (currentMonth >= 3) {
            return `${currentYear}-${currentYear + 1}`;
        } else {
            return `${currentYear - 1}-${currentYear}`;
        }
    };

    useEffect(() => {
        const currentFY = getCurrentFinancialYear();
        setFinancialYear(currentFY);
    }, []);

    const handleTabChange = (_e, v) => {
        setTabValue(v);
        window.scrollTo(0, 0);
    };

    const handleItDeclarationChange = (key, value) => {
        setItDeclarationOptions(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: value }
        }));
    };

    const handlePoiChange = (key, value) => {
        setPoiOptions(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: value }
        }));
    };

    const financialYearOptions = [
        { value: "2024-2025", label: "2024-2025" },
        { value: "2025-2026", label: "2025-2026" }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <ToastContainer position="top-right" autoClose={3000} theme="light" />

            <Box
                className="bg-white mt-4 p-6 rounded-xl shadow-lg max-w-5xl mx-auto border border-gray-200"
                sx={{ marginTop: '80px !important' }}
            >
                {/* Title and FY */}
                <Box className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <Typography variant="h4" className="font-bold font-header">
                        IT Declaration & POI Setup
                    </Typography>
                    <Box className="flex items-center gap-3">
                        <Typography variant="body1" className="min-w-[120px] font-semibold font-content">
                            Financial Year
                        </Typography>
                        <CustomSelect
                            label="Select FY"
                            value={financialYear}
                            onChange={(e) => setFinancialYear(e.target.value)}
                            options={financialYearOptions}
                            fullWidth={false}
                        />
                    </Box>
                </Box>

                <Alert severity="info" sx={{ backgroundColor: '#fef2f2', color: '#ef4444', '& .MuiAlert-icon': { color: '#ef4444' } }} className="mb-6 rounded-lg font-content">
                    <strong>Note:</strong> Configure settings for IT Declaration and Proof of Investments submission. Changes will apply to all selected employees.
                </Alert>

                {/* Tabs */}
                <StyledTabs value={tabValue} onChange={handleTabChange}>
                    <StyledTab label="IT Declaration" />
                    <StyledTab label="Proof of Investments" />
                </StyledTabs>
                <Divider className="mt-1" />

                {tabValue === 0 && (
                    <Box className="mt-6">
                        {[
                            { id: 1, label: "Choose Departments", key: "departments", description: "Select departments for IT declaration" },
                            { id: 2, label: "Choose Locations", key: "locations", description: "Select locations for IT declaration" },
                            { id: 3, label: "Choose Positions", key: "positions", description: "Select positions for IT declaration" },
                            { id: 4, label: "Choose Projects", key: "projects", description: "Select projects for IT declaration" },
                            { id: 5, label: "Choose Employees", key: "employees", description: "Select specific employees for IT declaration" },
                        ].map((item) => (
                            <Card
                                key={item.key}
                                variant="outlined"
                                className="mb-4 rounded-xl border-gray-200 bg-gray-50"
                            >
                                <CardContent className="p-4 pb-4">
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={1}>
                                            <Chip
                                                label={item.id}
                                                size="small"
                                                style={{
                                                    backgroundColor: primaryColor,
                                                    color: "white",
                                                    fontWeight: "bold"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={11}>
                                            <SelectionDropdown
                                                label={item.label}
                                                value={itDeclarationOptions[item.key].selected}
                                                total={itDeclarationOptions[item.key].total}
                                                onChange={(value) => handleItDeclarationChange(item.key, value)}
                                                description={item.description}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}

                        <Card
                            variant="outlined"
                            className="mb-6 rounded-xl border-gray-200 bg-gray-50"
                        >
                            <CardContent className="p-4 pb-4">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={1}>
                                        <Chip
                                            label="6"
                                            size="small"
                                            style={{
                                                backgroundColor: primaryColor,
                                                color: "white",
                                                fontWeight: "bold"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Box className="flex flex-col gap-2">
                                            <Box className="flex items-center">
                                                <Typography className="font-semibold font-content">Cut off Date</Typography>
                                                <Tooltip title="Set the last date for submission" arrow placement="top">
                                                    <IconButton size="small" className="ml-1">
                                                        <InfoOutlinedIcon fontSize="small" className="text-gray-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <CustomDatePicker
                                                value={cutoffDate}
                                                onChange={setCutoffDate}
                                                label="Select cut off date"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Typography variant="h6" className="font-semibold mb-4 font-header" style={{ color: primaryColor }}>
                            Selection Summary
                        </Typography>
                        <Box className="flex flex-wrap gap-4 mb-6">
                            {[
                                { label: "Departments", key: "departments" },
                                { label: "Locations", key: "locations" },
                                { label: "Positions", key: "positions" },
                                { label: "Projects", key: "projects" },
                                { label: "Employees", key: "employees" },
                            ].map((item) => (
                                <SummaryCard key={item.key}>
                                    <Typography variant="body2" className="text-gray-500 font-semibold font-content">
                                        {item.label}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        className="font-bold mt-1 font-header"
                                        style={{ color: primaryColor }}
                                    >
                                        {itDeclarationOptions[item.key].selected}
                                        <Typography component="span" variant="body2" className="text-gray-500 ml-1 font-content">
                                            / {itDeclarationOptions[item.key].total}
                                        </Typography>
                                    </Typography>
                                    <Box className="mt-2">
                                        <Chip
                                            label={itDeclarationOptions[item.key].selected === itDeclarationOptions[item.key].total ? "All Selected" : "Partial Selection"}
                                            size="small"
                                            color={itDeclarationOptions[item.key].selected === itDeclarationOptions[item.key].total ? "success" : "warning"}
                                            variant="outlined"
                                        />
                                    </Box>
                                </SummaryCard>
                            ))}
                        </Box>

                        <Box className="flex justify-end gap-3">
                            <Button
                                onClick={handleSubmitButton}
                                variant="contained"
                                style={{ backgroundColor: primaryColor }}
                                className="font-semibold normal-case px-6 min-h-[42px] rounded-lg shadow-none hover:shadow-none font-content"
                                endIcon={<ArrowForwardIcon />}
                            >
                                Start IT Declaration
                            </Button>
                        </Box>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box className="mt-6">
                        {[
                            { id: 1, label: "Choose Departments", key: "departments", description: "Select departments for POI submission" },
                            { id: 2, label: "Choose Locations", key: "locations", description: "Select locations for POI submission" },
                            { id: 3, label: "Choose Positions", key: "positions", description: "Select positions for POI submission" },
                            { id: 4, label: "Choose Projects", key: "projects", description: "Select projects for POI submission" },
                            { id: 5, label: "Choose Employees", key: "employees", description: "Select specific employees for POI submission" },
                        ].map((item) => (
                            <Card
                                key={item.key}
                                variant="outlined"
                                className="mb-4 rounded-xl border-gray-200 bg-gray-50"
                            >
                                <CardContent className="p-4 pb-4">
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={1}>
                                            <Chip
                                                label={item.id}
                                                size="small"
                                                style={{
                                                    backgroundColor: primaryColor,
                                                    color: "white",
                                                    fontWeight: "bold"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={11}>
                                            <SelectionDropdown
                                                label={item.label}
                                                value={poiOptions[item.key].selected}
                                                total={poiOptions[item.key].total}
                                                onChange={(value) => handlePoiChange(item.key, value)}
                                                description={item.description}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}

                        <Card
                            variant="outlined"
                            className="mb-6 rounded-xl border-gray-200 bg-gray-50"
                        >
                            <CardContent className="p-4 pb-4">
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={1}>
                                        <Chip
                                            label="6"
                                            size="small"
                                            style={{
                                                backgroundColor: primaryColor,
                                                color: "white",
                                                fontWeight: "bold"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Box className="flex flex-col gap-2">
                                            <Box className="flex items-center">
                                                <Typography className="font-semibold font-content">Cut off Date</Typography>
                                                <Tooltip title="Set the last date for POI submission" arrow placement="top">
                                                    <IconButton size="small" className="ml-1">
                                                        <InfoOutlinedIcon fontSize="small" className="text-gray-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <CustomDatePicker
                                                value={poiCutoffDate}
                                                onChange={setPoiCutoffDate}
                                                label="Select POI cut off date"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Typography variant="h6" className="font-semibold mb-4 font-header" style={{ color: primaryColor }}>
                            Selection Summary
                        </Typography>
                        <Box className="flex flex-wrap gap-4 mb-6">
                            {[
                                { label: "Departments", key: "departments" },
                                { label: "Locations", key: "locations" },
                                { label: "Positions", key: "positions" },
                                { label: "Projects", key: "projects" },
                                { label: "Employees", key: "employees" },
                            ].map((item) => (
                                <SummaryCard key={item.key}>
                                    <Typography variant="body2" className="text-gray-500 font-semibold font-content">
                                        {item.label}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        className="font-bold mt-1 font-header"
                                        style={{ color: primaryColor }}
                                    >
                                        {poiOptions[item.key].selected}
                                        <Typography component="span" variant="body2" className="text-gray-500 ml-1 font-content">
                                            / {poiOptions[item.key].total}
                                        </Typography>
                                    </Typography>
                                    <Box className="mt-2">
                                        <Chip
                                            label={poiOptions[item.key].selected === poiOptions[item.key].total ? "All Selected" : "Partial Selection"}
                                            size="small"
                                            color={poiOptions[item.key].selected === poiOptions[item.key].total ? "success" : "warning"}
                                            variant="outlined"
                                        />
                                    </Box>
                                </SummaryCard>
                            ))}
                        </Box>

                        <Box className="flex justify-end gap-3">
                            <Button
                                onClick={handleSubmitButton}
                                variant="contained"
                                style={{ backgroundColor: primaryColor }}
                                className="font-semibold normal-case px-6 min-h-[42px] rounded-lg shadow-none hover:shadow-none font-content"
                                endIcon={<ArrowForwardIcon />}
                                disabled={!itDeclarationSubmitted}
                            >
                                Start POI Submission
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </div>
    );
}

export default ITAdmin;