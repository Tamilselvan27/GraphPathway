import * as React from "react";
import styles from "./AddRequest.module.scss";
import {
  Button,
  Combobox,
  Option,
  Field,
  Radio,
  RadioGroup,
  Checkbox,
  Input,
  FluentProvider,
  webLightTheme,
  Divider,
  Textarea,
  Text,
  Card,
  CardHeader,
  CardPreview,
  Label,
  Persona,
  ComboboxProps,
  Badge,
  useId,
  useToastController,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  Subtitle2,
} from "@fluentui/react-components";
import { Icon } from "@fluentui/react";
import {
  ArrowLeft20Filled,
  Attach20Filled,
  Delete24Filled,
  Delete24Regular,
  bundleIcon,
} from "@fluentui/react-icons";
import {
  getFileTypeIconProps,
  initializeFileTypeIcons,
} from "@fluentui/react-file-type-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Envcontext } from "../CasgConnect";
import { getUsers } from "../Helpers/MSGraph";
import {
  AddAttachments,
  UpdateRequestNumber,
  UpdateRequestPath,
  getUserContext,
  getUserRequests,
  postNewRequest,
  sendNotification,
} from "../Helpers/PnpJS";
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
  const [License, setLicense]: any = useState({
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
  const [files, setFile]: any = useState([]);
  const [ADUsers, setADUsers]: any = useState<any>([]);
  const [currentUser, setCurrentUser]: any = useState({
    userName: "",
    userEmailId: "",
    userId: "",
  });
  const [AccountNames, setAccountNames]: any = useState([]);
  const [Account_Owner, setAccount_Owner]: any = useState({
    state: "none",
    message: "",
    data: { userName: "", userEmailId: "" },
  });

  const [filteredAccounts, setFilteredAccounts]: any = useState([]);

  const [Account_Name, setAccount_Name]: any = useState({
    state: "warning",
    message: "Please enter atleast 3 characters",
    data: "",
  });
  const [Reserved_Budget, setReserved_Budget]: any = useState({
    state: "",
    message: "",
    data: "1-2 Lakhs",
  });
  const [Procurement_Levels, setProcurement_Levels]: any = useState({
    state: "",
    message: "",
    data: "1",
  });

  const [Timeline, setTimeline]: any = useState({
    state: "none",
    message: "",
    data: "Urgent",
  });

  const [Contact_Person, setContact_Person]: any = useState({
    state: "none",
    message: "",
    data: "",
  });

  const [Contact_Number, setContact_Number]: any = useState({
    state: "none",
    message: "",
    data: "",
  });
  const [Notes, setNotes]: any = useState({
    state: "none",
    message: "",
    data: "",
  });

  const [Vendors, setVendors]: any = useState({
    state: "none",
    message: "",
    data: "No",
  });

  const [Employees, setEmployees]: any = useState({
    state: "none",
    message: "",
    data: "10-100",
  });

  const [End_Users, setEnd_Users]: any = useState({
    state: "none",
    message: "",
    data: "Below 50",
  });

  let context = useContext(Envcontext);
  const fileInputRef: any = useRef(null);

  useEffect(() => {
    (async (): Promise<void> => {
      await getUserContext()
        .then(async (result: any) => {
          console.log(await result);
          setCurrentUser({
            userName: await result.Title,
            userEmailId: await result.UserPrincipalName,
            userId: await result.Id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
    setAccount_Owner((val: any) => ({
      ...val,
      data: {
        userName: currentUser.userName,
        userEmailId: currentUser.userEmailId,
      },
    }));
    (async () => {
      getUserRequests().then((result: any) => console.log(result));
    })();
  }, [currentUser]);

  useEffect(() => {
    (async (): Promise<void> => {
      await getUsers(context)
        .then(async (result: any) => {
          console.log(await result);
          setADUsers(await result);
        })
        .catch((err) => {
          console.log(err);
        });
      await GetCustomerDetails()
        .then((result) => {
          console.log(result);
          setAccountNames(result);
        })
        .catch((err) => console.log(err));
    })();
  }, [context]);

  const uploadfile = (event: any) => {
    let fileitems = event.target.files;
    console.log(event.target.files.length);
    console.log(files);
    for (let a = 0; a < event.target.files.length; a++) {
      if (!files.map((val: any) => val.filename).includes(fileitems[a].name)) {
        console.log(fileitems[a].name);

        setFile((file: any) => [
          ...file,
          {
            filename: fileitems[a].name,
            props: fileitems[a],
            ext: fileitems[a].name.split(".")[1],
          },
        ]);
        console.log(files);
      } else {
      }
    }
  };

  const handleNavigateDashboard = () => {
    NAVIGATE(`/`);
  };

  const removeSelectedfile = (value: any) => {
    setFile((file: any) => file.filter((val: any) => val.filename != value));
    fileInputRef.current.value = null;
  };

  const onAccount_OwnerSelect: ComboboxProps["onOptionSelect"] = (
    event: any,
    data: any
  ) => {
    console.log(data);
    setAccount_Owner({
      data: { userName: data.optionText, userEmailId: data.optionValue },
      state: "none",
      message: "",
    });
  };

  const onAccount_NameSelect: ComboboxProps["onOptionSelect"] = (
    event: any,
    data: any
  ) => {
    console.log(data);
    setAccount_Name({
      data: data.optionText,
      state: "none",
      message: "",
    });
  };

  const onReserved_BudgetSelect: ComboboxProps["onOptionSelect"] = (
    event: any,
    data: any
  ) => {
    console.log(data);
    setReserved_Budget({
      data: data.optionText,
      state: "none",
      message: "",
    });
  };

  const onProcurement_Levels: ComboboxProps["onOptionSelect"] = (
    event: any,
    data: any
  ) => {
    console.log(data);
    setProcurement_Levels({
      data: data.optionText,
      state: "none",
      message: "",
    });
  };

  const fileType = (value: any) => {
    console.log(value);
    switch (value.ext) {
      case "accdb":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "accdb",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "csv":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "csv",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "docx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "docx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "dotx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "dotx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "mpp":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "mpp",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "mpt":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "mpt",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "one":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "one",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "onetoc":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "onetoc",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "potx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "potx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "ppsx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "ppsx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "pptx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "pptx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "pub":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "pub",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "vsdx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "vsdx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "vssx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "vssx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "vstx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "vstx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "xlsx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "xlsx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "xltx":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "xltx",
              size: 48,
              imageFileType: "png",
            })}
          />
        );

      case "xsn":
        return (
          <Icon
            {...getFileTypeIconProps({
              extension: "xsn",
              size: 48,
              imageFileType: "png",
            })}
          />
        );
      case "pdf":
        return (
          <img
            src={require("../../assets/PDF.png")}
            alt={value.filename}
            title={value.filename}
            className={styles.previewRequesterPDF}
          />
        );
      default:
        return (
          <img
            src={require("../../assets/File.png")}
            alt={value.filename}
            title={value.filename}
            className={styles.previewRequesterImage}
          />
        );
    }
  };

  const handleAccountName = (event: any) => {
    const value = event.target.value.trim();
    console.log(value);
    if (event.target.value.length < 3) {
      setAccount_Name((val: any) => ({
        ...val,
        state: "warning",
        message: "Please enter atleast 3 characters",
      }));
    } else {
      const matches = AccountNames.filter(
        (option: any) => option.toLowerCase().indexOf(value.toLowerCase()) === 0
      );
      setFilteredAccounts(matches);
    }

    console.log(value);
  };

  const handleLicense = (event: any, data: any) => {
    console.log(event);
    console.log(License);
    setLicense((value: any) => ({
      state: "none",
      message: "",
      data: { ...value.data, [event.target.name]: data.checked },
    }));
  };

  const handleTimeline = (event: any, data: any) => {
    setTimeline({
      state: "none",
      message: "",
      data: data.value,
    });
  };
  const handleVendors = (event: any, data: any) => {
    setVendors({
      state: "none",
      message: "",
      data: data.value,
    });
  };
  const handleEmployees = (event: any, data: any) => {
    setEmployees({
      state: "none",
      message: "",
      data: data.value,
    });
  };
  const handleEnd_Users = (event: any, data: any) => {
    setEnd_Users({
      state: "none",
      message: "",
      data: data.value,
    });
  };

  const handleContact_Person = (event: any, data: any) => {
    setContact_Person({ state: "none", message: "", data: data.value });
  };

  const handleContact_Number = (event: any, data: any) => {
    setContact_Number({ state: "none", message: "", data: data.value });
  };

  const handleNotes = (event: any, data: any) => {
    setNotes({ state: "none", message: "", data: data.value });
  };

  const notify = (type: string, message: string, intent: any) =>
    dispatchToast(
      <Toast>
        <ToastTitle>{type}</ToastTitle>
        <ToastBody>{message}</ToastBody>
      </Toast>,
      { position: "top", intent: intent }
    );

  const handleResetDetails = async () => {
    await getUserContext()
      .then(async (result: any) => {
        console.log(await result);
        setCurrentUser({
          userName: await result.Title,
          userEmailId: await result.UserPrincipalName,
          userId: await result.Id,
        });
      })
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
  };

  const handleSubmitRequest = async () => {
    console.log(Account_Owner);
    const hasTrueValue = Object.values(License.data).some(
      (value) => value === true
    );
    if (
      Account_Name.data == "" ||
      Contact_Person.data == "" ||
      Contact_Number.data == "" ||
      !hasTrueValue
    ) {
      if (Account_Name.data == "" || Account_Name.data == undefined) {
        setAccount_Name((val: any) => ({
          ...val,
          state: "error",
          message: "Please provide Account Name",
        }));
      } else {
        setAccount_Name((val: any) => ({ ...val, state: "none", message: "" }));
      }

      if (Contact_Person.data == "") {
        setContact_Person((val: any) => ({
          ...val,
          state: "error",
          message: "Please provide Contact person details",
        }));
      } else {
        setContact_Person((val: any) => ({
          ...val,
          state: "none",
          message: "",
        }));
      }
      if (Contact_Number.data == "") {
        setContact_Number((val: any) => ({
          ...val,
          state: "error",
          message: "Please provide Contact number details",
        }));
      } else {
        setContact_Number((val: any) => ({
          ...val,
          state: "none",
          message: "",
        }));
      }
      if (!hasTrueValue) {
        setLicense((val: any) => ({
          ...val,
          state: "error",
          message: "Please select the license details",
        }));
      } else {
        setLicense((val: any) => ({ ...val, state: "none", message: "" }));
      }
    } else {
      await postNewRequest({
        Account_Owner: {
          userName: Account_Owner.data.userName,
          userEmailId: Account_Owner.data.userEmailId,
        },
        Account_Name: Account_Name.data,
        Reserved_Budget: Reserved_Budget.data,
        License: Object.keys(License.data).filter(
          (key: any) => License.data[key] === true
        ),
        Timeline: Timeline.data,
        Vendors: Vendors.data == "Yes" ? true : false,
        Contact_Person: Contact_Person.data,
        Contact_Number: Contact_Number.data,
        Procurement_Levels: Procurement_Levels.data,
        Employees: Employees.data,
        End_Users: End_Users.data,
        Notes: Notes.data,
        UUID: UUID,
      }).then(async (result: any) => {
        if (result.status == "ok") {
          const ID =
            "CASG" +
            new Date().getFullYear().toString().slice(-2) +
            String(result.result.ID).padStart(4, "0");
          await UpdateRequestNumber(result.result, ID).then(
            async (updateID: any) => {
              if (updateID.status == "ok") {
                if (files.length != 0) {
                  await AddAttachments(files, result.result, ID).then(
                    async (Attachmentresult: any) => {
                      console.log(Attachmentresult);

                      await UpdateRequestPath(result.result, ID).then(
                        async (pathresult: any) => {
                          if (pathresult.status == "ok") {
                            notify(
                              "Request Details",
                              "Data submitted successfully!",
                              "success"
                            );
                          } else {
                            console.log("path");
                            notify(
                              "Request Details",
                              "Something went wrong",
                              "error"
                            );
                          }
                          await sendNotification(result.result, ID, true).then(
                            (Notificationresult: any) => {
                              console.log(Notificationresult);
                              if (Notificationresult.status == "ok") {
                                notify(
                                  "Notification",
                                  "Email sent successfully!",
                                  "success"
                                );
                                handleResetDetails();
                              } else {
                                console.log("mail");
                                notify(
                                  "Notification",
                                  "Something went wrong",
                                  "error"
                                );
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  await sendNotification(result.result, ID, false).then(
                    (Notificationresult: any) => {
                      console.log(Notificationresult);
                      if (Notificationresult.status == "ok") {
                        notify(
                          "Notification",
                          "Email sent successfully!",
                          "success"
                        );
                        handleResetDetails();
                      } else {
                        notify("Notification", "Something went wrong", "error");
                      }
                    }
                  );
                }
              } else {
                console.log("update");
                notify("Request Details", "Something went wrong", "error");
              }
            }
          );
        } else {
          console.log("details");
          notify("Request Details", "Something went wrong", "error");
        }
      });
    }
  };

  return (
    <div className={`${styles.container_Wrapper} container-fluid`}>
      <div className={`${styles.addContainer} container`}>
        <div className={`${styles.headerWrapper}`}>
          <div className={`${styles.AddRequest_Button} ms-2`}>
            <Button
              shape="circular"
              appearance="primary"
              icon={<ArrowLeft20Filled />}
              onClick={handleNavigateDashboard}
            ></Button>
            &nbsp;
            <Subtitle2>ADD REQUEST</Subtitle2>
          </div>
          <div>
            <img
              className={styles.header_quadraLogo}
              src={require("../../assets/Logo_CASG_Connect.png")}
              loading="lazy"
              alt="Quadrs-CASG"
              title="Quadrs-CASG"
            />
          </div>
        </div>
        <div className="row my-1">
          <Divider />
        </div>
        <div className="row">
          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Account Owner"
                validationState={Account_Owner.state}
                validationMessage={Account_Owner.message}
              >
                <FluentProvider theme={webLightTheme}>
                  <Combobox
                    style={{ width: "100%" }}
                    selectedOptions={[Account_Owner.data.userName]}
                    value={Account_Owner.data.userName}
                    onOptionSelect={onAccount_OwnerSelect}
                  >
                    {ADUsers.length > 0 &&
                      ADUsers.map((option: any) => (
                        <Option
                          text={option.userName}
                          value={option.userEmailId}
                        >
                          <Persona
                            avatar={{ color: "colorful", "aria-hidden": true }}
                            name={option.userName}
                            secondaryText={
                              option.userEmailId.length > 23
                                ? option.userEmailId.slice(0, 23) + "..."
                                : option.userEmailId
                            }
                          />
                        </Option>
                      ))}
                  </Combobox>
                </FluentProvider>
              </Field>
            </div>
            <div className="col m-2">
              <Field
                required
                label="Account Name"
                validationState={Account_Name.state}
                validationMessage={Account_Name.message}
              >
                <FluentProvider theme={webLightTheme}>
                  <Combobox
                    style={{ width: "100%" }}
                    placeholder=""
                    value={Account_Name.data}
                    selectedOptions={[Account_Name.data]}
                    onChange={handleAccountName}
                    onOptionSelect={onAccount_NameSelect}
                  >
                    {filteredAccounts.map((option: any) => (
                      <Option key={option}>{option}</Option>
                    ))}
                    {filteredAccounts.length === 0 ? (
                      <Option key="no-results" text="">
                        No results found
                      </Option>
                    ) : null}
                  </Combobox>
                </FluentProvider>
              </Field>
            </div>
          </div>
          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Reserved Budget(&#x20b9;-INR)"
                validationState={Reserved_Budget.state}
                validationMessage={Reserved_Budget.message}
              >
                <FluentProvider theme={webLightTheme}>
                  <Combobox
                    value={Reserved_Budget.data}
                    selectedOptions={[Reserved_Budget.data]}
                    style={{ width: "100%" }}
                    placeholder="Select your answer"
                    onOptionSelect={onReserved_BudgetSelect}
                  >
                    {BUDGET.map((option) => (
                      <Option key={option}>{option}</Option>
                    ))}
                  </Combobox>
                </FluentProvider>
              </Field>
            </div>
            <div className="col m-2"></div>
          </div>

          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Existing License"
                validationState={License.state}
                validationMessage={License.message}
              >
                <Checkbox
                  checked={License.data["Microsoft SharePoint"]}
                  onChange={handleLicense}
                  name="Microsoft SharePoint"
                  label="Microsoft SharePoint"
                />
                <Checkbox
                  checked={License.data["Microsoft Teams"]}
                  onChange={handleLicense}
                  label="Microsoft Teams"
                  name="Microsoft Teams"
                />
                <Checkbox
                  checked={License.data["Power Platform"]}
                  onChange={handleLicense}
                  label="Power Platform"
                  name="Power Platform"
                />
                <Checkbox
                  checked={License.data["Open Source"]}
                  onChange={handleLicense}
                  label="Open Source"
                  name="Open Source"
                />

                <Checkbox
                  checked={License.data["App Modernization"]}
                  onChange={handleLicense}
                  label="App Modernization"
                  name="App Modernization"
                />
                <Checkbox
                  checked={License.data["DevOps Consultation"]}
                  onChange={handleLicense}
                  label="DevOps Consultation"
                  name="DevOps Consultation"
                />
              </Field>
            </div>
            <div className="col m-2">
              <div className="row mb-2">
                <Field
                  required
                  label="Expected Timeline"
                  validationState={Timeline.state}
                  validationMessage={Timeline.message}
                >
                  <RadioGroup onChange={handleTimeline} value={Timeline.data}>
                    <Radio value="Urgent" label="Urgent" />
                    <Radio value="Need" label="Need" />
                    <Radio value="Above 2 months" label="Above 2 months" />
                  </RadioGroup>
                </Field>
              </div>
              <div className="row mb-2">
                <Field
                  required
                  label="Looking for other vendors"
                  validationState={Vendors.state}
                  validationMessage={Vendors.message}
                >
                  <RadioGroup onChange={handleVendors} value={Vendors.data}>
                    <Radio value="Yes" label="Yes" />
                    <Radio value="No" label="No" />
                  </RadioGroup>
                </Field>
              </div>
            </div>
          </div>
          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Contact Person"
                validationState={Contact_Person.state}
                validationMessage={Contact_Person.message}
              >
                <Input
                  value={Contact_Person.data}
                  onChange={handleContact_Person}
                />
              </Field>
            </div>
            <div className="col m-2">
              <Field
                required
                label="Contact Number"
                validationState={Contact_Number.state}
                validationMessage={Contact_Number.message}
              >
                <Input
                  value={Contact_Number.data}
                  onChange={handleContact_Number}
                />
              </Field>
            </div>
          </div>
          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Procurement Levels"
                validationState={Procurement_Levels.state}
                validationMessage={Procurement_Levels.message}
              >
                <FluentProvider theme={webLightTheme}>
                  <Combobox
                    style={{ width: "100%" }}
                    placeholder="Select your answer"
                    value={Procurement_Levels.data}
                    selectedOptions={[Procurement_Levels.data]}
                    onOptionSelect={onProcurement_Levels}
                  >
                    {PROCUREMENTLEVEL.map((option) => (
                      <Option key={option}>{option}</Option>
                    ))}
                  </Combobox>
                </FluentProvider>
              </Field>
            </div>
            <div className="col m-2"></div>
          </div>

          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                label="Total no. of Employees"
                validationState={Employees.state}
                validationMessage={Employees.message}
              >
                <RadioGroup onChange={handleEmployees} value={Employees.data}>
                  <Radio value="10-100" label="10-100" />
                  <Radio value="100-250" label="100-250" />
                  <Radio value="250-1000" label="250-1000" />
                  <Radio value="More than 1000" label="More than 1000" />
                </RadioGroup>
              </Field>
            </div>
            <div className="col m-2">
              <Field
                required
                label="Total no. of End Users"
                validationState={End_Users.state}
                validationMessage={End_Users.message}
              >
                <RadioGroup onChange={handleEnd_Users} value={End_Users.data}>
                  <Radio value="Below 50" label="Below 50" />
                  <Radio value="50-150" label="50-150" />
                  <Radio value="150-250" label="150-250" />
                  <Radio value="More than 250" label="More than 250" />
                </RadioGroup>
              </Field>
            </div>
          </div>
          <div className="row m-1">
            <div className="col m-2">
              <Field
                required
                validationState="none"
                validationMessage=""
                style={{ display: "flex", gap: "10px" }}
              >
                <Label>Requirement Documents(if any)</Label>
                <span>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    className={styles.inputfile}
                    onChange={uploadfile}
                  />

                  <label htmlFor="file">
                    <Badge
                      appearance="filled"
                      color="brand"
                      style={{
                        padding: "13px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Attach20Filled style={{ color: "#fff" }} />
                      <Text style={{ color: "#fff" }}>Attach</Text>
                    </Badge>
                  </label>
                </span>
              </Field>
              <div className={`${styles.Attachmentwrapper} mt-1`}>
                {files.length == 0 ? (
                  <>
                    <div
                      style={{
                        padding: "10px 0",
                        margin: "auto",
                        textAlign: "center",
                      }}
                    >
                      <img
                        style={{
                          // borderStyle:'dashed',
                          display: "block",
                          margin: "auto",
                          width: "90px",
                        }}
                        src={
                          "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230524.001/office-ui-fabric-react-assets/images/emptyfolder/empty_folder.svg"
                        }
                      />
                      <Label disabled>No Attachments!</Label>
                    </div>
                  </>
                ) : (
                  <>
                    {files.map((res: any) => (
                      <FluentProvider theme={webLightTheme}>
                        <Card
                          className={styles.AttachmentCard}
                          size="small"
                          orientation="horizontal"
                          style={{ margin: "0.7vw" }}
                        >
                          <CardPreview>{() => fileType(res)}</CardPreview>

                          <CardHeader
                            style={{ width: "200px" }}
                            key={res.filename}
                            header={
                              <Text>
                                {res.filename.length > 20
                                  ? res.filename.slice(0, 20) + "..."
                                  : res.filename}
                              </Text>
                            }
                            action={
                              <Button
                                icon={<DELETE />}
                                onClick={() => {
                                  removeSelectedfile(res.filename);
                                }}
                              />
                            }
                          />
                        </Card>
                      </FluentProvider>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row m-1">
          <div className="col m-2">
            <Field label="Notes" validationState="none" validationMessage="">
              <Textarea value={Notes.data} onChange={handleNotes} />
            </Field>
          </div>
        </div>

        <div className={`${styles.submit_Container} row`}>
          <Button
            appearance="primary"
            style={{ width: "100px" }}
            onClick={handleSubmitRequest}
          >
            Submit
          </Button>
          <Button style={{ width: "100px" }} onClick={handleResetDetails}>
            Reset
          </Button>
        </div>
      </div>
      <Toaster toasterId={toasterId} />
    </div>
  );
}

export default AddRequest;
