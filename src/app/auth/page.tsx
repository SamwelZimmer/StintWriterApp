import { redirect } from "next/navigation";

import { decryptData } from "../../../lib/helpers";
import { getUserFromId, getUserStints } from "../../../lib/firebase";
import { SaveUserInfo } from "./SaveUserInfo";
import { CURRENT_AUTH_SERVER } from "../../../lib/constants";

type CustomContext = {
    params: Record<string, unknown>;
    searchParams: {
      auth: string;
    };
    req: any;  // Add this for the request object
    res: any;  // Add this for the response object
};

export default async function AuthPage(context: CustomContext) {

    // get the encrypted user if from the auth application and ensure it is correct format
    const authValue = context.searchParams.auth?.replaceAll(" ", "+");

    if (!authValue) {
        redirect(CURRENT_AUTH_SERVER)
    }

    // get the user id from this encrypted data
    const userId = decryptData(authValue).userId;

    if (!userId) {
        redirect(CURRENT_AUTH_SERVER)
    }

    // get the data associated with the user id
    const userData = await getUserFromId(userId);

    if (!userData) {
        redirect(CURRENT_AUTH_SERVER)
    }

    // get the things created by the user
    const userStints = await getUserStints(userId);

    if (!userStints) {
        redirect(CURRENT_AUTH_SERVER)
    }

    let data;
    if (userData && userStints) {
        data = { "userData": userData, "userStints": userStints }
    };

    return (
        <>
            <SaveUserInfo data={data} />
        </>
        
    );
};