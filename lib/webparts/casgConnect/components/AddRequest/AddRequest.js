var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import styles from "./AddRequest.module.scss";
import { Button, Combobox, Option, Field, Radio, RadioGroup, Checkbox, Input, FluentProvider, webLightTheme, Divider, Textarea, Text, Card, CardHeader, CardPreview, Label, Persona, Badge, useId, useToastController, Toast, ToastBody, ToastTitle, Toaster, Subtitle2, } from "@fluentui/react-components";
import { Icon } from "@fluentui/react";
import { ArrowLeft20Filled, Attach20Filled, Delete24Filled, Delete24Regular, bundleIcon, } from "@fluentui/react-icons";
import { getFileTypeIconProps, initializeFileTypeIcons, } from "@fluentui/react-file-type-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Envcontext } from "../CasgConnect";
import { getUsers } from "../Helpers/MSGraph";
import { AddAttachments, UpdateRequestNumber, UpdateRequestPath, getUserContext, getUserRequests, postNewRequest, sendNotification, } from "../Helpers/PnpJS";
import { useNavigate } from "react-router-dom";
import { GetCustomerDetails } from "../Helpers/CRM";
import { v4 as uuidv4 } from "uuid";
initializeFileTypeIcons(undefined);
function AddRequest() {
    const NAVIGATE = useNavigate();
    const UUID = uuidv4();
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    const BUDGET = ["1-2 Lakhs", "2-3 Lakhs", "4-5 lakhs", "Above 5 lakhs"];
    const PROCUREMENTLEVEL = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [License, setLicense] = useState({
        data: {
            "Microsoft SharePoint": false,
            "Microsoft Teams": false,
            "Power Platform": false,
            "Open Source": false,
            "App Modernization": false,
            "DevOps Consultation": false,
        },
        state: "none",
        message: "",
    });
    const DELETE = bundleIcon(Delete24Filled, Delete24Regular);
    const [files, setFile] = useState([]);
    const [ADUsers, setADUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        userName: "",
        userEmailId: "",
        userId: "",
    });
    const [AccountNames, setAccountNames] = useState([]);
    const [Account_Owner, setAccount_Owner] = useState({
        state: "none",
        message: "",
        data: { userName: "", userEmailId: "" },
    });
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [Account_Name, setAccount_Name] = useState({
        state: "warning",
        message: "Please enter atleast 3 characters",
        data: "",
    });
    const [Reserved_Budget, setReserved_Budget] = useState({
        state: "",
        message: "",
        data: "1-2 Lakhs",
    });
    const [Procurement_Levels, setProcurement_Levels] = useState({
        state: "",
        message: "",
        data: "1",
    });
    const [Timeline, setTimeline] = useState({
        state: "none",
        message: "",
        data: "Urgent",
    });
    const [Contact_Person, setContact_Person] = useState({
        state: "none",
        message: "",
        data: "",
    });
    const [Contact_Number, setContact_Number] = useState({
        state: "none",
        message: "",
        data: "",
    });
    const [Notes, setNotes] = useState({
        state: "none",
        message: "",
        data: "",
    });
    const [Vendors, setVendors] = useState({
        state: "none",
        message: "",
        data: "No",
    });
    const [Employees, setEmployees] = useState({
        state: "none",
        message: "",
        data: "10-100",
    });
    const [End_Users, setEnd_Users] = useState({
        state: "none",
        message: "",
        data: "Below 50",
    });
    let context = useContext(Envcontext);
    const fileInputRef = useRef(null);
    useEffect(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            yield getUserContext()
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                console.log(yield result);
                setCurrentUser({
                    userName: yield result.Title,
                    userEmailId: yield result.UserPrincipalName,
                    userId: yield result.Id,
                });
            }))
                .catch((err) => {
                console.log(err);
            });
        }))();
    }, []);
    useEffect(() => {
        setAccount_Owner((val) => (Object.assign(Object.assign({}, val), { data: {
                userName: currentUser.userName,
                userEmailId: currentUser.userEmailId,
            } })));
        (() => __awaiter(this, void 0, void 0, function* () {
            getUserRequests().then((result) => console.log(result));
        }))();
    }, [currentUser]);
    useEffect(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            yield getUsers(context)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                console.log(yield result);
                setADUsers(yield result);
            }))
                .catch((err) => {
                console.log(err);
            });
            yield GetCustomerDetails()
                .then((result) => {
                console.log(result);
                setAccountNames(result);
            })
                .catch((err) => console.log(err));
        }))();
    }, [context]);
    const uploadfile = (event) => {
        let fileitems = event.target.files;
        console.log(event.target.files.length);
        console.log(files);
        for (let a = 0; a < event.target.files.length; a++) {
            if (!files.map((val) => val.filename).includes(fileitems[a].name)) {
                console.log(fileitems[a].name);
                setFile((file) => [
                    ...file,
                    {
                        filename: fileitems[a].name,
                        props: fileitems[a],
                        ext: fileitems[a].name.split(".")[1],
                    },
                ]);
                console.log(files);
            }
            else {
            }
        }
    };
    const handleNavigateDashboard = () => {
        NAVIGATE(`/`);
    };
    const removeSelectedfile = (value) => {
        setFile((file) => file.filter((val) => val.filename != value));
        fileInputRef.current.value = null;
    };
    const onAccount_OwnerSelect = (event, data) => {
        console.log(data);
        setAccount_Owner({
            data: { userName: data.optionText, userEmailId: data.optionValue },
            state: "none",
            message: "",
        });
    };
    const onAccount_NameSelect = (event, data) => {
        console.log(data);
        setAccount_Name({
            data: data.optionText,
            state: "none",
            message: "",
        });
    };
    const onReserved_BudgetSelect = (event, data) => {
        console.log(data);
        setReserved_Budget({
            data: data.optionText,
            state: "none",
            message: "",
        });
    };
    const onProcurement_Levels = (event, data) => {
        console.log(data);
        setProcurement_Levels({
            data: data.optionText,
            state: "none",
            message: "",
        });
    };
    const fileType = (value) => {
        console.log(value);
        switch (value.ext) {
            case "accdb":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "accdb",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "csv":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "csv",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "docx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "docx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "dotx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "dotx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "mpp":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "mpp",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "mpt":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "mpt",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "one":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "one",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "onetoc":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "onetoc",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "potx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "potx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "ppsx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "ppsx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "pptx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "pptx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "pub":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "pub",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "vsdx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "vsdx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "vssx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "vssx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "vstx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "vstx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "xlsx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "xlsx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "xltx":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "xltx",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "xsn":
                return (React.createElement(Icon, Object.assign({}, getFileTypeIconProps({
                    extension: "xsn",
                    size: 48,
                    imageFileType: "png",
                }))));
            case "pdf":
                return (React.createElement("img", { src: require("../../assets/PDF.png"), alt: value.filename, title: value.filename, className: styles.previewRequesterPDF }));
            default:
                return (React.createElement("img", { src: require("../../assets/File.png"), alt: value.filename, title: value.filename, className: styles.previewRequesterImage }));
        }
    };
    const handleAccountName = (event) => {
        const value = event.target.value.trim();
        console.log(value);
        if (event.target.value.length < 3) {
            setAccount_Name((val) => (Object.assign(Object.assign({}, val), { state: "warning", message: "Please enter atleast 3 characters" })));
        }
        else {
            const matches = AccountNames.filter((option) => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
            setFilteredAccounts(matches);
        }
        console.log(value);
    };
    const handleLicense = (event, data) => {
        console.log(event);
        console.log(License);
        setLicense((value) => ({
            state: "none",
            message: "",
            data: Object.assign(Object.assign({}, value.data), { [event.target.name]: data.checked }),
        }));
    };
    const handleTimeline = (event, data) => {
        setTimeline({
            state: "none",
            message: "",
            data: data.value,
        });
    };
    const handleVendors = (event, data) => {
        setVendors({
            state: "none",
            message: "",
            data: data.value,
        });
    };
    const handleEmployees = (event, data) => {
        setEmployees({
            state: "none",
            message: "",
            data: data.value,
        });
    };
    const handleEnd_Users = (event, data) => {
        setEnd_Users({
            state: "none",
            message: "",
            data: data.value,
        });
    };
    const handleContact_Person = (event, data) => {
        setContact_Person({ state: "none", message: "", data: data.value });
    };
    const handleContact_Number = (event, data) => {
        setContact_Number({ state: "none", message: "", data: data.value });
    };
    const handleNotes = (event, data) => {
        setNotes({ state: "none", message: "", data: data.value });
    };
    const notify = (type, message, intent) => dispatchToast(React.createElement(Toast, null,
        React.createElement(ToastTitle, null, type),
        React.createElement(ToastBody, null, message)), { position: "top", intent: intent });
    const handleResetDetails = () => __awaiter(this, void 0, void 0, function* () {
        yield getUserContext()
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            console.log(yield result);
            setCurrentUser({
                userName: yield result.Title,
                userEmailId: yield result.UserPrincipalName,
                userId: yield result.Id,
            });
        }))
            .catch((err) => {
            console.log(err);
        });
        setLicense({
            data: {
                "Microsoft SharePoint": false,
                "Microsoft Teams": false,
                "Power Platform": false,
                "Open Source": false,
                "App Modernization": false,
                "DevOps Consultation": false,
            },
            state: "none",
            message: "",
        });
        setFile([]);
        setFilteredAccounts([]);
        setAccount_Name({
            state: "warning",
            message: "Please enter atleast 3 characters",
            data: "",
        });
        setReserved_Budget({
            state: "",
            message: "",
            data: "1-2 Lakhs",
        });
        setProcurement_Levels({
            state: "",
            message: "",
            data: "1",
        });
        setTimeline({
            state: "none",
            message: "",
            data: "Urgent",
        });
        setContact_Person({
            state: "none",
            message: "",
            data: "",
        });
        setContact_Number({
            state: "none",
            message: "",
            data: "",
        });
        setNotes({
            state: "none",
            message: "",
            data: "",
        });
        setVendors({
            state: "none",
            message: "",
            data: "No",
        });
        setEmployees({
            state: "none",
            message: "",
            data: "10-100",
        });
        setEnd_Users({
            state: "none",
            message: "",
            data: "Below 50",
        });
    });
    const handleSubmitRequest = () => __awaiter(this, void 0, void 0, function* () {
        console.log(Account_Owner);
        const hasTrueValue = Object.values(License.data).some((value) => value === true);
        if (Account_Name.data == "" ||
            Contact_Person.data == "" ||
            Contact_Number.data == "" ||
            !hasTrueValue) {
            if (Account_Name.data == "" || Account_Name.data == undefined) {
                setAccount_Name((val) => (Object.assign(Object.assign({}, val), { state: "error", message: "Please provide Account Name" })));
            }
            else {
                setAccount_Name((val) => (Object.assign(Object.assign({}, val), { state: "none", message: "" })));
            }
            if (Contact_Person.data == "") {
                setContact_Person((val) => (Object.assign(Object.assign({}, val), { state: "error", message: "Please provide Contact person details" })));
            }
            else {
                setContact_Person((val) => (Object.assign(Object.assign({}, val), { state: "none", message: "" })));
            }
            if (Contact_Number.data == "") {
                setContact_Number((val) => (Object.assign(Object.assign({}, val), { state: "error", message: "Please provide Contact number details" })));
            }
            else {
                setContact_Number((val) => (Object.assign(Object.assign({}, val), { state: "none", message: "" })));
            }
            if (!hasTrueValue) {
                setLicense((val) => (Object.assign(Object.assign({}, val), { state: "error", message: "Please select the license details" })));
            }
            else {
                setLicense((val) => (Object.assign(Object.assign({}, val), { state: "none", message: "" })));
            }
        }
        else {
            yield postNewRequest({
                Account_Owner: {
                    userName: Account_Owner.data.userName,
                    userEmailId: Account_Owner.data.userEmailId,
                },
                Account_Name: Account_Name.data,
                Reserved_Budget: Reserved_Budget.data,
                License: Object.keys(License.data).filter((key) => License.data[key] === true),
                Timeline: Timeline.data,
                Vendors: Vendors.data == "Yes" ? true : false,
                Contact_Person: Contact_Person.data,
                Contact_Number: Contact_Number.data,
                Procurement_Levels: Procurement_Levels.data,
                Employees: Employees.data,
                End_Users: End_Users.data,
                Notes: Notes.data,
                UUID: UUID,
            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                if (result.status == "ok") {
                    const ID = "CASG" +
                        new Date().getFullYear().toString().slice(-2) +
                        String(result.result.ID).padStart(4, "0");
                    yield UpdateRequestNumber(result.result, ID).then((updateID) => __awaiter(this, void 0, void 0, function* () {
                        if (updateID.status == "ok") {
                            if (files.length != 0) {
                                yield AddAttachments(files, result.result, ID).then((Attachmentresult) => __awaiter(this, void 0, void 0, function* () {
                                    console.log(Attachmentresult);
                                    yield UpdateRequestPath(result.result, ID).then((pathresult) => __awaiter(this, void 0, void 0, function* () {
                                        if (pathresult.status == "ok") {
                                            notify("Request Details", "Data submitted successfully!", "success");
                                        }
                                        else {
                                            console.log("path");
                                            notify("Request Details", "Something went wrong", "error");
                                        }
                                        yield sendNotification(result.result, ID, true).then((Notificationresult) => {
                                            console.log(Notificationresult);
                                            if (Notificationresult.status == "ok") {
                                                notify("Notification", "Email sent successfully!", "success");
                                                handleResetDetails();
                                            }
                                            else {
                                                console.log("mail");
                                                notify("Notification", "Something went wrong", "error");
                                            }
                                        });
                                    }));
                                }));
                            }
                            else {
                                yield sendNotification(result.result, ID, false).then((Notificationresult) => {
                                    console.log(Notificationresult);
                                    if (Notificationresult.status == "ok") {
                                        notify("Notification", "Email sent successfully!", "success");
                                        handleResetDetails();
                                    }
                                    else {
                                        notify("Notification", "Something went wrong", "error");
                                    }
                                });
                            }
                        }
                        else {
                            console.log("update");
                            notify("Request Details", "Something went wrong", "error");
                        }
                    }));
                }
                else {
                    console.log("details");
                    notify("Request Details", "Something went wrong", "error");
                }
            }));
        }
    });
    return (React.createElement("div", { className: `${styles.container_Wrapper} container-fluid` },
        React.createElement("div", { className: `${styles.addContainer} container` },
            React.createElement("div", { className: `${styles.headerWrapper}` },
                React.createElement("div", { className: `${styles.AddRequest_Button} ms-2` },
                    React.createElement(Button, { shape: "circular", appearance: "primary", icon: React.createElement(ArrowLeft20Filled, null), onClick: handleNavigateDashboard }),
                    "\u00A0",
                    React.createElement(Subtitle2, null, "ADD REQUEST")),
                React.createElement("div", null,
                    React.createElement("img", { className: styles.header_quadraLogo, src: require("../../assets/Logo_CASG_Connect.png"), loading: "lazy", alt: "Quadrs-CASG", title: "Quadrs-CASG" }))),
            React.createElement("div", { className: "row my-1" },
                React.createElement(Divider, null)),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Account Owner", validationState: Account_Owner.state, validationMessage: Account_Owner.message },
                            React.createElement(FluentProvider, { theme: webLightTheme },
                                React.createElement(Combobox, { style: { width: "100%" }, selectedOptions: [Account_Owner.data.userName], value: Account_Owner.data.userName, onOptionSelect: onAccount_OwnerSelect }, ADUsers.length > 0 &&
                                    ADUsers.map((option) => (React.createElement(Option, { text: option.userName, value: option.userEmailId },
                                        React.createElement(Persona, { avatar: { color: "colorful", "aria-hidden": true }, name: option.userName, secondaryText: option.userEmailId.length > 23
                                                ? option.userEmailId.slice(0, 23) + "..."
                                                : option.userEmailId })))))))),
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Account Name", validationState: Account_Name.state, validationMessage: Account_Name.message },
                            React.createElement(FluentProvider, { theme: webLightTheme },
                                React.createElement(Combobox, { style: { width: "100%" }, placeholder: "", value: Account_Name.data, selectedOptions: [Account_Name.data], onChange: handleAccountName, onOptionSelect: onAccount_NameSelect },
                                    filteredAccounts.map((option) => (React.createElement(Option, { key: option }, option))),
                                    filteredAccounts.length === 0 ? (React.createElement(Option, { key: "no-results", text: "" }, "No results found")) : null))))),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Reserved Budget(\u20B9-INR)", validationState: Reserved_Budget.state, validationMessage: Reserved_Budget.message },
                            React.createElement(FluentProvider, { theme: webLightTheme },
                                React.createElement(Combobox, { value: Reserved_Budget.data, selectedOptions: [Reserved_Budget.data], style: { width: "100%" }, placeholder: "Select your answer", onOptionSelect: onReserved_BudgetSelect }, BUDGET.map((option) => (React.createElement(Option, { key: option }, option))))))),
                    React.createElement("div", { className: "col m-2" })),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Existing License", validationState: License.state, validationMessage: License.message },
                            React.createElement(Checkbox, { checked: License.data["Microsoft SharePoint"], onChange: handleLicense, name: "Microsoft SharePoint", label: "Microsoft SharePoint" }),
                            React.createElement(Checkbox, { checked: License.data["Microsoft Teams"], onChange: handleLicense, label: "Microsoft Teams", name: "Microsoft Teams" }),
                            React.createElement(Checkbox, { checked: License.data["Power Platform"], onChange: handleLicense, label: "Power Platform", name: "Power Platform" }),
                            React.createElement(Checkbox, { checked: License.data["Open Source"], onChange: handleLicense, label: "Open Source", name: "Open Source" }),
                            React.createElement(Checkbox, { checked: License.data["App Modernization"], onChange: handleLicense, label: "App Modernization", name: "App Modernization" }),
                            React.createElement(Checkbox, { checked: License.data["DevOps Consultation"], onChange: handleLicense, label: "DevOps Consultation", name: "DevOps Consultation" }))),
                    React.createElement("div", { className: "col m-2" },
                        React.createElement("div", { className: "row mb-2" },
                            React.createElement(Field, { required: true, label: "Expected Timeline", validationState: Timeline.state, validationMessage: Timeline.message },
                                React.createElement(RadioGroup, { onChange: handleTimeline, value: Timeline.data },
                                    React.createElement(Radio, { value: "Urgent", label: "Urgent" }),
                                    React.createElement(Radio, { value: "Need", label: "Need" }),
                                    React.createElement(Radio, { value: "Above 2 months", label: "Above 2 months" })))),
                        React.createElement("div", { className: "row mb-2" },
                            React.createElement(Field, { required: true, label: "Looking for other vendors", validationState: Vendors.state, validationMessage: Vendors.message },
                                React.createElement(RadioGroup, { onChange: handleVendors, value: Vendors.data },
                                    React.createElement(Radio, { value: "Yes", label: "Yes" }),
                                    React.createElement(Radio, { value: "No", label: "No" })))))),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Contact Person", validationState: Contact_Person.state, validationMessage: Contact_Person.message },
                            React.createElement(Input, { value: Contact_Person.data, onChange: handleContact_Person }))),
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Contact Number", validationState: Contact_Number.state, validationMessage: Contact_Number.message },
                            React.createElement(Input, { value: Contact_Number.data, onChange: handleContact_Number })))),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Procurement Levels", validationState: Procurement_Levels.state, validationMessage: Procurement_Levels.message },
                            React.createElement(FluentProvider, { theme: webLightTheme },
                                React.createElement(Combobox, { style: { width: "100%" }, placeholder: "Select your answer", value: Procurement_Levels.data, selectedOptions: [Procurement_Levels.data], onOptionSelect: onProcurement_Levels }, PROCUREMENTLEVEL.map((option) => (React.createElement(Option, { key: option }, option))))))),
                    React.createElement("div", { className: "col m-2" })),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Total no. of Employees", validationState: Employees.state, validationMessage: Employees.message },
                            React.createElement(RadioGroup, { onChange: handleEmployees, value: Employees.data },
                                React.createElement(Radio, { value: "10-100", label: "10-100" }),
                                React.createElement(Radio, { value: "100-250", label: "100-250" }),
                                React.createElement(Radio, { value: "250-1000", label: "250-1000" }),
                                React.createElement(Radio, { value: "More than 1000", label: "More than 1000" })))),
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, label: "Total no. of End Users", validationState: End_Users.state, validationMessage: End_Users.message },
                            React.createElement(RadioGroup, { onChange: handleEnd_Users, value: End_Users.data },
                                React.createElement(Radio, { value: "Below 50", label: "Below 50" }),
                                React.createElement(Radio, { value: "50-150", label: "50-150" }),
                                React.createElement(Radio, { value: "150-250", label: "150-250" }),
                                React.createElement(Radio, { value: "More than 250", label: "More than 250" }))))),
                React.createElement("div", { className: "row m-1" },
                    React.createElement("div", { className: "col m-2" },
                        React.createElement(Field, { required: true, validationState: "none", validationMessage: "", style: { display: "flex", gap: "10px" } },
                            React.createElement(Label, null, "Requirement Documents(if any)"),
                            React.createElement("span", null,
                                React.createElement("input", { type: "file", name: "file", id: "file", multiple: true, className: styles.inputfile, onChange: uploadfile }),
                                React.createElement("label", { htmlFor: "file" },
                                    React.createElement(Badge, { appearance: "filled", color: "brand", style: {
                                            padding: "13px",
                                            display: "flex",
                                            alignItems: "center",
                                        } },
                                        React.createElement(Attach20Filled, { style: { color: "#fff" } }),
                                        React.createElement(Text, { style: { color: "#fff" } }, "Attach"))))),
                        React.createElement("div", { className: `${styles.Attachmentwrapper} mt-1` }, files.length == 0 ? (React.createElement(React.Fragment, null,
                            React.createElement("div", { style: {
                                    padding: "10px 0",
                                    margin: "auto",
                                    textAlign: "center",
                                } },
                                React.createElement("img", { style: {
                                        // borderStyle:'dashed',
                                        display: "block",
                                        margin: "auto",
                                        width: "90px",
                                    }, src: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230524.001/office-ui-fabric-react-assets/images/emptyfolder/empty_folder.svg" }),
                                React.createElement(Label, { disabled: true }, "No Attachments!")))) : (React.createElement(React.Fragment, null, files.map((res) => (React.createElement(FluentProvider, { theme: webLightTheme },
                            React.createElement(Card, { className: styles.AttachmentCard, size: "small", orientation: "horizontal", style: { margin: "0.7vw" } },
                                React.createElement(CardPreview, null, () => fileType(res)),
                                React.createElement(CardHeader, { style: { width: "200px" }, key: res.filename, header: React.createElement(Text, null, res.filename.length > 20
                                        ? res.filename.slice(0, 20) + "..."
                                        : res.filename), action: React.createElement(Button, { icon: React.createElement(DELETE, null), onClick: () => {
                                            removeSelectedfile(res.filename);
                                        } }) }))))))))))),
            React.createElement("div", { className: "row m-1" },
                React.createElement("div", { className: "col m-2" },
                    React.createElement(Field, { label: "Notes", validationState: "none", validationMessage: "" },
                        React.createElement(Textarea, { value: Notes.data, onChange: handleNotes })))),
            React.createElement("div", { className: `${styles.submit_Container} row` },
                React.createElement(Button, { appearance: "primary", style: { width: "100px" }, onClick: handleSubmitRequest }, "Submit"),
                React.createElement(Button, { style: { width: "100px" }, onClick: handleResetDetails }, "Reset"))),
        React.createElement(Toaster, { toasterId: toasterId })));
}
export default AddRequest;
//# sourceMappingURL=AddRequest.js.map