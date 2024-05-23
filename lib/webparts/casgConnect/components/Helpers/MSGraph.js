var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let results = [];
const graphAPILooper = (result, context) => __awaiter(void 0, void 0, void 0, function* () {
    let val = result["@odata.nextLink"].replaceAll("skiptoken", "skipToken");
    yield context.msGraphClientFactory
        .getClient()
        .then((client) => {
        return client
            .api("/users")
            .skipToken(val.split("skipToken=")[1])
            .get()
            .then((result) => {
            console.log(result);
            if (val) {
                results.push(...result.value.map((result) => ({
                    userName: result.displayName.trim(),
                    userEmailId: result.userPrincipalName.trim(),
                })));
                return graphAPILooper(result, context);
            }
            return results.push(...result.value.map((result) => ({
                userName: result.displayName.trim(),
                userEmailId: result.userPrincipalName.trim(),
            })));
        })
            .catch((err) => {
            return [];
        });
    });
});
export const getUsers = (context) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.msGraphClientFactory
        .getClient()
        .then((client) => {
        return client
            .api("/users")
            .get()
            .then((result) => {
            console.log(result);
            if (result["@odata.nextLink"]) {
                results.push(...result.value.map((result) => ({
                    userName: result.displayName.trim(),
                    userEmailId: result.userPrincipalName.trim(),
                })));
                return graphAPILooper(result, context);
            }
            return results.push(...result.value.map((result) => ({
                userName: result.displayName.trim(),
                userEmailId: result.userPrincipalName.trim(),
            })));
        })
            .catch((err) => {
            return [];
        });
    });
    return results;
});
//# sourceMappingURL=MSGraph.js.map