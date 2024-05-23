var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export function GetCustomerDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        // let token = await GetAccessToken();
        // console.log('get Customer details');
        let src = yield axios
            .get("https://crmbackendapi.azurewebsites.net/CustomerDetails", {
            headers: {
                "Content-Type": "application/json",
                Cookie: "ARRAffinity=d98b935261bd2af9f3e05965d84680564df9724e56051aa975192705b3be207c; ARRAffinitySameSite=d98b935261bd2af9f3e05965d84680564df9724e56051aa975192705b3be207c",
                "Access-cred": "NwgUpAE~9-8YH94~N9yju_BYHZX4M0_wU.@1583726c-83aa-4cdc-903b-2d209e6c3b60",
            },
        })
            .then((response) => {
            // console.log(response);
            return Array.from(new Set(response.data.map((res) => res.customerName)));
        })
            .catch((error) => {
            console.log(error);
        });
        return src;
    });
}
//# sourceMappingURL=CRM.js.map