import { Address } from "viem";
export type TagType = { address: string; tag: string };

type TagsType = { addressTags: TagType[] };
export interface FunctionTokenResponse {
  data: string[];
  iat: number;
  exp: number;
}

export interface TagsTokenResponse {
  data: TagsType;
  iat: number;
  exp: number;
}
export const tokenVerify = async (
  cookieName: "tags" | "function_titles",
  contractAddress?: Address,
): Promise<FunctionTokenResponse | TagsTokenResponse | null> => {
  const response = await fetch(
    `/api/token?${contractAddress ? `contractAddress=${contractAddress}` : ""}&cookieName=${cookieName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (response.ok) {
    return data.data;
  } else {
    console.error("Error fetching protected data:", data.message);
    return null;
  }
};

export const createFunctionToken = async (data: string[], contractAddress: Address, cookieName: "function_titles") => {
  try {
    await PostHandler(data, cookieName, contractAddress);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createToken:", error.message);
    }
  }
};

export const createTagsToken = async (data: TagsType, cookieName: "tags") => {
  try {
    const existingToken = await tokenVerify((cookieName = "tags"));
    const existingData = ((existingToken && existingToken.data) as TagsType) || { addressTags: [] };

    data.addressTags.forEach(newTag => {
      const index = existingData.addressTags.findIndex(tag => tag.address === newTag.address);
      if (index !== -1) {
        existingData.addressTags[index].tag = newTag.tag;
      } else {
        existingData.addressTags.push(newTag);
      }
    });

    console.log("Updated tags");

    await PostHandler((data = existingData), (cookieName = cookieName));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createTagsToken:", error.message);
    }
  }
};

const PostHandler = async (data: TagsType | string[], cookieName: string, contractAddress?: Address) => {
  try {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, contractAddress, cookieName }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(result.message);
    } else {
      console.error("Error setting token:", result.message);
    }
  } catch (error) {
    console.error("Error in PostHandler:", error);
  }
};
