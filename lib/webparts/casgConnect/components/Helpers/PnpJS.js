var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
export const getUserContext = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield sp.web.currentUser();
    return items;
});
export const getUserRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield sp.web.lists
        .getByTitle("Request Details")
        .items.orderBy("Created", false)
        .getAll()
        .then((result) => {
        return result;
    })
        .catch((err) => {
        return [];
    });
    return items;
});
export const postNewRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return yield sp.web.lists
        .getByTitle("Request Details")
        .items.add({
        Account_Owner_Name: data.Account_Owner.userName,
        Account_Owner_EmailID: data.Account_Owner.userEmailId,
        UUID: data.UUID,
        Account_Name: data.Account_Name,
        Reserved_Budget: data.Reserved_Budget,
        Contact_Person: data.Contact_Person,
        Contact_Number: data.Contact_Number,
        Procurement_Levels: data.Procurement_Levels,
        Employees: data.Employees,
        End_Users: data.End_Users,
        Notes: data.Notes,
        Timeline: data.Timeline,
        Vendors: data.Vendors,
        Existing_License: { results: data.License },
    })
        .then((result) => {
        console.log(result);
        return { status: "ok", result: result.data };
    })
        .catch((err) => {
        return { status: "error", result: { message: err.message } };
    });
});
export const UpdateRequestNumber = (data, ID) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return yield sp.web.lists
        .getByTitle("Request Details")
        .items.getById(data.ID)
        .update({
        RequestID: ID,
    })
        .then((result) => {
        console.log(result.data);
        return { status: "ok", result: result.data };
    })
        .catch((err) => {
        return { status: "error", result: { message: err.message } };
    });
});
export const UpdateRequestPath = (data, Code) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    return yield sp.web.lists
        .getByTitle("Request Details")
        .items.getById(data.ID)
        .update({
        Destination: {
            Url: `/sites/CASGConnect/Shared Documents/${data.Account_Name}/${Code}`,
            Description: `${Code}`,
        },
    })
        .then((result) => {
        console.log(result.data);
        return { status: "ok", result: result.data };
    })
        .catch((err) => {
        return { status: "error", result: { message: err.message } };
    });
});
const CheckExisitingAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield sp.web
        .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents`)
        .folders.get();
    return items;
});
const CheckExisitingRequestID = (Client) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield sp.web
        .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents/${Client}`)
        .folders.get();
    return items;
});
export const AddAttachments = (files, request, Code) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(files);
    if (yield CheckExisitingAccount().then((data) => __awaiter(void 0, void 0, void 0, function* () { return data.map((val) => val.Name).includes(request.Account_Name); }))) {
        if (yield CheckExisitingRequestID(request.Account_Name).then((data) => __awaiter(void 0, void 0, void 0, function* () { return data.map((val) => val.Name).includes(Code); }))) {
            return yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(file);
                return yield sp.web
                    .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents/${request.Account_Name}/${Code}`)
                    .files.add(file.filename, file.props, true)
                    .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                    return res;
                }));
            }))).then((result) => result);
        }
        else {
            return yield sp.web.folders
                .add(`Shared Documents/${request.Account_Name}/${Code}`)
                .then((folderres) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(folderres);
                return yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(file);
                    return yield sp.web
                        .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents/${request.Account_Name}/${Code}`)
                        .files.add(file.filename, file.props, true)
                        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log(res);
                        return res;
                    }));
                }))).then((result) => result);
            }));
        }
    }
    else {
        return yield sp.web.folders
            .add(`Shared Documents/${request.Account_Name}`)
            .then((folderres) => __awaiter(void 0, void 0, void 0, function* () {
            if (yield CheckExisitingRequestID(request.Account_Name).then((data) => __awaiter(void 0, void 0, void 0, function* () { return data.map((val) => val.Name).includes(Code); }))) {
                return yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(file);
                    return yield sp.web
                        .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents/${request.Account_Name}/${Code}`)
                        .files.add(file.filename, file.props, true)
                        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        return res;
                    }));
                }))).then((result) => result);
            }
            else {
                return yield sp.web.folders
                    .add(`Shared Documents/${request.Account_Name}/${Code}`)
                    .then((folderres) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(folderres);
                    return yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log(file);
                        return yield sp.web
                            .getFolderByServerRelativeUrl(`/sites/CASGConnect/Shared Documents/${request.Account_Name}/${Code}`)
                            .files.add(file.filename, file.props, true)
                            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log(res);
                            return res;
                        }));
                    }))).then((result) => result);
                }));
            }
        }));
    }
});
function getGroupUsers(groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        return sp.web.siteGroups
            .getByName(groupName)
            .users()
            .then((result) => result.map((result) => result.UserPrincipalName))
            .catch((error) => []);
    });
}
export const sendNotification = (details, Code, anyAttachments) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(details);
    let serverUrl = yield sp.web().then((result) => result.Url);
    const Managers = yield getGroupUsers("CASGManagers").then((result) => __awaiter(void 0, void 0, void 0, function* () { return result; }));
    let License = "";
    details.Existing_License.forEach((item) => {
        License += `<li>${item}</li>`;
    });
    const emailProps = {
        To: [...Managers],
        CC: [details.Account_Owner_EmailID],
        Subject: `New Request Created - ${Code}`,
        Body: `<html >
    <head>
       <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <style>td{
          text-align: left; padding: 15px 20px; background-color: #ffffff
          }
       </style>
    </head>
    <body style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0;" bgcolor="#f2f2f2">
       <div>
          <div align="center" style="padding:32px 8px">
             <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;max-width:640px;border:1px solid #c8c8c8;box-shadow:0px 3px 6px rgba(0,0,0,0.05);border-radius:8px;overflow:hidden;background-color:#ffffff;background:#ffffff;width:100%">
                <colgroup>
                   <col width="100" style="width:25%">
                   <col width="30" style="width:8%">
                </colgroup>
                <tbody>
                   <tr>
                      <td colspan="3" style="text-align: left; padding: 5px 20px; background-color: #f8f8f8">
                         <h3>CASG-Connect</h3>
                      </td>
                     
                   </tr>
                   <tr>
                      <td colspan="2"><b>RequestID</b></td>
                      <td colspan="1" >${Code}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Account Owner</b></td>
                      <td colspan="1" >${details.Account_Owner_Name}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Account Owner EmailId</b></td>
                      <td colspan="1" >${details.Account_Owner_EmailID}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Account Name</b></td>
                      <td colspan="1" >${details.Account_Name}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Contact Person</b></td>
                      <td colspan="1" >${details.Contact_Person}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Contact Number</b></td>
                      <td colspan="1" >${details.Contact_Number}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Total Employees</b></td>
                      <td colspan="1" >${details.Employees}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Total End Users</b></td>
                      <td colspan="1" >${details.End_Users}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Reserved Budget</b></td>
                      <td colspan="1" >${details.Reserved_Budget}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Timeline</b></td>
                      <td colspan="1" >${details.Timeline}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>Looking for other Vendors</b></td>
                      <td colspan="1" >${details.Vendors == true ? "Yes" : "No"}</td>
                   </tr>
                   <tr>
                      <td colspan="2"><b>License Procured</b></td>
                      <td colspan="1" >
                         <ul>${License}</ul>
                      </td>
                   </tr>
                   ${anyAttachments
            ? `
                   <tr>
                      <td colspan="2"><b>Attachments</b></td>
                      <td colspan="1"><a target="_blank" href="${serverUrl}/Shared Documents/${details.Account_Name}/${Code}">Click here</a></td>
                   </tr>
                   `
            : ""}
                   ${details.Notes != "" && details.Notes != null
            ? `
                   <tr>
                      <td colspan="2"><b>Description</b></td>
                      <td colspan="1">${details.Notes}</td>
                   </tr>
                   `
            : ""}
                </tbody>
             </table>
          </div>
       </div>
    </body>
 </html>`,
        AdditionalHeaders: {
            "content-type": "text/html",
        },
    };
    return yield sp.utility
        .sendEmail(emailProps)
        .then((result) => {
        return { status: "ok" };
    })
        .catch((err) => ({ status: "err" }));
});
//# sourceMappingURL=PnpJS.js.map